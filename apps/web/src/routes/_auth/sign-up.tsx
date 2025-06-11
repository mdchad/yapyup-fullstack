import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "@/components/sign-up-form";

export const Route = createFileRoute("/_auth/sign-up")({
  component: SignUp,
});

function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <SignUpForm />
      </div>
    </div>
  );
}
