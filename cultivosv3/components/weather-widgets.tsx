"use client"

import { Cloud, CloudRain, Thermometer, Droplets, Sun } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SensoresData {
  humedad: number
  temperatura: number
  lluvia: number
  sol: number
}

interface WeatherWidgetsProps {
  sensores: SensoresData | null
}

export default function WeatherWidgets({ sensores }: WeatherWidgetsProps) {
  console.log("WeatherWidgets recibió sensores:", sensores)

  // Si no hay datos de sensores, mostrar un mensaje
  if (!sensores) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Información de Sensores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <p className="text-muted-foreground mb-2">No hay datos de sensores disponibles</p>
            <p className="text-xs text-muted-foreground">
              Los datos de los sensores aparecerán aquí cuando estén disponibles.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="border-red-200 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Temperatura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center">
            <Thermometer className="h-8 w-8 mb-2 text-red-500" />
            <div className="text-3xl font-bold text-red-600">{sensores.temperatura} °C</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Humedad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center">
            <Droplets className="h-8 w-8 mb-2 text-blue-500" />
            <div className="text-3xl font-bold text-blue-600">{sensores.humedad}%</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-indigo-200 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Lluvia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center">
            <CloudRain className="h-8 w-8 mb-2 text-indigo-500" />
            <div className="text-lg font-medium text-indigo-600">{sensores.lluvia} mm</div>
            <Cloud className="h-8 w-8 mt-1 text-indigo-400" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Intensidad del sol</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center">
            <Sun className="h-8 w-8 mb-2 text-yellow-500" />
            <div className="text-lg font-medium text-yellow-600">{sensores.sol}%</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

