import { Hackathon } from '@/types/hackathon'
import {  RegistrationData } from '@/types/registrations'
import { 
  SendTemplateEmailRequest, 
  EmailTemplate, 
  EmailResponse,
  EmailError 
} from '@/types/email';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`
});

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
    const headers = getAuthHeaders();

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
      const errorData = await registrationResponse.json();
      console.error('Registration error:', errorData);
      throw new Error('Failed to submit registration');
    }

    // Send confirmation email
    const emailRequest: SendTemplateEmailRequest = {
      templateId: 1, // Your template ID
      to: formData.email,
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      }
    };

    const emailResponse = await fetch(`${apiUrl}/api/emails/send-template`, {
      method: 'POST',
      headers,
      body: JSON.stringify(emailRequest),
    });

    if (!emailResponse.ok) {
      const errorData: EmailError = await emailResponse.json();
      console.error('Email error:', errorData);
      return true; // Still return true as registration was successful
    }

    return true;
  } catch (error) {
    console.error('Error in registration process:', error);
    return false;
  }
}

// Get email template by ID
export async function getEmailTemplate(id: number): Promise<EmailTemplate | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${apiUrl}/api/emails/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch email template');
    }

    const data: EmailResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching email template:', error);
    return null;
  }
}

// Send email using template
export async function sendTemplateEmail(request: SendTemplateEmailRequest): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const response = await fetch(`${apiUrl}/api/emails/send-template`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData: EmailError = await response.json();
      console.error('Failed to send template email:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending template email:', error);
    return false;
  }
}