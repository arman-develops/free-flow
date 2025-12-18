"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAssociateStore } from "@/stores/associate-store"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CheckSquare,
  DollarSign,
  MessageSquare,
  Upload,
  Clock,
  FolderKanban,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const navigation = [
  { name: "Overview", href: "/associate/dashboard", icon: LayoutDashboard },
  { name: "Workspace", href: "/associate/dashboard/tasks", icon: CheckSquare },
  { name: "Projects", href: "/associate/dashboard/projects", icon: FolderKanban },
  { name: "Time Tracking", href: "/associate/dashboard/time", icon: Clock },
  { name: "Finances", href: "/associate/dashboard/finances", icon: DollarSign },
  { name: "Submissions", href: "/associate/dashboard/submissions", icon: Upload },
  { name: "Messages", href: "/associate/dashboard/messages", icon: MessageSquare },
  { name: "Settings", href: "/associate/dashboard/settings", icon: Settings },
]

export function AssociateSidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useAssociateStore()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300 hidden lg:block",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            {!sidebarCollapsed && <h1 className="text-xl font-semibold text-sidebar-foreground">Freeflow</h1>}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn("text-sidebar-foreground hover:bg-sidebar-accent", sidebarCollapsed && "mx-auto")}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                        sidebarCollapsed && "justify-center",
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span>{item.name}</span>}
                    </div>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>

          {/* User Section */}
          <div className="border-t border-sidebar-border p-4">
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3",
                sidebarCollapsed && "justify-center",
              )}
            >
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold flex-shrink-0">
                A
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">Associate</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">associate@example.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar - Simplified for now */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card">
        <nav className="flex items-center justify-around p-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px]">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
