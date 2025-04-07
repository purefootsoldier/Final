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

interface DashboardData {
  sensores: SensoresData
  parcelas: Parcela[]
}

interface BarChartData {
  fecha: string
  promedioHumedad: number
  promedioTemperatura: number
}

// Nueva interfaz para los datos de la gráfica de área
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


function checkAuthentication() {
  if (!isAuthenticated()) {
    window.location.href = "/unauthorized"
    throw new Error("No autenticado")
  }
}


function isAuthenticated(): boolean {
  const token = localStorage.getItem("auth_token")
  return !!token
}

export async function fetchParcelas(): Promise<Parcela[]> {
  try {

    const response = await fetch("https://localhost:7233/api/Parcelas")

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/unauthorized"
        throw new Error("No autenticado")
      }
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching parcelas:", error)
    throw error
  }
}

export async function actualizarDashboard(): Promise<DashboardData> {
  try {
    // Verificar autenticación antes de hacer la solicitud
    checkAuthentication()

    const response = await fetch("https://localhost:7233/api/Parcelas/actualizar", {
      method: "POST",
    })

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/unauthorized"
        throw new Error("No autenticado")
      }
    }
    const data = await response.json()

    // Verificar si es el nuevo formato de respuesta (con mensaje y sensores pero sin parcelas)
    if (data.mensaje && data.mensaje.includes("No se encontraron parcelas") && data.sensores) {
      console.log("Recibidos datos de sensores globales sin parcelas:", data.sensores)
      return {
        sensores: data.sensores,
        parcelas: [],
      }
    }

    // Si es el formato normal, devolver los datos tal cual
    return data
  } catch (error) {
    console.error("Error actualizando dashboard:", error)
    throw error
  }
}

export async function fetchBarChartData(): Promise<BarChartData[]> {
  try {
    // Verificar autenticación antes de hacer la solicitud
    checkAuthentication()

    const response = await fetch("https://localhost:7233/api/historial/Barras")

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/unauthorized"
        throw new Error("No autenticado")
      }
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching bar chart data:", error)
    throw error
  }
}

// Nueva función para obtener datos del gráfico de área
export async function fetchAreaChartData(): Promise<AreaChartData> {
  try {
    // Verificar autenticación antes de hacer la solicitud
    checkAuthentication()

    const response = await fetch("https://localhost:7233/api/historial/AreaChart")

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/unauthorized"
        throw new Error("No autenticado")
      }
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching area chart data:", error)
    throw error
  }
}

export async function fetchLineChartData(): Promise<LineChartData[]> {
  try {
    checkAuthentication()

    const response = await fetch("https://localhost:7233/api/historial/lineChart")

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/unauthorized"
        throw new Error("No autenticado")
      }
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching line chart data:", error)
    throw error
  }
}

export async function fetchParcelasEliminadas(): Promise<HistorialParcela[]> {
  try {
    checkAuthentication()

    const response = await fetch("https://localhost:7233/api/Parcelas/ultimas-eliminadas")
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = "/unauthorized"
        throw new Error("No autenticado")
      }
      if (response.status === 404) {
        // Si no hay parcelas eliminadas, devolver un array vacío
        return []
      }
      throw new Error(`Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching parcelas eliminadas:", error)
    throw error
  }
}

