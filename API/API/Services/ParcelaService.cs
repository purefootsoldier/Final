
using API.DTOs;
using API.Models;
using API.Models.Sensores;
using API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace API.Services
{
    public class ParcelaService : IParcelaService
    {
        private readonly ApplicationDbContext _context;
        private readonly HttpClient _httpClient;

        public ParcelaService(ApplicationDbContext context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
        }

        public async Task<(int StatusCode, object Contenido)> ActualizarDatosDesdeAPI()
        {
            string urlApiExterna = "http://moriahmkt.com/iotapp/updated/";

            try
            {
                var response = await _httpClient.GetAsync(urlApiExterna);
                if (!response.IsSuccessStatusCode)
                    return (400, "No se pudo obtener datos de la API externa.");

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var responseObject = JsonSerializer.Deserialize<ParcelaResponseDTO>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                var parcelasExternas = responseObject?.Parcelas ?? new List<ParcelaDTO>();
                var sensoresGlobales = responseObject?.Sensores;

                if (sensoresGlobales != null)
                {
                    var sensorGlobal = new SensorGlobal
                    {
                        FechaRegistro = DateTime.UtcNow,
                        Humedad = sensoresGlobales.Humedad,
                        Temperatura = sensoresGlobales.Temperatura,
                        Lluvia = sensoresGlobales.Lluvia,
                        Sol = (int)sensoresGlobales.Sol
                    };

                    _context.SensoresGlobales.Add(sensorGlobal);
                }

                if (!parcelasExternas.Any())
                {
                    await _context.SaveChangesAsync();
                    return (200, new
                    {
                        Mensaje = "No se encontraron parcelas, pero se guardaron los sensores globales.",
                        Sensores = sensoresGlobales
                    });
                }

                var idsParcelasExternas = parcelasExternas.Select(p => p.Id).ToHashSet();

                var parcelasEnBD = await _context.Parcelas
                    .Include(p => p.Sensor)
                    .Include(p => p.HistorialParcelas)
                    .ToListAsync();

                var parcelasDict = parcelasEnBD.ToDictionary(p => p.Id);

                foreach (var parcela in parcelasEnBD)
                {
                    if (!idsParcelasExternas.Contains(parcela.Id))
                        parcela.Estado = false;
                }

                foreach (var p in parcelasExternas)
                {
                    if (parcelasDict.TryGetValue(p.Id, out var parcelaExistente))
                    {
                        parcelaExistente.Estado = true;

                        _context.HistorialParcelas.Add(new HistorialParcela
                        {
                            Nombre = parcelaExistente.Nombre,
                            Ubicacion = parcelaExistente.Ubicacion,
                            Responsable = parcelaExistente.Responsable,
                            TipoCultivo = parcelaExistente.TipoCultivo,
                            UltimoRiego = DateTime.UtcNow,
                            Latitud = parcelaExistente.Latitud,
                            Longitud = parcelaExistente.Longitud,
                            FechaRegistro = DateTime.UtcNow,
                            ParcelaId = parcelaExistente.Id
                        });

                        parcelaExistente.Nombre = p.Nombre;
                        parcelaExistente.Ubicacion = p.Ubicacion;
                        parcelaExistente.Responsable = p.Responsable;
                        parcelaExistente.TipoCultivo = p.TipoCultivo;
                        parcelaExistente.UltimoRiego = DateTime.UtcNow;
                        parcelaExistente.Latitud = p.Latitud;
                        parcelaExistente.Longitud = p.Longitud;

                        if (parcelaExistente.Sensor != null)
                        {
                            _context.HistorialSensores.Add(new HistorialSensor
                            {
                                SensorId = parcelaExistente.Sensor.Id,
                                FechaRegistro = DateTime.UtcNow,
                                Humedad = parcelaExistente.Sensor.Humedad,
                                Temperatura = parcelaExistente.Sensor.Temperatura,
                                Lluvia = parcelaExistente.Sensor.Lluvia,
                                Sol = parcelaExistente.Sensor.Sol
                            });

                            parcelaExistente.Sensor.Humedad = p.Sensor.Humedad;
                            parcelaExistente.Sensor.Temperatura = p.Sensor.Temperatura;
                            parcelaExistente.Sensor.Lluvia = p.Sensor.Lluvia;
                            parcelaExistente.Sensor.Sol = p.Sensor.Sol;
                        }
                        else
                        {
                            parcelaExistente.Sensor = new Sensor
                            {
                                Humedad = p.Sensor.Humedad,
                                Temperatura = p.Sensor.Temperatura,
                                Lluvia = p.Sensor.Lluvia,
                                Sol = p.Sensor.Sol
                            };
                        }
                    }
                    else
                    {
                        _context.Parcelas.Add(new Parcela
                        {
                            Id = p.Id,
                            Nombre = p.Nombre,
                            Ubicacion = p.Ubicacion,
                            Responsable = p.Responsable,
                            TipoCultivo = p.TipoCultivo,
                            UltimoRiego = DateTime.UtcNow,
                            Latitud = p.Latitud,
                            Longitud = p.Longitud,
                            Estado = true,
                            Sensor = new Sensor
                            {
                                Humedad = p.Sensor.Humedad,
                                Temperatura = p.Sensor.Temperatura,
                                Lluvia = p.Sensor.Lluvia,
                                Sol = p.Sensor.Sol
                            }
                        });
                    }
                }

                await _context.SaveChangesAsync();

                return (200, new
                {
                    Mensaje = "Datos actualizados correctamente.",
                    Sensores = sensoresGlobales,
                    Parcelas = parcelasExternas
                });
            }
            catch (Exception ex)
            {
                return (500, $"Error interno: {ex.Message}");
            }
        }

        public Task<List<HistorialParcelaDto>> ObtenerParcelasEliminadasAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<List<HistorialParcelaDto>> ObtenerUltimasParcelasEliminadasAsync()
        {
            var datos = await _context.Parcelas
                .Where(p => !p.Estado && p.Sensor != null)
                .Select(p => new
                {
                    Parcela = p,
                    Sensor = p.Sensor!,
                    UltimoHistorial = p.HistorialParcelas
                        .OrderByDescending(h => h.FechaRegistro)
                        .FirstOrDefault()
                })
                .Select(x => new HistorialParcelaDto
                {
                    Id = x.Parcela.Id,
                    ParcelaId = x.Parcela.Id,
                    HistorialNombre = x.UltimoHistorial != null ? x.UltimoHistorial.Nombre : x.Parcela.Nombre,
                    Ubicacion = x.UltimoHistorial != null ? x.UltimoHistorial.Ubicacion : x.Parcela.Ubicacion,
                    Responsable = x.UltimoHistorial != null ? x.UltimoHistorial.Responsable : x.Parcela.Responsable,
                    Tipo_cultivo = x.UltimoHistorial != null ? x.UltimoHistorial.TipoCultivo : x.Parcela.TipoCultivo,
                    Humedad = x.Sensor.Humedad,
                    Temperatura = x.Sensor.Temperatura,
                    Lluvia = x.Sensor.Lluvia,
                    Sol = x.Sensor.Sol
                })
                .ToListAsync();

            return datos;
        }
    }
}