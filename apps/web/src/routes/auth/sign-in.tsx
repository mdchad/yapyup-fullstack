import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouteContext,
  useRouterState,
} from "@tanstack/react-router";
import { LoginForm } from "@/components/login-form";
import Loader from "@/components/loader";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignIn,
  beforeLoad: (ctx) => {
    if (ctx?.context?.auth?.data?.user) {
      throw redirect({ to: "/" });
    }
  },
});

function SignIn() {
  const state = useRouterState();
  const { auth } = useRouteContext({
    from: "/auth/sign-in",
    select: (context) => ({
      auth: context.auth,
    }),
  });

  if (auth?.isPending) {
    return;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <LoginForm redirect={state?.location?.search?.app_redirect} />
      </div>
    </div>
  );
}
