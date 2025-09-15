import { initialApplications } from '@/lib/data';
import type { Application } from '@/lib/types';
import { Award, FileText, Users, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

type TimelineEvent = {
  date: Date;
  type: 'applied' | 'interviewed' | 'offer' | 'rejected';
  application: Application;
};

const statusConfig = {
  applied: { icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-100' },
  interviewed: { icon: Users, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  offer: { icon: Award, color: 'text-green-500', bgColor: 'bg-green-100' },
  rejected: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-100' },
};

export default function TimelinePage() {
  const events: TimelineEvent[] = [];

  initialApplications.forEach((app) => {
    events.push({ date: app.dateApplied, type: 'applied', application: app });
    if (app.interviewDate) {
      events.push({ date: app.interviewDate, type: 'interviewed', application: app });
    }
    if (app.offerDate) {
      events.push({ date: app.offerDate, type: 'offer', application: app });
    }
    if (app.rejectionDate) {
      events.push({ date: app.rejectionDate, type: 'rejected', application: app });
    }
  });

  const sortedEvents = events.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold text-foreground">
        Application Timeline
      </h1>
      <p className="text-muted-foreground font-body">A chronological view of your job search journey.</p>
      
      <div className="relative pl-6">
        <div className="absolute left-6 top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>

        {sortedEvents.map((event, index) => {
          const config = statusConfig[event.type];
          const Icon = config.icon;
          return (
            <div key={index} className="relative mb-8">
              <div className={`absolute left-0 -translate-x-[calc(50%+11px)] top-1.5 h-6 w-6 rounded-full ${config.bgColor} flex items-center justify-center ring-8 ring-background`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div className="ml-8">
                <p className="font-semibold text-muted-foreground text-sm">
                  {format(event.date, 'MMMM d, yyyy')}
                </p>
                <Card className="mt-2 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-headline">
                      <span className="capitalize">{event.type}</span>: {event.application.position}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-body text-base">
                      At <Link href={event.application.linkToJobPosting} target='_blank' className='font-bold hover:underline'>{event.application.company}</Link>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          );
        })}
        {sortedEvents.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg ml-8">
            <p className="text-muted-foreground font-body">Your timeline is empty.</p>
            <p className="text-sm text-muted-foreground/80 font-body">
              Add applications to see your journey here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
