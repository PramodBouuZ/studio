'use server';

/**
 * @fileOverview This file defines a Genkit flow for refining customer inquiries.
 *
 * The flow takes an initial customer inquiry as input and uses AI to suggest relevant keywords
 * or clarify requirements, helping customers find the right vendor more easily by following BANT parameters.
 * It also suggests products from the catalog based on the user's query.
 *
 * @exported refineCustomerInquiry - The main function to refine customer inquiries.
 * @exported RefineCustomerInquiryInput - The input type for the refineCustomerInquiry function.
 * @exported RefineCustomerInquiryOutput - The output type for the refineCustomerInquiry function.
 */

import {ai} from '@/ai/genkit';
import {products} from '@/lib/data';
import {z} from 'genkit';

const RefineCustomerInquiryInputSchema = z.object({
  inquiry: z.string().describe('The customer inquiry text to be refined.'),
  isNewConversation: z.boolean().optional().describe('Whether this is the start of a new conversation.'),
});
export type RefineCustomerInquiryInput = z.infer<typeof RefineCustomerInquiryInputSchema>;

const RefineCustomerInquiryOutputSchema = z.object({
  refinedInquiry: z.string().describe('The refined customer inquiry or the next question to ask.'),
  isFinished: z.boolean().describe('Whether the BANT process is complete.'),
  suggestedProductIds: z.array(z.string()).optional().describe('A list of product IDs to highlight in the UI.'),
  summaryForAdmin: z.string().optional().describe('A concise summary of the user inquiry for the admin panel.')
});
export type RefineCustomerInquiryOutput = z.infer<typeof RefineCustomerInquiryOutputSchema>;

/**
 * Refines a customer inquiry using AI to suggest relevant keywords or clarify requirements following BANT.
 *
 * @param input - The input containing the customer's initial inquiry.
 * @returns The refined inquiry or next question, and whether the process is finished.
 */
export async function refineCustomerInquiry(input: RefineCustomerInquiryInput): Promise<RefineCustomerInquiryOutput> {
  const productList = products.map(p => `- ${p.name}: ${p.description} (ID: ${p.id})`).join('\n');
  const result = await refineCustomerInquiryFlow({ ...input, productList });

  // Post-processing to extract product IDs if any
  const suggestedProductIds = products.filter(p => result.refinedInquiry.includes(p.name)).map(p => p.id);

  return { ...result, suggestedProductIds };
}

const BANT_QUESTIONS = [
  'To better understand your needs, could you provide an estimated budget for this project?',
  'Who will be the main point of contact and decision-maker for this project?',
  'What is your ideal timeline for completing this project?',
];

// Define the prompt for refining the customer inquiry
const refineCustomerInquiryPrompt = ai.definePrompt({
  name: 'refineCustomerInquiryPrompt',
  input: {schema: z.object({
    inquiry: RefineCustomerInquiryInputSchema.shape.inquiry,
    isNewConversation: RefineCustomerInquiryInputSchema.shape.isNewConversation,
    productList: z.string().describe('A list of available products in the catalog.'),
  })},
  output: {schema: RefineCustomerInquiryOutputSchema},
  prompt: `You are an AI assistant helping customers find the right product on a marketplace. Your goal is to guide them through the BANT (Budget, Authority, Need, Timeline) process.

  Here is the product catalog:
  {{{productList}}}

  Here is the conversation history: {{{inquiry}}}

  {{#if isNewConversation}}
  You are starting a new conversation.
  - Your first message should always be: "Hello! I'm here to help you find the perfect vendor. To start, could you please tell me what you're looking for?"
  - Set isFinished to false.
  {{else}}
  Analyze the user's latest message in the context of the conversation history.

  1.  **Initial Interaction**:
      - If this is the second message in the conversation (user is responding to your greeting), analyze their requirement.
      - If their request seems to match products, suggest them (e.g., "Based on your request for a 'VoIP system', I'd recommend..."). Then, ask the first BANT question about their Need: "To refine this, what are the key features you're looking for?".
      - If their request is generic ("I need help"), ask for more details: "Certainly! Could you please describe your requirements in more detail?".
      - Set isFinished to false.

  2.  **BANT Process & Product Suggestions**:
      - If you have just suggested products, wait for their response. If they confirm interest or provide more details, start the BANT process by asking about **Budget**: "${BANT_QUESTIONS[0]}".
      - If a BANT question has been answered, ask the next one in the sequence (Budget -> Authority -> Timeline).
      - If the user's response is a question or doesn't answer the current BANT question after you've asked it twice, be flexible. Ask: "No problem. Would you like me to submit your inquiry as-is, and our team will contact you for more details?".
      - If they agree to have the team contact them, set **isFinished** to **true**. Set **refinedInquiry** to a confirmation message like "Great! I've forwarded your request to our team. To complete the submission, please sign up or log in.". Also, create a concise **summaryForAdmin** based on the conversation so far.

  3.  **Finishing the Conversation**:
      - Once all BANT questions are answered, you must conclude the conversation.
      - Create a final summary of the user's need, budget, authority, and timeline.
      - Set **isFinished** to **true**.
      - Set **refinedInquiry** to the final summary, followed by: "To submit this inquiry and connect with vendors, please create an account or sign in."
      - Set **summaryForAdmin** to the same final summary.
  {{/if}}
`,
});

// Define the Genkit flow for refining the customer inquiry
const refineCustomerInquiryFlow = ai.defineFlow(
  {
    name: 'refineCustomerInquiryFlow',
    inputSchema: z.object({
      inquiry: RefineCustomerInquiryInputSchema.shape.inquiry,
      isNewConversation: RefineCustomerInquiryInputSchema.shape.isNewConversation,
      productList: z.string(),
    }),
    outputSchema: RefineCustomerInquiryOutputSchema,
  },
  async input => {
    const {output} = await refineCustomerInquiryPrompt(input);
    return output!;
  }
);
