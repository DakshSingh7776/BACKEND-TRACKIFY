'use client';

import type { Application, ApplicationStatus, NewsArticle } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Award,
  Building2,
  Calendar,
  FileText,
  Link as LinkIcon,
  Loader2,
  Newspaper,
  Sparkles,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getCompanyNewsAction, summarizeApplicationAction } from '@/lib/actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NewsArticleCard } from './news-article-card';

const statusIcons: Record<ApplicationStatus, React.ReactNode> = {
  applied: <FileText className="h-4 w-4" />,
  interviewed: <Users className="h-4 w-4" />,
  offer: <Award className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
};

const statusColors: Record<ApplicationStatus, string> = {
  applied: 'bg-blue-100 text-blue-800 border-blue-300',
  interviewed: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  offer: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
};

export function ApplicationCard({ application }: { application: Application }) {
  const { toast } = useToast();
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);

  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [isNewsDialogOpen, setIsNewsDialogOpen] = useState(false);

  const handleSummarize = async () => {
    setIsSummaryLoading(true);
    try {
      const result = await summarizeApplicationAction({
        company: application.company,
        position: application.position,
        dateApplied: application.dateApplied.toISOString().split('T')[0],
        linkToJobPosting: application.linkToJobPosting,
        applicationStatus: application.status,
      });
      setSummary(result.summary);
      setIsSummaryDialogOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate summary. Please ensure the job posting link is a valid URL.',
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleGetNews = async () => {
    setIsNewsLoading(true);
    try {
      const result = await getCompanyNewsAction(application.company);
      if (result && result.length > 0) {
        setNews(result);
        setIsNewsDialogOpen(true);
      } else {
        toast({
          title: 'No News Found',
          description: `Could not find any recent news for ${application.company}.`,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch company news. Please check your API key and try again.',
      });
    } finally {
      setIsNewsLoading(false);
    }
  };

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-2xl">{application.position}</CardTitle>
            <Badge variant="outline" className={`capitalize ${statusColors[application.status]}`}>
              {statusIcons[application.status]}
              <span className="ml-2">{application.status}</span>
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-2 pt-2">
            <Building2 className="h-4 w-4" />
            <span className="font-body text-base">{application.company}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Applied on {format(application.dateApplied, 'MMMM d, yyyy')}</span>
            </div>
            {application.notes && (
              <p className="font-body italic text-gray-600 line-clamp-3">
                &quot;{application.notes}&quot;
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={application.linkToJobPosting} target="_blank" rel="noopener noreferrer">
              <LinkIcon className="mr-2 h-4 w-4" />
              Job Post
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleGetNews} disabled={isNewsLoading}>
            {isNewsLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Newspaper className="mr-2 h-4 w-4" />
            )}
            News
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSummarize} disabled={isSummaryLoading}>
            {isSummaryLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4 text-accent" />
            )}
            AI Summary
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              AI Summary
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-base pt-4 text-foreground">
              {summary}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsSummaryDialogOpen(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isNewsDialogOpen} onOpenChange={setIsNewsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              Recent News for {application.company}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-6">
            <div className="space-y-4 py-4">
              {news.map((article, index) => (
                <NewsArticleCard key={index} article={article} />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
