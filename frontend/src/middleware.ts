import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // For development, we can bypass auth temporarily
  const skipAuth = process.env.NODE_ENV === 'development' && true; // set to true to bypass auth
  
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
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    
    // If the user is not logged in and trying to access an admin route, redirect to the login page
    if (!session && request.nextUrl.pathname.startsWith('/admin')) {
      // The admin/login route is always accessible
      if (request.nextUrl.pathname === '/admin/login') {
        return response;
      }

      const redirectUrl = new URL('/admin/login', request.nextUrl.origin);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If the user is logged in and accessing the login page, redirect to the admin dashboard
    if (session && request.nextUrl.pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.nextUrl.origin));
    }
  } catch (error) {
    console.error('Middleware auth error:', error);
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};