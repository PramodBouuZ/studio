'use server';

/**
 * @fileOverview This file defines a Genkit flow for refining customer inquiries.
 *
 * The flow takes an initial customer inquiry as input and uses AI to suggest relevant keywords
 * or clarify requirements, helping customers find the right vendor more easily by following BANT parameters.
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
  isNewConversation: z.boolean().optional().describe('Whether this is the start of a new conversation.'),
});
export type RefineCustomerInquiryInput = z.infer<typeof RefineCustomerInquiryInputSchema>;

// Define the output schema for the refineCustomerInquiry flow
const RefineCustomerInquiryOutputSchema = z.object({
  refinedInquiry: z.string().describe('The refined customer inquiry or the next question to ask.'),
  isFinished: z.boolean().describe('Whether the BANT process is complete.'),
});
export type RefineCustomerInquiryOutput = z.infer<typeof RefineCustomerInquiryOutputSchema>;

/**
 * Refines a customer inquiry using AI to suggest relevant keywords or clarify requirements following BANT.
 *
 * @param input - The input containing the customer's initial inquiry.
 * @returns The refined inquiry or next question, and whether the process is finished.
 */
export async function refineCustomerInquiry(input: RefineCustomerInquiryInput): Promise<RefineCustomerInquiryOutput> {
  return refineCustomerInquiryFlow(input);
}

const BANT_QUESTIONS = [
  "To better understand your needs, could you provide an estimated budget for this project?",
  "Who will be the main point of contact and decision-maker for this project?",
  "What is your ideal timeline for completing this project?"
];

// Define the prompt for refining the customer inquiry
const refineCustomerInquiryPrompt = ai.definePrompt({
  name: 'refineCustomerInquiryPrompt',
  input: {schema: RefineCustomerInquiryInputSchema},
  output: {schema: RefineCustomerInquiryOutputSchema},
  prompt: `You are an AI assistant helping customers refine their inquiries on a marketplace.

  The customer has provided the following inquiry: {{{inquiry}}}

  {{#if isNewConversation}}
  You are starting a new conversation.
  Analyze the user's first message. If it's a simple request like "I need a CRM", ask for more details first. For example: "Certainly! Could you please describe your exact requirements and what features you are looking for in a CRM?".
  If the user has provided enough detail, start by asking the first BANT question about their need: "What are the key features you are looking for? For example, for a CRM, how many users do you need to support?".
  Set isFinished to false.
  {{else}}
  Analyze the user's response in the context of the conversation.
  If you have just asked for initial requirements, evaluate if the user has provided them. If they have, ask the first BANT question: "Great, thank you. To better understand your needs, could you provide an estimated budget for this project?".
  If the current BANT question is answered, ask the next BANT question.
  If the user's response is a question or doesn't answer the current BANT question, provide a helpful response and repeat the current BANT question.
  Once all BANT questions are answered, summarize the collected information (Need, Budget, Authority, Timeline) into a refined inquiry.
  Then set isFinished to true and the refinedInquiry to the summarized text.
  If there are more questions to ask, set isFinished to false and refinedInquiry to the next question.
  Here are the BANT questions for your reference:
  1. Need: What are the key features you are looking for?
  2. Budget: ${BANT_QUESTIONS[0]}
  3. Authority: ${BANT_QUESTIONS[1]}
  4. Timeline: ${BANT_QUESTIONS[2]}
  {{/if}}
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
