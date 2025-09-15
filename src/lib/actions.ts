'use server';

import {
  summarizeApplicationDetails,
  SummarizeApplicationDetailsInput,
} from '@/ai/flows/summarize-application-details';
import {
  determineKeyApplicationDates,
  DetermineKeyApplicationDatesInput,
} from '@/ai/flows/determine-key-application-dates';
import { z } from 'zod';

const summarizeSchema = z.object({
  company: z.string(),
  position: z.string(),
  dateApplied: z.string(),
  linkToJobPosting: z.string().url(),
  applicationStatus: z.string(),
});

export async function summarizeApplicationAction(
  input: SummarizeApplicationDetailsInput
) {
  const validatedInput = summarizeSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for summarization.');
  }
  return await summarizeApplicationDetails(validatedInput.data);
}

const determineDatesSchema = z.object({
  applicationDetails: z.string(),
});

export async function determineDatesAction(
  input: DetermineKeyApplicationDatesInput
) {
  const validatedInput = determineDatesSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for date determination.');
  }
  return await determineKeyApplicationDates(validatedInput.data);
}