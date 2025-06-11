import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";
import { authQueries } from "@/lib/queries/auth";

export const Route = createFileRoute("/_auth/sign-in")({
  component: SignIn,
});

function SignIn() {
  const state = useRouterState();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <LoginForm redirect={state?.location?.search?.app_redirect} />
      </div>
    </div>
  );
}
