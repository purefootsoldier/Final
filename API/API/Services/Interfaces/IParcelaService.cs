using API.DTOs;

namespace API.Services.Interfaces
{
    public interface IParcelaService
    {
        Task<(int StatusCode, object Contenido)> ActualizarDatosDesdeAPI();
        Task<List<HistorialParcelaDto>> ObtenerUltimasParcelasEliminadasAsync();
    }
}
