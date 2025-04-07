import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AppSidebar from "@/components/app-sidebar"
import "./globals.css"
import AuthGuard from "@/components/auth-guard"
import { AuthProvider } from "@/components/auth-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <title>Cultinnovation</title>
        <meta name="description" content="Dashboard de Cultinnovation" />
      </head>
      <body className="min-h-screen bg-background">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
          <AuthGuard>
          <SidebarProvider>
            <div className="flex min-h-screen flex-col w-full">
              <Header />
              <div className="flex flex-1 relative">
                <AppSidebar />
                <main className="flex-1 w-full p-4 md:p-6">{children}</main>
              </div>
              <Footer />
            </div>
          </SidebarProvider>
          </AuthGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

