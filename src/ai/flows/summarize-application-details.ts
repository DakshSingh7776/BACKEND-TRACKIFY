// Summarize application details using AI to quickly review key information.

'use server';

/**
 * @fileOverview Summarizes job application details.
 *
 * - summarizeApplicationDetails - A function that summarizes job application details.
 * - SummarizeApplicationDetailsInput - The input type for the summarizeApplicationDetails function.
 * - SummarizeApplicationDetailsOutput - The return type for the summarizeApplicationDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeApplicationDetailsInputSchema = z.object({
  company: z.string().describe('The name of the company.'),
  position: z.string().describe('The position applied for.'),
  dateApplied: z.string().describe('The date the application was submitted (e.g., YYYY-MM-DD).'),
  linkToJobPosting: z.string().describe('A URL to the job posting.'),
  applicationStatus: z.string().describe('The current status of the application (applied, interviewed, offer, rejected).'),
});
export type SummarizeApplicationDetailsInput = z.infer<typeof SummarizeApplicationDetailsInputSchema>;

const SummarizeApplicationDetailsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the job application details.'),
});
export type SummarizeApplicationDetailsOutput = z.infer<typeof SummarizeApplicationDetailsOutputSchema>;

export async function summarizeApplicationDetails(input: SummarizeApplicationDetailsInput): Promise<SummarizeApplicationDetailsOutput> {
  return summarizeApplicationDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeApplicationDetailsPrompt',
  input: {schema: SummarizeApplicationDetailsInputSchema},
  output: {schema: SummarizeApplicationDetailsOutputSchema},
  prompt: `Summarize the following job application details:

Company: {{{company}}}
Position: {{{position}}}
Date Applied: {{{dateApplied}}}
Link to Job Posting: {{{linkToJobPosting}}}
Application Status: {{{applicationStatus}}}

Provide a concise summary highlighting key information for quick review.`,
});

const summarizeApplicationDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeApplicationDetailsFlow',
    inputSchema: SummarizeApplicationDetailsInputSchema,
    outputSchema: SummarizeApplicationDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
