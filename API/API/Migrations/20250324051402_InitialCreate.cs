using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Parcelas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Ubicacion = table.Column<string>(type: "text", nullable: false),
                    Responsable = table.Column<string>(type: "text", nullable: false),
                    TipoCultivo = table.Column<string>(type: "text", nullable: false),
                    UltimoRiego = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Latitud = table.Column<double>(type: "double precision", nullable: false),
                    Longitud = table.Column<double>(type: "double precision", nullable: false),
                    Estado = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parcelas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HistorialParcelas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Ubicacion = table.Column<string>(type: "text", nullable: false),
                    Responsable = table.Column<string>(type: "text", nullable: false),
                    TipoCultivo = table.Column<string>(type: "text", nullable: false),
                    UltimoRiego = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Latitud = table.Column<double>(type: "double precision", nullable: false),
                    Longitud = table.Column<double>(type: "double precision", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ParcelaId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorialParcelas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HistorialParcelas_Parcelas_ParcelaId",
                        column: x => x.ParcelaId,
                        principalTable: "Parcelas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Sensores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ParcelaId = table.Column<int>(type: "integer", nullable: false),
                    Humedad = table.Column<double>(type: "double precision", nullable: false),
                    Temperatura = table.Column<double>(type: "double precision", nullable: false),
                    Lluvia = table.Column<double>(type: "double precision", nullable: false),
                    Sol = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sensores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sensores_Parcelas_ParcelaId",
                        column: x => x.ParcelaId,
                        principalTable: "Parcelas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HistorialSensores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SensorId = table.Column<int>(type: "integer", nullable: false),
                    FechaRegistro = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Humedad = table.Column<double>(type: "double precision", nullable: false),
                    Temperatura = table.Column<double>(type: "double precision", nullable: false),
                    Lluvia = table.Column<double>(type: "double precision", nullable: false),
                    Sol = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorialSensores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HistorialSensores_Sensores_SensorId",
                        column: x => x.SensorId,
                        principalTable: "Sensores",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HistorialParcelas_ParcelaId",
                table: "HistorialParcelas",
                column: "ParcelaId");

            migrationBuilder.CreateIndex(
                name: "IX_HistorialSensores_SensorId",
                table: "HistorialSensores",
                column: "SensorId");

            migrationBuilder.CreateIndex(
                name: "IX_Sensores_ParcelaId",
                table: "Sensores",
                column: "ParcelaId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HistorialParcelas");

            migrationBuilder.DropTable(
                name: "HistorialSensores");

            migrationBuilder.DropTable(
                name: "Sensores");

            migrationBuilder.DropTable(
                name: "Parcelas");
        }
    }
}
