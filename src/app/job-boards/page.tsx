import { jobBoards } from '@/lib/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function JobBoardsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold text-foreground">
        Job Boards
      </h1>
      <p className="text-muted-foreground font-body">
        A collection of popular job boards to help you find your next opportunity.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobBoards.map((board) => (
          <Card key={board.name} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-headline text-xl">{board.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href={board.url} target="_blank" rel="noopener noreferrer">
                  Visit Site <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}