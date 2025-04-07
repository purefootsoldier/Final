using API.DTOs;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
namespace API.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<User?> RegisterUser(RegisterUserDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return null; // Email ya registrado

            using var hmac = new HMACSHA512();
            var passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(request.Password));
            var passwordSalt = hmac.Key;

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<string?> LoginUser(LoginUserDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null) return null; // Usuario no encontrado

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(request.Password));

            if (!computedHash.SequenceEqual(user.PasswordHash))
                return "contraseña_o_usuario_incorrecto"; // Contraseña incorrecta

            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email)
        };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public async Task<string> ChangePassword(ChangePasswordDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return "usuario_no_encontrado"; // Usuario no encontrado

            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(request.CurrentPassword));

            if (!computedHash.SequenceEqual(user.PasswordHash))
                return "contraseña_incorrecta"; // Contraseña actual incorrecta

            if (request.CurrentPassword == request.NewPassword)
                return "La contraseña debe de ser diferente a la anterior"; // La nueva contraseña es la misma que la actual

            // Generar nuevo hash y salt
            using var newHmac = new HMACSHA512();
            user.PasswordSalt = newHmac.Key;
            user.PasswordHash = newHmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(request.NewPassword));

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return "Contraseña_actualizada_con_exito"; // Contraseña actualizada exitosamente
        }
        public async Task<bool> SendPasswordResetToken(ForgotPasswordDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return false; // Usuario no encontrado

            // Generar token de recuperación
            user.ResetToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            user.ResetTokenExpires = DateTime.UtcNow.AddMinutes(30); // Expira en 30 minutos

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            // Enviar correo con el token
            return SendEmail(user.Email, user.ResetToken);
        }

        private bool SendEmail(string email, string token)
        {
            try
            {
                using var smtp = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("jro2funsal@gmail.com", "fmym avft mvfp waai"),
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    DeliveryMethod = SmtpDeliveryMethod.Network
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("jro2funsal@gmail.com"),
                    Subject = "Password Reset Request",
                    Body = $"Usa esta clave para restaurar tu contraseña: {token}",
                    IsBodyHtml = false
                };
                mailMessage.To.Add(email);

                smtp.Send(mailMessage);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        public async Task<string> ResetPassword(ResetPasswordDto request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return "usuario_no_encontrado";

            if (user.ResetToken != request.Token || user.ResetTokenExpires < DateTime.UtcNow)
                return "la_sesión_ha_expirado";

            // Generar nuevo hash y salt
            using var hmac = new HMACSHA512();
            user.PasswordSalt = hmac.Key;
            user.PasswordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(request.NewPassword));

            // Limpiar token de recuperación
            user.ResetToken = null;
            user.ResetTokenExpires = null;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return "La_contraseña_se_restauro_con_exito";
        }


    }

}
