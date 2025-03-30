'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/supabase/auth-context';
import { ThemeProvider } from 'next-themes';

export const NextAuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem={true}
      storageKey="hackwknd-theme"
    >
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};