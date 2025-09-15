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
import type { NewsArticle } from './types';

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


export async function getCompanyNewsAction(companyName: string): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error('NEWS_API_KEY environment variable not set.');
  }

  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(companyName)}&sortBy=relevancy&pageSize=10&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('News API error:', errorData);
      throw new Error(`News API request failed: ${errorData.message}`);
    }
    const data = await response.json();
    if (data.status === 'ok') {
      return data.articles as NewsArticle[];
    } else {
      throw new Error(data.message || 'Failed to fetch news.');
    }
  } catch (error) {
    console.error('Failed to fetch company news:', error);
    throw new Error('Could not fetch company news.');
  }
}
