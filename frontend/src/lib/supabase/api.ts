import { supabase } from './client';
import { Hackathon } from '@/types/hackathon';
import { RegistrationData } from '@/types/registrations';

// Fetch hackathon data by slug
export async function getHackathonBySlug(slug: string): Promise<Hackathon | null> {
  try {
    console.log(`Fetching hackathon data for slug: ${slug}`);
    
    // Query Supabase for hackathon by slug
    const { data, error } = await supabase
      .from('hackathons')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching hackathon:', error);
      return null;
    }
    
    if (!data) {
      console.log('No hackathon found with slug:', slug);
      return null;
    }

    // Transform data to match the existing Hackathon type
    const hackathon: Hackathon = {
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
        // Only try to parse partnership_logos if the column exists
        PartnershipLogos: data.partnership_logos ? 
          (typeof data.partnership_logos === 'string' 
            ? JSON.parse(data.partnership_logos) 
            : data.partnership_logos) 
          : [],
        EventStatus: data.event_status || 'upcoming',
        RegistrationEndDate: data.registration_end_date || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at || data.created_at,
        publishedAt: data.created_at
      }
    };

    console.log('Transformed hackathon data:', hackathon);
    return hackathon;
  } catch (error) {
    console.error('Error in getHackathonBySlug:', error);
    return null;
  }
}

// Get all hackathons
export async function getHackathons(): Promise<Hackathon[]> {
  try {
    const { data, error } = await supabase
      .from('hackathons')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching hackathons:', error);
      return [];
    }

    // Transform the data to match the existing Hackathon type
    return data.map(item => ({
      id: item.id,
      attributes: {
        Title: item.title,
        Theme: item.theme || '',
        Date: item.date || '',
        Location: item.location || '',
        Description: item.description || '',
        Schedule: item.schedule ? JSON.parse(item.schedule) : null,
        Prizes: item.prizes ? JSON.parse(item.prizes) : null,
        FAQ: item.faq ? JSON.parse(item.faq) : [],
        slug: item.slug,
        Image: item.image_url || null,
        // Only try to parse partnership_logos if the column exists
        PartnershipLogos: item.partnership_logos ? 
          (typeof item.partnership_logos === 'string' 
            ? JSON.parse(item.partnership_logos) 
            : item.partnership_logos) 
          : [],
        EventStatus: item.event_status || 'upcoming',
        RegistrationEndDate: item.registration_end_date || '',
        createdAt: item.created_at,
        updatedAt: item.updated_at || item.created_at,
        publishedAt: item.created_at
      }
    }));
  } catch (error) {
    console.error('Error in getHackathons:', error);
    return [];
  }
}

// Submit registration
export async function submitRegistration(formData: RegistrationData): Promise<boolean> {
  try {
    console.log('Starting registration process for:', formData.email);
    
    // Check if registration already exists
    const { data: existingRegistrations, error: checkError } = await supabase
      .from('registrations')
      .select('*')
      .or(`email.eq."${formData.email}",phone.eq."${formData.phone}"`);
    
    if (checkError) {
      console.error('Error checking existing registrations:', checkError);
      throw new Error('Failed to check existing registrations');
    }
    
    if (existingRegistrations && existingRegistrations.length > 0) {
      console.warn('Registration already exists for this email or phone');
      return false;
    }
    
    // Get the active hackathon (assuming we're registering for the most recent upcoming or ongoing hackathon)
    const { data: activeHackathons, error: hackathonError } = await supabase
      .from('hackathons')
      .select('*')
      .or('event_status.eq.upcoming,event_status.eq.ongoing')
      .order('date', { ascending: true })
      .limit(1);
    
    if (hackathonError) {
      console.error('Error fetching active hackathon:', hackathonError);
      throw new Error('Failed to fetch active hackathon');
    }
    
    if (!activeHackathons || activeHackathons.length === 0) {
      console.warn('No active hackathon found to register for');
      throw new Error('No active hackathon available for registration');
    }
    
    const activeHackathon = activeHackathons[0];
    
    // Submit registration
    const { error: registrationError } = await supabase
      .from('registrations')
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        hackathon_id: activeHackathon.id,
        status: 'pending'
      });
    
    if (registrationError) {
      console.error('Registration error:', registrationError);
      throw new Error('Failed to submit registration');
    }
    
    // Try to send confirmation email with hackathon details
    try {
      await sendConfirmationEmail(formData, activeHackathon);
    } catch (emailError) {
      console.warn('Email sending failed but registration was successful:', emailError);
      // Continue anyway, registration is successful
    }
    
    return true;
  } catch (error) {
    console.error('Error in registration process:', error);
    return false;
  }
}

// Check for existing registration
export async function checkExistingRegistration(data: RegistrationData): Promise<boolean> {
  try {
    const { data: existingRegistrations, error } = await supabase
      .from('registrations')
      .select('*')
      .or(`email.eq."${data.email}",phone.eq."${data.phone}"`);
    
    if (error) {
      throw error;
    }
    
    return existingRegistrations && existingRegistrations.length > 0;
  } catch (error) {
    console.error('Error checking registration:', error);
    return false; // Default to false on error to allow registration attempt
  }
}

// Send confirmation email with hackathon details
async function sendConfirmationEmail(formData: RegistrationData, hackathon: any) {
  try {
    console.log('Sending confirmation email to:', formData.email);
    
    // Format hackathon data
    const formattedDate = new Date(hackathon.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    // Parse hackathon description if it's stored as JSON
    let descriptionText = '';
    if (hackathon.description) {
      try {
        const descObj = JSON.parse(hackathon.description);
        if (Array.isArray(descObj) && descObj.length > 0) {
          // Try to extract text from the first paragraph
          if (descObj[0].children && Array.isArray(descObj[0].children)) {
            descriptionText = descObj[0].children.map((child: any) => child.text || '').join('');
          }
        }
      } catch (e) {
        // If parsing fails, use raw description
        descriptionText = hackathon.description;
      }
    }
    
    // Make sure description isn't too long
    if (descriptionText.length > 150) {
      descriptionText = descriptionText.substring(0, 147) + '...';
    }
    
    // Parse partnership logos if available
    let partnershipLogos = [];
    if (hackathon.partnership_logos) {
      try {
        partnershipLogos = typeof hackathon.partnership_logos === 'string' 
          ? JSON.parse(hackathon.partnership_logos) 
          : hackathon.partnership_logos;
      } catch (e) {
        console.error('Error parsing partnership logos:', e);
        // If parsing fails, default to empty array
        partnershipLogos = [];
      }
    }
    
    // Use relative path instead of full URL
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formData.email,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          hackathonTitle: hackathon.title,
          hackathonTheme: hackathon.theme || '',
          hackathonDate: formattedDate,
          hackathonLocation: hackathon.location || '',
          hackathonDescription: descriptionText,
          partnershipLogos: partnershipLogos,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send confirmation email: ${errorData.error || response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}