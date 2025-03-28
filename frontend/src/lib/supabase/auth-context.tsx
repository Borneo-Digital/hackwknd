'use client';

// This file is explicitly client-side only
// ⚠️ Do not import this file in server components/pages

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
      console.log('AuthContext: Initializing and checking for session');
      
      // For development, provide a mock user when needed
      if (isDev && process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
        console.log('AuthContext: Using mock user for development');
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
        console.log('AuthContext: Fetching session from Supabase');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Error getting session:', error);
        } else {
          console.log('AuthContext: Session fetch result:', {
            hasSession: !!data.session,
            user: data.session?.user?.email || 'none'
          });
          setSession(data.session);
          setUser(data.session?.user || null);
        }
      } catch (err) {
        console.error('AuthContext: Provider error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    console.log('AuthContext: Setting up auth state listener');
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state changed:', { 
          event, 
          hasSession: !!session,
          user: session?.user?.email || 'none'
        });
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      console.log('AuthContext: Cleaning up auth listener');
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Attempting sign in for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        console.error('AuthContext: Sign in error:', error);
        throw error;
      }
      
      console.log('AuthContext: Sign in successful:', {
        user: data.user?.email || 'none',
        hasSession: !!data.session
      });
      
      // Manual session check to verify state after sign in
      const sessionCheck = await supabase.auth.getSession();
      console.log('AuthContext: Post-login session check:', {
        hasSession: !!sessionCheck.data.session,
        user: sessionCheck.data.session?.user?.email || 'none'
      });
    } catch (err) {
      console.error('AuthContext: Unexpected sign in error:', err);
      throw err;
    }
  };

  const signOut = async () => {
    console.log('AuthContext: Signing out');
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthContext: Sign out error:', error);
        throw error;
      }
      console.log('AuthContext: Sign out successful');
    } catch (err) {
      console.error('AuthContext: Unexpected sign out error:', err);
      throw err;
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