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
import type { NewsArticle } from '@/lib/types';

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

export async function getNewsForCategory(category: string): Promise<NewsArticle[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      throw new Error('News API key is not configured.');
    }
    
    const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(category)}&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`, {
        next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        console.error('NewsAPI Error:', errorData);
        throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Filter out articles without an image
    return data.articles.filter((article: NewsArticle) => article.urlToImage);

  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}
