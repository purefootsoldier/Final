using System.Text.Json.Serialization;
using API.DTOs;

public class ParcelaDTO
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Ubicacion { get; set; } = string.Empty;
    public string Responsable { get; set; } = string.Empty;

    [JsonPropertyName("tipo_cultivo")]
    public string TipoCultivo { get; set; } = string.Empty;
    public DateTime UltimoRiego { get; set; } = DateTime.Now;
    public double Latitud { get; set; }
    public double Longitud { get; set; }
    public SensorDTO Sensor { get; set; } = new SensorDTO();
}

public class ParcelaResponseDTO
{
    public SensorDTO Sensores { get; set; } = new SensorDTO();
    public List<ParcelaDTO> Parcelas { get; set; } = new List<ParcelaDTO>();
}

