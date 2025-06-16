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
            navigate({ to: "/create-organisation" });
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
          <CardHeader>
            <CardTitle className="text-2xl">Sign up</CardTitle>
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
                <hr />
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
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating an account..." : "Sign up"}
                </Button>
              </div>
              {!nextStep && (
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="underline underline-offset-4">
                    Login
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
