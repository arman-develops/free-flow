"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

const clients = [
  {
    id: 1,
    name: "TechCorp Inc.",
    email: "contact@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp Inc.",
    status: "active",
    projects: 3,
    totalValue: 25500,
    lastContact: "2024-12-10",
  },
  {
    id: 2,
    name: "StartupXYZ",
    email: "hello@startupxyz.com",
    phone: "+1 (555) 987-6543",
    company: "StartupXYZ",
    status: "active",
    projects: 2,
    totalValue: 18000,
    lastContact: "2024-12-08",
  },
  {
    id: 3,
    name: "RetailCorp",
    email: "projects@retailcorp.com",
    phone: "+1 (555) 456-7890",
    company: "RetailCorp",
    status: "active",
    projects: 1,
    totalValue: 12000,
    lastContact: "2024-12-05",
  },
  {
    id: 4,
    name: "Creative Agency",
    email: "work@creativeagency.com",
    phone: "+1 (555) 321-0987",
    company: "Creative Agency",
    status: "inactive",
    projects: 1,
    totalValue: 3500,
    lastContact: "2024-11-28",
  },
  {
    id: 5,
    name: "Global Solutions",
    email: "info@globalsolutions.com",
    phone: "+1 (555) 654-3210",
    company: "Global Solutions",
    status: "prospect",
    projects: 0,
    totalValue: 0,
    lastContact: "2024-12-12",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="secondary">Active</Badge>;
    case "inactive":
      return <Badge variant="outline">Inactive</Badge>;
    case "prospect":
      return <Badge variant="default">Prospect</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export function ClientsTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Clients</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
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
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {client.company}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {client.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(client.status)}</TableCell>
                <TableCell>{client.projects}</TableCell>
                <TableCell>${client.totalValue.toLocaleString()}</TableCell>
                <TableCell>{client.lastContact}</TableCell>
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
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Client
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Client
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
