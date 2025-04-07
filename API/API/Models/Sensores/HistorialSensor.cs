using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class HistorialSensor
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("Sensor")]
    public int SensorId { get; set; }
    public Sensor Sensor { get; set; } = null!;

    public DateTime FechaRegistro { get; set; }
    public double Humedad { get; set; }
    public double Temperatura { get; set; }
    public double Lluvia { get; set; }
    public int Sol { get; set; }
}