'use server';

/**
 * @fileOverview Provides AI-generated suggestions to improve lead qualification when viewing and editing user details.
 *
 * - improveLeadQualification - A function that takes user details and generates suggestions for improved lead qualification.
 * - ImproveLeadQualificationInput - The input type for the improveLeadQualification function.
 * - ImproveLeadQualificationOutput - The return type for the improveLeadQualification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveLeadQualificationInputSchema = z.object({
  userDetails: z
    .string()
    .describe('Detailed information about the user, including their needs, preferences, and inquiry details.'),
});
export type ImproveLeadQualificationInput = z.infer<typeof ImproveLeadQualificationInputSchema>;

const ImproveLeadQualificationOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions to improve lead qualification, such as clarifying requirements or identifying suitable vendors.'),
});
export type ImproveLeadQualificationOutput = z.infer<typeof ImproveLeadQualificationOutputSchema>;

export async function improveLeadQualification(
  input: ImproveLeadQualificationInput
): Promise<ImproveLeadQualificationOutput> {
  return improveLeadQualificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveLeadQualificationPrompt',
  input: {schema: ImproveLeadQualificationInputSchema},
  output: {schema: ImproveLeadQualificationOutputSchema},
  prompt: `You are an AI assistant helping to improve lead qualification for a marketplace.

  Based on the following user details, provide a list of suggestions to improve lead qualification. Suggestions should focus on clarifying the user's requirements, identifying the most suitable vendors, and any other relevant information that would help in assigning the lead effectively.

  User Details: {{{userDetails}}}

  Suggestions:`,
});

const improveLeadQualificationFlow = ai.defineFlow(
  {
    name: 'improveLeadQualificationFlow',
    inputSchema: ImproveLeadQualificationInputSchema,
    outputSchema: ImproveLeadQualificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
