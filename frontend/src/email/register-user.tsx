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

export default function WelcomeEmail() {
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
            <Text style={textStyle}>
              Go to the website to see more on the info about this hackwknd
            </Text>
            <Button href="https://hackwknd.com" style={buttonStyle}>
              Visit the HackWknd Kota Samarahan
            </Button>
          </Section>

          <Hr style={hrStyle} />
          
          <Text style={textStyle}>
            Thank you,
            <br />
            HackWknd Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

