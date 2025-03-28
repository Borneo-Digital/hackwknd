import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: true,
      // Storage preference priority: cookies first, then localStorage
      storage: {
        getItem: (key) => {
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
        },
        setItem: (key, value) => {
          console.log('Supabase client: Setting auth in storage');
          
          // Set in both cookies and localStorage for maximum compatibility
          document.cookie = `${key}=${value}; path=/; max-age=2592000; SameSite=Lax; secure`;
          localStorage.setItem(key, value);
          return;
        },
        removeItem: (key) => {
          console.log('Supabase client: Removing auth from storage');
          
          // Remove from both cookies and localStorage
          document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; secure`;
          localStorage.removeItem(key);
          return;
        }
      },
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