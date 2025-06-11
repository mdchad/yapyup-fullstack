import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { type MouseEventHandler, useState, useRef, useMemo } from "react";
import { toast } from "sonner";
import { CheckCircle2Icon, LoaderCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import useMeasure from "react-use-measure";
import { useRouteContext } from "@tanstack/react-router";

export function InvitationDialog({ id }: { id?: string }) {
  const queryClient = useRouteContext({
    select: (context) => context.queryClient,
  });

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Height animation setup
  const [elementRef, bounds] = useMeasure();
  const previousHeightRef = useRef<number>();

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await authClient.organization.inviteMember(
      {
        email: email,
        role: "admin",
      },
      {
        onRequest: (ctx) => {
          setIsLoading(true);
        },
        onSuccess: async (ctx) => {
          setIsLoading(false);
          setIsSuccess(true);
          await queryClient.invalidateQueries({
            queryKey: ["organization", id, "full"],
          });
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error("Failed to invite member. Please try again.", {});
        },
      },
    );
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setIsSuccess(false);
      setIsLoading(false);
      setEmail("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Invite</Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden sm:max-w-[425px]">
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
            <DialogHeader>
              <DialogTitle>Invite</DialogTitle>
              <DialogDescription>
                Invite members to your organisation
              </DialogDescription>
            </DialogHeader>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                // <motion.div
                //   key="form"
                //   initial={{ opacity: 0, y: 10 }}
                //   animate={{ opacity: 1, y: 0 }}
                //   // exit={{ opacity: 0, y: -10 }}
                //   transition={{ duration: 0.2 }}
                //   className="grid gap-4"
                // >
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Email</Label>
                  <Input
                    id="name-1"
                    name="email"
                    placeholder="john@test.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              ) : (
                // </motion.div>
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="py-4"
                >
                  <Alert>
                    <CheckCircle2Icon className="h-4 w-4" />
                    <AlertTitle>Success! Invitation sent</AlertTitle>
                    <AlertDescription>
                      We've sent an invitation to {email}. They'll receive an
                      email with instructions to join your organization.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">
                  {isSuccess ? "Done" : "Cancel"}
                </Button>
              </DialogClose>
              {!isSuccess && (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading || !email.trim()}
                >
                  {isLoading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send"
                  )}
                </Button>
              )}
            </DialogFooter>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
