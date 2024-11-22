import { Hackathon } from '@/types/hackathon';
import { RegistrationData } from '@/types/registrations';

// Fetch hackathon data by slug
export async function getHackathonBySlug(slug: string): Promise<Hackathon | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const res = await fetch(`${apiUrl}/api/hackathons?filters[slug][$eq]=${slug}&populate=*`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch hackathon');
    }

    const data = await res.json();
    return data.data[0] as Hackathon || null;
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    return null;
  }
}

// Send confirmation email
async function sendConfirmationEmail(email: string, name: string) {
  try {
    console.log('Sending confirmation email to:', email);
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

    if (!response.ok) {
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