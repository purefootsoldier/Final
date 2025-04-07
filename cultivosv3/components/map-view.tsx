"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, MapPin } from "lucide-react"

// Configuración del token de Mapbox
mapboxgl.accessToken =
  "pk.eyJ1IjoicHVyZWZvb3Rzb2xkaWVyIiwiYSI6ImNtODdjamNtazBkdDMybG9wcmlsZDVjd28ifQ.zQn4EQItuHZNVrnoh9yM7w"

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

interface MapViewProps {
  parcelas: Parcela[]
}

// Modificar el componente MapView para manejar el caso de parcelas vacías
export default function MapView({ parcelas }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!mapContainer.current) return

    // Inicializar mapa incluso si no hay parcelas
    if (!map.current) {
      setLoading(true)
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/outdoors-v12", // Estilo más detallado con vegetación
        center: parcelas.length > 0 ? [parcelas[0].longitud, parcelas[0].latitud] : [-74.006, 40.7128], // Coordenadas predeterminadas si no hay parcelas
        zoom: parcelas.length > 0 ? 12 : 3, // Zoom más alejado si no hay parcelas
        attributionControl: false, // Ocultar atribución por defecto
      })

      // Agregar controles de navegación con estilo personalizado
      map.current.addControl(
        new mapboxgl.NavigationControl({
          showCompass: true,
          visualizePitch: true,
        }),
        "top-right",
      )

      // Agregar control de escala
      map.current.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 150,
          unit: "metric",
        }),
        "bottom-right",
      )

      // Agregar control de atribución personalizado
      map.current.addControl(
        new mapboxgl.AttributionControl({
          compact: true,
        }),
        "bottom-left",
      )
    }

    // Limpiar marcadores existentes
    const mapElement = map.current

    // Esperar a que el mapa esté cargado
    mapElement.on("load", () => {
      setLoading(false)

      // Solo agregar marcadores si hay parcelas
      if (parcelas.length > 0) {
        // Agregar marcadores para cada parcela
        parcelas.forEach((parcela) => {
          // Crear un elemento personalizado para el marcador
          const markerElement = document.createElement("div")
          markerElement.className = "custom-marker"
          markerElement.style.width = "22px"
          markerElement.style.height = "22px"
          markerElement.style.borderRadius = "50%" // Mantener forma circular
          markerElement.style.backgroundColor = "#2ecc71" // Color verde primario
          markerElement.style.border = "2px solid white"
          markerElement.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)"

          // Crear el popup con información de la parcela
          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            maxWidth: "300px",
            className: "custom-popup",
          }).setHTML(`
            <div style="font-family: system-ui, sans-serif; padding: 8px;">
              <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #2ecc71; border-bottom: 2px solid #2ecc71; padding-bottom: 4px;">${parcela.nombre}</h3>
              <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 8px;">
                <div style="font-weight: 600;">Ubicación:</div>
                <div>${parcela.ubicacion}</div>
                <div style="font-weight: 600;">Cultivo:</div>
                <div>${parcela.tipo_cultivo}</div>
                <div style="font-weight: 600;">Responsable:</div>
                <div>${parcela.responsable}</div>
                <div style="font-weight: 600;">Último riego:</div>
                <div>${parcela.ultimoRiego.split("T")[1].substring(0, 8)}</div>
              </div>
              <div style="margin-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 0.9em;">
                <div style="background-color: rgba(46, 204, 113, 0.1); padding: 4px; border-radius: 4px; text-align: center;">
                  <span style="font-weight: 600; color: #2ecc71;">Humedad: </span>${parcela.sensor.humedad}%
                </div>
                <div style="background-color: rgba(46, 204, 113, 0.1); padding: 4px; border-radius: 4px; text-align: center;">
                  <span style="font-weight: 600; color: #2ecc71;">Temp: </span>${parcela.sensor.temperatura}°C
                </div>
              </div>
            </div>
          `)

          // Crear y añadir el marcador al mapa
          new mapboxgl.Marker(markerElement)
            .setLngLat([parcela.longitud, parcela.latitud])
            .setPopup(popup)
            .addTo(mapElement)
        })

        // Ajustar el mapa para mostrar todos los marcadores con animación
        if (parcelas.length > 1) {
          const bounds = new mapboxgl.LngLatBounds()
          parcelas.forEach((parcela) => {
            bounds.extend([parcela.longitud, parcela.latitud])
          })
          mapElement.fitBounds(bounds, {
            padding: 70,
            duration: 1000, // Animación de 1 segundo
          })
        }
      }
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [parcelas])

  // Añadir estilos CSS personalizados para el popup
  useEffect(() => {
    // Crear un elemento de estilo
    const styleElement = document.createElement("style")
    styleElement.textContent = `
      .custom-popup .mapboxgl-popup-content {
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 0;
        overflow: hidden;
      }
      .custom-popup .mapboxgl-popup-tip {
        border-top-color: white;
      }
      .mapboxgl-ctrl-group {
        border-radius: 8px !important;
        overflow: hidden;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1) !important;
      }
      .mapboxgl-ctrl button {
        background-color: white !important;
      }
      .mapboxgl-ctrl button:hover {
        background-color: #f8f9fa !important;
      }
    `
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  return (
    <Card className="overflow-hidden border shadow-md">
      <CardContent className="p-0 relative">
        <div ref={mapContainer} className="h-[500px] w-full" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Cargando mapa...</p>
            </div>
          </div>
        )}
        {!loading && parcelas.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <div className="flex flex-col items-center gap-2 text-center p-4 max-w-md">
              <MapPin className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No hay parcelas disponibles</p>
              <p className="text-sm text-muted-foreground">
                No se encontraron parcelas para mostrar en el mapa. Las parcelas aparecerán aquí cuando estén
                disponibles.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

