import {
  createFileRoute,
  useNavigate,
  useParams,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { authClient } from "@/lib/auth-client";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@repo/ui/stepper";
import { useState } from "react";
import { z } from "zod";
import { SignUpForm } from "@/components/sign-up-form";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

// const steps = [
//   {
//     step: 1,
//     title: "Sign Up",
//   },
//   {
//     step: 2,
//     title: "Accept Invitation",
//   },
// ];

const StepEnum = z.enum(["signup", "login"]);

export const Route = createFileRoute("/_auth/accept-invitation/$invitationId")({
  validateSearch: z.object({
    step: StepEnum,
    email: z.string().optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const { step, email } = useSearch({
    from: "/_auth/accept-invitation/$invitationId",
  });

  const invitationId = useParams({
    from: "/_auth/accept-invitation/$invitationId",
    select: (params) => params.invitationId,
  });

  const auth = useRouteContext({
    from: "/_auth/accept-invitation/$invitationId",
    select: (context) => context.auth,
  });

  const handleAcceptInvitation = async () => {
    await authClient.organization.acceptInvitation(
      {
        invitationId,
      },
      {
        onRequest: (ctx) => {
          //show loading
          setIsLoading(true);
        },
        onSuccess: async (ctx) => {
          //redirect to the dashboard or sign in page
          setIsSuccess(true);

          navigate({ to: "/" });
          setIsLoading(false);
        },
        onError: (ctx) => {
          // display the error message
          setIsLoading(false);
          toast.error("Error accepting invitation. Please try again.", {});
        },
        //callbacks
      },
    );
  };

  const steps = [
    {
      step: 1,
      title: step === "signup" ? "Sign Up" : "Login",
    },
    {
      step: 2,
      title: "Accept Invitation",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg p-6">
        {!auth?.data?.user && (
          <Stepper
            value={currentStep}
            onValueChange={setCurrentStep}
            className="mb-8 rounded-lg bg-white p-4 shadow-lg"
          >
            {steps.map(({ step, title }) => (
              <StepperItem
                key={step}
                step={step}
                className="not-last:flex-1 max-md:items-start"
              >
                <div className="flex items-center gap-2 rounded max-md:flex-col">
                  <StepperIndicator />
                  <div className="text-center md:text-left">
                    <StepperTitle>{title}</StepperTitle>
                  </div>
                </div>
                {step < steps.length && (
                  <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
                )}
              </StepperItem>
            ))}
          </Stepper>
        )}
        {currentStep === 1 ? (
          step === "signup" ? (
            <SignUpForm
              nextStep={true}
              userInvitedEmail={email}
              setCurrentStep={setCurrentStep}
            />
          ) : (
            <LoginForm nextStep={true} userInvitedEmail={email} />
          )
        ) : (
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Accept Invitation</CardTitle>
                <CardDescription>You've been invited to join</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  You've received an invitation to join our team. Click the
                  button below to accept the invitation and create your account.
                </p>
                {isLoading ? (
                  <LoaderCircle className="mr-2 animate-spin" />
                ) : (
                  <Button onClick={handleAcceptInvitation} className="w-full">
                    Accept Invitation
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
