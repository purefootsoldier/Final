"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Droplets, Thermometer, CloudRain, Sun, AlertTriangle } from "lucide-react"
import { fetchParcelasEliminadas } from "@/lib/api"

interface HistorialParcela {
  id: number
  parcelaId: number
  historialNombre: string
  ubicacion: string
  responsable: string
  tipo_cultivo: string
  humedad: number
  temperatura: number
  lluvia: number
  sol: number
}

export default function ParcelasEliminadas() {
  const { isLoggedIn } = useAuth()
  const [historiales, setHistoriales] = useState<HistorialParcela[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn) return

    const loadParcelasEliminadas = async () => {
      try {
        setLoading(true)
        console.log("Llamando a fetchParcelasEliminadas")
        const data = await fetchParcelasEliminadas()

        setHistoriales(data)
        setError(null)
      } catch (err) {
        console.error("Error al cargar parcelas eliminadas:", err)
        setError("No se pudieron cargar las parcelas eliminadas")
      } finally {
        setLoading(false)
      }
    }

    loadParcelasEliminadas()
  }, [isLoggedIn])

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-semibold text-primary">Parcelas Eliminadas</h1>
        <div className="flex items-center justify-center h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-semibold text-primary">Parcelas Eliminadas</h1>

      {error ? (
        <Card className="p-6 text-center text-red-500">{error}</Card>
      ) : historiales.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No hay parcelas eliminadas</p>
            <p className="text-sm text-muted-foreground mt-2">
              Cuando se eliminen parcelas, podrás ver su último registro aquí.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Tabla con información básica de las parcelas */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Parcelas Eliminadas</CardTitle>
              <CardDescription>Datos básicos de las parcelas que han sido eliminadas del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Tipo de Cultivo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historiales.map((historial) => (
                    <TableRow key={historial.id}>
                      <TableCell className="font-medium">{historial.id}</TableCell>
                      <TableCell>{historial.historialNombre}</TableCell>
                      <TableCell>{historial.ubicacion}</TableCell>
                      <TableCell>{historial.responsable}</TableCell>
                      <TableCell>{historial.tipo_cultivo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Tarjetas con información de sensores */}
          <Card>
            <CardHeader>
              <CardTitle>Datos de Sensores</CardTitle>
              <CardDescription>Últimas lecturas de sensores registradas antes de la eliminación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {historiales.map((historial) => (
                  <Card key={historial.id} className="overflow-hidden border-gray-200 bg-white">
                    <CardHeader className="bg-secondary pb-2">
                      <CardTitle className="text-base">{historial.historialNombre}</CardTitle>
                      <CardDescription>
                        ID: {historial.id} - {historial.tipo_cultivo}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col items-center p-2 bg-blue-50 rounded-md">
                          <Droplets className="h-5 w-5 mb-1 text-blue-500" />
                          <span className="text-xs text-muted-foreground">Humedad</span>
                          <span className="font-medium text-blue-600">{historial.humedad}%</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-red-50 rounded-md">
                          <Thermometer className="h-5 w-5 mb-1 text-red-500" />
                          <span className="text-xs text-muted-foreground">Temperatura</span>
                          <span className="font-medium text-red-600">{historial.temperatura}°C</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-indigo-50 rounded-md">
                          <CloudRain className="h-5 w-5 mb-1 text-indigo-500" />
                          <span className="text-xs text-muted-foreground">Lluvia</span>
                          <span className="font-medium text-indigo-600">{historial.lluvia} mm</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-yellow-50 rounded-md">
                          <Sun className="h-5 w-5 mb-1 text-yellow-500" />
                          <span className="text-xs text-muted-foreground">Sol</span>
                          <span className="font-medium text-yellow-600">{historial.sol}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

