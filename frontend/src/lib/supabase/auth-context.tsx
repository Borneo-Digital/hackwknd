'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // For development, we can create a mock user
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // Get session from local storage
    const getSession = async () => {
      setIsLoading(true);
      
      // For development, provide a mock user when needed
      if (isDev && process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
        const mockUser = {
          id: 'dev-user-123',
          email: 'admin@example.com',
          role: 'admin',
        } as User;
        
        const mockSession = {
          user: mockUser,
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          expires_at: Date.now() + 3600000, // 1 hour from now
        } as Session;
        
        setUser(mockUser);
        setSession(mockSession);
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(data.session);
          setUser(data.session?.user || null);
        }
      } catch (err) {
        console.error('Auth provider error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}