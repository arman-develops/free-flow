"use client"

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  User, 
  Mail, 
  Phone,
  FileText,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { parsePaymentTerms } from '@/utils/parse-payment-terms';
import { queryClient } from '@/lib/query-client';
import { invitesApi } from '@/lib/api';

interface Associate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  skills: string[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  estimated_hours: number;
}

interface Contract {
  id: string;
  role: string;
  start_date: string;
  end_date: string;
  effort: string;
  payment_terms: string;
}

interface Invite {
  id: string;
  status: 'pending' | 'accepted' | 'declined';
  responded_at?: string;
  associate: Associate;
  task: Task;
  contract: Contract;
}

interface InvitesViewProps {
  projectID: string;
}

// Helper function to get initials
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Single Invite Card Component
function InviteCard({ invite }: { invite: Invite }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: 'accept' | 'decline' | null }>({
    open: false,
    action: null
  });

  const paymentTerms = parsePaymentTerms(invite.contract.payment_terms);

  const handleAction = (action: 'accept' | 'decline') => {
    setConfirmDialog({ open: true, action });
  };

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Pending', icon: Clock },
    accepted: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Accepted', icon: CheckCircle2 },
    declined: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Declined', icon: XCircle },
  };

  const priorityConfig = {
    high: { color: 'bg-red-500', label: 'High' },
    medium: { color: 'bg-yellow-500', label: 'Medium' },
    low: { color: 'bg-blue-500', label: 'Low' },
  };

  const status = statusConfig[invite.status];
  const StatusIcon = status.icon;
  const priority = priorityConfig[invite.task.priority as keyof typeof priorityConfig];

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <Avatar className="h-12 w-12 border-2 border-gray-200">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                  {getInitials(invite.associate.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg truncate">{invite.associate.name}</h3>
                  <Badge variant="outline" className={`${status.color} border`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{invite.associate.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{invite.associate.phone}</span>
                  </div>
                </div>

                {invite.associate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {invite.associate.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Task Overview */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">{invite.task.title}</h4>
                  <Badge className={`${priority.color} text-white text-xs`}>
                    {priority.label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{invite.task.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{invite.task.estimated_hours.toLocaleString()} hours</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{invite.contract.role}</span>
              </div>
            </div>
          </div>

          {/* Contract Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-900">Timeline</span>
              </div>
              <p className="text-xs text-blue-700">
                {new Date(invite.contract.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(invite.contract.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-xs text-blue-600 mt-1">{invite.contract.effort}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-900">Payment</span>
              </div>
              <p className="text-sm font-semibold text-green-700">
                {paymentTerms.amount ? `${paymentTerms.currency} ${paymentTerms.amount}` : paymentTerms.currency}
              </p>
              <p className="text-xs text-green-600 mt-1 capitalize">{paymentTerms.type}</p>
            </div>
          </div>

          {/* Expandable Details */}
          {isExpanded && (
            <div className="border-t pt-4 space-y-3 animate-in slide-in-from-top-2">
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Full Task Description</h5>
                <p className="text-sm text-gray-700">{invite.task.description}</p>
              </div>
              
              <div>
                <h5 className="text-sm font-semibold text-gray-900 mb-2">Payment Schedule</h5>
                <p className="text-sm text-gray-700">{paymentTerms.paymentSchedule}</p>
              </div>

              {invite.responded_at && (
                <div className="text-xs text-gray-500">
                  Responded on {new Date(invite.responded_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show More
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Main Invites View Component
export default function InvitesView({ projectID }: InvitesViewProps) {
  const { data: invites, isLoading, error } = useQuery({
    queryKey: ['invites', projectID],
    queryFn: () => invitesApi.invitesByProjectID(projectID),
  });

  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');

  const filteredInvites = invites?.filter((invite:any) => 
    filter === 'all' || invite.status === filter
  );

  const stats = {
    total: invites?.length || 0,
    pending: invites?.filter((i:any) => i.status === 'pending').length || 0,
    accepted: invites?.filter((i:any) => i.status === 'accepted').length || 0,
    declined: invites?.filter((i:any) => i.status === 'declined').length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to Load Invites</h3>
        <p className="text-sm text-gray-600">Please try refreshing the page.</p>
      </div>
    );
  }

  if (!invites || invites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <User className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Invites Yet</h3>
        <p className="text-sm text-gray-600">Invites sent to associates will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('all')}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Invites</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('pending')}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('accepted')}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              <p className="text-sm text-gray-600">Accepted</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilter('declined')}>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
              <p className="text-sm text-gray-600">Declined</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Info */}
      {filter !== 'all' && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <p className="text-sm text-blue-900">
            Showing <span className="font-semibold">{filteredInvites?.length}</span> {filter} invite{filteredInvites?.length !== 1 ? 's' : ''}
          </p>
          <Button variant="ghost" size="sm" onClick={() => setFilter('all')} className="text-blue-700">
            Clear Filter
          </Button>
        </div>
      )}

      {/* Invites List */}
      <div className="space-y-4">
        {filteredInvites?.map((invite:any) => (
          <InviteCard key={invite.id} invite={invite} />
        ))}
      </div>
    </div>
  );
}