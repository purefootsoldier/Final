using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class HistorialParcela
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
    public DateTime FechaRegistro { get; set; }

    [ForeignKey("Parcela")]
    public int ParcelaId { get; set; }
    public Parcela Parcela { get; set; } = null!;
}