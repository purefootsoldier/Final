
using API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class HistorialService : IHistorialService
    {
        private readonly ApplicationDbContext _context;

        public HistorialService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<object> ObtenerHistorialBarrasAsync()
        {
            var datos = await _context.SensoresGlobales
                .AsNoTracking()
                .ToListAsync();

            var agrupado = datos
                .GroupBy(d => d.FechaRegistro.ToUniversalTime().ToLocalTime().Date)
                .Select(g => new
                {
                    Fecha = g.Key.ToString("yyyy-MM-dd"),
                    PromedioHumedad = g.Average(h => h.Humedad),
                    PromedioTemperatura = g.Average(h => h.Temperatura)
                })
                .OrderBy(g => g.Fecha)
                .ToList();

            return agrupado;
        }

        public async Task<object> ObtenerAreaChartLluviaAsync()
        {
            var datos = await _context.SensoresGlobales
                .AsNoTracking()
                .OrderByDescending(s => s.FechaRegistro)
                .Take(10)
                .ToListAsync();

            var datosOrdenados = datos
                .OrderBy(s => s.FechaRegistro)
                .Select(d => new
                {
                    Fecha = d.FechaRegistro.ToUniversalTime().ToLocalTime().ToString("yyyy-MM-dd HH:mm:ss"),
                    d.Lluvia
                })
                .ToList();

            return new
            {
                labels = datosOrdenados.Select(d => d.Fecha),
                datasets = new[]
                {
                    new {
                        label = "Lluvia (mm)",
                        data = datosOrdenados.Select(d => d.Lluvia),
                        fill = true
                    }
                }
            };
        }

        public async Task<object> ObtenerLineChartAsync()
        {
            var datos = await _context.SensoresGlobales
                .AsNoTracking()
                .OrderByDescending(h => h.FechaRegistro)
                .ToListAsync();

            if (!datos.Any()) return null;

            var agrupado = datos
                .GroupBy(d => d.FechaRegistro
                    .ToUniversalTime()
                    .ToLocalTime()
                    .AddTicks(-(d.FechaRegistro.Ticks % TimeSpan.TicksPerSecond)))
                .OrderByDescending(g => g.Key)
                .Take(15)
                .Select(g => new
                {
                    Fecha = g.Key.ToString("yyyy-MM-dd HH:mm:ss"),
                    Humedad = Math.Round(g.Average(x => x.Humedad), 2),
                    Temperatura = Math.Round(g.Average(x => x.Temperatura), 2),
                    Lluvia = Math.Round(g.Average(x => x.Lluvia), 2),
                    Sol = Math.Round(g.Average(x => x.Sol), 2),
                    Registros = g.Count()
                })
                .OrderBy(g => g.Fecha)
                .ToList();

            return agrupado;
        }
    }
}