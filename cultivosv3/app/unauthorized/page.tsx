import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert, LogIn } from "lucide-react"

export default function Unauthorized() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center">
              <ShieldAlert className="h-12 w-12 text-amber-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center">401</CardTitle>
          <CardDescription className="text-xl text-center">Acceso no autorizado</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">No tienes permiso para acceder a esta página. Por favor, inicia sesión para continuar.</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/auth/login">
              <LogIn className="mr-2 h-4 w-4" />
              Iniciar sesión
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/auth/register">Registrarse</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

