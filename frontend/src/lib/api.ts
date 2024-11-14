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
    
    // First, submit the registration
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
      throw new Error('Failed to submit registration');
    }

             // Then, send the confirmation email
             const emailResponse = await fetch(`${apiUrl}/api/emails/send-template`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                templateId: 1, // Use the actual ID of your email template
                to: formData.email,
                data: {
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                },
              }),
            });
            console.log('Email response:', emailResponse); // Log the email response
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