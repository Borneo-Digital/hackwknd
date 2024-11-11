// src/api/email/controllers/email.ts
import { factories } from '@strapi/strapi';

const emailController = factories.createCoreController('api::email.email', ({ strapi }) => ({
  // Keep the default CRUD actions
  ...factories.createCoreController('api::email.email'),

  // Add custom actions
  async sendEmail(ctx) {
    try {
      const { id } = ctx.params;
      const { to } = ctx.request.body;

      // Find the email template from your collection
      const emailTemplate = await strapi.entityService.findOne('api::email.email', id);

      if (!emailTemplate || !emailTemplate.IsActive) {
        return ctx.throw(404, 'Email template not found or inactive');
      }

      // Send the email using the template data
      await strapi.plugins['email'].services.email.send({
        to,
        from: emailTemplate.FromEmail,
        subject: emailTemplate.Subject,
        text: emailTemplate.Body, // In case HTML isn't supported
        html: emailTemplate.Body,
      });

      // Record the email sending (optional)
      await strapi.entityService.create('api::email.email', {
        data: {
          Name: `Sent: ${emailTemplate.Name}`,
          Subject: emailTemplate.Subject,
          Body: emailTemplate.Body,
          FromEmail: emailTemplate.FromEmail,
          IsActive: false, // This is a record of a sent email
          sentTo: to,
          sentAt: new Date(),
        },
      });

      return ctx.send({
        message: 'Email sent successfully',
      });
    } catch (error) {
      strapi.log.error('Email sending error:', error);
      return ctx.throw(500, 'Failed to send email');
    }
  },

  // Add a method to send custom emails without a template
  async sendCustomEmail(ctx) {
    try {
      const { to, subject, body, fromEmail } = ctx.request.body;

      // Validate required fields
      if (!to || !subject || !body || !fromEmail) {
        return ctx.throw(400, 'Missing required fields');
      }

      // Send the email
      await strapi.plugins['email'].services.email.send({
        to,
        from: fromEmail,
        subject,
        text: body, // In case HTML isn't supported
        html: body,
      });

      // Optionally save the sent email
      await strapi.entityService.create('api::email.email', {
        data: {
            
          Name: `Custom: ${subject}`,
          Subject: subject,
          Body: body,
          FromEmail: fromEmail,
          IsActive: false,
          sentTo: to,
          sentAt: new Date(),
        },
      });

      return ctx.send({
        message: 'Custom email sent successfully',
      });
    } catch (error) {
      strapi.log.error('Custom email sending error:', error);
      return ctx.throw(500, 'Failed to send custom email');
    }
  },
}));

export default emailController;