import { Button } from '@/components/ui/button';
import { Briefcase, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="grid lg:grid-cols-2 min-h-[calc(100vh)]">
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-background">
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <Briefcase className="h-12 w-12 text-primary" />
                <h1 className="text-4xl font-bold tracking-tighter text-foreground">
                  JobTrack
                </h1>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold uppercase text-foreground leading-tight tracking-wide">
                Streamline Your Job Search
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                The ultimate tool to manage, track, and organize your job
                applications, helping you stay ahead in your career journey.
              </p>

              <div className="mt-10">
                <Button asChild size="lg" className="group">
                  <Link href="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-primary opacity-80 z-10"></div>
            <Image
              src="https://picsum.photos/seed/jobsearch/1200/1800"
              alt="People in a professional setting"
              fill
              style={{ objectFit: 'cover' }}
              className="bg-background"
              data-ai-hint="job search"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
