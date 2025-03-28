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

interface WelcomeEmailProps {
  name?: string;
  email?: string;
  age?: number;
}

export default function WelcomeEmail({ name, email, age }: WelcomeEmailProps = {}) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to HackWeekend Samarahan 2024!</Preview>
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
            Welcome to HackWeekend Samarahan 2024!
          </Heading>
          <Text style={textStyle}>
            We are thrilled to have you join us for this exciting 3-day hackathon focused on AI for Education. Below, you will find key information about the event to help you prepare.
          </Text>
          
          <Section style={sectionStyle}>
            <Heading as="h2" style={{...headingStyle, fontSize: "20px", marginBottom: "16px"}}>
              Event Details
            </Heading>
            <Container style={eventDetailsStyle}>
              <Text style={detailItemStyle}>
                <strong>Location:</strong> Universiti Malaysia Sarawak (UNIMAS)
              </Text>
              <Text style={detailItemStyle}>
                <strong>Date:</strong> December 6 - December 8, 2024
              </Text>
              <Text style={{...detailItemStyle, marginBottom: "0"}}>
                <strong>Theme:</strong> AI for Education
              </Text>
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
              Visit our website for more information about HackWknd:
            </Text>
            <Button href="https://hackwknd.com" style={buttonStyle}>
              Visit the HackWknd Kota Samarahan
            </Button>
          </Section>

          <Section style={sectionStyle}>
            <Text style={textStyle}>
              Please fill in your participant details using the form below:
            </Text>
            <Button 
              href="https://forms.clickup.com/25542747/f/rbg2v-21396/T2RDOIQ4UICY88CYUR" 
              style={buttonStyle}
            >
              Fill Participant Details
            </Button>
          </Section>

          <Section style={sectionStyle}>
            <Text style={textStyle}>
              Access your participant kit containing important files and information:
            </Text>
            <Button 
              href="https://drive.google.com/drive/u/0/folders/1zLDBRDu-qNbpjGGwTYREnsWT_08lvmjx" 
              style={buttonStyle}
            >
              Access Participant Kit
            </Button>
          </Section>

          <Hr style={hrStyle} />
          
          <Text style={textStyle}>
            Thank you,
            <br />
            HackWknd Team
          </Text>

          <Img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hackwknd%20footer1-94eFkX6OZX4ZnsY4Y0pmHzpXcvxtsj.png"
            alt="HackWknd Partners and Collaborators"
            style={footerImageStyle}
          />
        </Container>
      </Body>
    </Html>
  );
}

