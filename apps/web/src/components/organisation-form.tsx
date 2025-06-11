import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Users,
  Plus,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Better Auth client setup
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

// Create auth client with organization plugin
const OrganizationSignupFlow = () => {
  const [currentStep, setCurrentStep] = useState("welcome");
  const [invitationId, setInvitationId] = useState(null);
  const [invitationData, setInvitationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Better Auth hooks
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  // Organization creation form
  const [orgForm, setOrgForm] = useState({
    name: "",
    slug: "",
    logo: "",
  });
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  // Check for invitation on component mount
  useEffect(() => {
    // In real implementation, get invitation ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const inviteId = urlParams.get("invitation");

    if (inviteId) {
      setInvitationId(inviteId);
      loadInvitationData(inviteId);
    }
  }, []);

  // Redirect to login if not authenticated
  if (sessionPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  // if (!session) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Card>
  //         <CardHeader>
  //           <CardTitle>Please Sign In</CardTitle>
  //           <CardDescription>You need to be signed in to access this page</CardDescription>
  //         </CardHeader>
  //         <CardContent>
  //           <Button onClick={() => window.location.href = '/sign-in'} className="w-full">
  //             Go to Sign In
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  const loadInvitationData = async (inviteId) => {
    try {
      setLoading(true);
      const invitation = await authClient.organization.getInvitation({
        invitationId: inviteId,
      });
      setInvitationData(invitation);
      setCurrentStep("invitation-review");
    } catch (err) {
      setError("Invalid or expired invitation");
      setCurrentStep("welcome");
    } finally {
      setLoading(false);
    }
  };

  const checkSlugAvailability = async (slug) => {
    if (!slug || slug.length < 3) return;

    setCheckingSlug(true);
    try {
      const available = await authClient.organization.checkSlug({ slug });
      setSlugAvailable(available);
    } catch (err) {
      setSlugAvailable(false);
    } finally {
      setCheckingSlug(false);
    }
  };

  const handleSlugChange = (value) => {
    const slug = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setOrgForm((prev) => ({ ...prev, slug }));

    // Debounce slug checking
    const timeoutId = setTimeout(() => checkSlugAvailability(slug), 500);
    return () => clearTimeout(timeoutId);
  };

  const handleCreateOrganization = async () => {
    if (!orgForm.name || !orgForm.slug || slugAvailable === false) return;

    setLoading(true);
    setError("");

    try {
      const { data: organization, error } =
        await authClient.organization.create({
          name: orgForm.name,
          slug: orgForm.slug,
          logo: "",
        });

      if (error?.code) {
        throw new Error(error.statusText);
      }

      // Set as active organization
      await authClient.organization.setActive({
        organizationId: organization.id,
      });

      setCurrentStep("success");
    } catch (err) {
      toast.error("Failed to create organization. Please try again.", {});
      setError(
        err.message || "Failed to create organization. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await authClient.organization.acceptInvitation({
        invitationId: invitationId,
      });

      // Set the organization as active
      await authClient.organization.setActive({
        organizationId: result.organizationId,
      });

      setCurrentStep("invitation-success");
    } catch (err) {
      setError(err.message || "Failed to accept invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (name) => {
    setOrgForm((prev) => ({
      ...prev,
      name,
      slug:
        prev.slug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, ""),
    }));
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Welcome Step */}
        {currentStep === "welcome" && (
          <Card>
            <CardHeader className="text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <CardTitle>Welcome to Our Platform!</CardTitle>
              <CardDescription>
                {organizations && organizations.length > 0
                  ? `You're already a member of ${organizations.length} organization(s). Create a new one or manage existing ones.`
                  : "Get started by creating your organization or joining an existing one"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setCurrentStep("create-org")}
                className="w-full"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Organization
              </Button>

              {organizations && organizations.length > 0 && (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => (window.location.href = "/dashboard")}
                    className="w-full"
                    size="lg"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Go to My Organizations
                  </Button>
                </>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentStep("join-org")}
                className="w-full"
                size="lg"
              >
                <Users className="h-4 w-4 mr-2" />
                Join with Invitation
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Organization Step */}
        {currentStep === "create-org" && (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Organization</CardTitle>
              <CardDescription>
                Set up your workspace and start collaborating
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="org-name">Organization Name</Label>
                <Input
                  id="org-name"
                  placeholder="Acme Corporation"
                  value={orgForm.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-slug">Organization Slug</Label>
                <div className="relative">
                  <Input
                    id="org-slug"
                    placeholder="acme-corp"
                    value={orgForm.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                  />
                  {checkingSlug && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin" />
                  )}
                  {slugAvailable === true && (
                    <Check className="absolute right-3 top-3 h-4 w-4 text-green-600" />
                  )}
                  {slugAvailable === false && (
                    <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-600" />
                  )}
                </div>
                {orgForm.slug && (
                  <p className="text-xs text-muted-foreground">
                    Your organization URL: yourapp.com/{orgForm.slug}
                  </p>
                )}
                {slugAvailable === false && (
                  <p className="text-xs text-red-600">
                    This slug is already taken
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-logo">Logo URL (Optional)</Label>
                <Input
                  id="org-logo"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={orgForm.logo}
                  onChange={(e) =>
                    setOrgForm((prev) => ({ ...prev, logo: e.target.value }))
                  }
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("welcome")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreateOrganization}
                  disabled={!orgForm.name || !orgForm.slug}
                  className="flex-1"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Create Organization
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Join Organization Step */}
        {currentStep === "join-org" && (
          <Card>
            <CardHeader>
              <CardTitle>Join Organization</CardTitle>
              <CardDescription>
                Enter your invitation details or contact your team admin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You need an invitation link from your organization admin to
                  join. Check your email or contact your team administrator.
                </AlertDescription>
              </Alert>

              <Button
                variant="outline"
                onClick={() => setCurrentStep("welcome")}
                className="w-full"
              >
                Back to Options
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Invitation Review Step */}
        {currentStep === "invitation-review" && invitationData && (
          <Card>
            <CardHeader>
              <CardTitle>Organization Invitation</CardTitle>
              <CardDescription>
                You've been invited to join an organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Organization:</span>
                  <span>{invitationData.organizationName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Invited by:</span>
                  <span>{invitationData.inviterName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Role:</span>
                  <Badge variant="secondary">{invitationData.role}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Email:</span>
                  <span className="text-sm text-muted-foreground">
                    {invitationData.email}
                  </span>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleAcceptInvitation}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Accept Invitation
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success Steps */}
        {currentStep === "success" && (
          <Card>
            <CardHeader className="text-center">
              <Check className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle>Organization Created!</CardTitle>
              <CardDescription>
                Your organization "{orgForm.name}" has been successfully created
                and set as your active workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeOrganization && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Active Organization:
                  </p>
                  <p className="font-medium">{activeOrganization.name}</p>
                </div>
              )}
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="w-full"
                size="lg"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === "invitation-success" && (
          <Card>
            <CardHeader className="text-center">
              <Check className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <CardTitle>
                Welcome to {invitationData?.organizationName}!
              </CardTitle>
              <CardDescription>
                You've successfully joined the organization and it's now your
                active workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeOrganization && (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Active Organization:
                  </p>
                  <p className="font-medium">{activeOrganization.name}</p>
                  <Badge variant="outline" className="mt-1">
                    {invitationData?.role}
                  </Badge>
                </div>
              )}
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="w-full"
                size="lg"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrganizationSignupFlow;
