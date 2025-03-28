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
    // Check if this is a post-login redirect
    // We'll be more lenient with auth checks right after login attempts
    const isPostLogin = request.cookies.has('post_login');
    const isAccessingAdmin = request.nextUrl.pathname.startsWith('/admin');
    const isAccessingLoginPage = request.nextUrl.pathname === '/admin/login';
    
    // Log initial state
    console.log('Middleware request:', {
      path: request.nextUrl.pathname,
      isPostLogin,
      isAccessingAdmin,
      isAccessingLoginPage,
      cookies: Array.from(request.cookies.keys())
    });
    
    // Refresh session if expired
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Middleware: Error getting session:', error);
    }
    
    const session = data.session;
    
    // Log session info (helpful for debugging)
    console.log('Middleware session check:', {
      path: request.nextUrl.pathname,
      hasSession: !!session,
      userId: session?.user?.id || 'none',
      email: session?.user?.email || 'none'
    });
    
    // Add debug headers to the response
    response.headers.set('X-Auth-Status', session ? 'authenticated' : 'unauthenticated');
    response.headers.set('X-Auth-Email', session?.user?.email || 'none');
    response.headers.set('X-Request-Path', request.nextUrl.pathname);
    
    // The admin/login route is always accessible
    if (isAccessingLoginPage) {
      // If user is logged in and accessing login page, redirect to admin dashboard
      if (session) {
        console.log('Middleware: Redirecting authenticated user from login to admin dashboard');
        return NextResponse.redirect(new URL('/admin', request.nextUrl.origin));
      }
      
      console.log('Middleware: Allowing access to login page');
      return response;
    }
    
    // If the user is not logged in and trying to access an admin route
    if (!session && isAccessingAdmin) {
      console.log('Middleware: Redirecting unauthenticated user to login');
      
      // Create a redirect response
      const redirectUrl = new URL('/admin/login', request.nextUrl.origin);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      
      const redirectResponse = NextResponse.redirect(redirectUrl);
      
      // Clear any stale post_login cookie if it exists
      if (isPostLogin) {
        redirectResponse.cookies.set('post_login', '', { 
          maxAge: 0,
          path: '/',
          secure: true,
          sameSite: 'lax'
        });
      }
      
      return redirectResponse;
    }
    
    // For authenticated users accessing admin routes, allow access
    if (session && isAccessingAdmin) {
      console.log('Middleware: Authenticated user accessing admin route');
      
      // Clear any post_login cookie if it exists, since we're now properly authenticated
      if (isPostLogin) {
        response.cookies.set('post_login', '', { 
          maxAge: 0,
          path: '/',
          secure: true,
          sameSite: 'lax'
        });
      }
      
      return response;
    }
    
    // For any other routes, just proceed normally
    return response;
  } catch (error) {
    console.error('Middleware auth error:', error);
    
    // In case of error, we need to make a decision:
    // If accessing login page, allow it
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    // For other admin routes, redirect to login to be safe
    if (request.nextUrl.pathname.startsWith('/admin')) {
      const redirectUrl = new URL('/admin/login', request.nextUrl.origin);
      redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
      redirectUrl.searchParams.set('error', 'auth_error');
      return NextResponse.redirect(redirectUrl);
    }
    
    // For non-admin routes, just proceed
    return NextResponse.next();
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};