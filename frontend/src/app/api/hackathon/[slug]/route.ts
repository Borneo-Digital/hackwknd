import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  
  try {
    // Create server-side Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Fetch hackathon data by slug
    const { data, error } = await supabase
      .from('hackathons')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching hackathon:', error);
      return NextResponse.json(
        { error: 'Failed to fetch hackathon data' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      );
    }

    // Transform the data to match the expected format
    const hackathon = {
      data: {
        id: data.id,
        attributes: {
          Title: data.title,
          Theme: data.theme || '',
          Date: data.date || '',
          Location: data.location || '',
          Description: data.description || '',
          Schedule: data.schedule ? JSON.parse(data.schedule) : null,
          Prizes: data.prizes ? JSON.parse(data.prizes) : null,
          FAQ: data.faq ? JSON.parse(data.faq) : [],
          slug: data.slug,
          Image: data.image_url || null,
          EventStatus: data.event_status || 'upcoming',
          RegistrationEndDate: data.registration_end_date || '',
          createdAt: data.created_at,
          updatedAt: data.updated_at || data.created_at,
          publishedAt: data.created_at
        }
      }
    };

    return NextResponse.json(hackathon);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}