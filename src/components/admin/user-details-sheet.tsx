'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Lead } from '@/lib/data';
import { Sparkles, Loader2 } from 'lucide-react';
import { improveLeadQualification, ImproveLeadQualificationOutput } from '@/ai/flows/improve-lead-qualification';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

interface UserDetailsSheetProps {
  lead: Lead;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdateLead: (updatedLead: Lead) => void;
  vendors: string[];
}

type AIState = {
  loading: boolean;
  suggestions: string[] | null;
  error: string | null;
};

export default function UserDetailsSheet({
  lead,
  isOpen,
  onOpenChange,
  onUpdateLead,
  vendors
}: UserDetailsSheetProps) {
  const [editedLead, setEditedLead] = useState<Lead>(lead);
  const [aiState, setAiState] = useState<AIState>({ loading: false, suggestions: null, error: null });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedLead({ ...editedLead, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setEditedLead({ ...editedLead, [name]: value });
  };

  const handleSaveChanges = () => {
    onUpdateLead(editedLead);
    onOpenChange(false);
  };
  
  const handleGetAISuggestions = async () => {
    setAiState({ loading: true, suggestions: null, error: null });
    try {
        const userDetails = `
        Name: ${lead.name}
        Company: ${lead.company}
        Inquiry: ${lead.inquiry}
        Current Status: ${lead.status}
        Assigned Vendor: ${lead.assignedVendor || 'None'}
        `;
      const result: ImproveLeadQualificationOutput = await improveLeadQualification({ userDetails });
      setAiState({ loading: false, suggestions: result.suggestions, error: null });
    } catch (error) {
      setAiState({ loading: false, suggestions: null, error: 'Failed to get AI suggestions.' });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Lead Details</SheetTitle>
          <SheetDescription>View, edit, and get AI insights for this lead.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" name="name" value={editedLead.name} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">Company</Label>
            <Input id="company" name="company" value={editedLead.company} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" name="email" value={editedLead.email} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" name="phone" value={editedLead.phone} onChange={handleInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="inquiry" className="text-right mt-2">Inquiry</Label>
            <Textarea id="inquiry" name="inquiry" value={editedLead.inquiry} onChange={handleInputChange} className="col-span-3" rows={5} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select name="status" value={editedLead.status} onValueChange={(v) => handleSelectChange('status', v)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Set status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedVendor" className="text-right">Assigned Vendor</Label>
            <Select name="assignedVendor" value={editedLead.assignedVendor} onValueChange={(v) => handleSelectChange('assignedVendor', v)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Assign vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Unassigned</SelectItem>
                {vendors.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-4">
            <Button onClick={handleGetAISuggestions} variant="outline" className="w-full" disabled={aiState.loading}>
              {aiState.loading ? (
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4 text-accent" />
              )}
              Get AI Suggestions for Lead Qualification
            </Button>
          </div>
          {aiState.suggestions && (
            <div className="col-span-4">
               <Alert>
                 <Sparkles className="h-4 w-4" />
                 <AlertTitle>AI-Powered Suggestions</AlertTitle>
                 <AlertDescription>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        {aiState.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                 </AlertDescription>
               </Alert>
            </div>
          )}
          {aiState.error && (
            <div className="col-span-4">
                 <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{aiState.error}</AlertDescription>
                 </Alert>
            </div>
          )}
        </div>
        <SheetFooter>
          <Button type="submit" onClick={handleSaveChanges}>Save Changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
