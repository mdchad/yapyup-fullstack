import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { authClient } from "@/lib/auth-client";
import { Link, redirect, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Separator } from "@repo/ui/separator";

type SignUpFormProps = {
  className?: string;
  nextStep?: boolean;
  userInvitedEmail?: string;
  setCurrentStep?: (step: number) => void;
  children?: React.ReactNode;
};

export function SignUpForm({
  className,
  nextStep,
  userInvitedEmail,
  setCurrentStep,
  ...props
}: SignUpFormProps) {
  const [email, setEmail] = useState(userInvitedEmail ? userInvitedEmail : "");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await authClient.signUp.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
        name: name, // user display name
        // image, // User image URL (optional)
        // callbackURL: "/dashboard", // A URL to redirect to after the user verifies their email (optional)
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
          //show loading
        },
        onSuccess: (ctx) => {
          setIsLoading(false);
          //redirect to the dashboard or sign in page
          // redirect('/dashboard')
          if (nextStep && setCurrentStep) {
            setCurrentStep(2);
          } else {
            navigate({ to: "/auth/create-organisation" });
          }
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message, {});
          // display the error message
          // alert(ctx.error.message);
        },
      },
    );
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await authClient.signIn.social(
        {
          provider: "google",
          callbackURL:
            import.meta.env.VITE_CLIENT_URL +
            "/auth/signinhandler" +
            (nextStep ? "" : "?redirect=/create-organisation"),
        },
        {
          onSuccess: async (ctx) => {
            if (nextStep && setCurrentStep) {
              setCurrentStep(2);
              return;
            }
            setSuccess(true);
            setIsLoading(false);
            navigate({ to: "/auth/create-organisation" });
          },
          onError: (ctx) => {
            setIsLoading(false);
            setError("Google sign up failed. Please try again.");
          },
        },
      );
    } catch (error) {
      setIsLoading(false);
      setError("Google authentication failed. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-2xl">
              Thank you for signing up!
            </CardTitle>
            <CardDescription>Check your email to confirm</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You've successfully signed up. Please check your email to confirm
              your account before signing in.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg border-0">
          <div className="px-6">
            <img src="/yapyup.svg" alt="logo" className="w-6 lg:w-7" />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl">
              Sign up for a new account
            </CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John"
                    required
                    autoComplete="username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className="disabled:bg-gray-200"
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    disabled={nextStep}
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {/*<div className="grid gap-2">*/}
                {/*  <Label htmlFor="workspace-name">Organisation Name</Label>*/}
                {/*  <Input*/}
                {/*    id="workspace-name"*/}
                {/*    type="text"*/}
                {/*    placeholder="Your workspace name"*/}
                {/*    required*/}
                {/*    value={organisation}*/}
                {/*    onChange={(e) => setOrganisation(e.target.value)}*/}
                {/*  />*/}
                {/*</div>*/}
                <Button
                  type="submit"
                  className="w-full bg-purple-500/70 hover:bg-purple-400/70 text-white font-bold cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </div>
                  ) : success ? (
                    "Account created!"
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign Up Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50 cursor-pointer"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <svg
                  className="mr-2 h-4 w-4"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>

              {!nextStep && (
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/auth/sign-in"
                    className="underline underline-offset-4 text-purple-500"
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
