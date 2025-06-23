import { useRouteContext, createLazyFileRoute } from "@tanstack/react-router";
import NotesLayout from "@/components/notes-layout";
import { authQueries } from "@/lib/queries/auth";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { RouterAppContext } from "@/routes/__root";

export const Route = createLazyFileRoute("/_protected/notes")({
  component: RouteComponent,
  loader: ({ context }: { context: RouterAppContext }) =>
    context.queryClient.ensureQueryData(
      authQueries.hasPermission(context.auth?.data?.user.id),
    ),
});

function RouteComponent() {
  const auth = useRouteContext({
    from: "/_protected/notes",
    select: (opts) => opts.auth,
  });

  const { data } = useSuspenseQuery(
    authQueries.hasPermission(auth?.data?.user.id),
  );

  return <NotesLayout permissions={data?.data?.success} />;
}
