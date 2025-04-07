using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistorialController : ControllerBase
    {
        private readonly IHistorialService _historialService;

        public HistorialController(IHistorialService historialService)
        {
            _historialService = historialService;
        }

        [HttpGet("barras")]
        public async Task<IActionResult> GetHistorialBarras()
        {
            var resultado = await _historialService.ObtenerHistorialBarrasAsync();
            return Ok(resultado);
        }

        [HttpGet("AreaChart")]
        public async Task<IActionResult> GetAreaChartLluvia()
        {
            var resultado = await _historialService.ObtenerAreaChartLluviaAsync();
            return Ok(resultado);
        }

        [HttpGet("lineChart")]
        public async Task<IActionResult> GetPromediosPorFechaHoraMinutoSegundo()
        {
            var resultado = await _historialService.ObtenerLineChartAsync();
            if (resultado == null)
                return NotFound("No hay datos para procesar.");

            return Ok(resultado);
        }
    }
}
