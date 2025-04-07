"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, isLoggedIn } = useAuth()
  const pathname = usePathname()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    // Determinar si debemos renderizar los componentes hijos
    const isAuthRoute =
      pathname.startsWith("/auth/") ||
      pathname === "/" ||
      pathname === "/auth" ||
      pathname === "/unauthorized" ||
      pathname.includes("not-found")

    // Solo renderizar si:
    // 1. No está cargando Y (está autenticado O es una ruta de autenticación)
    setShouldRender(!isLoading && (isLoggedIn || isAuthRoute))
  }, [isLoading, isLoggedIn, pathname])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return shouldRender ? children : null
}

