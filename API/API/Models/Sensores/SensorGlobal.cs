namespace API.Models.Sensores
{
    public class SensorGlobal
    {
        public int Id { get; set; }
        public DateTime FechaRegistro { get; set; }

        public double Humedad { get; set; }
        public double Temperatura { get; set; }
        public double Lluvia { get; set; }
        public int Sol { get; set; }
    }

}
