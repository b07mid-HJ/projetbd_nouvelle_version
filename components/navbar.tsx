"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Briefcase,
  UserCircle,
  ShieldCheck,
  Layers,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useEffect, useState } from "react"
import { getUserName, logout } from "@/lib/auth"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [username, setUsername] = useState<string | undefined>()
  
  useEffect(() => {
    // Get username from cookie on client side
    setUsername(getUserName())
  }, [])
  
  // Don't render navbar on login page
  if (pathname === '/login') {
    return null
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      name: "Formateurs",
      href: "/formateurs",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      name: "Participants",
      href: "/participants",
      icon: <GraduationCap className="h-4 w-4 mr-2" />,
    },
    {
      name: "Formations",
      href: "/formations",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
    },
    {
      name: "Domaines",
      href: "/domaines",
      icon: <Layers className="h-4 w-4 mr-2" />,
    },
    {
      name: "Structures",
      href: "/structures",
      icon: <Building2 className="h-4 w-4 mr-2" />,
    },
    {
      name: "Employeurs",
      href: "/employeurs",
      icon: <Briefcase className="h-4 w-4 mr-2" />,
    },
    {
      name: "Profils",
      href: "/profils",
      icon: <UserCircle className="h-4 w-4 mr-2" />,
    },
    {
      name: "Utilisateurs",
      href: "/utilisateurs",
      icon: <ShieldCheck className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="font-bold text-xl">Training Center</div>
        <nav className="flex items-center space-x-1 overflow-x-auto pb-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              asChild
              className={cn("flex items-center", pathname === item.href && "bg-primary text-primary-foreground")}
            >
              <Link href={item.href}>
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          {username && (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium hidden md:inline-block">Welcome, {username}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  logout()
                  router.push('/login')
                  router.refresh()
                }}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
