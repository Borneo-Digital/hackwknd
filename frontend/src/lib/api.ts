import { Hackathon } from '@/types/hackathon';
import { RegistrationData } from '@/types/registrations';

// Fetch hackathon data by slug
export async function getHackathonBySlug(slug: string): Promise<Hackathon | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    
    // First try the pluralized endpoint (hackathons)
    let res = await fetch(`${apiUrl}/api/hackathons?filters[slug][$eq]=${slug}&populate=*`, {
      cache: 'no-store',
    });

    // If that fails, try the singular endpoint (hackathon)
    if (!res.ok) {
      console.log('Trying singular endpoint...');
      res = await fetch(`${apiUrl}/api/hackathon?filters[slug][$eq]=${slug}&populate=*`, {
        cache: 'no-store',
      });
    }

    if (!res.ok) {
      console.error('API Response status:', res.status);
      console.error('API Response text:', await res.text());
      throw new Error('Failed to fetch hackathon');
    }

    const data = await res.json();
    console.log('Hackathon API Response:', data);
    
    // Handle Strapi v4 response format
    if (data.data) {
      let hackathonData;
      
      if (Array.isArray(data.data) && data.data.length > 0) {
        hackathonData = data.data[0];
      } else {
        hackathonData = data.data;
      }
      
      // Handle the case where EventStatus is a date string but the frontend expects a status string
      if (hackathonData.attributes) {
        // Convert date-based EventStatus to a string status
        if (hackathonData.attributes.EventStatus) {
          const eventDate = new Date(hackathonData.attributes.EventStatus);
          const today = new Date();
          
          // Set a human-readable status based on the date
          if (eventDate > today) {
            hackathonData.attributes.EventStatus = "Upcoming";
          } else {
            const endDate = new Date(eventDate);
            endDate.setDate(eventDate.getDate() + 2); // Assuming 2-day event
            
            if (today >= eventDate && today <= endDate) {
              hackathonData.attributes.EventStatus = "Ongoing";
            } else {
              hackathonData.attributes.EventStatus = "Finished";
            }
          }
        }
        
        return hackathonData as Hackathon;
      }
      
      return hackathonData as Hackathon;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    return null;
  }
}

// Send confirmation email
// Send confirmation email
async function sendConfirmationEmail(email: string, name: string) {
  try {
    console.log('Sending confirmation email to:', email);
    // Use relative path instead of full URL
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        data: {
          name,
          email,
        },
      }),
    });

    const data = await response.json();
    console.log('Email API response:', data); // Add this log

    if (!response.ok) {
      console.error('Email API error response:', data); // Add this log
      throw new Error(data.error || 'Failed to send confirmation email');
    }

    console.log('Confirmation email sent successfully:', data);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: 'Failed to send confirmation email' };
  }
}

// Submit registration
export async function submitRegistration(formData: RegistrationData): Promise<boolean> {
  try {
    console.log('Starting registration process for:', formData.email);
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    // Submit registration data to Strapi backend
    console.log('Submitting registration to Strapi...');
    const registrationResponse = await fetch(`${apiUrl}/api/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          Name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      }),
    });

    if (!registrationResponse.ok) {
      const errorBody = await registrationResponse.text();
      console.error('Registration failed:', {
        status: registrationResponse.status,
        statusText: registrationResponse.statusText,
        body: errorBody,
      });
      throw new Error(`Failed to submit registration: ${registrationResponse.statusText}`);
    }

    console.log('Registration submitted successfully');

    // Send confirmation email
    console.log('Initiating confirmation email...');
    const emailResult = await sendConfirmationEmail(formData.email, formData.name);
    
    if (!emailResult.success) {
      console.warn('Email sending failed but registration was successful:', emailResult.error);
      // We don't throw here because we want the registration to succeed even if email fails
    }

    return true;
  } catch (error) {
    console.error('Error in registration process:', error);
    return false;
  }
}

export async function checkExistingRegistration(data: RegistrationData): Promise<boolean> {
  try {
    const response = await fetch('/api/check-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error checking registration:', error);
    throw error;
  }
}