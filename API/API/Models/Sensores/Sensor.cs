using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Sensor
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("Parcela")]
    public int ParcelaId { get; set; }
    public Parcela Parcela { get; set; } = null!;

    public double Humedad { get; set; }
    public double Temperatura { get; set; }
    public double Lluvia { get; set; }
    public int Sol { get; set; }

    // Relación con HistorialSensor (1 a muchos)
    public List<HistorialSensor> HistorialSensores { get; set; } = new();
}