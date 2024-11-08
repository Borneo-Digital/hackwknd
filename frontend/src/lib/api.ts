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

export async function submitRegistration(formData: RegistrationData): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${apiUrl}/api/registrations`, {
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

    const responseBody = await response.json();
    console.error('Response body:', responseBody); // Add this line

    if (!response.ok) {
      throw new Error('Failed to submit registration');
    }

    return true;
  } catch (error) {
    console.error('Error submitting registration:', error);
    return false;
  }
}