using API.DTOs;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParcelasController : ControllerBase
    {
        private readonly IParcelaService _parcelaService;

        public ParcelasController(IParcelaService parcelaService)
        {
            _parcelaService = parcelaService;
        }

        [HttpGet("/E")]
        public IActionResult Probar()
        {
            return Ok("ok");
        }

        [HttpPost("actualizar")]
        public async Task<IActionResult> ActualizarDesdeAPI()
        {
            var resultado = await _parcelaService.ActualizarDatosDesdeAPI();
            return StatusCode(resultado.StatusCode, resultado.Contenido);
        }

        [HttpGet("ultimas-eliminadas")]
        public async Task<IActionResult> ObtenerUltimasParcelasEliminadas()
        {
            var datos = await _parcelaService.ObtenerUltimasParcelasEliminadasAsync();

            if (!datos.Any())
                return NotFound("No hay registros de parcelas eliminadas.");

            return Ok(datos);
        }
    }
}
