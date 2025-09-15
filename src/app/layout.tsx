import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Oswald } from 'next/font/google';

const oswald = Oswald({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'JobTrack',
  description: 'Track your job applications with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${oswald.className} antialiased h-full bg-background`}>
          <main>{children}</main>
          <Toaster />
      </body>
    </html>
  );
}
