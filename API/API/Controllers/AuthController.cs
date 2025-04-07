using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid input data" });

            var user = await _authService.RegisterUser(request);
            if (user == null)
                return Conflict(new { message = "Email already in use" });

            return CreatedAtAction(nameof(Register), new { message = "User registered successfully", userId = user.Id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid input data" });

            var token = await _authService.LoginUser(request);
            if (token == null)
                return NotFound(new { message = "User not found" });

            if (token == "invalid_password")
                return Unauthorized(new { message = "Invalid password" });

            return Ok(new { message = "Login successful", token });
        }
        [Authorize] // Solo usuarios autenticados pueden cambiar su contraseña
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid input data" });

            var result = await _authService.ChangePassword(request);

            return result switch
            {
                "user_not_found" => NotFound(new { message = "User not found" }),
                "incorrect_password" => Unauthorized(new { message = "Incorrect current password" }),
                "same_password" => BadRequest(new { message = "New password cannot be the same as the old one" }),
                "password_updated" => Ok(new { message = "Password updated successfully" }),
                _ => StatusCode(500, new { message = "Internal server error" })
            };
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid input data" });

            var result = await _authService.SendPasswordResetToken(request);
            if (!result)
                return NotFound(new { message = "User not found" });

            return Ok(new { message = "Password reset token sent to email" });
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { message = "Invalid input data" });

            var result = await _authService.ResetPassword(request);

            return result switch
            {
                "user_not_found" => NotFound(new { message = "User not found" }),
                "invalid_or_expired_token" => Unauthorized(new { message = "Invalid or expired token" }),
                "password_reset_success" => Ok(new { message = "Password has been reset successfully" }),
                _ => StatusCode(500, new { message = "Internal server error" })
            };
        }



    }


}
