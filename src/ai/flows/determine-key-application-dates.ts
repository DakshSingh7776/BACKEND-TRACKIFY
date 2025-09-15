'use server';

/**
 * @fileOverview Determines key dates (application, interview, offer, rejection) from a job application description.
 *
 * - determineKeyApplicationDates - A function that identifies key application dates.
 * - DetermineKeyApplicationDatesInput - The input type for the determineKeyApplicationDates function.
 * - DetermineKeyApplicationDatesOutput - The return type for the determineKeyApplicationDates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetermineKeyApplicationDatesInputSchema = z.object({
  applicationDetails: z
    .string()
    .describe('The full text details of the job application.'),
});
export type DetermineKeyApplicationDatesInput = z.infer<
  typeof DetermineKeyApplicationDatesInputSchema
>;

const DetermineKeyApplicationDatesOutputSchema = z.object({
  applicationDate: z
    .string()
    .optional()
    .describe('The date the application was submitted (ISO format).'),
  interviewDate: z
    .string()
    .optional()
    .describe('The date of the interview, if any (ISO format).'),
  offerDate: z
    .string()
    .optional()
    .describe('The date the job offer was extended, if any (ISO format).'),
  rejectionDate: z
    .string()
    .optional()
    .describe('The date the application was rejected, if any (ISO format).'),
});

export type DetermineKeyApplicationDatesOutput = z.infer<
  typeof DetermineKeyApplicationDatesOutputSchema
>;

export async function determineKeyApplicationDates(
  input: DetermineKeyApplicationDatesInput
): Promise<DetermineKeyApplicationDatesOutput> {
  return determineKeyApplicationDatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'determineKeyApplicationDatesPrompt',
  input: {schema: DetermineKeyApplicationDatesInputSchema},
  output: {schema: DetermineKeyApplicationDatesOutputSchema},
  prompt: `You are an AI assistant helping to extract key dates from job application details.

  Given the following job application details, extract the application date, interview date, offer date, and rejection date if they exist. Return the dates in ISO format (YYYY-MM-DD). If a date is not explicitly mentioned, leave the field blank.

  Application Details: {{{applicationDetails}}}

  Make your determination based on the application details provided. Return only the dates in the format specified, without any extra explanation or preamble.
  `,
});

const determineKeyApplicationDatesFlow = ai.defineFlow(
  {
    name: 'determineKeyApplicationDatesFlow',
    inputSchema: DetermineKeyApplicationDatesInputSchema,
    outputSchema: DetermineKeyApplicationDatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
