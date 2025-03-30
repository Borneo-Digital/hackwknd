'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase/auth-context';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    // Skip verification for login page
    if (pathname === '/admin/login') {
      setIsVerifying(false);
      return;
    }
    
    console.log('Admin layout: Checking authentication...');
    
    if (!isLoading) {
      if (!user) {
        console.log('Admin layout: No user found, redirecting to login');
        router.push(`/admin/login?redirect=${pathname}`);
      } else {
        console.log('Admin layout: User authenticated:', user.email);
        setIsVerifying(false);
      }
    }
  }, [user, isLoading, pathname, router]);
  
  // Don't show the layout on the login page
  if (pathname === '/admin/login') {
    return children;
  }
  
  // Show loading state while verifying auth
  if (isVerifying || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hack-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <div 
        className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-card shadow-lg transition-all duration-300 ease-in-out relative`}
      >
        <div className={`p-6 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && <Link href="/admin" className="flex items-center space-x-2">
            <Image 
              src="/icon-hackwknd.svg" 
              alt="Hackathon Logo" 
              width={32} 
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hack-primary to-hack-secondary">HackWknd</h1>
          </Link>}
          {sidebarCollapsed && <Link href="/admin" className="flex items-center justify-center">
            <Image 
              src="/icon-hackwknd.svg" 
              alt="Hackathon Logo" 
              width={32} 
              height={32}
              className="w-8 h-8"
            />
          </Link>}
          
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              {sidebarCollapsed ? (
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              )}
            </svg>
          </button>
        </div>
        
        <nav className="mt-6">
          <SidebarLink
            href="/admin"
            active={pathname === '/admin'}
            collapsed={sidebarCollapsed}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>}
          >
            Dashboard
          </SidebarLink>
          <SidebarLink
            href="/admin/hackathons"
            active={pathname.startsWith('/admin/hackathons')}
            collapsed={sidebarCollapsed}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 9H7a1 1 0 010-2h7.586l-3.293-3.293A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>}
          >
            Hackathons
          </SidebarLink>
          <SidebarLink
            href="/admin/registrations"
            active={pathname.startsWith('/admin/registrations')}
            collapsed={sidebarCollapsed}
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>}
          >
            Registrations
          </SidebarLink>
        </nav>
        
        <div className={`absolute bottom-0 p-4 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
          <div className="border-t pt-4">
            {user && !sidebarCollapsed && (
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-gray-100 p-2 mr-2 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-hack-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="truncate">
                  <div className="font-medium text-sm">{user.email}</div>
                </div>
              </div>
            )}
            <button
              onClick={() => signOut()}
              className={`${sidebarCollapsed ? 'justify-center' : 'justify-start'} w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-hack-primary rounded-md transition-colors duration-200`}
              title="Sign out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-2'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              {!sidebarCollapsed && <span>Sign out</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-card shadow-sm py-4 px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {pathname === '/admin' && 'Dashboard'}
              {pathname.startsWith('/admin/hackathons') && 'Hackathons'}
              {pathname.startsWith('/admin/registrations') && 'Registrations'}
            </h2>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

interface SidebarLinkProps {
  href: string;
  active: boolean;
  collapsed?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SidebarLink({ href, active, collapsed = false, icon, children }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center ${collapsed ? 'justify-center' : 'px-6'} py-3 font-medium text-sm transition-all duration-200 ${
        active
          ? 'text-hack-primary dark:text-hack-primary/80 bg-primary/10 border-r-4 border-hack-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
      title={collapsed ? String(children) : undefined}
    >
      <span className={collapsed ? '' : 'mr-3'}>{icon}</span>
      {!collapsed && children}
    </Link>
  );
}