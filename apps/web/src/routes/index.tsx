import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@repo/ui/header";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const session = authClient.useSession();

  const healthCheckQuery = useQuery(trpc.healthCheck.queryOptions());
  const privateDataQuery = useQuery(trpc.privateData.queryOptions());

  return (
    <>
      <Header isAuthenticated={session.data} />
      <div className="p-2">
        <h3>Welcome Home!</h3>
        <Link to="/dashboard">Go to Dashboard</Link>
        <p>healthCheck: {healthCheckQuery.data}</p>
        <p>privateData: {privateDataQuery.data?.message}</p>
        {/*<SignUp />*/}
      </div>
    </>
  );
}
