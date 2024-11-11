// src/api/email/controllers/email.ts
import { factories } from '@strapi/strapi';

const emailController = factories.createCoreController('api::email.email', ({ strapi }) => ({
  // Keep the default CRUD actions
  ...factories.createCoreController('api::email.email'),

  // Send email using template
  async sendTemplate(ctx) {
    try {
      const { to, templateId, data } = ctx.request.body;

      // Validate required fields
      if (!to || !templateId || !data) {
        return ctx.throw(400, 'Missing required fields: to, templateId, or data');
      }

      // Find the email template
      const emailTemplate = await strapi.entityService.findOne('api::email.email', templateId);

      if (!emailTemplate || !emailTemplate.IsActive) {
        return ctx.throw(404, 'Email template not found or inactive');
      }

      // Replace placeholders with actual data
      let emailBody = emailTemplate.Body;
      Object.keys(data).forEach(key => {
        emailBody = emailBody.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
      });

      // Send the email using Strapi's email plugin
      await strapi.plugins['email'].services.email.send({
        to,
        from: emailTemplate.FromEmail,
        subject: emailTemplate.Subject,
        html: emailBody,
      });

      // Record the email sending
      await strapi.entityService.create('api::email.email', {
        data: {
          Name: `Sent: ${emailTemplate.Name}`,
          Subject: emailTemplate.Subject,
          Body: emailBody,
          FromEmail: emailTemplate.FromEmail,
          IsActive: false,
          sentTo: to,
          sentAt: new Date(),
        },
      });

      return ctx.send({
        message: 'Email sent successfully using template'
      });
    } catch (error) {
      strapi.log.error('Template email sending error:', error);
      return ctx.throw(500, 'Failed to send template email');
    }
  },

  // Send email with specific template ID
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
        text: emailTemplate.Body,
        html: emailTemplate.Body,
      });

      // Record the email sending
      await strapi.entityService.create('api::email.email', {
        data: {
          Name: `Sent: ${emailTemplate.Name}`,
          Subject: emailTemplate.Subject,
          Body: emailTemplate.Body,
          FromEmail: emailTemplate.FromEmail,
          IsActive: false,
          sentTo: to,
          sentAt: new Date(),
        },
      });

      return ctx.send({
        message: 'Email sent successfully'
      });
    } catch (error) {
      strapi.log.error('Email sending error:', error);
      return ctx.throw(500, 'Failed to send email');
    }
  },

  // Send custom email without template
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
        text: body,
        html: body,
      });

      // Record the sent email
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
        message: 'Custom email sent successfully'
      });
    } catch (error) {
      strapi.log.error('Custom email sending error:', error);
      return ctx.throw(500, 'Failed to send custom email');
    }
  },

  // Test email configuration
  async test(ctx) {
    try {
      await strapi.plugins['email'].services.email.send({
        to: 'test@example.com', // Replace with a test email
        from: process.env.SMTP_FROM || 'your-verified@domain.com',
        subject: 'Test Email from Strapi',
        text: 'This is a test email from your Strapi application',
        html: '<h1>Test Email</h1><p>This is a test email from your Strapi application</p>',
      });

      return ctx.send({
        message: 'Test email sent successfully'
      });
    } catch (error) {
      strapi.log.error('Test email error:', error);
      return ctx.throw(500, 'Failed to send test email');
    }
  },

  // Get email template with validation
  async getTemplate(ctx) {
    try {
      const { id } = ctx.params;
      const template = await strapi.entityService.findOne('api::email.email', id);
      
      if (!template) {
        return ctx.throw(404, 'Email template not found');
      }

      return ctx.send(template);
    } catch (error) {
      strapi.log.error('Get template error:', error);
      return ctx.throw(500, 'Failed to get email template');
    }
  }
}));

export default emailController;