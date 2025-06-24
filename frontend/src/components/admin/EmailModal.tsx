'use client';

import { useState, useEffect } from 'react';
import { SendTemplateEmailRequest } from '@/types/email';
import { toast } from 'sonner';
import { PartnershipLogo } from '@/types/hackathon';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: {
    name: string;
    email: string;
    hackathon_id: string;
    partnershipLogos?: PartnershipLogo[];
  }[];
  hackathonTitle: string;
  onSendEmail: (emailData: SendTemplateEmailRequest[]) => Promise<void>;
}

export default function EmailModal({ 
  isOpen, 
  onClose, 
  recipients, 
  hackathonTitle,
  onSendEmail
}: EmailModalProps) {
  const [subject, setSubject] = useState<string>(`Important Information for ${hackathonTitle}`);
  const [content, setContent] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');

  useEffect(() => {
    if (isOpen) {
      setSubject(`Important Information for ${hackathonTitle}`);
    }
  }, [isOpen, hackathonTitle]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setContent('');
      setIsSending(false);
      setPreviewMode(false);
      setSelectedTemplate('custom');
    }
  }, [isOpen]);

  // Email templates
  const templates = {
    custom: { subject: `Important Information for ${hackathonTitle}`, content: '' },
    confirmation: { 
      subject: `Your ${hackathonTitle} Registration is Confirmed!`, 
      content: `Hello {{name}},

We're excited to confirm your registration for ${hackathonTitle}!

Please make sure to arrive on time and bring your ID. We look forward to seeing you at the event.

Best regards,
The HackWknd Team`
    },
    reminder: { 
      subject: `Reminder: ${hackathonTitle} is Coming Soon!`, 
      content: `Hello {{name}},

This is a friendly reminder that ${hackathonTitle} is coming up soon!

Here are a few things to remember:
- Bring your laptop and charger
- Have your ID with you
- Come with an open mind and ready to collaborate

We can't wait to see what you'll build!

Best regards,
The HackWknd Team`
    },
    update: { 
      subject: `Important Update for ${hackathonTitle}`, 
      content: `Hello {{name}},

We have an important update regarding ${hackathonTitle}.

[Your update details here]

If you have any questions, please don't hesitate to reply to this email.

Best regards,
The HackWknd Team`
    }
  };

  // Apply template
  const applyTemplate = (templateKey: string) => {
    setSelectedTemplate(templateKey);
    setSubject(templates[templateKey as keyof typeof templates].subject);
    setContent(templates[templateKey as keyof typeof templates].content);
  };

  // Handle sending emails
  const handleSend = async () => {
    if (!content || !subject) {
      toast.warning('Please provide both subject and content for your email');
      return;
    }
    
    if (isSending) {
      return; // Prevent multiple submissions
    }
    
    setIsSending(true);
    
    try {
      console.log(`Preparing to send emails to ${recipients.length} recipients`);
      
      const emailRequests = recipients.map(recipient => {
        // Replace placeholders in content
        const personalizedContent = content
          .replace(/{{name}}/g, recipient.name)
          .replace(/{{email}}/g, recipient.email);
      
        // Create the request object
        const request = {
          to: recipient.email,
          data: {
            name: recipient.name,
            email: recipient.email,
            hackathonTitle,
            customSubject: subject,
            customContent: personalizedContent,
            partnershipLogos: recipient.partnershipLogos || [],
            isCustomEmail: true,
          }
        };
        
        return request;
      });
      
      // Log the first request for debugging
      if (emailRequests.length > 0) {
        console.log('Sample email request:', JSON.stringify(emailRequests[0]));
      }
      
      await onSendEmail(emailRequests);
      console.log('Emails sent successfully');
      onClose();
    } catch (error) {
      console.error('Error sending emails:', error);
      toast.error(`Failed to send emails: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl bg-card rounded-lg shadow-xl overflow-hidden">
        <div className="flex justify-between items-center p-6 bg-muted border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Email {recipients.length} Participant{recipients.length !== 1 ? 's' : ''}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Email Template</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate('custom')}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  selectedTemplate === 'custom' 
                    ? 'bg-hack-primary/10 text-hack-primary border-hack-primary/30' 
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                Custom
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('confirmation')}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  selectedTemplate === 'confirmation' 
                    ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50' 
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                Confirmation
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('reminder')}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  selectedTemplate === 'reminder' 
                    ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50' 
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                Reminder
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('update')}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  selectedTemplate === 'update' 
                    ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50' 
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                Update
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
              Subject Line
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors"
              placeholder="Enter email subject..."
            />
          </div>
          
          {!previewMode ? (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="content" className="block text-sm font-medium text-foreground">
                  Email Content
                </label>
                <div className="text-xs text-muted-foreground">
                  Use <code className="bg-muted px-1 py-0.5 rounded">{'{{name}}'}</code> to include participant&apos;s name
                </div>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-4 py-2.5 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-colors font-mono text-sm"
                placeholder="Write your email content here..."
              />
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-foreground">
                  Preview (for first recipient)
                </label>
              </div>
              <div className="border border-input rounded-lg p-4 min-h-[250px] max-h-[400px] overflow-y-auto bg-muted/30">
                <div className="text-lg font-bold mb-2">{subject}</div>
                <div className="whitespace-pre-wrap">
                  {recipients.length > 0 ? 
                    content
                      .replace(/{{name}}/g, recipients[0].name)
                      .replace(/{{email}}/g, recipients[0].email) : 
                    content}
                </div>
              </div>
            </div>
          )}
            
          <div className="border-t border-border mt-6 pt-6 flex justify-between">
            <button
              type="button"
              onClick={togglePreview}
              className="px-4 py-2.5 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
            >
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-input rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
                disabled={isSending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                className="px-4 py-2.5 border border-hack-primary/30 rounded-md shadow-sm text-sm font-medium text-white bg-hack-primary hover:bg-hack-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hack-primary transition-colors flex items-center space-x-2"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                    <span>Send to {recipients.length} Participant{recipients.length !== 1 ? 's' : ''}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}