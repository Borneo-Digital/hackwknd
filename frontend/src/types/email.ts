// frontend/src/types/email.ts

// Partnership Logo type
export interface PartnershipLogo {
  id: string;
  url: string;
  name: string;
}

// Type for sending template email
export interface SendTemplateEmailRequest {
  to: string;
  data: {
    name: string;
    email: string;
    phone?: string;
    age?: number;
    hackathonTitle?: string;
    hackathonTheme?: string;
    hackathonDate?: string;
    hackathonLocation?: string;
    hackathonDescription?: string;
    partnershipLogos?: PartnershipLogo[];
    // Custom email properties
    customSubject?: string;
    customContent?: string;
    isCustomEmail?: boolean;
    [key: string]: string | number | boolean | undefined | PartnershipLogo[];
  };
}

// Unified response type for email sending
export interface SendEmailResponse {
  id: string;
  // Add other properties returned by Resend if necessary
}