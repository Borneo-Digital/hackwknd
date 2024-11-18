// src/api/registration/controllers/registration.ts

import { factories } from '@strapi/strapi';
import { Resend } from 'resend'; // Correctly import Resend as a named export

export default factories.createCoreController('api::registration.registration', ({ strapi }) => ({
  async create(ctx) {
    // Call the default create method to save the registration
    const response = await super.create(ctx);

    // Extract user data from the response
    const { Name, email, phone } = response.data.attributes;

    // Initialize Resend with your API key
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send confirmation email using Resend
    try {
      await resend.emails.send({
        from: process.env.RESEND_DEFAULT_FROM || 'no-reply@yourdomain.com',
        to: email,
        subject: 'Registration Confirmation',
        html: `
          <p>Dear ${Name},</p>
          <p>Thank you for registering. We have received your details:</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
          </ul>
          <p>We look forward to seeing you at the event.</p>
          <p>Best regards,<br/>Your Company</p>
        `,
      });
      strapi.log.info(`Confirmation email sent to ${email}`);
    } catch (error) {
      strapi.log.error('Error sending confirmation email:', error);
    }

    // Return the original response to the frontend
    return response;
  },

  // Optional: Test Email Method
  async testEmail(ctx) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      await resend.emails.send({
        from: process.env.RESEND_DEFAULT_FROM || 'no-reply@yourdomain.com',
        to: 'your_email@example.com', // Replace with your email for testing
        subject: 'Test Email from Strapi',
        html: '<h1>Test Email</h1><p>This is a test email sent through Resend API.</p>',
      });
      ctx.send({ message: 'Test email sent successfully.' });
    } catch (error) {
      strapi.log.error('Test email error:', error);
      ctx.throw(500, 'Failed to send test email');
    }
  },
}));