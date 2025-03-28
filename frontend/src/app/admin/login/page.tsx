'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/supabase/auth-context';

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
      console.log('Attempting to sign in with:', email);
      await signIn(email, password);
      console.log('Sign in successful, redirecting to:', redirectPath);
      router.push(redirectPath);
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
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
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
          
          {/* Hidden debug button - click 5 times rapidly to show debug info */}
          <button 
            className="mt-2 text-xs text-gray-400 hover:text-gray-500"
            onClick={() => setShowDebug(prev => !prev)}>
            Version 1.0.1
          </button>
          
          {showDebug && (
            <div className="mt-4 p-3 bg-gray-100 text-left text-xs rounded">
              <p><strong>Debug Info:</strong></p>
              <p>Environment: {process.env.NODE_ENV}</p>
              <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}</p>
              <p>Skip Auth: {process.env.NEXT_PUBLIC_SKIP_AUTH || 'Not set'}</p>
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