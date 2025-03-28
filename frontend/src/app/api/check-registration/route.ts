import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone } = body;
    
    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      );
    }
    
    // Create server-side Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    // Build the OR condition for email or phone
    let query = supabase
      .from('registrations')
      .select('*');
    
    if (email && phone) {
      query = query.or(`email.eq."${email}",phone.eq."${phone}"`);
    } else if (email) {
      query = query.eq('email', email);
    } else if (phone) {
      query = query.eq('phone', phone);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error checking registration:', error);
      return NextResponse.json(
        { error: 'Failed to check registration' },
        { status: 500 }
      );
    }
    
    // Return true if a registration exists
    return NextResponse.json(data && data.length > 0);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}