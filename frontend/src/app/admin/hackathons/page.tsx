'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, MapPinIcon, PencilIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Hackathon {
  id: string;
  title: string;
  theme: string;
  date: string;
  location: string;
  event_status: string;
  slug: string;
  created_at: string;
  image_url?: string;
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHackathons() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('hackathons')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setHackathons(data || []);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHackathons();
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
        return 'bg-hack-secondary/20 text-hack-secondary border border-hack-secondary/30';
      case 'ongoing':
        return 'bg-hack-primary/20 text-hack-primary border border-hack-primary/30';
      case 'finished':
        return 'bg-muted text-muted-foreground border border-border';
      default:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50';
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <svg className="animate-spin h-10 w-10 mx-auto text-hack-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-muted-foreground font-medium">Loading hackathons...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-hack-primary to-hack-secondary">Hackathons</h1>
          <p className="text-muted-foreground mt-1">Manage your hackathon events and competitions</p>
        </div>
        <Button asChild className="bg-hack-primary hover:bg-hack-primary/90 transition-all duration-200 shadow-md hover:shadow-lg">
          <Link href="/admin/hackathons/new" className="flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Create New Hackathon</span>
          </Link>
        </Button>
      </div>

      {hackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
            <Card key={hackathon.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group border border-border">
              <div className="h-48 bg-gradient-to-r from-hack-primary/80 to-hack-secondary/80 flex items-center justify-center relative overflow-hidden">
                {hackathon.image_url ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                    <Image 
                      src={hackathon.image_url} 
                      alt={hackathon.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </>
                ) : (
                  <div className="text-white text-2xl font-bold drop-shadow-md">{hackathon.title}</div>
                )}
                <div className="absolute top-2 right-2 z-20">
                  <span className={cn(
                    'px-3 py-1 text-xs font-semibold rounded-full shadow-sm',
                    getStatusBadgeColor(hackathon.event_status)
                  )}>
                    {hackathon.event_status || 'Draft'}
                  </span>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-bold">{hackathon.title}</CardTitle>
                </div>
                <CardDescription>{hackathon.theme}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pb-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-2 text-hack-primary" />
                  {new Date(hackathon.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPinIcon className="h-4 w-4 mr-2 text-hack-primary" />
                  {hackathon.location}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3 pb-3 border-t border-border">
                <Button asChild variant="outline" size="sm" className="transition-all duration-200 hover:border-hack-primary hover:text-hack-primary">
                  <Link href={`/admin/hackathons/${hackathon.id}`} className="flex items-center space-x-1">
                    <PencilIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="transition-all duration-200 hover:text-hack-secondary">
                  <Link href={`/hackathon/${hackathon.slug}`} target="_blank" className="flex items-center space-x-1">
                    <EyeIcon className="h-4 w-4" />
                    <span>View</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-16 text-center shadow-md">
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold">No hackathons found</h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">Get started by creating your first hackathon to showcase your event to participants</p>
            <Button asChild className="mt-8 bg-hack-primary hover:bg-hack-primary/90 shadow-md hover:shadow-lg transition-all duration-200">
              <Link href="/admin/hackathons/new" className="flex items-center space-x-2">
                <PlusIcon className="h-5 w-5" />
                <span>Create Hackathon</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}