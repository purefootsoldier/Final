namespace API.DTOs
{
    public class SensorPromedioDTO
    {
        public int SensorId { get; set; }
        public double PromedioHumedad { get; set; }
        public double PromedioTemperatura { get; set; }
        public int TotalRegistros { get; set; }
    }

}
