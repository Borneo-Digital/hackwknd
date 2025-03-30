import { PartnershipLogo } from "@/types/email";

interface BulkEmailProps {
  name: string;
  email: string;
  hackathonTitle: string;
  customSubject: string;
  customContent: string;
  partnershipLogos?: PartnershipLogo[];
  isCustomEmail?: boolean;
}

export default function BulkEmail(props: BulkEmailProps) {
  const {
    name = '',
    email = '',
    hackathonTitle = 'HackWknd',
    customSubject = '',
    customContent = '',
  } = props;
  
  // Ensure content is a string
  const safeContent = customContent || '';
  const safeSubject = customSubject || `Message from ${hackathonTitle}`;
  
  // Create a very simple HTML email template
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSubject}</title>
</head>
<body style="background-color: #1F2937; font-family: sans-serif; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 32px;">
    <div style="width: 100%; max-width: 400px; margin: 32px auto; padding: 0 20px; text-align: center;">
      <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HackWknd%20SDEC-BwCXqqMM3vFQm9z1GKx2H7mMsFvZSP.png" 
           alt="HackWknd Logo" 
           style="width: 100%; height: auto; display: block; object-fit: contain;">
    </div>
    
    <h1 style="color: #FFFFFF; font-size: 24px; font-weight: bold; margin: 16px 0;">
      ${safeSubject}
    </h1>
    
    <div style="color: #E5E7EB; font-size: 16px; line-height: 24px; white-space: pre-wrap; margin: 24px 0;">
      ${safeContent}
    </div>
    
    <hr style="border-color: #4B5563; margin: 32px 0;">
    
    <!-- Only show the sign-off if it's not already in the content -->
    ${!safeContent.includes('Best regards') && !safeContent.includes('Thank you') ? 
      `<div style="color: #E5E7EB; font-size: 16px; line-height: 24px;">
        Thank you,<br>
        HackWknd Team
      </div>` : ''}
    
    ${props.partnershipLogos && props.partnershipLogos.length > 0 ? 
      `<div style="margin-top: 32px;">
        <hr style="border-color: #4B5563; margin: 32px 0;">
        <h3 style="color: #FFFFFF; font-size: 18px; font-weight: bold; margin-bottom: 16px; text-align: center;">
          In partnership with
        </h3>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; margin-top: 16px;">
          ${props.partnershipLogos.map(logo => `
            <div style="display: flex; flex-direction: column; align-items: center; width: 100px; margin: 0 10px;">
              ${logo.url ? 
                `<img src="${logo.url}" 
                      alt="${logo.name || 'Partnership Logo'}" 
                      width="80"
                      height="60"
                      style="max-width: 80px; max-height: 60px; object-fit: contain;">` : 
                ''}
              ${logo.name ? 
                `<div style="color: #E5E7EB; font-size: 12px; margin-top: 4px; text-align: center;">
                  ${logo.name}
                </div>` : 
                ''}
            </div>
          `).join('')}
        </div>
      </div>` : 
      '' // Removed the "Organized by" section entirely
    }
  </div>
</body>
</html>`;
}