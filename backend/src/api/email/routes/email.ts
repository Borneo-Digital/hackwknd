// src/api/email/routes/email.ts

export default {
    routes: [
      // Default CRUD routes
      {
        method: 'GET',
        path: '/emails',
        handler: 'email.find',
      },
      {
        method: 'GET',
        path: '/emails/:id',
        handler: 'email.findOne',
      },
      {
        method: 'POST',
        path: '/emails',
        handler: 'email.create',
      },
      {
        method: 'PUT',
        path: '/emails/:id',
        handler: 'email.update',
      },
      {
        method: 'DELETE',
        path: '/emails/:id',
        handler: 'email.delete',
      },
  
      // Custom email routes
      {
        method: 'POST',
        path: '/emails/send-template',
        handler: 'email.sendTemplate',
        config: {
          description: 'Send an email using a template',
          policies: [],
        }
      },
      {
        method: 'POST',
        path: '/emails/:id/send',
        handler: 'email.sendEmail',
        config: {
          description: 'Send an email using a specific template ID',
          policies: [],
        }
      },
      {
        method: 'POST',
        path: '/emails/send-custom',
        handler: 'email.sendCustomEmail',
        config: {
          description: 'Send a custom email without a template',
          policies: [],
        }
      },
      {
        method: 'GET',
        path: '/emails/test',
        handler: 'email.test',
        config: {
          description: 'Test email configuration',
          policies: [],
        }
      }
    ]
  };