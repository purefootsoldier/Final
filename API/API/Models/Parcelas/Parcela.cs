using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using API.Models;

public class Parcela
{
    [Key]
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string Ubicacion { get; set; } = string.Empty;
    public string Responsable { get; set; } = string.Empty;
    public string TipoCultivo { get; set; } = string.Empty;
    public DateTime UltimoRiego { get; set; }
    public double Latitud { get; set; }
    public double Longitud { get; set; }
    public bool Estado { get; set; }

    // Relación con Sensor (1 a 1)
    public Sensor? Sensor { get; set; }

    // Relación con HistorialParcela (1 a muchos)
    public List<HistorialParcela> HistorialParcelas { get; set; } = new();
}