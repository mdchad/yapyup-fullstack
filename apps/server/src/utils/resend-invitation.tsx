import InviteUserEmail from "@repo/emails/invitation-template";

function resendInvitation(data: any, inviteLink: string) {
  return {
    from: "YapYup <onboarding@notifications.yapyup.com>", // You could add your custom domain
    to: "delivered@resend.dev", // email of the user to want to end
    subject: "Invitation to Yapyup", // Main subject of the email
    react: (
      <InviteUserEmail
        teamName={data.organization.name}
        invitedByUsername={data.inviter.user.name}
        invitedByEmail={data.inviter.user.email}
        inviteLink={inviteLink}
      />
    ), // Content of the email
    // you could also use "React:" option for sending the email template and there content to user
  };
}

export default resendInvitation;
