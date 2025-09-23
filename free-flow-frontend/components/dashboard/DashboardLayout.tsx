"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { HierarchicalSidebar } from "@/components/dashboard/hierarchical-sidebar"
import { DetailPanel } from "@/components/dashboard/details-panel"
import { TopNav } from "@/components/dashboard/top-nav"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [detailPanel, setDetailPanel] = useState<{
    isOpen: boolean
    type: "client" | "project" | "task" | null
    data: any
    client?: any
  }>({
    isOpen: false,
    type: null,
    data: null,
  })

  useEffect(() => {
    const handleOpenDetailPanel = (event: CustomEvent) => {
      setDetailPanel({
        isOpen: true,
        type: event.detail.type,
        data: event.detail.data,
        client: event.detail.client,
      })
    }

    window.addEventListener("openDetailPanel", handleOpenDetailPanel as EventListener)

    return () => {
      window.removeEventListener("openDetailPanel", handleOpenDetailPanel as EventListener)
    }
  }, [])

  const closeDetailPanel = () => {
    setDetailPanel({
      isOpen: false,
      type: null,
      data: null,
    })
  }

  return (
    <div className="flex h-screen bg-background">
      <HierarchicalSidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className={`flex-1 overflow-auto transition-all duration-300 ${detailPanel.isOpen ? "mr-96" : ""}`}>
          {children}
        </main>
      </div>
      <DetailPanel
        isOpen={detailPanel.isOpen}
        onClose={closeDetailPanel}
        type={detailPanel.type}
        data={detailPanel.data}
        client={detailPanel.client}
      />
    </div>
  )
}
