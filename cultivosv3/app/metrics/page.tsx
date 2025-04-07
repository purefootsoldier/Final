"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, AreaChart } from "@/components/charts"
import { fetchBarChartData, fetchAreaChartData, fetchLineChartData } from "@/lib/api"

interface BarChartData {
  fecha: string
  promedioHumedad: number
  promedioTemperatura: number
}

interface AreaChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    fill: boolean
  }[]
}

interface LineChartData {
  fecha: string
  humedad: number
  temperatura: number
  lluvia: number
  sol: number
  registros: number
}

export default function Metrics() {
  const { isLoggedIn } = useAuth()
  const [barData, setBarData] = useState<BarChartData[]>([])
  const [areaData, setAreaData] = useState<AreaChartData | null>(null)
  const [lineData, setLineData] = useState<LineChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn) return

    let isMounted = true

    const loadMetricsData = async () => {
      try {
        setLoading(true)
        const [barChartData, areaChartData, lineChartData] = await Promise.all([
          fetchBarChartData(),
          fetchAreaChartData(),
          fetchLineChartData(),
        ])

        if (isMounted) {
          setBarData(barChartData)
          setAreaData(areaChartData)
          setLineData(lineChartData.slice(0, 15))
          setError(null)
        }
      } catch (err) {
        console.error("Error al cargar datos de métricas:", err)
        if (isMounted) {
          setError("No se pudieron cargar los datos de métricas")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadMetricsData()

    // Función de limpieza para evitar actualizar estados en componentes desmontados
    return () => {
      isMounted = false
    }
  }, [isLoggedIn])

  if (loading) {
    return (
      <div className="w-full space-y-6">
        <h1 className="text-2xl font-semibold text-primary">Métricas de Cultivos</h1>
        <div className="flex items-center justify-center h-[400px]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-semibold text-primary">Métricas de Cultivos</h1>

      {error ? (
        <Card className="p-6 text-center text-red-500">{error}</Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Promedios Diarios</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={barData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Lluvia</CardTitle>
              </CardHeader>
              <CardContent>{areaData && <AreaChart data={areaData} />}</CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Sensores</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={lineData} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

