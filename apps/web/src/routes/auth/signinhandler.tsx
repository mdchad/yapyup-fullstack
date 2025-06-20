import {
  createFileRoute,
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import OrganisationForm from "@/components/organisation-form";

export const Route = createFileRoute("/auth/signinhandler")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: SignInHandler,
});

function SignInHandler() {
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<
    "loading" | "create-org" | "invitations" | "redirecting"
  >("loading");
  const [orgName, setOrgName] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [invitations, setInvitations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { redirect } = useSearch({
    from: "/auth/signinhandler",
  });

  const { auth, trpc } = useRouteContext({
    from: "/auth/signinhandler",
    select: (context) => context,
  });

  useEffect(() => {
    if (!auth?.isPending && !auth?.data?.user) {
      // User is not authenticated, redirect to sign in
      navigate({ to: "/auth/sign-in" });
      return;
    }

    handlePostAuthFlow();
  }, [auth?.data?.user, auth?.isPending]);

  const handlePostAuthFlow = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Check if user has any organization invitations
      const userInvitations = await checkUserInvitations();

      if (userInvitations.length > 0) {
        setInvitations(userInvitations);
        setStep("invitations");
        return;
      }

      // Step 2: Check if user is part of any organizations
      const userMemberships = await checkUserMemberships();

      if (userMemberships.length > 0) {
        // User has memberships, set the last active org and redirect
        await setActiveOrganization(userMemberships[0]);
        setStep("redirecting");
        redirectToDestination();
        return;
      }

      // Step 3: User has no invitations and no memberships - prompt for org creation
      setStep("create-org");
    } catch (error) {
      console.error("Error in post-auth flow:", error);
      setError(
        "An error occurred while setting up your account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserInvitations = async () => {
    try {
      // Get all invitations for the user's email
      const userEmail = auth?.data?.user?.email;
      if (!userEmail) return [];

      // Use direct fetch to avoid tRPC typing issues
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/trpc/getUserInvitations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            json: { email: userEmail },
          }),
        },
      );

      if (response.ok) {
        const result = await response.json();
        return result.result?.data || [];
      }

      return [];
    } catch (error) {
      console.error("Error checking invitations:", error);
      return [];
    }
  };

  const checkUserMemberships = async () => {
    try {
      const result = await authClient.organization.list();

      // Handle the result properly based on better-auth return type
      if ("data" in result && Array.isArray(result.data)) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error("Error checking memberships:", error);
      return [];
    }
  };

  const setActiveOrganization = async (organization: any) => {
    try {
      await authClient.organization.setActive({
        organizationId: organization.id,
      });
    } catch (error) {
      console.error("Error setting active organization:", error);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      setIsLoading(true);

      await authClient.organization.acceptInvitation({
        invitationId,
      });

      // Get the updated memberships after accepting invitation
      const updatedMemberships = await checkUserMemberships();

      if (updatedMemberships.length > 0) {
        await setActiveOrganization(updatedMemberships[0]);
        setStep("redirecting");
        redirectToDestination();
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to accept invitation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrganization = async () => {
    if (!orgName || !orgSlug) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);

      const result = await authClient.organization.create({
        name: orgName,
        slug: orgSlug,
        logo: "",
      });

      // Handle the result properly
      if ("data" in result && result.data) {
        // Set as active organization
        await authClient.organization.setActive({
          organizationId: result.data.id,
        });
      }

      setStep("redirecting");
      redirectToDestination();
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Failed to create organization. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToDestination = () => {
    const destination = redirect || "/";
    navigate({ to: destination as any });
  };

  if (isLoading && step === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <LoaderCircle className="h-8 w-8 animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">
              Setting up your account...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate({ to: "/auth/sign-in" })}
              className="w-full"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "invitations") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>You have invitations!</CardTitle>
            <CardDescription>
              You've been invited to join organizations. Choose one to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{invitation.organizationName}</p>
                  <p className="text-sm text-muted-foreground">
                    Invited by {invitation.inviterName}
                  </p>
                </div>
                <Button
                  onClick={() => handleAcceptInvitation(invitation.id)}
                  disabled={isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    "Accept"
                  )}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "create-org") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-6">
          <OrganisationForm />
        </div>
        {/*<Card className="w-full max-w-md">*/}
        {/*  <CardHeader>*/}
        {/*    <CardTitle>Create Your Organization</CardTitle>*/}
        {/*    <CardDescription>*/}
        {/*      Welcome! Let's set up your first organization to get started.*/}
        {/*    </CardDescription>*/}
        {/*  </CardHeader>*/}
        {/*  <CardContent className="space-y-4">*/}
        {/*    <div className="space-y-2">*/}
        {/*      <Label htmlFor="org-name">Organization Name</Label>*/}
        {/*      <Input*/}
        {/*        id="org-name"*/}
        {/*        placeholder="My Organization"*/}
        {/*        value={orgName}*/}
        {/*        onChange={(e) => setOrgName(e.target.value)}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <div className="space-y-2">*/}
        {/*      <Label htmlFor="org-slug">Organization Slug</Label>*/}
        {/*      <Input*/}
        {/*        id="org-slug"*/}
        {/*        placeholder="my-organization"*/}
        {/*        value={orgSlug}*/}
        {/*        onChange={(e) => handleSlugChange(e.target.value)}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*    <Button*/}
        {/*      onClick={handleCreateOrganization}*/}
        {/*      disabled={!orgName || !orgSlug || isLoading}*/}
        {/*      className="w-full"*/}
        {/*    >*/}
        {/*      {isLoading ? (*/}
        {/*        <LoaderCircle className="h-4 w-4 animate-spin mr-2" />*/}
        {/*      ) : null}*/}
        {/*      Create Organization*/}
        {/*    </Button>*/}
        {/*  </CardContent>*/}
        {/*</Card>*/}
      </div>
    );
  }

  if (step === "redirecting") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <LoaderCircle className="h-8 w-8 animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
