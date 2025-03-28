import { createClient } from '@supabase/supabase-js';

// Create a browser-safe storage implementation
const createBrowserStorage = () => {
  return {
    getItem: (key: string) => {
      // Check if we're running on the client
      if (typeof window === 'undefined') {
        console.log('Supabase client: Running on server, no storage available');
        return null;
      }

      try {
        // Try to get from cookies first (for SSR compatibility)
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${key}=`))
          ?.split('=')[1];
        
        if (cookieValue) {
          console.log('Supabase client: Found auth in cookies');
          return cookieValue;
        }
        
        // Fall back to localStorage
        const localValue = localStorage.getItem(key);
        if (localValue) {
          console.log('Supabase client: Found auth in localStorage');
        } else {
          console.log('Supabase client: No auth found in storage');
        }
        return localValue;
      } catch (error) {
        console.error('Supabase client: Error accessing storage', error);
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      // Check if we're running on the client
      if (typeof window === 'undefined') {
        console.log('Supabase client: Running on server, cannot set storage');
        return;
      }

      try {
        console.log('Supabase client: Setting auth in storage');
        
        // Set in both cookies and localStorage for maximum compatibility
        document.cookie = `${key}=${value}; path=/; max-age=2592000; SameSite=Lax; secure`;
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Supabase client: Error setting storage', error);
      }
    },
    removeItem: (key: string) => {
      // Check if we're running on the client
      if (typeof window === 'undefined') {
        console.log('Supabase client: Running on server, cannot remove from storage');
        return;
      }

      try {
        console.log('Supabase client: Removing auth from storage');
        
        // Remove from both cookies and localStorage
        document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; secure`;
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Supabase client: Error removing from storage', error);
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