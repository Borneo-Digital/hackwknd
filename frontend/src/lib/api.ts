import { Hackathon } from '@/types/hackathon'
import {  RegistrationData } from '@/types/registrations'

export async function getHackathonBySlug(slug: string): Promise<Hackathon | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const res = await fetch(`${apiUrl}/api/hackathons?filters[slug][$eq]=${slug}&populate=*`, {
      cache: 'no-store'
    })

    if (!res.ok) {
      throw new Error('Failed to fetch hackathon')
    }

    const data = await res.json()
    return data.data[0] as Hackathon || null
  } catch (error) {
    console.error('Error fetching hackathon:', error)
    return null
  }
}


// lib/api.ts

export async function submitRegistration(formData: RegistrationData): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    console.log('API URL:', apiUrl);

    // Submit the registration
    console.log('Submitting registration data:', formData);
    const registrationResponse = await fetch(`${apiUrl}/api/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://hackwknd.sarawak.digital'
      },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        data: {
          Name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      }),
    });

    // Log response details
    console.log('Registration Response Status:', registrationResponse.status);
    console.log('Registration Response Headers:', Object.fromEntries(registrationResponse.headers.entries()));

    if (!registrationResponse.ok) {
      const errorBody = await registrationResponse.text();
      console.error('Registration failed:', {
        status: registrationResponse.status,
        statusText: registrationResponse.statusText,
        headers: Object.fromEntries(registrationResponse.headers.entries()),
        body: errorBody,
      });
      throw new Error(`Failed to submit registration: ${registrationResponse.status}`);
    }

    console.log('Registration successful');
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error in registration process:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      console.error('Unknown error in registration process:', error);
    }
    return false;
  }
}