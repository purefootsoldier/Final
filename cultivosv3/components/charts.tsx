"use client"

import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

interface BarChartData {
  fecha: string
  promedioHumedad: number
  promedioTemperatura: number
}


interface LineChartData {
  fecha: string
  humedad: number
  temperatura: number
  lluvia: number
  sol: number
  registros: number
}

interface AreaChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    fill: boolean
  }[]
}

interface BarChartProps {
  data: BarChartData[]
}

interface LineChartProps {
  data: LineChartData[]
}

interface AreaChartProps {
  data: AreaChartData
}

export function BarChart({ data }: BarChartProps) {
  // Formatear fechas para mostrar en el gráfico
  const labels = data.map((item) => format(parseISO(item.fecha), "dd MMM", { locale: es }))

  const chartData = {
    labels,
    datasets: [
      {
        label: "Humedad Promedio (%)",
        data: data.map((item) => item.promedioHumedad),
        backgroundColor: "rgba(46, 204, 113, 0.8)",
      },
      {
        label: "Temperatura Promedio (°C)",
        data: data.map((item) => item.promedioTemperatura),
        backgroundColor: "rgba(231, 76, 60, 0.8)",
      },
    ],
  }

  // Definir las opciones con tipos compatibles
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(1)
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Fecha",
          font: {
            weight: "bold" as const,
            size: 14,
          } as const,
          padding: { top: 10 },
        },
      },
      y: {
        beginAtZero: true,
        max: 80,
        title: {
          display: true,
          text: "Promedios",
          font: {
            weight: "bold" as "bold",
            size: 14,
          } as const,
          padding: { bottom: 10 },
        },
        ticks: {
          stepSize: 10,
        },
      },
    },
  }

  return (
    <div style={{ height: "350px", position: "relative" }}>
      <Bar data={chartData} options={options} />
    </div>
  )
}

export function AreaChart({ data }: AreaChartProps) {
  const formattedLabels = data.labels.map((dateStr) => {
    // Extraer solo la hora:minuto:segundo
    const timePart = dateStr.split(" ")[1]
    return timePart
  })

  const chartData = {
    labels: formattedLabels,
    datasets: [
      {
        ...data.datasets[0],
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        borderColor: "rgba(52, 152, 219, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(52, 152, 219, 1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(52, 152, 219, 1)",
        tension: 0.3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex
            return data.labels[index] // Mostrar la fecha completa en el tooltip
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hora",
          font: {
            weight: "bold" as const,
            size: 14,
          },
          padding: { top: 10 },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Lluvia (mm)",
          font: {
            weight: "bold" as const,
            size: 14,
          },
          padding: { bottom: 10 },
        },
      },
    },
  }

  return (
    <div style={{ height: "350px", position: "relative" }}>
      <Line data={chartData} options={options} />
    </div>
  )
}



export function LineChart({ data }: LineChartProps) {
  // Formatear fechas para mostrar en el gráfico
  const labels = data.map((item) => {
    const date = parseISO(item.fecha)
    return format(date, "HH:mm:ss", { locale: es })
  })

  const chartData = {
    labels,
    datasets: [
      {
        label: "Humedad (%)",
        data: data.map((item) => item.humedad),
        borderColor: "rgba(46, 204, 113, 0.8)",
        backgroundColor: "rgba(46, 204, 113, 0.1)",
        tension: 0.3,
      },
      {
        label: "Temperatura (°C)",
        data: data.map((item) => item.temperatura),
        borderColor: "rgba(231, 76, 60, 0.8)",
        backgroundColor: "rgba(231, 76, 60, 0.1)",
        tension: 0.3,
      },
      {
        label: "Lluvia (mm)",
        data: data.map((item) => item.lluvia),
        borderColor: "rgba(52, 152, 219, 0.8)",
        backgroundColor: "rgba(52, 152, 219, 0.1)",
        tension: 0.3,
      },
      {
        label: "Sol (%)",
        data: data.map((item) => item.sol),
        borderColor: "rgba(241, 196, 15, 0.8)",
        backgroundColor: "rgba(241, 196, 15, 0.1)",
        tension: 0.3,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex
            const date = parseISO(data[index].fecha)
            return format(date, "dd MMM yyyy HH:mm:ss", { locale: es })
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Hora",
          font: {
            weight: "bold" as const,
            size: 14,
          },
          padding: { top: 10 },
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Valores",
          font: {
            weight: "bold" as const,
            size: 14,
          },
          padding: { bottom: 10 },
        },
      },
    },
  }

  return (
    <div style={{ height: "350px", position: "relative" }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

