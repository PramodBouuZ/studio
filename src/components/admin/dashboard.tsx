'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileDown,
  MoreVertical,
  CheckCircle2,
  Edit,
  Trash2,
} from 'lucide-react';
import { type Lead } from '@/lib/data';
import UserDetailsSheet from './user-details-sheet';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import type { VendorProfile } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

export default function AdminDashboard() {
  const firestore = useFirestore();
  const leadsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'leads') : null, [firestore]);
  const { data: leads, isLoading: isLeadsLoading } = useCollection<Lead>(leadsCollection);

  const vendorsCollection = useMemoFirebase(() => firestore ? collection(firestore, 'vendors') : null, [firestore]);
  const { data: vendors, isLoading: isVendorsLoading } = useCollection<VendorProfile>(vendorsCollection);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setSheetOpen(true);
  };
  
  const handleDeleteLead = async (leadId: string) => {
      if (!firestore) return;
      await deleteDoc(doc(firestore, 'leads', leadId));
  }

  const handleDownloadLeads = () => {
    if (!leads) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID", "Name", "Company", "Email", "Phone", "Inquiry", "Status", "Assigned Vendor"].join(",")
      + "\n"
      + leads.map(e => `"${e.id}","${e.name}","${e.company}","${e.email}","${e.phone}","${e.inquiry.replace(/"/g, '""')}","${e.status}","${e.assignedVendor}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Leads Dashboard</h1>
        <p className="text-muted-foreground">View and manage all customer inquiries.</p>
      </div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleDownloadLeads} disabled={!leads || leads.length === 0}>
          <FileDown className="mr-2 h-4 w-4" />
          Download Leads
        </Button>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Inquiry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Assigned Vendor</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLeadsLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
            ))}
            {!isLeadsLoading && leads?.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="font-medium">{lead.name}</div>
                  <div className="text-sm text-muted-foreground">{lead.company}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell max-w-sm">
                  <p className="truncate">{lead.inquiry}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={lead.status === 'New' ? 'default' : lead.status === 'Qualified' ? 'outline' : 'secondary'}
                    className={lead.status === 'Qualified' ? 'border-green-500 text-green-600' : ''}
                  >
                    {lead.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{lead.assignedVendor || 'Unassigned'}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleViewDetails(lead)}>
                        <Edit className="mr-2 h-4 w-4" />
                        View/Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Verify Lead
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteLead(lead.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete Lead</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
             {!isLeadsLoading && leads?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No leads found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {selectedLead && (
        <UserDetailsSheet
          lead={selectedLead}
          isOpen={isSheetOpen}
          onOpenChange={setSheetOpen}
          vendors={vendors?.map(v => v.name) || []}
          isVendorsLoading={isVendorsLoading}
        />
      )}
    </>
  );
}
