// frontend/src/app/api/send-email/route.ts

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
// import { Resend } from 'resend'; // Commented out since we might not send emails
import { SendEmailResponse } from '@/types/email';

export async function POST(request: NextRequest) {
  const emailEnabled = process.env.EMAIL_ENABLED === 'true';

  if (!emailEnabled) {
    console.log('Email sending is disabled.');
    try {
      await request.json();

      // Mock the resendResult since we're not sending an actual email
      const resendResult: SendEmailResponse = { id: 'email_disabled' };

      return NextResponse.json(
        { success: true, messageId: resendResult.id },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error processing email request:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to process email request' },
        { status: 500 }
      );
    }
  }

  // Email sending is enabled
  /*
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('RESEND_API_KEY is not defined.');
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  
  try {
    const { to, data }: SendTemplateEmailRequest = await request.json();

    const emailData = {
      from: 'HackWknd Team <no-reply@hackwknd.sarawak.digital>',
      to,
      subject: 'Thank You for Registering for HackWknd!',
      html: `<p>Hello ${data.name},</p>
             <p>Thank you for registering for HackWknd. We're excited to have you join us!</p>
             <p>Best regards,<br/>The HackWknd Team</p>`,
    };

    const resendResult = await resend.emails.send(emailData);
    const result: SendEmailResponse = { id: resendResult.id };

    return NextResponse.json(
      { success: true, messageId: result.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
  */
}