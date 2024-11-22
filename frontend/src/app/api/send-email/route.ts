import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SendTemplateEmailRequest } from '@/types/email';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log('Starting email sending process...');
  
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not defined in environment variables.');
    return NextResponse.json(
      { success: false, error: 'Missing API key' },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { to, data }: SendTemplateEmailRequest = await request.json();
    console.log('Sending email to:', to);

    const emailData = {
      from: 'HackWknd Team <onboarding@resend.dev>', // Use the verified domain from Resend
      to,
      subject: 'Thank You for Registering for HackWknd!',
      html: `<p>Hello ${data.name},</p>
             <p>Thank you for registering for HackWknd. We're excited to have you join us!</p>
             <p>Best regards,<br/>The HackWknd Team</p>`,
    };

    const resendResult = await resend.emails.send(emailData);
    console.log('Resend API response:', resendResult);

    if (resendResult.error) {
      throw new Error(resendResult.error.message);
    }

    return NextResponse.json(
      { success: true, messageId: resendResult.data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}