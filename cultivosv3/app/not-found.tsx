import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center">404</CardTitle>
          <CardDescription className="text-xl text-center">Página no encontrada</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard">Ir al dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

