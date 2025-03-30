'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/supabase/auth-context';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';

// Component that uses searchParams wrapped in Suspense
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Login page: Attempting to sign in with:', email);
      await signIn(email, password);
      console.log('Login page: Sign in successful, will redirect to:', redirectPath);
      
      // Using a progressive approach with multiple timeout attempts
      // This helps ensure the session is properly established before redirecting
      let attempts = 0;
      const maxAttempts = 3;
      const checkSessionAndRedirect = async () => {
        attempts++;
        try {
          console.log(`Login page: Checking session before redirect (attempt ${attempts}/${maxAttempts})`);
          // Force a session refresh to make sure we have the latest state
          const { data } = await supabase.auth.getSession();
          
          if (data.session) {
            console.log('Login page: Session confirmed, redirecting now');
            // Set a cookie to indicate this is a post-login navigation
            // This can be used by middleware to be more lenient with auth checks
            document.cookie = 'post_login=true; path=/; max-age=60; SameSite=Lax; secure';
            // Force a hard navigation instead of client-side navigation
            window.location.href = redirectPath;
          } else if (attempts < maxAttempts) {
            console.log(`Login page: Session not detected yet, trying again in ${attempts * 500}ms`);
            // Try again with increasing delay
            setTimeout(checkSessionAndRedirect, attempts * 500);
          } else {
            console.log('Login page: Session still not detected after max attempts');
            // Last resort - redirect anyway and hope middleware picks up the session
            window.location.href = redirectPath;
          }
        } catch (error) {
          console.error('Login page: Error checking session:', error);
          // If we fail to check session, redirect anyway as last resort
          window.location.href = redirectPath;
        }
      };
      
      // Start the session check process with a small initial delay
      setTimeout(checkSessionAndRedirect, 300);
    } catch (err: any) {
      console.error('Login page: Sign in error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground/70" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 block w-full px-3 py-2.5 border border-input bg-background rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hack-primary focus:border-hack-primary transition-colors"
            placeholder="admin@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground/70" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pl-10 block w-full px-3 py-2.5 border border-input bg-background rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-hack-primary focus:border-hack-primary transition-colors"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-700 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-hack-primary hover:bg-hack-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hack-primary disabled:opacity-50 transition-all duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            <>Sign In</>
          )}
        </button>
      </div>
    </form>
  );
}

// Loading fallback component
function LoginFormFallback() {
  return (
    <div className="space-y-5">
      <div>
        <div className="h-5 w-16 bg-muted animate-pulse rounded mb-1.5"></div>
        <div className="h-11 bg-muted animate-pulse rounded-lg"></div>
      </div>
      <div>
        <div className="h-5 w-20 bg-muted animate-pulse rounded mb-1.5"></div>
        <div className="h-11 bg-muted animate-pulse rounded-lg"></div>
      </div>
      <div className="h-10 bg-muted animate-pulse rounded-lg mt-7"></div>
    </div>
  );
}

// Separate component that uses searchParams
function LoginPageContent() {
  const [showDebug, setShowDebug] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card shadow-xl rounded-lg border border-input">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-hack-primary/10 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image 
                src="/icon-hackwknd.svg" 
                alt="Hackathon Logo" 
                width={40} 
                height={40}
                className="w-10 h-10" 
              />
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hack-primary to-hack-secondary">Admin Portal</h1>
        <p className="text-muted-foreground mt-2">Sign in to access the management dashboard</p>
        
        {error === 'auth_error' && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm">
            <p className="font-medium">Authentication issue detected</p>
            <p className="mt-1">Your session may have expired. Please sign in again.</p>
          </div>
        )}
        
        {/* Version indicator and debug toggle */}
        <button 
          className="mt-4 text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
          onClick={() => setShowDebug(prev => !prev)}>
          Version 1.0.3
        </button>
      </div>
      
      {showDebug && (
        <div className="mt-4 p-4 bg-muted/30 text-left text-xs rounded-lg border border-input">
          <p className="font-medium text-foreground mb-2">Debug Information</p>
          <div className="space-y-1.5 text-muted-foreground">
            <p>Environment: <span className="font-mono">{process.env.NODE_ENV}</span></p>
            <p>Supabase URL: <span className={`font-mono ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}`}>
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}
            </span></p>
            <p>Skip Auth: <span className="font-mono">{process.env.NEXT_PUBLIC_SKIP_AUTH || 'Not set'}</span></p>
            <p>Current URL: <span className="font-mono text-xs">{typeof window !== 'undefined' ? window.location.href : 'N/A'}</span></p>
            <p>Auth Cookie: <span className={`font-mono ${
              typeof window !== 'undefined' && typeof document !== 'undefined'
                ? document.cookie.split(';').some(c => c.trim().startsWith('supabase-auth-token='))
                  ? 'text-green-600'
                  : 'text-red-600'
                : ''
            }`}>
              {
              typeof window !== 'undefined' && typeof document !== 'undefined'
                ? document.cookie.split(';').some(c => c.trim().startsWith('supabase-auth-token='))
                  ? '✓ Present'
                  : '✗ Missing'
                : 'N/A'
            }</span></p>
          </div>
          <div className="mt-3 flex space-x-2">
            <button
              type="button"
              onClick={async () => {
                try {
                  const { data } = await supabase.auth.getSession();
                  alert(
                    data.session
                      ? `Session found for: ${data.session.user.email}`
                      : 'No session found'
                  );
                } catch (err) {
                  alert(`Error checking session: ${err}`);
                }
              }}
              className="px-2 py-1 bg-hack-secondary text-white rounded text-xs hover:bg-hack-secondary/90 transition-colors"
            >
              Check Session
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  try {
                    localStorage.clear();
                    document.cookie.split(';').forEach(c => {
                      const name = c.trim().split('=')[0];
                      if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                    });
                    alert('All cookies and localStorage cleared');
                    window.location.reload();
                  } catch (err) {
                    alert(`Error clearing storage: ${err}`);
                  }
                }
              }}
              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
            >
              Clear Storage
            </button>
          </div>
        </div>
      )}
      
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

// Loading state while page params are loading
function LoginPageLoading() {
  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card shadow-xl rounded-lg border border-input">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-muted rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="h-7 w-32 bg-muted rounded-lg animate-pulse mx-auto"></div>
        <div className="h-5 w-56 bg-muted rounded animate-pulse mx-auto mt-2"></div>
      </div>
      <LoginFormFallback />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/70">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-hack-primary/5 to-hack-primary/10 blur-3xl"></div>
        <div className="absolute right-[-10%] bottom-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-hack-secondary/5 to-hack-secondary/10 blur-3xl"></div>
      </div>
      <div className="relative z-10">
        <Suspense fallback={<LoginPageLoading />}>
          <LoginPageContent />
        </Suspense>
      </div>
    </div>
  );
}