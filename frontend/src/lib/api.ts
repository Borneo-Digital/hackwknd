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
// lib/api.ts
export async function submitRegistration(formData: RegistrationData): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const apiToken = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

    // Common headers with authentication
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiToken}`
    };

    // Submit registration
    const registrationResponse = await fetch(`${apiUrl}/api/registrations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data: {
          Name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      }),
    });

    if (!registrationResponse.ok) {
      throw new Error('Failed to submit registration');
    }

    // Send confirmation email
    const emailResponse = await fetch(`${apiUrl}/api/emails/send-template`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        templateId: 1,
        to: formData.email,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      }),
    });

    if (!emailResponse.ok) {
      console.error('Failed to send confirmation email');
      // Still return true as registration was successful
      return true;
    }

    return true;
  } catch (error) {
    console.error('Error in registration process:', error);
    return false;
  }
}

// // Optional: Create a helper function for authenticated API calls
// async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
//   const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
//   const apiToken = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

//   const response = await fetch(`${apiUrl}${endpoint}`, {
//     ...options,
//     headers: {
//       ...options.headers,
//       'Authorization': `Bearer ${apiToken}`,
//     },
//   });

//   if (!response.ok) {
//     throw new Error(`API call failed: ${response.statusText}`);
//   }

//   return response.json();
// }