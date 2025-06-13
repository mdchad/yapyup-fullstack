import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const SimpleTestEmail = () => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform!</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto my-10 max-w-md rounded-lg border border-gray-200 p-6">
            <Section className="text-center">
              <Heading className="text-2xl font-bold text-gray-900 mb-4">
                Welcome!
              </Heading>

              <Text className="text-gray-700 mb-4">
                Thanks for joining us. We're excited to have you on board.
              </Text>

              <Text className="text-gray-700 mb-6">
                Click the button below to get started with your new account.
              </Text>

              <Button
                href="https://example.com/get-started"
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium no-underline"
              >
                Get Started
              </Button>

              <Text className="text-sm text-gray-500 mt-6">
                If you have any questions, feel free to reach out to our support
                team.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default SimpleTestEmail;
