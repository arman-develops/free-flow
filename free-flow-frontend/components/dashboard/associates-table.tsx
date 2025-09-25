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
  CheckSquare,
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { associatesApi } from "@/lib/api";
import { DetailPanel } from "./details-panel";

interface Associate {
  id: string,
  created_at: string,
  updated_at: string,
  user_id: string,
  name: string, 
  email: string,
  phone: string,
  skills: string[],
  projects: any,
  status: string,
  rating: number,
  rate: number,
  completedTasks: number,
  totalEarnings: number,
  activeProjects: number
}

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
  const [isAssociateDetailOpen, setIsAssociateDetailOpen] = useState(false)
  const [selectedAssociate, setSelectedAssociate] = useState<any>(null)
  const {
    data: associateResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["associates"],
    queryFn: associatesApi.getAssociatesByUserID
  })

  const handleAssociateClick = (associate: any) => {
    setSelectedAssociate(associate)
    setIsAssociateDetailOpen(true)
  }

    if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading associates...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600">Failed to load associates</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const associates = associateResponse?.data || []

  const filteredAssociates = associates.filter(
    (associate: Associate) =>
      associate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      associate.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if(associates?.length === 0) {
    return (
      <>
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckSquare className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No associates yet</h3>
            <p className="text-gray-500 text-center mb-4">Create your first associate to get started with this project.</p>
          </CardContent>
        </Card>
      </>
    )
  }

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
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssociates.map((associate: Associate) => (
              <TableRow key={associate.id} className="cursor-pointer transition-shadow" onClick={() => handleAssociateClick(associate)}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={"/placeholder.svg"}
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
                        Joined: { new Date(associate.created_at).toISOString().substring(0,10)}
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
                  {associate.skills.map(skill => (
                    <Badge key={skill} variant="outline" className="px-1">{skill}</Badge>
                  ))}
                </TableCell>
                <TableCell>{getStatusBadge(associate?.status || "active")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{associate?.rating || 4.5}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-medium">
                      {associate?.rate || 70}%
                    </span>
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
                      <DropdownMenuItem onClick={() => handleAssociateClick(associate)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" onClick={() => handleAssociateClick(associate)} />
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
      {/* DetailPanel for associate details */}
      <DetailPanel
          isOpen={isAssociateDetailOpen}
          onClose={() => setIsAssociateDetailOpen(false)}
          type="associate"
          data={selectedAssociate}
        />
    </Card>
  );
}
