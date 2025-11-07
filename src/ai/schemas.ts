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
