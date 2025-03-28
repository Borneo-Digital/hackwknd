'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/supabase/auth-context';

export const NextAuthProvider = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};