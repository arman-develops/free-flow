"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FolderPlus, UserPlus, CheckSquare } from "lucide-react";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button
          className="flex items-center gap-2 h-12 bg-transparent"
          variant="outline"
        >
          <FolderPlus className="h-4 w-4" />
          New Project
        </Button>
        <Button
          className="flex items-center gap-2 h-12 bg-transparent"
          variant="outline"
        >
          <UserPlus className="h-4 w-4" />
          Add Associate
        </Button>
        <Button
          className="flex items-center gap-2 h-12 bg-transparent"
          variant="outline"
        >
          <CheckSquare className="h-4 w-4" />
          Create Task
        </Button>
      </CardContent>
    </Card>
  );
}
