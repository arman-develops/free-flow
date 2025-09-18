"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Star,
  DollarSign,
  CheckCircle,
} from "lucide-react";

const associates = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    specialty: "UI/UX Design",
    status: "active",
    rating: 4.9,
    hourlyRate: 75,
    totalEarnings: 8450,
    activeProjects: 3,
    completedTasks: 24,
    joinDate: "2024-01-15",
    avatar: "/diverse-woman-portrait.png",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@example.com",
    phone: "+1 (555) 987-6543",
    specialty: "Full Stack Development",
    status: "active",
    rating: 4.8,
    hourlyRate: 85,
    totalEarnings: 12200,
    activeProjects: 2,
    completedTasks: 31,
    joinDate: "2024-02-01",
    avatar: "/thoughtful-man.png",
  },
  {
    id: 3,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 456-7890",
    specialty: "Backend Development",
    status: "active",
    rating: 4.6,
    hourlyRate: 80,
    totalEarnings: 6750,
    activeProjects: 1,
    completedTasks: 18,
    joinDate: "2024-03-10",
    avatar: "/developer-working.png",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    email: "emily@example.com",
    phone: "+1 (555) 321-0987",
    specialty: "Mobile Development",
    status: "busy",
    rating: 4.7,
    hourlyRate: 78,
    totalEarnings: 5400,
    activeProjects: 4,
    completedTasks: 15,
    joinDate: "2024-04-05",
    avatar: "/mobile-developer.jpg",
  },
  {
    id: 5,
    name: "David Kim",
    email: "david@example.com",
    phone: "+1 (555) 654-3210",
    specialty: "DevOps",
    status: "available",
    rating: 4.5,
    hourlyRate: 90,
    totalEarnings: 3200,
    activeProjects: 0,
    completedTasks: 8,
    joinDate: "2024-05-20",
    avatar: "/devops-lifecycle.png",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="secondary">Active</Badge>;
    case "busy":
      return <Badge variant="destructive">Busy</Badge>;
    case "available":
      return <Badge variant="default">Available</Badge>;
    case "inactive":
      return <Badge variant="outline">Inactive</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export function AssociatesTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAssociates = associates.filter(
    (associate) =>
      associate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      associate.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      associate.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Associates</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search associates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Associate</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssociates.map((associate) => (
              <TableRow key={associate.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={associate.avatar || "/placeholder.svg"}
                        alt={associate.name}
                      />
                      <AvatarFallback>
                        {associate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{associate.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Joined {associate.joinDate}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {associate.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {associate.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{associate.specialty}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(associate.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{associate.rating}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-medium">
                      ${associate.hourlyRate}/hr
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-secondary" />
                      <span>{associate.completedTasks} tasks</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${associate.totalEarnings.toLocaleString()} earned
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {associate.activeProjects} active projects
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Associate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Associate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
