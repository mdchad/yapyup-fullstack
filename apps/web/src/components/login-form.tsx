import { useState, useRef, useMemo } from "react";
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
import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { CheckCircle, LoaderCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import useMeasure from "react-use-measure";

type LoginFormProps = {
  redirect?: string;
  className?: string;
  nextStep?: boolean;
  userInvitedEmail?: string;
  setCurrentStep?: (step: number) => void;
  children?: React.ReactNode;
};

export function LoginForm({
  className,
  redirect,
  nextStep,
  setCurrentStep,
  userInvitedEmail,
  ...props
}: LoginFormProps) {
  const queryClient = useRouteContext({
    from: "/_auth/sign-in",
    select: (context) => context.queryClient,
  });

  const [email, setEmail] = useState(userInvitedEmail ? userInvitedEmail : "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  // Height animation setup
  const [elementRef, bounds] = useMeasure();
  const previousHeightRef = useRef<number | null>(null);

  // Calculate animation duration based on height difference
  const animationDuration = useMemo(() => {
    const currentHeight = bounds.height;
    const previousHeight = previousHeightRef.current;
    const MIN_DURATION = 0.15;
    const MAX_DURATION = 0.27;

    if (!previousHeightRef.current) {
      previousHeightRef.current = currentHeight;
      return MIN_DURATION;
    }

    const heightDifference = Math.abs(currentHeight - previousHeight);
    previousHeightRef.current = currentHeight;

    const duration = Math.min(
      Math.max(heightDifference / 500, MIN_DURATION),
      MAX_DURATION,
    );

    return duration;
  }, [bounds.height]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { data, error } = await authClient.signIn.email(
      {
        /**
         * The user email
         */
        email,
        /**
         * The user password
         */
        password,
        /**
         * A URL to redirect to after the user verifies their email (optional)
         */
        // callbackURL: "/dashboard",
        /**
         * remember the user session after the browser is closed.
         * @default true
         */
        rememberMe: true,
      },
      {
        onRequest: (ctx) => {
          //show loading
          setIsLoading(true);
        },
        onSuccess: async (ctx) => {
          //redirect to the dashboard or sign in page
          if (nextStep && setCurrentStep) {
            setCurrentStep(2);
            return;
          }
          await queryClient.invalidateQueries({
            queryKey: ["organization", "activeMember"],
          });
          setIsSuccess(true);

          if (!redirect) {
            await navigate({
              to: "/",
            });
          }
          setIsLoading(false);
        },
        onError: (ctx) => {
          // display the error message
          setIsLoading(false);
          setError(
            "Login failed. Please check your credentials and try again.",
          );
        },
        //callbacks
      },
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-lg">
        <div className="px-6">
          <img src="/yapyup.svg" alt="logo" className="w-6 lg:w-7" />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">Sign in to your account</CardTitle>
          <CardDescription>Enter your email below</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            animate={{
              height: bounds.height,
              transition: {
                duration: animationDuration,
                ease: [0.25, 1, 0.5, 1],
              },
            }}
          >
            <div ref={elementRef}>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      autoComplete="current-password"
                      type="password"
                      required
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Alert
                          variant="destructive"
                          className="border-0 bg-red-200"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription className="text-xs">
                            {error}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Button
                    type="submit"
                    className="w-full bg-purple-500/70 hover:bg-purple-400/70 text-white font-bold cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoaderCircle className="mr-2 animate-spin" />
                    ) : isSuccess ? (
                      <CheckCircle className="mr-2" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </div>
                {!nextStep && (
                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a
                      href="/sign-up"
                      className="underline underline-offset-4 text-purple-500"
                    >
                      Sign up
                    </a>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
