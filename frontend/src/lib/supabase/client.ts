import { createClient } from '@supabase/supabase-js';

// Create a browser-safe storage implementation
const createBrowserStorage = () => {
  // For server-side rendering, create a minimal storage implementation
  // that does not try to access browser APIs like document or localStorage
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  // Browser environment implementation
  return {
    getItem: (key: string) => {
      try {
        // Try to get from cookies first (for SSR compatibility)
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${key}=`))
          ?.split('=')[1];
        
        if (cookieValue) {
          return cookieValue;
        }
        
        // Fall back to localStorage
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Storage access error:', error);
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        // Set in both cookies and localStorage for maximum compatibility
        document.cookie = `${key}=${value}; path=/; max-age=2592000; SameSite=Lax; secure`;
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Storage set error:', error);
      }
    },
    removeItem: (key: string) => {
      try {
        // Remove from both cookies and localStorage
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; secure`;
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Storage remove error:', error);
      }
    }
  };
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: true,
      storage: createBrowserStorage(),
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
);

// Create a function for server components
export const createServerClient = async () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    {
      auth: {
        persistSession: false,
      }
    }
  );
};