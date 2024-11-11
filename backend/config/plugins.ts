export default ({ env }) => ({
  email: {
    provider: 'smtp', // Use 'smtp' as the provider
    providerOptions: {
      host: env('SMTP_HOST', 'smtp.resend.com'), // Resend SMTP server host
      port: parseInt(env('SMTP_PORT', '587'), 10), // SMTP server port
      secure: env('SMTP_SECURE') === 'true', // Use TLS
      auth: {
        user: env('SMTP_USERNAME'), // Resend SMTP username
        pass: env('SMTP_PASSWORD'), // Resend SMTP password
      },
    },
    settings: {
      defaultFrom: 'no-reply@example.com', // Change to your desired default sender
      defaultReplyTo: 'no-reply@example.com', // Change to your desired default reply-to
    },
  },
});