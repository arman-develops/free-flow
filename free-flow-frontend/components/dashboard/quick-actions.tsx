"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, UserPlus, Building2, UserRoundCog } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button
          className="flex items-center gap-2 h-12 bg-transparent"
          variant="outline"
        >
          <Building2 className="h-4 w-4" />
          <Link href="/dashboard/clients/create">New Client</Link>
        </Button>
        <Button
          className="flex items-center gap-2 h-12 bg-transparent"
          variant="outline"
        >
          <UserPlus className="h-4 w-4" />
          <Link href="/dashboard/associates/create">Add Associate</Link>
        </Button>
        <Button
          className="flex items-center gap-2 h-12 bg-transparent"
          variant="outline"
        >
          <UserRoundCog className="h-4 w-4" />
          Preferences
        </Button>
      </div>
  );
}
