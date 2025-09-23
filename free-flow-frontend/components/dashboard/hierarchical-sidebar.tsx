"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth-store"
import { clientsApi, projectsApi } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Building2,
  FolderOpen,
  Plus,
} from "lucide-react"

interface Client {
  id: string
  companyName: string
  email: string
  contact: string
  projects?: Project[]
}

interface Project {
  id: string
  name: string
  description: string
  estimated_value: number
}

export function HierarchicalSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedClients, setExpandedClients] = useState<Set<string>>(new Set())
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const { logout } = useAuthStore()

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const response = await clientsApi.getClientsByUserID()
      if (response.success) {
        setClients(response.data)
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const fecthProjects = async (id: string) => {
    try {
      const response = await projectsApi.getProjectByClientID(id)
      if (response.success) {
        setClients([...clients, response.data])
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleClientExpansion = (clientId: string) => {
    const newExpanded = new Set(expandedClients)
    if (newExpanded.has(clientId)) {
      newExpanded.delete(clientId)
    } else {
      newExpanded.add(clientId)
    }
    setExpandedClients(newExpanded)
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/login"
  }

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-72",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-gray-900">ProjectFlow</h1>
            <p className="text-xs text-gray-500">Project Management</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-600 hover:bg-gray-100"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {/* Dashboard */}
          <Link href="/dashboard">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-gray-700 hover:bg-gray-100",
                pathname === "/dashboard" && "bg-gray-100 text-gray-900 font-medium",
                isCollapsed && "px-2",
              )}
            >
              <LayoutDashboard className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </Button>
          </Link>

          {/* Clients with Accordion */}
          {!isCollapsed && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>Clients</span>
                </div>
                <Link href="/dashboard/clients/create">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
                    <Plus className="h-3 w-3" />
                  </Button>
                </Link>
              </div>

              {loading ? (
                <div className="px-6 py-2 text-xs text-gray-500">Loading clients...</div>
              ) : clients.length === 0 ? (
                <div className="px-6 py-2 text-xs text-gray-500">No clients yet</div>
              ) : (
                <div className="space-y-1">
                  {clients.map((client) => (
                    <div key={client.id} className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleClientExpansion(client.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                        >
                          {expandedClients.has(client.id) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex-1 justify-start gap-2 text-sm text-gray-700 hover:bg-gray-50 h-8"
                          onClick={() => {
                            // Open client detail panel
                            window.dispatchEvent(
                              new CustomEvent("openDetailPanel", {
                                detail: { type: "client", data: client },
                              }),
                            )
                          }}
                        >
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{client.companyName}</span>
                        </Button>
                      </div>

                      {expandedClients.has(client.id) && (
                        <div className="ml-6 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 px-2">Projects</span>
                            <Link href={`/dashboard/projects/create`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
                              >
                                <Plus className="h-2 w-2" />
                              </Button>
                            </Link>
                          </div>
                          {client.projects?.length ? (
                            client.projects.map((project) => (
                              <Button
                                key={project.id}
                                variant="ghost"
                                className="w-full justify-start gap-2 text-xs text-gray-600 hover:bg-gray-50 h-7 ml-2"
                                onClick={() => {
                                  // Open project detail panel
                                  window.dispatchEvent(
                                    new CustomEvent("openDetailPanel", {
                                      detail: { type: "project", data: project, client },
                                    }),
                                  )
                                }}
                              >
                                <FolderOpen className="h-3 w-3" />
                                <span className="truncate">{project.name}</span>
                              </Button>
                            ))
                          ) : (
                            <div className="px-4 py-1 text-xs text-gray-400">No projects</div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Collapsed Clients */}
          {isCollapsed && (
            <Link href="/clients">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-gray-700 hover:bg-gray-100",
                  pathname.startsWith("/clients") && "bg-gray-100 text-gray-900 font-medium",
                  "px-2",
                )}
              >
                <Users className="h-4 w-4 flex-shrink-0" />
              </Button>
            </Link>
          )}

          {/* Associates */}
          <Link href="/associates">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-gray-700 hover:bg-gray-100",
                pathname.startsWith("/associates") && "bg-gray-100 text-gray-900 font-medium",
                isCollapsed && "px-2",
              )}
            >
              <UserCheck className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span>Associates</span>}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 space-y-2 border-t border-gray-200">
        <Link href="/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-gray-700 hover:bg-gray-100",
              pathname === "/settings" && "bg-gray-100 text-gray-900 font-medium",
              isCollapsed && "px-2",
            )}
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>Settings</span>}
          </Button>
        </Link>

        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700",
            isCollapsed && "px-2",
          )}
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}
