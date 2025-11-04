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
  prompt: `You are an AI assistant helping customers find the right product on a marketplace.

  Here is the product catalog:
  {{{productList}}}

  The customer has provided the following inquiry history: {{{inquiry}}}

  {{#if isNewConversation}}
  You are starting a new conversation.
  Analyze the user's first message.
  - If it's a simple greeting or a generic request like "I need help", ask for more details first. For example: "Certainly! Could you please describe your requirements?".
  - If the user's request seems to match one or more products from the catalog, suggest them. For example: "Based on your request for a 'VoIP system', I'd recommend looking at our 'VoIP Business Phone System' and 'Cloud Contact Center' products. Can you tell me more about your needs so I can help you decide?".
  - If the user has provided enough detail in their first message, start by asking the first BANT question about their need: "What are the key features you are looking for?".
  Set isFinished to false.
  {{else}}
  Analyze the user's response in the context of the conversation.
  - If you have just suggested products, wait for their response. If they confirm interest or provide more details, start the BANT process by asking the first BANT question about Budget: "${BANT_QUESTIONS[0]}".
  - If you have just asked for initial requirements, evaluate if the user has provided them. If they have, and the requirements match products, suggest them. Otherwise, ask the first BANT question: "${BANT_QUESTIONS[0]}".
  - If a BANT question has been answered, ask the next one in the sequence (Budget -> Authority -> Timeline).
  - If the user's response is a question or doesn't answer the current BANT question, provide a helpful response and repeat the current BANT question.
  - Once all BANT questions are answered, summarize the collected information (Need, Budget, Authority, Timeline) and the suggested products into a refined inquiry.
  - Then set isFinished to true and the refinedInquiry to the summarized text.
  - If there are more questions to ask, set isFinished to false and refinedInquiry to the next question.
  
  BANT questions for reference:
  1. Budget: ${BANT_QUESTIONS[0]}
  2. Authority: ${BANT_QUESTIONS[1]}
  3. Timeline: ${BANT_QUESTIONS[2]}
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
