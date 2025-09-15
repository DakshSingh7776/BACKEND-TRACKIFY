import { getNewsForCategory } from '@/lib/actions';
import NewsFeed from '@/components/news-feed';
import type { NewsArticle } from '@/lib/types';

export default async function NewsPage() {
  const initialArticles: NewsArticle[] = await getNewsForCategory('technology');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold text-foreground">
        Career News
      </h1>
      <NewsFeed initialArticles={initialArticles} />
    </div>
  );
}
