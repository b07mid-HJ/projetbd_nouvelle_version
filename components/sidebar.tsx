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
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useEffect, useState } from "react"
import { getUserName, getUserRole, logout } from "@/lib/auth"
import { useSidebar } from "@/context/sidebar-context"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [username, setUsername] = useState<string | undefined>()
  const [userRole, setUserRole] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const { isOpen, toggle } = useSidebar()
  
  useEffect(() => {
    // Get username and role from cookie on client side
    setUsername(getUserName())
    setUserRole(getUserRole())
    setIsLoading(false)
  }, [pathname]) // Add pathname as a dependency to refresh when navigation occurs
  
  // Don't render sidebar on login page
  if (pathname === '/login') {
    return null
  }

  // Define all navigation items with role permissions
  const allNavItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      roles: ["admin", "responsable"], // All roles can access dashboard
    },
    {
      name: "Formateurs",
      href: "/formateurs",
      icon: <Users className="h-5 w-5" />,
      roles: ["admin","simple"], // Only admin can access formateurs
    },
    {
      name: "Participants",
      href: "/participants",
      icon: <GraduationCap className="h-5 w-5" />,
      roles: ["admin","simple"], // Admin and formateur can access participants
    },
    {
      name: "Formations",
      href: "/formations",
      icon: <BookOpen className="h-5 w-5" />,
      roles: ["admin","simple"], // Multiple roles can access formations
    },
    {
      name: "Domaines",
      href: "/domaines",
      icon: <Layers className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      name: "Structures",
      href: "/structures",
      icon: <Building2 className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      name: "Employeurs",
      href: "/employeurs",
      icon: <Briefcase className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      name: "Profils",
      href: "/profils",
      icon: <UserCircle className="h-5 w-5" />,
      roles: ["admin"],
    },
    {
      name: "Utilisateurs",
      href: "/utilisateurs",
      icon: <ShieldCheck className="h-5 w-5" />,
      roles: ["admin"], // Only admin can manage users
    },
  ]

  // Filter navigation items based on user role
  const navItems = allNavItems.filter(item => {
    // If no role is specified or if the item has no role restrictions, show to everyone
    if (!userRole || !item.roles) return true;
    // Otherwise, check if the user's role is in the allowed roles for this item
    return item.roles.includes(userRole.toLowerCase());
  });

  return (
    <div className="relative">
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={toggle}
          aria-hidden="true"
        />
      )}
      
      {/* Toggle button for mobile */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggle}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-background border-r transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "md:w-16"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className={cn("font-bold text-xl transition-opacity", isOpen ? "opacity-100" : "opacity-0 md:opacity-0")}>
            Training Center
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggle}
            className="flex"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-pulse h-6 w-6 rounded-full bg-muted"></div>
            </div>
          ) : (
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Button
                    variant={pathname === item.href ? "default" : "ghost"}
                    asChild
                    className={cn(
                      "w-full justify-start", 
                      pathname === item.href && "bg-primary text-primary-foreground",
                      !isOpen && "md:justify-center"
                    )}
                  >
                    <Link href={item.href} className="flex items-center">
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className={cn("ml-3 transition-opacity", isOpen ? "opacity-100" : "opacity-0 md:hidden md:w-0")}>
                        {item.name}
                      </span>
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </nav>
        
        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex flex-col space-y-4">
            {username && (
              <div className={cn("flex items-center gap-2", !isOpen && "md:justify-center")}>
                <span className={cn("text-sm font-medium transition-opacity", isOpen ? "opacity-100" : "opacity-0 md:hidden md:w-0")}>
                  {username}
                </span>
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
            <div className={cn("flex", !isOpen && "md:justify-center")}>
              <ModeToggle />
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}