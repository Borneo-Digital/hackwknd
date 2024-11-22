import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SendEmailResponse, SendTemplateEmailRequest } from '@/types/email';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log('Starting email sending process...');
  const emailEnabled = process.env.EMAIL_ENABLED === 'true';
  console.log('Email enabled:', emailEnabled);

  if (!emailEnabled) {
    console.log('Email sending is disabled. Processing mock email...');
    try {
      const requestData = await request.json();
      console.log('Received request data:', requestData);

      // Mock the resendResult since we're not sending an actual email
      const resendResult: SendEmailResponse = { id: 'email_disabled' };
      console.log('Created mock email response:', resendResult);

      return NextResponse.json(
        { success: true, messageId: resendResult.id },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error processing mock email request:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to process email request' },
        { status: 500 }
      );
    }
  }

  // Email sending is enabled
  console.log('Email sending is enabled. Checking API key...');
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('RESEND_API_KEY is not defined in environment variables.');
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }

  console.log('Initializing Resend client...');
  const resend = new Resend(apiKey);

  try {
    console.log('Parsing request data...');
    const { to, data }: SendTemplateEmailRequest = await request.json();
    console.log('Received email request for:', to);

    const emailData = {
      from: 'HackWknd Team <no-reply@hackwknd.sarawak.digital>',
      to,
      subject: 'Thank You for Registering for HackWknd!',
      html: `<p>Hello ${data.name},</p>
             <p>Thank you for registering for HackWknd. We're excited to have you join us!</p>
             <p>Best regards,<br/>The HackWknd Team</p>`,
    };
    console.log('Prepared email data:', { ...emailData, to: '[REDACTED]' });

    console.log('Sending email via Resend...');
    const resendResult = await resend.emails.send(emailData);

    if (resendResult.error) {
      console.error('Resend API returned an error:', resendResult.error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', resendResult.data);
    const result: SendEmailResponse = { id: resendResult.data?.id || 'unknown' };

    console.log('Returning success response with ID:', result.id);
    return NextResponse.json(
      { success: true, messageId: result.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error during email sending:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}