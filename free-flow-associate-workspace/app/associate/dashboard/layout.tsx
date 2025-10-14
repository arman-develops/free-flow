"use client"

import type React from "react"

import { AssociateSidebar } from "@/components/associate/associate-sidebar"
import { AssociateTopNav } from "@/components/associate/associate-top-nav"
import { useAssociateStore } from "@/stores/associate-store"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AssociateDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAssociateStore((state) => state.isAuthenticated)
  const hasHydrated = useAssociateStore((state) => state._hasHydrated)

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.push("/associate/login")
    }
  }, [isAuthenticated, hasHydrated, router])

  // Show loading state while hydrating
  if (!hasHydrated) {
    return null // or a loading spinner
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <AssociateSidebar />
      <div className="lg:pl-64">
        <AssociateTopNav />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
