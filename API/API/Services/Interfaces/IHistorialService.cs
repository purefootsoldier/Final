namespace API.Services.Interfaces
{
    public interface IHistorialService
    {
        Task<object> ObtenerHistorialBarrasAsync();
        Task<object> ObtenerAreaChartLluviaAsync();
        Task<object> ObtenerLineChartAsync();
    }
}
