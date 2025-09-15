import type { NewsArticle } from '@/lib/types';
import NewsCard from '@/components/news-card';

async function getNews(): Promise<NewsArticle[]> {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      throw new Error('News API key is not configured.');
    }
    
    const response = await fetch(`https://newsapi.org/v2/everything?q=career%20development&sortBy=publishedAt&language=en&pageSize=20&apiKey=${apiKey}`, {
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

export default async function NewsPage() {
  const articles = await getNews();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold text-foreground">
        Career News
      </h1>
      <p className="text-muted-foreground font-body">
        Latest articles and insights on career development and the job market.
      </p>

      {articles.length > 0 ? (
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
