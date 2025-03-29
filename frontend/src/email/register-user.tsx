import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const mainStyle = {
  backgroundColor: "#1F2937",
  fontFamily: "sans-serif",
  margin: "0 auto",
};

const containerStyle = {
  padding: "32px",
  borderRadius: "4px",
  margin: "0 auto",
  width: "100%",
  maxWidth: "600px",
};

const headingStyle = {
  color: "#FFFFFF",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "16px 0",
};

const textStyle = {
  color: "#E5E7EB",
  fontSize: "16px",
  lineHeight: "24px",
};

const sectionStyle = {
  marginTop: "32px",
};

const eventDetailsStyle = {
  backgroundColor: "#374151",
  padding: "24px",
  borderRadius: "8px",
};

const detailItemStyle = {
  ...textStyle,
  padding: "8px",
  marginBottom: "8px",
};

const buttonStyle = {
  backgroundColor: "#C5FF00",
  color: "#111827",
  padding: "12px 24px",
  borderRadius: "6px",
  fontWeight: "600",
  marginTop: "16px",
  textAlign: "center" as const,
  display: "inline-block",
  textDecoration: "none",
};

const hrStyle = {
  borderColor: "#4B5563",
  margin: "32px 0",
};

const imageContainerStyle = {
  width: "100%",
  maxWidth: "400px",
  margin: "32px auto",
  padding: "0 20px",
};

const imageStyle = {
  width: "100%",
  height: "auto",
  display: "block",
  objectFit: "contain" as const,
};

const footerImageStyle = {
  width: "100%",
  maxWidth: "600px",
  height: "auto",
  marginTop: "32px",
};

interface PartnershipLogo {
  id: string;
  url: string;
  name: string;
}

interface WelcomeEmailProps {
  name: string;
  email: string;
  hackathonTitle: string;
  hackathonTheme: string;
  hackathonDate: string;
  hackathonLocation: string;
  hackathonDescription?: string;
  age?: number;
  partnershipLogos?: PartnershipLogo[];
}

export default function WelcomeEmail({
  name,
  email,
  hackathonTitle = "HackWknd",
  hackathonTheme = "",
  hackathonDate = "",
  hackathonLocation = "",
  hackathonDescription = "",
  age,
  partnershipLogos = []
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {hackathonTitle}!</Preview>
      <Body style={mainStyle}>
        <Container style={containerStyle}>
          <div style={imageContainerStyle}>
            <Img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HackWknd%20SDEC-BwCXqqMM3vFQm9z1GKx2H7mMsFvZSP.png"
              alt="HackWknd Logo"
              style={imageStyle}
            />
          </div>
          <Heading style={headingStyle}>
            Welcome to {hackathonTitle}!
          </Heading>
          <Text style={textStyle}>
            Hi {name}, we are thrilled to have you join us for {hackathonTitle}.
            {hackathonTheme ? ` This event is focused on "${hackathonTheme}".` : ''}
            {hackathonDescription ? ` ${hackathonDescription}` : ''}
          </Text>
          
          <Text style={textStyle}>
            Below, you will find the key information about the event.
          </Text>
          
          <Section style={sectionStyle}>
            <Heading as="h2" style={{...headingStyle, fontSize: "20px", marginBottom: "16px"}}>
              Event Details
            </Heading>
            <Container style={eventDetailsStyle}>
              <Text style={detailItemStyle}>
                <strong>Location:</strong> {hackathonLocation}
              </Text>
              <Text style={detailItemStyle}>
                <strong>Date:</strong> {hackathonDate}
              </Text>
              {hackathonTheme && (
                <Text style={{...detailItemStyle, marginBottom: "0"}}>
                  <strong>Theme:</strong> {hackathonTheme}
                </Text>
              )}
            </Container>
          </Section>
          
          <Section style={sectionStyle}>
            <Heading as="h2" style={{...headingStyle, fontSize: "20px", marginBottom: "16px"}}>
              Your Registration Info
            </Heading>
            <Container style={eventDetailsStyle}>
              {name && (
                <Text style={detailItemStyle}>
                  <strong>Name:</strong> {name}
                </Text>
              )}
              {email && (
                <Text style={detailItemStyle}>
                  <strong>Email:</strong> {email}
                </Text>
              )}
              {age && (
                <Text style={{...detailItemStyle, marginBottom: "0"}}>
                  <strong>Age:</strong> {age}
                </Text>
              )}
            </Container>
          </Section>

          <Section style={sectionStyle}>
            <Text style={textStyle}>
              Thank you for registering for this event. You will receive more details and instructions closer to the event date.
            </Text>
            <Text style={textStyle}>
              For more information, please visit our website at <a href="https://hackwknd.sarawak.digital" style={{color: "#C5FF00"}}>hackwknd.sarawak.digital</a>.
            </Text>
          </Section>

          <Hr style={hrStyle} />
          
          <Text style={textStyle}>
            Thank you,
            <br />
            HackWknd Team
          </Text>

          {/* Dynamic partnership logos */}
          {Array.isArray(partnershipLogos) && partnershipLogos.length > 0 ? (
            <Section>
              <Hr style={hrStyle} />
              <Heading as="h3" style={{...headingStyle, fontSize: "18px", marginBottom: "16px", textAlign: "center" as const}}>
                In partnership with
              </Heading>
              <Container style={{
                display: "flex",
                flexDirection: "row" as const,
                flexWrap: "wrap" as const,
                justifyContent: "center" as const,
                gap: "20px",
                marginTop: "16px"
              }}>
                {partnershipLogos.map((logo) => (
                  <div key={logo.id} style={{
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center" as const,
                    width: "100px",
                    margin: "0 10px"
                  }}>
                    {logo.url && (
                      <Img 
                        src={logo.url} 
                        alt={logo.name || "Partnership Logo"} 
                        width="80"
                        height="60"
                        style={{
                          maxWidth: "80px",
                          maxHeight: "60px",
                          objectFit: "contain" as const
                        }}
                      />
                    )}
                    {logo.name && (
                      <Text style={{
                        ...textStyle,
                        fontSize: "12px",
                        marginTop: "4px",
                        textAlign: "center" as const
                      }}>
                        {logo.name}
                      </Text>
                    )}
                  </div>
                ))}
              </Container>
            </Section>
          ) : (
            // Fallback to default partners footer only if no custom partners
            <Img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hackwknd%20footer1-94eFkX6OZX4ZnsY4Y0pmHzpXcvxtsj.png"
              alt="HackWknd Partners and Collaborators"
              style={footerImageStyle}
            />
          )}
        </Container>
      </Body>
    </Html>
  );
}