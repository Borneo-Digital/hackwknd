import { Hackathon } from '@/types/hackathon';
import { RegistrationData } from '@/types/registrations';

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

export async function submitRegistration(formData: RegistrationData): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    // Submit registration data to Strapi backend
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

    // Send confirmation email via API route
    const emailResponse = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: formData.email,
        name: formData.name,
      }),
    });

    if (!emailResponse.ok) {
      const emailError = await emailResponse.text();
      console.error('Failed to send confirmation email:', emailError);
      // Do not throw an error here to allow registration to succeed
    }

    return true;
  } catch (error) {
    console.error('Error in registration process:', error);
    return false;
  }
}