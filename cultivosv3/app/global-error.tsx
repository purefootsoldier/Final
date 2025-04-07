"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Registrar el error en un servicio de análisis de errores
    console.error(error)
  }, [error])

  return (
    <html lang="es">
      <body>
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
          <div className="w-full max-w-md text-center">
            <div className="flex justify-center mb-6">
              <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">Error crítico</h1>
            <p className="text-xl mb-6">La aplicación ha encontrado un error inesperado</p>
            <p className="mb-8 text-muted-foreground">
              {error.message || "Error desconocido. Por favor, intenta de nuevo más tarde."}
            </p>
            <Button onClick={reset} size="lg">
              Reiniciar aplicación
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}

