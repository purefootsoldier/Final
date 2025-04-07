"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, removeAuthToken } from "@/lib/auth"

interface AuthContextType {
  isLoggedIn: boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true)
      const authenticated = isAuthenticated()
      setIsLoggedIn(authenticated)

      if (
        !authenticated &&
        !pathname.startsWith("/auth/") &&
        pathname !== "/" &&
        pathname !== "/auth" &&
        pathname !== "/unauthorized" &&
        !pathname.includes("not-found")
      ) {
        router.push("/unauthorized")
      }

      // Si está autenticado y está en una ruta de autenticación, redirigir a dashboard
      // EXCEPTO si está en la página de cambio de contraseña
      if (authenticated && pathname.startsWith("/auth/") && pathname !== "/auth/change-password") {
        // No redirigir si está en la página de reset-password con un email en los parámetros
        if (pathname === "/auth/reset-password" && window.location.search.includes("email=")) {
          setIsLoading(false)
          return
        }

        router.push("/dashboard")
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  const logout = () => {
    removeAuthToken()
    setIsLoggedIn(false)
    router.push("/auth/login")
  }

  return <AuthContext.Provider value={{ isLoggedIn, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

