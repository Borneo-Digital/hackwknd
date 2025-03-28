import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // For development or if we want to bypass auth with an environment variable
  const skipAuth = process.env.NEXT_PUBLIC_SKIP_AUTH === 'true' || 
                  (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_SKIP_AUTH === 'true');
  
  if (skipAuth) {
    console.log('Middleware: Auth check bypassed by environment variable');
    return NextResponse.next();
  }

  // TEMPORARY BYPASS - enable this for emergency access
  const EMERGENCY_BYPASS = true;
  if (EMERGENCY_BYPASS) {
    console.log('Middleware: Emergency bypass enabled');
    return NextResponse.next();
  }

  // Make sure we have the URL
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Middleware: Supabase URL or Anon Key missing - bypassing auth');
    return NextResponse.next();
  }

  const isAccessingLoginPage = request.nextUrl.pathname === '/admin/login';
  
  // Login page is always accessible
  if (isAccessingLoginPage) {
    console.log('Middleware: Allowing access to login page');
    return NextResponse.next();
  }

  // For access to admin routes, we're now bypassing middleware checks 
  // and relying on client-side auth in the admin layout component
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Middleware: Allowing access to admin area - auth will be checked client-side');
    return NextResponse.next();
  }

  // For all other routes, just proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};