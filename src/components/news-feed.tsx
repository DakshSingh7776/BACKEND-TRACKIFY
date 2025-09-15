
'use client';

import { useState, useTransition } from 'react';
import type { NewsArticle } from '@/lib/types';
import { getNewsForCategory } from '@/lib/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import NewsCard from './news-card';
import { Skeleton } from './ui/skeleton';

const jobFields = [
  'technology',
  'healthcare',
  'finance',
  'education',
  'engineering',
  'marketing',
  'design',
];

export default function NewsFeed({ initialArticles }: { initialArticles: NewsArticle[] }) {
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [selectedCategory, setSelectedCategory] = useState('technology');
  const [isPending, startTransition] = useTransition();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    startTransition(async () => {
      const newArticles = await getNewsForCategory(category);
      setArticles(newArticles);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-muted-foreground font-body">
          Latest articles for the <span className="font-bold text-primary">{selectedCategory}</span> sector.
        </p>
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {jobFields.map((field) => (
              <SelectItem key={field} value={field} className="capitalize">
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {articles.map((article, index) => (
            <NewsCard key={article.url + index} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground font-body">Could not fetch news articles at the moment.</p>
          <p className="text-sm text-muted-foreground/80 font-body">
            Please check the configuration or try again later.
          </p>
        </div>
      )}
    </div>
  );
}
