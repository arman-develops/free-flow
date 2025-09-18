"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, User } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "task_completed",
    title: "Website redesign mockups completed",
    project: "TechCorp Website",
    user: "Sarah Johnson",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "project_created",
    title: "New project created: Mobile App Development",
    project: "StartupXYZ App",
    user: "You",
    time: "4 hours ago",
    status: "new",
  },
  {
    id: 3,
    type: "task_overdue",
    title: "Database optimization task is overdue",
    project: "E-commerce Platform",
    user: "Mike Chen",
    time: "6 hours ago",
    status: "overdue",
  },
  {
    id: 4,
    type: "payment_received",
    title: "Payment received from Acme Corp",
    project: "Acme Dashboard",
    user: "System",
    time: "1 day ago",
    status: "completed",
  },
  {
    id: 5,
    type: "associate_assigned",
    title: "John Doe assigned to UI/UX tasks",
    project: "Portfolio Website",
    user: "You",
    time: "2 days ago",
    status: "new",
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "task_completed":
    case "payment_received":
      return <CheckCircle className="h-4 w-4 text-secondary" />;
    case "task_overdue":
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    default:
      return <Clock className="h-4 w-4 text-primary" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="secondary">Completed</Badge>;
    case "overdue":
      return <Badge variant="destructive">Overdue</Badge>;
    case "new":
      return <Badge variant="default">New</Badge>;
    default:
      return <Badge variant="outline">Active</Badge>;
  }
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground">
                {activity.title}
              </p>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{activity.project}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {activity.user}
                  </div>
                </div>
                {getStatusBadge(activity.status)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
