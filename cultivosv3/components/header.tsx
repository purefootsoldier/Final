"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Header() {
  const { isLoggedIn, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="w-full flex h-16 items-center px-4 md:px-6">
        {isLoggedIn &&<SidebarTrigger className="mr-2 text-primary-foreground hover:bg-primary-foreground/10" />}
        <Link href="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M12 2 2 7l10 5 10-5-10-5Z" />
            <path d="m2 17 10 5 10-5" />
            <path d="m2 12 10 5 10-5" />
          </svg>
          <span className="font-bold">Cultinnovation</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {isLoggedIn && (
            <>
              <Avatar className="h-8 w-8 bg-primary-foreground/20">
                <AvatarImage src="" alt="Usuario" />
                <AvatarFallback className="text-primary">US</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-primary-foreground hover:bg-primary-foreground/10"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Cerrar sesión</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

