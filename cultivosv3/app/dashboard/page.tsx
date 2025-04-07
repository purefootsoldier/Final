"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import MapView from "@/components/map-view"
import WeatherWidgets from "@/components/weather-widgets"
import { actualizarDashboard } from "@/lib/api"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, RefreshCw } from "lucide-react"

interface Parcela {
  id: number
  nombre: string
  ubicacion: string
  responsable: string
  tipo_cultivo: string
  ultimoRiego: string
  latitud: number
  longitud: number
  sensor: {
    humedad: number
    temperatura: number
    lluvia: number
    sol: number
  }
}

interface SensoresData {
  humedad: number
  temperatura: number
  lluvia: number
  sol: number
}

export default function Dashboard() {
  const { isLoggedIn } = useAuth()
  const [sensores, setSensores] = useState<SensoresData | null>(null)
  const [parcelas, setParcelas] = useState<Parcela[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)


  const initialLoadDone = useRef(false)
  const loadDashboardData = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true)

      console.log("Llamando a actualizarDashboard")
      const data = await actualizarDashboard()

      setSensores(data.sensores || null)
      setParcelas(data.parcelas || [])
      setError(null)

      console.log("Datos de sensores recibidos:", data.sensores)
      console.log("Parcelas recibidas:", data.parcelas.length)
    } catch (err) {
      console.error("Error al cargar datos del dashboard:", err)
      setError("No se pudieron cargar los datos del dashboard")
      setSensores(null)
      setParcelas([])
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  // Efecto para la carga inicial
  useEffect(() => {
    if (!isLoggedIn || initialLoadDone.current) return

    initialLoadDone.current = true

    loadDashboardData()

  }, [isLoggedIn])
  
  const handleRefresh = () => {
    if (isRefreshing) return
    setIsRefreshing(true)
    loadDashboardData(true)
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-primary">Cultinnovation</h1>
          <div className="h-6 w-px bg-muted"></div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">Mapa de Ubicaciones</span>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Actualizando..." : "Actualizar"}</span>
        </Button>
      </div>

      {loading && !isRefreshing ? (
        <div className="flex items-center justify-center h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <Card className="p-6 text-center text-red-500">{error}</Card>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-muted-foreground">
              Visualización geográfica de todas las parcelas activas con información detallada de cada ubicación y sus
              sensores.
            </p>
            {parcelas.length === 0 && (
              <p className="mt-2 text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
                No se encontraron parcelas disponibles. El mapa se mostrará vacío.
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <MapView parcelas={parcelas} />
            </div>
            <div className="lg:col-span-1">
              <WeatherWidgets sensores={sensores} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

