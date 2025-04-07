public class HistorialParcelaDto
{
    public int Id { get; set; }
    public int ParcelaId { get; set; }
    public string HistorialNombre { get; set; }
    public string Ubicacion { get; set; }
    public string Responsable { get; set; }
    public string Tipo_cultivo { get; set; }
    public double Humedad { get; set; }
    public double Temperatura { get; set; }
    public double Lluvia { get; set; }
    public int Sol { get; set; }
}
