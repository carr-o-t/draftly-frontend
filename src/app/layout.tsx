import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { NetlifyBadgeRemover } from '@/components/netlify-badge-remover';
import { Toaster } from '@/components/ui/toaster';
import { APP_NAME } from '@/constants/app.constants';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description:
    'Draftly is a small collaborative document editor. Write together in real time with live cursors and instant saves.',
  applicationName: APP_NAME,
  keywords: ['draftly', 'document editor', 'collaborative editor', 'real time'],
  openGraph: {
    title: APP_NAME,
    description:
      'A small collaborative document editor. Write together in real time.',
    siteName: APP_NAME,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
          <Toaster />
          <NetlifyBadgeRemover />
        </QueryProvider>
      </body>
    </html>
  );
}
