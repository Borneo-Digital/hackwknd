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
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'finished':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <svg className="animate-spin h-10 w-10 mx-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-600">Loading hackathons...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Hackathons</h1>
          <p className="text-gray-600">Manage your hackathon events</p>
        </div>
        <Button asChild>
          <Link href="/admin/hackathons/new">
            <PlusIcon className="h-5 w-5" />
            New Hackathon
          </Link>
        </Button>
      </div>

      {hackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
            <Card key={hackathon.id} className="overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center relative">
                {hackathon.image_url ? (
                  <Image 
                    src={hackathon.image_url} 
                    alt={hackathon.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="text-white text-2xl font-bold">{hackathon.title}</div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{hackathon.title}</CardTitle>
                  <span className={cn(
                    'px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusBadgeColor(hackathon.event_status)
                  )}>
                    {hackathon.event_status || 'Draft'}
                  </span>
                </div>
                <CardDescription>{hackathon.theme}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pb-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {new Date(hackathon.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {hackathon.location}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/hackathons/${hackathon.id}`}>
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/hackathon/${hackathon.slug}`} target="_blank">
                    <EyeIcon className="h-4 w-4" />
                    View
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <CardContent className="pt-6 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mt-4 text-lg font-medium">No hackathons found</p>
            <p className="mt-2 text-gray-500">Get started by creating your first hackathon</p>
            <Button asChild className="mt-6">
              <Link href="/admin/hackathons/new">
                Create Hackathon
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}