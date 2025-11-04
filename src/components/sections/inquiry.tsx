'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Lightbulb, Loader2, Send } from 'lucide-react';
import { refineCustomerInquiry, RefineCustomerInquiryOutput } from '@/ai/flows/refine-customer-inquiry';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type FormState = (RefineCustomerInquiryOutput & { success: boolean }) | { success: boolean; error: string } | null;

async function handleInquiry(prevState: FormState, formData: FormData): Promise<FormState> {
  const inquiry = formData.get('inquiry') as string;
  if (!inquiry || inquiry.trim().length < 10) {
    return { success: false, error: 'Please provide a more detailed inquiry.' };
  }

  try {
    const result = await refineCustomerInquiry({ inquiry });
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
          Refining...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Refine & Submit Inquiry
        </>
      )}
    </Button>
  );
}

export default function InquirySection() {
  const [state, formAction] = useFormState(handleInquiry, null);

  return (
    <section id="inquiry" className="py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Need Something Specific?
          </h2>
          <p className="text-muted-foreground md:text-xl/relaxed">
            Describe your project, and our AI will help refine your inquiry to attract the perfect vendors. The more details you provide, the better we can match you with qualified experts ready to help.
          </p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Submit Your Inquiry</CardTitle>
            <CardDescription>Let our AI help you craft the perfect request.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inquiry">Your Detailed Requirements</Label>
                <Textarea
                  id="inquiry"
                  name="inquiry"
                  placeholder="e.g., 'I need a new e-commerce website with Shopify integration for about 50 products...'"
                  rows={6}
                  required
                />
              </div>
              <SubmitButton />
            </form>
            {state && (
              <div className="mt-6">
                {state.success && 'refinedInquiry' in state ? (
                   <Alert>
                     <Lightbulb className="h-4 w-4" />
                     <AlertTitle>AI Suggestion</AlertTitle>
                     <AlertDescription>
                       <p className="mb-2">We've refined your inquiry for better results:</p>
                       <p className="font-semibold italic p-4 bg-secondary rounded-md">"{state.refinedInquiry}"</p>
                       <p className="mt-2 text-xs text-muted-foreground">Your inquiry has been submitted with these improvements.</p>
                     </AlertDescription>
                   </Alert>
                ) : (
                  state.success === false && 'error' in state && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
