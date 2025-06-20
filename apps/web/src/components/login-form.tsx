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
import { Separator } from "@repo/ui/separator";
import { router } from "@/main";

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
    from: "/auth/sign-in",
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

    const heightDifference = Math.abs(currentHeight - (previousHeight ?? 0));
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

          router.invalidate();
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

  const handleGoogleSignIn = async () => {
    setError(null);

    try {
      await authClient.signIn.social(
        {
          provider: "google",
          callbackURL:
            import.meta.env.VITE_CLIENT_URL +
            "/auth/signinhandler" +
            (redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""),
        },
        {
          onSuccess: async (ctx) => {
            await queryClient.invalidateQueries({
              queryKey: ["organization", "activeMember"],
            });
            setIsSuccess(true);
          },
          onError: (ctx) => {
            setError("Google sign in failed. Please try again.");
          },
        },
      );
    } catch (error) {
      setError("Google authentication failed. Please try again.");
    }
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
                    className="w-full bg-[#b381b2]/90 hover:bg-[#c8a2c8] text-[white] cursor-pointer"
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

                {/* Google Sign In Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 hover:bg-gray-50 cursor-pointer"
                  onClick={handleGoogleSignIn}
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
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/auth/sign-up"
                      className="underline underline-offset-4 text-purple-500"
                    >
                      Sign up
                    </Link>
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
