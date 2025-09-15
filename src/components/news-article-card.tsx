import type { NewsArticle } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { ArrowUpRight } from 'lucide-react';

export function NewsArticleCard({ article }: { article: NewsArticle }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-headline">{article.title}</CardTitle>
        <CardDescription className="text-xs pt-1">
          By {article.author || article.source.name} on {format(parseISO(article.publishedAt), 'MMMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-body text-sm line-clamp-3">{article.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild variant="link" className="p-0 h-auto">
          <Link href={article.url} target="_blank" rel="noopener noreferrer">
            Read full article <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
