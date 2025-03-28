import type { Metadata } from 'next';
import './globals.css';
import { NextAuthProvider } from './Providers';

export const metadata: Metadata = {
  title: 'Hackathon Weekend',
  description: 'Hackathon registration platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}