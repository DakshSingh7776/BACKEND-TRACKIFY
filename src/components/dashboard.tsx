'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Search } from 'lucide-react';
import { initialApplications } from '@/lib/data';
import type { Application, ApplicationStatus } from '@/lib/types';
import { applicationStatuses } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ApplicationCard } from '@/components/application-card';
import { AddApplicationDialog } from '@/components/add-application-dialog';

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const searchMatch =
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'all' || app.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [applications, searchTerm, statusFilter]);

  const handleAddApplication = (newApplicationData: Omit<Application, 'id'>) => {
    const newApplication: Application = {
      ...newApplicationData,
      id: (applications.length + 1).toString(),
    };
    setApplications((prev) => [newApplication, ...prev]);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-headline font-bold text-foreground">
          My Applications
        </h1>
        <div className="flex items-center gap-2">
           <AddApplicationDialog 
            onApplicationAdd={handleAddApplication} 
            open={isDialogOpen} 
            onOpenChange={setIsDialogOpen}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Application
            </Button>
          </AddApplicationDialog>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by company or position..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {applicationStatuses.map((status) => (
              <SelectItem key={status} value={status} className="capitalize">
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredApplications.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground font-body">No applications found.</p>
          <p className="text-sm text-muted-foreground/80 font-body">
            {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters.' : 'Click "Add Application" to get started!'}
          </p>
        </div>
      )}
    </div>
  );
}
