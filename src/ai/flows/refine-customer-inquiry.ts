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
  "What are the key features you are looking for? For example, for a CRM, how many users do you need to support?",
  "What is your ideal timeline for completing this project?"
];

// Define the prompt for refining the customer inquiry
const refineCustomerInquiryPrompt = ai.definePrompt({
  name: 'refineCustomerInquiryPrompt',
  input: {schema: RefineCustomerInquiryInputSchema},
  output: {schema: RefineCustomerInquiryOutputSchema},
  prompt: `You are an AI assistant helping customers refine their inquiries on a marketplace by following BANT (Budget, Authority, Need, Timeline) parameters.

  The customer has provided the following inquiry: {{{inquiry}}}

  {{#if isNewConversation}}
  You are starting a new conversation. Your goal is to guide the user through the BANT questions.
  Start by asking the first BANT question: "${BANT_QUESTIONS[0]}"
  Set isFinished to false.
  Your output should be just the question.
  {{else}}
  Analyze the user's response. If the current question is answered, ask the next BANT question.
  If the user's response is a question or doesn't answer the current BANT question, provide a helpful response and repeat the current BANT question.
  Once all BANT questions are answered, summarize the collected information (Budget, Authority, Need, Timeline) into a refined inquiry.
  Then set isFinished to true and the refinedInquiry to the summarized text.
  If there are more questions to ask, set isFinished to false and refinedInquiry to the next question.
  Here are the BANT questions for your reference:
  1. Budget: ${BANT_QUESTIONS[0]}
  2. Authority: ${BANT_QUESTIONS[1]}
  3. Need: ${BANT_QUESTIONS[2]}
  4. Timeline: ${BANT_QUESTIONS[3]}
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
