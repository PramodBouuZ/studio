'use server';

/**
 * @fileOverview This file defines a Genkit flow for refining customer inquiries.
 *
 * The flow takes an initial customer inquiry as input and uses AI to suggest relevant keywords
 * or clarify requirements, helping customers find the right vendor more easily.
 *
 * @exported refineCustomerInquiry - The main function to refine customer inquiries.
 * @exported RefineCustomerInquiryInput - The input type for the refineCustomerInquiry function.
 * @exported RefineCustomerInquiryOutput - The output type for the refineCustomerInquiry function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the refineCustomerInquiry flow
const RefineCustomerInquiryInputSchema = z.object({
  inquiry: z.string().describe('The customer inquiry text to be refined.'),
});
export type RefineCustomerInquiryInput = z.infer<typeof RefineCustomerInquiryInputSchema>;

// Define the output schema for the refineCustomerInquiry flow
const RefineCustomerInquiryOutputSchema = z.object({
  refinedInquiry: z.string().describe('The refined customer inquiry with suggested keywords or clarifications.'),
});
export type RefineCustomerInquiryOutput = z.infer<typeof RefineCustomerInquiryOutputSchema>;

/**
 * Refines a customer inquiry using AI to suggest relevant keywords or clarify requirements.
 *
 * @param input - The input containing the customer's initial inquiry.
 * @returns The refined inquiry with suggested keywords or clarifications.
 */
export async function refineCustomerInquiry(input: RefineCustomerInquiryInput): Promise<RefineCustomerInquiryOutput> {
  return refineCustomerInquiryFlow(input);
}

// Define the prompt for refining the customer inquiry
const refineCustomerInquiryPrompt = ai.definePrompt({
  name: 'refineCustomerInquiryPrompt',
  input: {schema: RefineCustomerInquiryInputSchema},
  output: {schema: RefineCustomerInquiryOutputSchema},
  prompt: `You are an AI assistant helping customers refine their inquiries to better match vendor offerings on a marketplace.

  The customer has provided the following initial inquiry: {{{inquiry}}}

  Suggest relevant keywords or clarifications to help the customer find the right vendor and get the help they need.
  Provide the refined inquiry in a clear and concise manner.
`,
});

// Define the Genkit flow for refining the customer inquiry
const refineCustomerInquiryFlow = ai.defineFlow(
  {
    name: 'refineCustomerInquiryFlow',
    inputSchema: RefineCustomerInquiryInputSchema,
    outputSchema: RefineCustomerInquiryOutputSchema,
  },
  async input => {
    const {output} = await refineCustomerInquiryPrompt(input);
    return output!;
  }
);
