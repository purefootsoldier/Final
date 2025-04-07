"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
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
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Ha ocurrido un error</CardTitle>
          <CardDescription className="text-center">
            Lo sentimos, algo salió mal al procesar tu solicitud.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-muted-foreground">
            {error.message || "Error desconocido. Por favor, intenta de nuevo más tarde."}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Intentar de nuevo
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

