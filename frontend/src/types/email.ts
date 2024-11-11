// types/email.ts

// Base type for Email attributes
export interface EmailAttributes {
    Name: string;
    Subject: string;
    Body: string;
    FromEmail: string;
    IsActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
  }
  
  // Type for Email response from Strapi
  export interface EmailTemplate {
    id: number;
    attributes: EmailAttributes;
  }
  
  // Type for sending template email
  export interface SendTemplateEmailRequest {
    templateId: number;
    to: string;
    data: {
      name: string;
      email: string;
      phone: string;
      [key: string]: string; // For additional template variables
    };
  }
  
  // Type for creating/updating email template
  export interface CreateEmailTemplate {
    data: {
      Name: string;
      Subject: string;
      Body: string;
      FromEmail: string;
      IsActive: boolean;
    };
  }
  
  // Type for API response
  export interface EmailResponse {
    data: EmailTemplate;
  }
  
  // Type for error response
  export interface EmailError {
    status: number;
    name: string;
    message: string;
  }