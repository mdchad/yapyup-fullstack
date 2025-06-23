import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_protected/org/$orgId/billing")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_protected/org/$orgId/billing"!</div>;
}
