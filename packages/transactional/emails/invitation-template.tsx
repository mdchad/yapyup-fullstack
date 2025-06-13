import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VercelInviteUserEmailProps {
  username?: string;
  userImage?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
  inviteFromIp?: string;
  inviteFromLocation?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

const InviteUserEmail = ({
  invitedByUsername,
  invitedByEmail,
  teamName,
  inviteLink,
}: VercelInviteUserEmailProps) => {
  // Ensure all props are strings to avoid React child errors
  const safeInvitedByUsername = String(invitedByUsername || "");
  const safeInvitedByEmail = String(invitedByEmail || "");
  const safeTeamName = String(teamName || "");
  const safeInviteLink = String(inviteLink || "");

  const previewText = `Join ${safeInvitedByUsername} on Yapyup`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] border-solid p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              Join <strong>{safeTeamName}</strong> on <strong>Yapyup</strong>
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Hello,
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              <strong>{safeInvitedByUsername}</strong> (
              <Link
                href={`mailto:${safeInvitedByEmail}`}
                className="text-blue-600 no-underline"
              >
                {safeInvitedByEmail}
              </Link>
              ) has invited you to the <strong>{safeTeamName}</strong> team on{" "}
              <strong>Yapyup</strong>.
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-5 py-3 text-center font-semibold text-[12px] text-white no-underline"
                href={safeInviteLink}
              >
                Join the team
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              or copy and paste this URL into your browser:{" "}
              <Link
                href={safeInviteLink}
                className="text-blue-600 no-underline"
              >
                {safeInviteLink}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

InviteUserEmail.PreviewProps = {
  username: "alanturing",
  invitedByUsername: "Alan",
  invitedByEmail: "alan.turing@example.com",
  teamName: "Enigma",
  inviteLink: "https://vercel.com",
  inviteFromIp: "204.13.186.218",
  inviteFromLocation: "São Paulo, Brazil",
} as VercelInviteUserEmailProps;

export default InviteUserEmail;
