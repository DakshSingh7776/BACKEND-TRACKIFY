import type { NewsArticle } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Newspaper } from 'lucide-react';
import { format } from 'date-fns';

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        {article.urlToImage ? (
          <div className="relative aspect-video rounded-t-lg overflow-hidden -mt-6 -mx-6 mb-4">
            <Image
              src={article.urlToImage}
              alt={article.title}
              fill
              style={{ objectFit: 'cover' }}
              className="bg-muted"
            />
          </div>
        ) : (
          <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center -mt-6 -mx-6 mb-4">
             <Newspaper className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        <CardTitle className="font-headline text-lg leading-snug">
          {article.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
            {article.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="text-xs text-muted-foreground w-full flex justify-between items-center">
            <span>{article.source.name}</span>
            <span>{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
        </div>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={article.url} target="_blank" rel="noopener noreferrer">
            Read More <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
