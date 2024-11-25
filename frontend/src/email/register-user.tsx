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
import { Tailwind } from "@react-email/tailwind";

export default function WelcomeEmail() {
  return (
    <Html>
      <Head />
      <Preview>Welcome to HackWeekend Samarahan 2024!</Preview>
      <Tailwind>
        <Body className="bg-gray-800 my-auto mx-auto font-sans">
          <Container className="p-8 rounded mx-auto w-full">
            <Img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HackWknd%20SDEC-FhvMazb5pixYTNJCNvRyjVrcaqSVg4.png"
              width="240"
              height="120"
              alt="HackWknd Logo"
              className="mx-auto my-8"
            />
            <Heading className="text-white text-2xl font-bold my-4">
              Welcome to HackWeekend Samarahan 2024!
            </Heading>
            <Text className="text-gray-200 text-base">
              We are thrilled to have you join us for this exciting 3-day hackathon focused on AI for Education. Below, you will find key information about the event to help you prepare.
            </Text>
            
            <Section className="mt-8">
              <Heading className="text-white text-xl font-semibold mb-4">
                Event Details
              </Heading>
              <Container className="bg-gray-700 p-6 rounded-lg">
                <Text className="text-gray-200 mb-2 p-2">
                  <strong>Location:</strong> Universiti Malaysia Sarawak (UNIMAS)
                </Text>
                <Text className="text-gray-200 mb-2 p-2">
                  <strong>Date:</strong> December 6 - December 8, 2024
                </Text>
                <Text className="text-gray-200 p-2">
                  <strong>Theme:</strong> AI for Education
                </Text>
              </Container>
            </Section>

            <Section className="mt-8">
              <Text className="text-gray-200">
                Go to the website to see more on the info about this hackwknd
              </Text>
              <Button
                className="bg-[#c5ff00] text-gray-900 px-6 py-3 rounded-md font-semibold mt-4 text-center"
                href="https://hackwknd.sarawak.digital/hackathon/hackwknd-kota-samarahan"
              >
                Visit the HackWknd Kota Samarahan
              </Button>
            </Section>

            <Hr className="border-gray-600 my-8" />
            
            <Text className="text-gray-200">
              Thank you,
              <br />
              HackWknd Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}