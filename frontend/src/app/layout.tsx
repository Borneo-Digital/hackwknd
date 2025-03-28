import type { Metadata } from 'next';
import './globals.css';
import { NextAuthProvider } from './Providers';

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
  // Add manifest and theme color for PWA support
  manifest: '/manifest.json',
  themeColor: '#1e293b', // slate-900 to match your design
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HackWknd',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-hackwknd.svg" type="image/svg+xml" />
        <link rel="mask-icon" href="/icon-hackwknd.svg" color="#1e293b" />
        <meta name="msapplication-TileColor" content="#1e293b" />
      </head>
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}