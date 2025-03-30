import type { Metadata, Viewport } from 'next';
import './globals.css';
import { NextAuthProvider } from './Providers';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Hackathon Weekend',
  description: 'Hackathon registration platform',
  icons: {
    icon: [
      { url: '/icon-hackwknd.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon-hackwknd.svg' }
    ],
    shortcut: ['/icon-hackwknd.svg'],
  },
  // Add manifest for PWA support
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HackWknd',
  },
};

// Moved themeColor from metadata to viewport as per Next.js recommendation
export const viewport: Viewport = {
  themeColor: '#1e293b', // slate-900 to match design
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon-hackwknd.svg" type="image/svg+xml" />
        <link rel="mask-icon" href="/icon-hackwknd.svg" color="#1e293b" />
        <meta name="msapplication-TileColor" content="#1e293b" />
      </head>
      <body className="font-sans bg-background text-foreground">
        <NextAuthProvider>{children}</NextAuthProvider>
        <Toaster />
      </body>
    </html>
  );
}