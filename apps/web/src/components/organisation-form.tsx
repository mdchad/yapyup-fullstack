import React, { useState } from "react";
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
import { Alert, AlertDescription } from "@repo/ui/alert";
import { Separator } from "@repo/ui/separator";
import { Users, Plus, Check, AlertCircle, Loader2 } from "lucide-react";

// Better Auth client setup
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import slugify from "slugify";
import { useDebounce } from "@/hooks/use-debounce";

// Create auth client with organization plugin
const OrganizationSignupFlow = () => {
  const [currentStep, setCurrentStep] = useState("welcome");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Better Auth hooks
  const { isPending: sessionPending } = authClient.useSession();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  // Organization creation form
  const [orgForm, setOrgForm] = useState({
    name: "",
    slug: "",
    logo: "",
  });

  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

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

  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 3) return;

    setCheckingSlug(true);
    setSlugAvailable(null);
    try {
      const response = await authClient.organization.checkSlug({ slug });
      if (response?.error?.status) {
        setSlugAvailable(false);
      } else {
        setSlugAvailable(true);
      }
    } catch (err) {
      setSlugAvailable(false);
    } finally {
      setCheckingSlug(false);
    }
  };

  const debouncedClickHandler = useDebounce((ev) => {
    checkSlugAvailability(ev);
  }, 500);

  const handleSlugChange = (value: string) => {
    const slug = slugify(value);
    setOrgForm((prev) => ({ ...prev, slug }));

    debouncedClickHandler(value);
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
        organizationId: organization?.id,
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

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    debouncedClickHandler(name);

    setOrgForm((prev) => ({
      ...prev,
      name,
      slug: slugify(name),
    }));
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Welcome Step */}
        {currentStep === "welcome" && (
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
              <div className="pb-6">
                <img src="/yapyup.svg" alt="logo" className="w-6 lg:w-10" />
              </div>
              <CardTitle>Welcome to Our Platform!</CardTitle>
              <CardDescription>
                Get started by creating your organization or joining an existing
                one
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
                  ) : (
                    "Create Organization"
                  )}
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
                onClick={() => {
                  navigate({
                    to: "/",
                  });
                }}
                className="w-full bg-purple-500/70 hover:bg-purple-400/70 text-white font-bold cursor-pointer"
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
