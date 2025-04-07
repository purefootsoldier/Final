using API.Models;
using API.Models.Sensores;
using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Parcela> Parcelas { get; set; }
    public DbSet<Sensor> Sensores { get; set; }
    public DbSet<HistorialParcela> HistorialParcelas { get; set; }
    public DbSet<HistorialSensor> HistorialSensores { get; set; }
    public DbSet<SensorGlobal> SensoresGlobales { get; set; }

    public DbSet<User> Users { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Relaciones
        modelBuilder.Entity<Parcela>()
            .HasOne(p => p.Sensor)
            .WithOne(s => s.Parcela)
            .HasForeignKey<Sensor>(s => s.ParcelaId);

        modelBuilder.Entity<Parcela>()
            .HasMany(p => p.HistorialParcelas)
            .WithOne(h => h.Parcela)
            .HasForeignKey(h => h.ParcelaId);

        modelBuilder.Entity<Sensor>()
            .HasMany(s => s.HistorialSensores)
            .WithOne(h => h.Sensor)
            .HasForeignKey(h => h.SensorId);
    }
}