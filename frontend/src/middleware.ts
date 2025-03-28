import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // For development or if we want to bypass auth with an environment variable
  const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true' || 
                  (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === 'true');
  
  if (skipAuth) {
    return NextResponse.next();
  }

  // Make sure we have the URL
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Supabase URL or Anon Key missing');
    return NextResponse.next();
  }

  let response = NextResponse.next();
  
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove: (name, options) => {
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  try {
    // Refresh session if expired
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session in middleware:', error);
    }
    
    const session = data.session;
    
    // Log session info (helpful for debugging)
    console.log('Middleware path:', request.nextUrl.pathname);
    console.log('Session exists:', !!session);
    
    // Add a header to indicate session status for debugging
    response.headers.set('X-Auth-Status', session ? 'authenticated' : 'unauthenticated');
    
    // If the user is not logged in and trying to access an admin route, redirect to the login page
    if (!session && request.nextUrl.pathname.startsWith('/admin')) {
      // The admin/login route is always accessible
      if (request.nextUrl.pathname === '/admin/login') {
        return response;
      }

      console.log('Redirecting unauthenticated user to login');
      const redirectUrl = new URL('/admin/login', request.nextUrl.origin);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If the user is logged in and accessing the login page, redirect to the admin dashboard
    if (session && request.nextUrl.pathname === '/admin/login') {
      console.log('Redirecting authenticated user to admin dashboard');
      return NextResponse.redirect(new URL('/admin', request.nextUrl.origin));
    }
    
    // For authenticated users accessing admin routes, allow access
    if (session && request.nextUrl.pathname.startsWith('/admin')) {
      console.log('Authenticated user accessing admin route');
      return response;
    }
  } catch (error) {
    console.error('Middleware auth error:', error);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};