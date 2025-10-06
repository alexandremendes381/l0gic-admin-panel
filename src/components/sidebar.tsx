"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  MdDashboard, 
  MdPeople, 
  MdAssessment, 
  MdSettings,
  MdMenu, 
  MdClose, 
  MdChevronLeft, 
  MdChevronRight,
  MdLogout 
} from "react-icons/md"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: MdDashboard,
  },
  {
    title: "Leads",
    href: "/leads",
    icon: MdPeople,
  },
  {
    title: "Relatórios",
    href: "/reports",
    icon: MdAssessment,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: MdSettings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('token')
    }
    router.push('/login')
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">L</span>
              </div>
              <span className="font-semibold text-lg text-foreground">L0gic</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex text-muted-foreground hover:text-foreground"
            >
              {collapsed ? <MdChevronRight size={16} /> : <MdChevronLeft size={16} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <MdClose size={16} />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed && "justify-center"
                  )}
                >
                  <item.icon size={20} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Separator />

        <div className="p-4 space-y-3">
          <div className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">A</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Admin User
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  admin@example.com
                </p>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            onClick={handleLogout}
            className={cn(
              "w-full text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors",
              collapsed ? "px-0" : "justify-start"
            )}
          >
            <MdLogout size={16} />
            {!collapsed && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </div>

      {!mobileOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="fixed top-2 left-2 z-[60] lg:hidden text-foreground hover:bg-accent bg-card/90 backdrop-blur-sm border border-border shadow-lg"
        >
          <MdMenu size={16} />
        </Button>
      )}
    </>
  )
}
