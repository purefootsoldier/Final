"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { resetPassword } from "@/lib/auth"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [emailMissing, setEmailMissing] = useState(false)

  useEffect(() => {
    if (!email) {
      setEmailMissing(true)
    }
  }, [email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (newPassword.length <= 6) {
      setError("La nueva contraseña debe contener más de 6 caracteres")
      setLoading(false)
      return
    }

    try {
      await resetPassword({ email, token, newPassword })
      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al restablecer la contraseña")
    } finally {
      setLoading(false)
    }
  }

  if (emailMissing) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Error</CardTitle>
            <CardDescription className="text-center">
              No se ha proporcionado un correo electrónico válido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Para restablecer tu contraseña, primero debes solicitar un código de recuperación.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center mt-4">
              <Button asChild>
                <Link href="/auth/forgot-password">Solicitar código de recuperación</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Restablecer Contraseña</CardTitle>
          <CardDescription className="text-center">
            Ingresa la clave de recuperación que recibiste por correo y tu nueva contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success ? (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                Contraseña restablecida con éxito. Serás redirigido a la página de inicio de sesión.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {}}
                  disabled={!!email}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">
                  Clave de Recuperación <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="token"
                  placeholder="Ingresa la clave que recibiste por correo"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  La clave de recuperación es el código que recibiste en tu correo electrónico.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">La contraseña debe contener más de 6 caracteres.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Restableciendo..." : "Restablecer Contraseña"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm">
            <Link href="/auth/login" className="text-primary hover:underline">
              Volver a Iniciar Sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

