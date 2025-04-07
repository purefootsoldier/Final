"use client"

import { useEffect, useState } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verificar al cargar
    checkIsMobile()

    // Agregar listener para cambios de tamaño
    window.addEventListener("resize", checkIsMobile)

    // Limpiar listener
    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return isMobile
}

