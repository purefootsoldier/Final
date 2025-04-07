export default function Footer() {
  return (
    <footer className="border-t py-4 w-full bg-secondary">
      <div className="w-full px-4 md:px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Cultinnovation - Todos los derechos reservados
      </div>
    </footer>
  )
}

