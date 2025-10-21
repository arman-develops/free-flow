"use client"

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, User, Clock, Plus, X, Save, Edit2, Eye, Loader2, FileX } from 'lucide-react';
import { Contract } from '@/types/contract';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios-config';
import { contractApi } from '@/lib/api';
import { useParams } from 'next/navigation';

interface ContractModalProps {
    isOpen: boolean
    onClose: () => void
    taskId: string
    contract_metadata: {
      project_name: string
      project_description: string
      task_name: string
      task_description: string
    }
}

export default function ContractModal({ isOpen, onClose, taskId, contract_metadata }: ContractModalProps) {
  const params = useParams()
  const projectID = params.id as string

  const queryClient = useQueryClient();
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view');
  const [contract, setContract] = useState<Contract>({
    id: '',
    project_id: projectID,
    task_id: taskId,
    role: '',
    description: '',
    responsibilities: [''],
    timeline_notes: '',
    effort: '',
    deliverables: [''],
    payment_terms: '',
    start_date: '',
    end_date: '',
    timestamp: new Date().toISOString()
  });

  // Fetch contract by task ID
  const { data: contractResponse, isLoading, error } = useQuery({
    queryKey: ['contract', taskId],
    queryFn: () => contractApi.contractByTaskID(taskId!),
    enabled: isOpen && !!taskId,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: contractApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', taskId] });
      onClose();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({contractID, data}: {contractID: string, data: any}) => contractApi.updateContract(contractID, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', taskId] });
      setMode('view');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contractApi.deleteContract(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contract', taskId] });
      setMode('view');
    },
  })

  const existingContract = contractResponse?.success ? contractResponse?.data : null

  // Update local state when contract is fetched
  useEffect(() => {
    if (existingContract) {
      setContract(existingContract);
      setMode('view');
    } else if (!isLoading && !existingContract && isOpen) {
      setMode('create');
      setContract({
        id: '',
        project_id: projectID,
        task_id: taskId,
        role: '',
        description: '',
        responsibilities: [''],
        timeline_notes: '',
        effort: '',
        deliverables: [''],
        payment_terms: '',
        start_date: '',
        end_date: '',
        timestamp: new Date().toISOString()
      });
    }
  }, [existingContract, isLoading, isOpen, taskId]);

  const handleAddResponsibility = () => {
    setContract(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, '']
    }));
  };

  const handleRemoveResponsibility = (index: number) => {
    setContract(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const handleResponsibilityChange = (index: number, value: string) => {
    setContract(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.map((r, i) => i === index ? value : r)
    }));
  };

  const handleAddDeliverable = () => {
    setContract(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }));
  };

  const handleRemoveDeliverable = (index: number) => {
    setContract(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
  };

  const handleDeliverableChange = (index: number, value: string) => {
    setContract(prev => ({
      ...prev,
      deliverables: prev.deliverables.map((d, i) => i === index ? value : d)
    }));
  };

  const handleSave = () => {
    const contractToSave = {
      ...contract,
      task_id: taskId || '',
      project_id: projectID,
      timestamp: new Date().toISOString(),
      responsibilities: contract.responsibilities.filter(r => r.trim() !== ''),
      deliverables: contract.deliverables.filter(d => d.trim() !== ''),
      timeline_notes: contract.timeline_notes,
      payment_terms: contract.payment_terms
    };

    if (existingContract) {
      console.log(contractToSave)
      updateMutation.mutateAsync({contractID: contract.id, data: contractToSave});
    } else {
      createMutation.mutate(contractToSave);
    }
  };

  const handleContractDelete = (id:string) => {
    deleteMutation.mutateAsync(id)
    onClose()
  }

  const isViewMode = mode === 'view';
  const isEditing = mode === 'edit' || mode === 'create';
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Loading state
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p className="text-sm text-gray-600">Loading contract details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex flex-col items-center justify-center py-12">
            <FileX className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Contract</h3>
            <p className="text-sm text-gray-600 mb-6">We couldn't load the contract. Please try again.</p>
            <Button onClick={onClose} variant="outline">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Empty state - no contract exists
  if (!existingContract && mode === 'view') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-blue-50 rounded-full p-4 mb-4">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Contract Found</h3>
            <p className="text-sm text-gray-600 mb-6 text-center max-w-md">
              There's no contract associated with this task yet. Would you like to create one?
            </p>
            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline">Cancel</Button>
              <Button onClick={() => setMode('create')} className="gap-2">
                <Plus className="w-4 h-4" />
                Create Contract
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mt-5">
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              {mode === 'create' ? 'Create New Contract' : isViewMode ? 'Contract Overview' : 'Edit Contract'}
            </DialogTitle>
            {existingContract && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode(isViewMode ? 'edit' : 'view')}
                className="gap-2"
                disabled={isSaving}
              >
                {isViewMode ? <Edit2 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isViewMode ? 'Edit' : 'View'}
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(contract.timestamp).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          {isViewMode ? (
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {contract?.description || "No description provided"}
            </p>
          ) : (
            <Textarea
              id="description"
              value={contract?.description}
              onChange={(e) => setContract(prev => ({ ...prev, timeline_notes: e.target.value }))}
              placeholder="Any additional timeline considerations or milestones"
              rows={2}
              className="resize-none"
              disabled={isSaving}
            />
          )}
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Details Section */}
          <div className="space-y-4 pb-4 border-b">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Project Details
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="project_name">Project Name *</Label>
                <p className="text-sm font-medium">{contract_metadata?.project_name || 'Not specified'}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_description">Project Description *</Label>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{contract_metadata?.project_description || 'Not specified'}</p>
            </div>
          </div>

          {/* Task Details Section */}
          <div className="space-y-4 pb-4 border-b">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Task & Role Details
            </h3>

            <div className="space-y-2">
              <Label htmlFor="task_title">Task Title *</Label>
                <p className="text-sm font-medium">{contract_metadata?.task_name || 'Not specified'}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task_description">Task Description *</Label>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{contract_metadata?.task_description || 'Not specified'}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              {isViewMode ? (
                <Badge variant="secondary" className="font-medium">
                  {contract.role || 'Not specified'}
                </Badge>
              ) : (
                <Input
                  id="role"
                  value={contract.role}
                  onChange={(e) => setContract(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Senior Frontend Developer"
                  disabled={isSaving}
                />
              )}
            </div>
          </div>

          {/* Responsibilities Section */}
          <div className="space-y-4 pb-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Responsibilities *</h3>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddResponsibility}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {contract.responsibilities.map((resp, index) => (
                <div key={index} className="flex gap-2 items-start">
                  {isViewMode ? (
                    <div className="flex gap-2 w-full">
                      <span className="text-sm font-medium text-gray-500 mt-0.5">•</span>
                      <p className="text-sm text-gray-700 flex-1">{resp}</p>
                    </div>
                  ) : (
                    <>
                      <Input
                        value={resp}
                        onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                        placeholder={`Responsibility ${index + 1}`}
                        className="flex-1"
                        disabled={isSaving}
                      />
                      {contract.responsibilities.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveResponsibility(index)}
                          className="shrink-0"
                          disabled={isSaving}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Section */}
          <div className="space-y-4 pb-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Deliverables</h3>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddDeliverable}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {contract.deliverables.map((deliv, index) => (
                <div key={index} className="flex gap-2 items-start">
                  {isViewMode ? (
                    <div className="flex gap-2 w-full">
                      <span className="text-sm font-medium text-gray-500 mt-0.5">•</span>
                      <p className="text-sm text-gray-700 flex-1">{deliv}</p>
                    </div>
                  ) : (
                    <>
                      <Input
                        value={deliv}
                        onChange={(e) => handleDeliverableChange(index, e.target.value)}
                        placeholder={`Deliverable ${index + 1}`}
                        className="flex-1"
                        disabled={isSaving}
                      />
                      {contract.deliverables.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDeliverable(index)}
                          className="shrink-0"
                          disabled={isSaving}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-4 pb-4 border-b">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Timeline & Effort
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                {isViewMode ? (
                  <p className="text-sm">
                    {contract.start_date ? new Date(contract.start_date).toLocaleDateString() : 'Not specified'}
                  </p>
                ) : (
                  <Input
                    id="start_date"
                    type="date"
                    value={contract.start_date ? new Date(contract.start_date).toISOString().split("T")[0] : ""}
                    onChange={                      
                      (e) => {
                        const date = new Date(e.target.value)
                        setContract(prev => ({ ...prev, start_date: date.toISOString() }))
                      }
                    }
                    disabled={isSaving}
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                {isViewMode ? (
                  <p className="text-sm">
                    {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'Not specified'}
                  </p>
                ) : (
                  <Input
                    id="end_date"
                    type="date"
                    value={contract.end_date ? new Date(contract.end_date).toISOString().split("T")[0] : ""}
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      setContract(prev => ({ ...prev, end_date: date.toISOString() }))
                    }}                  
                    disabled={isSaving}
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="effort">Estimated Effort *</Label>
              {isViewMode ? (
                <Badge variant="outline" className="font-medium">
                  <Clock className="w-3 h-3 mr-1" />
                  {contract.effort || 'Not specified'}
                </Badge>
              ) : (
                <Input
                  id="effort"
                  value={contract.effort}
                  onChange={(e) => setContract(prev => ({ ...prev, effort: e.target.value }))}
                  placeholder="e.g., 40 hours/week, 3 months"
                  disabled={isSaving}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Additional Timeline Notes</Label>
              {isViewMode ? (
                <p className="text-sm text-gray-700">{contract.timeline_notes || 'None'}</p>
              ) : (
                <Textarea
                  id="timeline"
                  value={contract.timeline_notes}
                  onChange={(e) => setContract(prev => ({ ...prev, timeline_notes: e.target.value }))}
                  placeholder="Any additional timeline considerations or milestones"
                  rows={2}
                  className="resize-none"
                  disabled={isSaving}
                />
              )}
            </div>
          </div>

          {/* Payment Terms Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Payment Terms</h3>
            
            <div className="space-y-2">
              <Label htmlFor="payment_terms">Terms & Conditions</Label>
              {isViewMode ? (
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{contract.payment_terms || 'Not specified'}</p>
              ) : (
                <Textarea
                  id="payment_terms"
                  value={contract.payment_terms}
                  onChange={(e) => setContract(prev => ({ ...prev, payment_terms: e.target.value }))}
                  placeholder="Specify payment schedule, rates, and conditions"
                  rows={3}
                  className="resize-none"
                  disabled={isSaving}
                />
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <div className="flex gap-3 justify-between">
            {!isEditing ? (
              <Button 
                variant="destructive" 
                onClick={
                  () => handleContractDelete(contract.id)
                } 
                disabled={isSaving}>
                Delete
              </Button>
            ) : (
              <Button variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
            )}
            <div>
              {isEditing && (
                <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {mode === 'create' ? 'Create Contract' : 'Save Changes'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}