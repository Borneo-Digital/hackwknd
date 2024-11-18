/**
 * registration controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::registration.registration', ({ strapi }) => ({
  async create(ctx) {
    // Call the default create method to save the registration
    const response = await super.create(ctx);

    // Extract user data from the response
    const { Name, email, phone } = response.data.attributes;

    // Send confirmation email using Resend
    try {
      await strapi.plugins['email'].services.email.send({
        to: email,
        from: process.env.RESEND_DEFAULT_FROM || 'no-reply@yourdomain.com', // Replace with your verified sender email
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
}));