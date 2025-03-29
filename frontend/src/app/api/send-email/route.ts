import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SendTemplateEmailRequest } from '@/types/email';
import { render } from '@react-email/render';
import WelcomeEmail from '@/email/register-user';

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
    console.log('Email data:', data);
    
    // Create title for the email based on hackathon title if available
    const emailSubject = data.hackathonTitle 
      ? `Thank You for Registering for ${data.hackathonTitle}!` 
      : 'Thank You for Registering for HackWknd!';

    // Render the email template with the provided data
    const html = render(
      WelcomeEmail({
        name: data.name,
        email: data.email,
        hackathonTitle: data.hackathonTitle || 'HackWknd',
        hackathonTheme: data.hackathonTheme || '',
        hackathonDate: data.hackathonDate || '',
        hackathonLocation: data.hackathonLocation || '',
        hackathonDescription: data.hackathonDescription || '',
        age: data.age,
        partnershipLogos: data.partnershipLogos || []
      })
    );

    const emailData = {
      from: 'HackWknd Team <no-reply@hackwknd.sarawak.digital>',
      to,
      subject: emailSubject,
      html,
    };
    
    console.log('Attempting to send email with data:', { 
      ...emailData, 
      to: '[REDACTED]',
      hackathonTitle: data.hackathonTitle || 'HackWknd'
    });
    
    const htmlContent = await emailData.html;
    const emailDataToSend = { ...emailData, html: htmlContent };
    const resendResult = await resend.emails.send(emailDataToSend);
    console.log('Resend API response:', resendResult);

    if (resendResult.error) {
      console.error('Resend API error:', resendResult.error);
      return NextResponse.json(
        { success: false, error: resendResult.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        messageId: resendResult.data?.id,
        data: resendResult.data 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error instanceof Error) ? error.message : 'Failed to send email',
        details: error
      },
      { status: 500 }
    );
  }
}