"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, FileText, Tag, Zap, LogOut, Menu, X, Users, User, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/blogs", label: "Blog Posts", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/ads", label: "Ads", icon: Zap },
  { href: "/admin/profile", label: "Profile", icon: User },
]

const superAdminItems = [
  { href: "/admin/users", label: "Users", icon: Users },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-200",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <h1 className="text-xl font-bold text-sidebar-foreground">Sparkzonn</h1>
            <p className="text-xs text-sidebar-foreground/60 mt-1">Admin Panel</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[...navItems, ...((session?.user as any)?.role === 'SUPER_ADMIN' ? superAdminItems : [])].map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border space-y-3">
            <div className="px-2 py-2 bg-sidebar-accent/50 rounded-lg">
              <p className="text-xs font-medium text-sidebar-foreground">Logged in as</p>
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{session?.user?.email}</p>
              <p className="text-xs text-sidebar-foreground/60 uppercase tracking-wide">
                {(session?.user as any)?.role}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 bg-transparent"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start gap-2 bg-transparent"
              onClick={() => signOut({ redirect: true, callbackUrl: "/auth/signin" })}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />}
    </>
  )
}
