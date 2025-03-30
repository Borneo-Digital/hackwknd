import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SendTemplateEmailRequest } from '@/types/email';
import { render } from '@react-email/render';
import WelcomeEmail from '@/email/register-user';
import BulkEmail from '@/email/bulk-email';

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
    // Parse the request body
    const requestBody = await request.json();
    console.log('Raw request body:', JSON.stringify(requestBody));
    
    if (!requestBody || !requestBody.to || !requestBody.data) {
      console.error('Invalid request format - missing required fields');
      return NextResponse.json(
        { success: false, error: 'Invalid request format - missing required fields' },
        { status: 400 }
      );
    }
    
    const { to, data }: SendTemplateEmailRequest = requestBody;
    console.log('Sending email to:', to);
    console.log('Email data keys:', Object.keys(data));
    
    // Safely access properties
    if (!data.name || !data.email) {
      console.error('Missing required data fields (name or email)');
      return NextResponse.json(
        { success: false, error: 'Missing required data fields (name or email)' },
        { status: 400 }
      );
    }
    
    // Determine if this is a custom email from the admin panel
    const isCustomEmail = data.isCustomEmail === true;
    console.log('Is custom email:', isCustomEmail);
    
    // Set the appropriate email subject
    let emailSubject;
    if (isCustomEmail && data.customSubject) {
      // Use the custom subject for bulk emails
      emailSubject = data.customSubject;
    } else {
      // Use the default subject for registration emails
      emailSubject = data.hackathonTitle 
        ? `Thank You for Registering for ${data.hackathonTitle}!` 
        : 'Thank You for Registering for HackWknd!';
    }
    console.log('Email subject:', emailSubject);

    // Render the appropriate email template based on the type
    let html;
    try {
      if (isCustomEmail) {
        // Render the bulk email template with custom content
        console.log('Generating custom email content');
        
        // Log all the properties being passed to the template
        console.log('Custom email props:', {
          name: data.name,
          email: data.email,
          hackathonTitle: data.hackathonTitle,
          customSubjectLength: data.customSubject ? data.customSubject.length : 0,
          customContentLength: data.customContent ? data.customContent.length : 0,
          hasPartnershipLogos: Array.isArray(data.partnershipLogos) && data.partnershipLogos.length > 0
        });
        
        if (!data.customContent) {
          console.error('Missing customContent for custom email');
          return NextResponse.json(
            { success: false, error: 'Missing customContent for custom email' },
            { status: 400 }
          );
        }
        
        try {
          const bulkEmailProps = {
            name: data.name,
            email: data.email,
            hackathonTitle: data.hackathonTitle || 'HackWknd',
            customSubject: data.customSubject || '',
            customContent: data.customContent || '',
            partnershipLogos: data.partnershipLogos || [],
            isCustomEmail: true
          };
          
          console.log('Generating email HTML with template string');
          // Now the BulkEmail function returns a string directly, no need to render
          html = BulkEmail(bulkEmailProps);
          console.log('Email HTML generated successfully');
        } catch (err) {
          console.error('Error generating custom email HTML:', err);
          throw err;
        }
      } else {
        // Render the original welcome email for registrations
        console.log('Rendering welcome email template');
        try {
          html = render(
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
        } catch (err) {
          console.error('Error creating or rendering WelcomeEmail component:', err);
          throw err;
        }
      }
      
      console.log('HTML creation completed, length:', typeof html === 'string' ? html.length : 'unknown');
      
      if (!html) {
        throw new Error('Failed to render email template - html output is empty');
      }
    } catch (renderError) {
      console.error('Error rendering email template:', renderError);
      if (renderError instanceof Error) {
        console.error('Error name:', renderError.name);
        console.error('Error message:', renderError.message);
        console.error('Error stack:', renderError.stack);
      }
      return NextResponse.json(
        { success: false, error: 'Error rendering email template: ' + (renderError instanceof Error ? renderError.message : 'Unknown error') },
        { status: 500 }
      );
    }

    const emailData = {
      from: 'HackWknd Team <no-reply@hackwknd.sarawak.digital>',
      to,
      subject: emailSubject,
      html,
    };
    
    console.log('Attempting to send email with data:', { 
      subject: emailSubject,
      to: '[REDACTED for privacy]',
      hackathonTitle: data.hackathonTitle || 'HackWknd',
      emailType: isCustomEmail ? 'custom' : 'registration'
    });
    
    try {
      console.log('Preparing HTML content for email sending');
      // For our bulk email, html is already a string
      // For welcome email, we need to get the string from the rendering result
      const htmlContent = typeof html === 'string' ? html : 
                         (typeof html.then === 'function' ? await html : String(html));
      
      console.log('HTML content prepared, length:', htmlContent.length);
      
      if (!htmlContent) {
        throw new Error('Email HTML content is empty');
      }
      
      const emailDataToSend = { 
        ...emailData, 
        html: htmlContent 
      };
      
      console.log('Sending email via Resend API');
      const resendResult = await resend.emails.send(emailDataToSend);
      console.log('Resend API response status:', resendResult.error ? 'error' : 'success');

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
    } catch (sendError) {
      console.error('Error sending email via Resend:', sendError);
      if (sendError instanceof Error) {
        console.error('Error name:', sendError.name);
        console.error('Error message:', sendError.message);
        console.error('Error stack:', sendError.stack);
      }
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send email via email provider: ' + (sendError instanceof Error ? sendError.message : 'Unknown error') 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending email:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: (error instanceof Error) ? error.message : 'Failed to send email',
        details: JSON.stringify(error)
      },
      { status: 500 }
    );
  }
}