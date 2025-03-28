// frontend/src/types/email.ts

// Type for sending template email
export interface SendTemplateEmailRequest {
  to: string;
  data: {
    name: string;
    email: string;
    phone?: string;
    age?: number;
    [key: string]: string | number | undefined;
  };
}

// Unified response type for email sending
export interface SendEmailResponse {
  id: string;
  // Add other properties returned by Resend if necessary
}