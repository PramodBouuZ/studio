'use client';
import { useState, useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2, Send, UserPlus, ArrowRight } from 'lucide-react';
import { refineCustomerInquiry, RefineCustomerInquiryOutput } from '@/ai/flows/refine-customer-inquiry';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type FormState = (RefineCustomerInquiryOutput & { success: boolean }) | { success: boolean; error: string } | null;

async function handleInquiry(prevState: FormState, formData: FormData): Promise<FormState> {
  const inquiry = formData.get('inquiry') as string;
  const conversationHistory = formData.get('conversationHistory') as string;
  const isNewConversation = !conversationHistory || conversationHistory.length === 2; // "[]" is length 2

  if (!inquiry || inquiry.trim().length < 2) {
    return { success: false, error: 'Please provide a more detailed response.' };
  }

  const fullInquiry = conversationHistory ? `${conversationHistory}\nUser: ${inquiry}` : `User: ${inquiry}`;

  try {
    const result = await refineCustomerInquiry({ inquiry: fullInquiry, isNewConversation });
    return { ...result, success: true };
  } catch (e) {
    return { success: false, error: 'Failed to get AI refinement. Please try again.' };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Send
        </>
      )}
    </Button>
  );
}

export default function InquirySection() {
  const [state, formAction] = useActionState(handleInquiry, null);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inquirySectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state?.success) {
      if ('refinedInquiry' in state) {
        setConversation(prev => [...prev, { role: 'assistant', content: state.refinedInquiry }]);
        if (state.isFinished) {
          setAuthModalOpen(true);
        }
      }
    } else if (state?.success === false && 'error' in state) {
      setConversation(prev => [...prev, { role: 'assistant', content: state.error || "Sorry, I encountered an error." }]);
    }
  }, [state]);

  const handleFormSubmit = (formData: FormData) => {
    const inquiry = formData.get('inquiry') as string;
    setConversation(prev => [...prev, { role: 'user', content: inquiry }]);
    
    const conversationHistory = conversation.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    formData.append('conversationHistory', JSON.stringify(conversation));
    
    formAction(formData);
    formRef.current?.reset();
  };

  const handleScrollToInquiry = () => {
    inquirySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="text-center -mt-16 relative z-10 mb-16">
        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleScrollToInquiry}>
            Submit Your Inquiry
            <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <section id="inquiry" className="py-16 sm:py-24" ref={inquirySectionRef}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Need Something Specific?
            </h2>
            <p className="text-muted-foreground md:text-xl/relaxed">
              Describe your project, and our AI will help refine your inquiry to attract the perfect vendors. We'll guide you through specifying your Budget, Authority, Need, and Timeline (BANT) to ensure the best match.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Submit Your Inquiry</CardTitle>
              <CardDescription>Let our AI assistant guide you.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-96 overflow-y-auto p-4 border rounded-md bg-secondary/50 flex flex-col gap-4">
                  {conversation.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {conversation.length === 0 && (
                     <div className="text-center text-muted-foreground self-center">
                        <p>Start by telling us what you need.</p>
                        <p className="text-xs">e.g., "I need a CRM"</p>
                     </div> 
                  )}
                </div>
                <form action={handleFormSubmit} ref={formRef} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="inquiry">Your Message</Label>
                    <Textarea
                      id="inquiry"
                      name="inquiry"
                      placeholder="Type your message here..."
                      rows={3}
                      required
                    />
                  </div>
                  <SubmitButton />
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Almost there!</DialogTitle>
            <DialogDescription>
              Your inquiry has been refined. Please create an account or sign in to submit it to our vendors.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Simple Auth Form Placeholder */}
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
            </div>
          </div>
          <DialogFooter className='gap-2 sm:justify-between'>
            <Button variant="outline">Sign In</Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4"/>
              Create Account & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
