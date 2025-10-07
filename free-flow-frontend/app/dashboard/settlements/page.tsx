"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import SettlementStats from "@/components/dashboard/settlement-stats"
import SettlementsTable from "@/components/dashboard/settlement-table"
import { Plus, Wallet } from "lucide-react"
import SettlementHistory from "@/components/dashboard/settlement-history"

export default function SettlementsPage() {
  
  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Wallet className="h-8 w-8" />
                Associate Settlements
              </h1>
              <p className="text-muted-foreground">Track and manage payments to your associates</p>
            </div>
          </div>

          <SettlementStats />

          <SettlementsTable />

          <SettlementHistory />

        </div>
      </main>
    </div>
  )
}
