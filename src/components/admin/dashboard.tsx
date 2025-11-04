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
import { leads as initialLeads, vendors, type Lead } from '@/lib/data';
import UserDetailsSheet from './user-details-sheet';

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);

  const handleViewDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setSheetOpen(true);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
  };
  
  const handleDownloadLeads = () => {
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
      <div className="flex justify-end mb-4">
        <Button onClick={handleDownloadLeads}>
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
            {leads.map((lead) => (
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
                      <DropdownMenuItem>
                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                        <span className="text-destructive">Delete Lead</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedLead && (
        <UserDetailsSheet
          lead={selectedLead}
          isOpen={isSheetOpen}
          onOpenChange={setSheetOpen}
          onUpdateLead={handleUpdateLead}
          vendors={vendors.map(v => v.name)}
        />
      )}
    </>
  );
}
