'use server';
/**
 * @fileOverview A Genkit flow for generating content and images for the admin panel.
 *
 * This flow can generate various types of text content (titles, descriptions, etc.)
 * and can also generate an image based on a prompt.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GenerateContentInputSchema = z.object({
  prompt: z.string().describe('The topic or prompt for content generation.'),
  contentType: z.enum(['title', 'description', 'buttonText', 'tagText', 'productName']).optional().describe('The type of text content to generate.'),
  generateImage: z.boolean().optional().describe('Whether to generate an image instead of text.'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

export const GenerateContentOutputSchema = z.object({
  generatedText: z.string().optional().describe('The generated text content.'),
  imageUrl: z.string().optional().describe('The data URI of the generated image.'),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;


export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return generateContentFlow(input);
}

const generateTextPrompt = ai.definePrompt({
    name: 'generateTextPrompt',
    input: { schema: GenerateContentInputSchema },
    output: { schema: z.object({ generatedText: z.string() }) },
    prompt: `You are an expert copywriter for a B2B marketplace called BANTConfirm. Your task is to generate a compelling {{contentType}} for a hero banner slide, promotion, or product based on the following topic:

Topic: {{{prompt}}}

Generate a short, punchy, and professional-sounding {{contentType}}.`,
});


const generateContentFlow = ai.defineFlow(
  {
    name: 'generateContentFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async (input) => {
    if (input.generateImage) {
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Generate a professional, high-quality marketing image for a B2B marketplace. The image should be visually appealing and relevant to the following topic: ${input.prompt}. Style: photorealistic, clean, modern, corporate.`,
        config: {
            aspectRatio: '16:9'
        }
      });
      return { imageUrl: media.url };
    } else {
        const {output} = await generateTextPrompt(input);
        return { generatedText: output?.generatedText };
    }
  }
);
