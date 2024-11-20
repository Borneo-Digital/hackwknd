// frontend/src/app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SendTemplateEmailRequest, CreateEmailResponse } from '@/types/email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
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

    // Use the CreateEmailResponse type
    const resendResult = await resend.emails.send(emailData);
    const result: CreateEmailResponse = { id: resendResult.toString() };

    return NextResponse.json({ success: true, messageId: result.id }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}