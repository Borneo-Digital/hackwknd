// config/plugins.ts
export default ({ env }) => ({
  email: {
    config: {
      provider: 'smtp',
      providerOptions: {
        host: env('RESEND_SMTP_HOST', 'smtp.resend.com'),
        port: env.int('RESEND_SMTP_PORT', 465),
        auth: {
          user: env('RESEND_SMTP_USERNAME'),
          pass: env('RESEND_SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('RESEND_DEFAULT_FROM', 'no-reply@yourdomain.com'),
        defaultReplyTo: env('RESEND_DEFAULT_REPLY_TO', 'support@yourdomain.com'),
      },
    },
  },
});