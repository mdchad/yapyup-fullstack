import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { EditIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { authQueries } from "@/lib/queries/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute(
  "/_protected/dashboard/org/$orgId/user/$userId",
)({
  component: RouteComponent,
  // loader: async ({ params, context }) => {
  //   const member = await authClient.organization.getActiveMember()
  //
  //   return member?.data?.user
  // },
});

function RouteComponent() {
  // const user = Route.useLoaderData()
  const { data, isLoading } = useQuery(authQueries.activeMember());

  async function handleSubmit(e: any) {
    e.preventDefault();
  }

  function handleChange() {}

  return (
    <div>
      <main className="flex-1 flex flex-col py-12 px-6">
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
          <h1 className="text-4xl font-medium">General details</h1>
        </div>
        <div className="flex flex-col gap-3 md:gap-6 mx-auto w-full max-w-full px-6 md:max-w-5xl">
          <Card className="w-full mb-10 shadow-xs">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={data?.data?.user.name || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="slug">Email</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        name="email"
                        value={data?.data?.user.email || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit">{"Update"}</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
