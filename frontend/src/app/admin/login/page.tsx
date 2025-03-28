'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/supabase/auth-context';
import { supabase } from '@/lib/supabase/client';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </form>
  );
}

// Loading fallback component
function LoginFormFallback() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-10 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-10 bg-gray-200 animate-pulse rounded mt-6"></div>
    </div>
  );
}

export default function LoginPage() {
  // Quick way to show debug info in production
  const [showDebug, setShowDebug] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
          
          {error === 'auth_error' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded text-sm">
              <p className="font-medium">Authentication issue detected</p>
              <p className="mt-1">Your session may have expired. Please sign in again.</p>
            </div>
          )}
          
          {/* Version indicator and debug toggle */}
          <button 
            className="mt-2 text-xs text-gray-400 hover:text-gray-500"
            onClick={() => setShowDebug(prev => !prev)}>
            Version 1.0.2
          </button>
          
          {showDebug && (
            <div className="mt-4 p-3 bg-gray-100 text-left text-xs rounded">
              <p><strong>Debug Info:</strong></p>
              <p>Environment: {process.env.NODE_ENV}</p>
              <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}</p>
              <p>Skip Auth: {process.env.NEXT_PUBLIC_SKIP_AUTH || 'Not set'}</p>
              <p>Current URL: {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
              <p>Auth Cookie: {
                typeof window !== 'undefined' && typeof document !== 'undefined'
                  ? document.cookie.split(';').some(c => c.trim().startsWith('supabase-auth-token='))
                    ? '✓ Present'
                    : '✗ Missing'
                  : 'N/A'
              }</p>
              <div className="mt-2">
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
                  className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
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
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
                >
                  Clear Storage
                </button>
              </div>
            </div>
          )}
        </div>

        <Suspense fallback={<LoginFormFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}