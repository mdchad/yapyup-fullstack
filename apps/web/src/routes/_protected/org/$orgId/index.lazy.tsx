import {
  Link,
  useParams,
  useRouteContext,
  createLazyFileRoute,
} from "@tanstack/react-router";
import { EditIcon, Ellipsis, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Label } from "@repo/ui/label";
import { Skeleton } from "@repo/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { InvitationDialog } from "@/components/invitation-dialog";
import { LogoutIcon, type LogoutIconHandle } from "@repo/ui/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/_protected/org/$orgId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { queryClient, organization } = useRouteContext({
    from: "/_protected/org/$orgId/",
    select: (context) => context,
  });

  const params = useParams({ from: "/_protected/org/$orgId/" });

  const [org, setOrg] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const logoutRef = useRef<LogoutIconHandle | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrg({ ...org, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  async function cancelInvitation(e: any, invitationId: string) {
    const cancelInvitation = authClient.organization.cancelInvitation({
      invitationId,
    });

    toast.promise(cancelInvitation, {
      style: {
        background: "white",
      },
      loading: "Loading...",
      success: (data: { name: string }) => {
        queryClient.invalidateQueries({
          queryKey: ["organization", params.orgId, "full"],
        });
        return `Invitation cancelled for ${data.data.email}`;
      },
      error: "Error",
    });
  }

  return (
    <div className="min-h-screen">
      {/* Tab Navigation */}
      <main className="py-10">
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
          <h1 className="text-4xl font-medium">Settings</h1>
        </div>
        <div className="mx-auto flex w-full max-w-full flex-col gap-3 px-6 md:max-w-5xl md:gap-6">
          <div className="flex gap-8 pt-8 pb-2 text-sm font-medium">
            <Link
              to="/org/$orgId"
              params={{ orgId: params.orgId }}
              className="px-2 py-1 text-gray-600 hover:text-black"
            >
              Usage
            </Link>
            <Link
              to="/org/$orgId"
              params={{ orgId: params.orgId }}
              className="px-2 py-1 text-gray-600 hover:text-black"
            >
              Billing
            </Link>
            <span className="rounded bg-gray-100 px-2 py-1 text-black">
              Team
            </span>
            <Link
              to="/org/$orgId"
              params={{ orgId: params.orgId }}
              className="px-2 py-1 text-gray-600 hover:text-black"
            >
              SMTP
            </Link>
            <Link
              to="/org/$orgId"
              params={{ orgId: params.orgId }}
              className="px-2 py-1 text-gray-600 hover:text-black"
            >
              Integrations
            </Link>
            <Link
              to="/org/$orgId"
              params={{ orgId: params.orgId }}
              className="px-2 py-1 text-gray-600 hover:text-black"
            >
              Documents
            </Link>
          </div>
          {/* Overview Card */}
          <Card className="mb-10 w-full shadow-xs">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-6 flex items-center gap-6">
                  {/* Avatar */}
                  {organization?.data?.logo ? (
                    <img
                      src={organization?.data?.logo}
                      alt="Logo"
                      className="h-16 w-16 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-700 to-purple-400 text-3xl font-bold text-white">
                      {organization?.data?.name?.[0]?.toUpperCase() || "I"}
                    </div>
                  )}
                  <Button type="button" variant="outline" className="h-9">
                    Update Image
                  </Button>
                </div>
                <div className="mb-4">
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={organization?.data?.name || ""}
                    onChange={handleChange}
                    required
                    className="mt-2 capitalize"
                  />
                </div>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
                {error && <div className="text-sm text-red-500">{error}</div>}
                {success && (
                  <div className="text-sm text-green-600">Saved!</div>
                )}
              </form>
            </CardContent>
          </Card>
          {/* Members Card */}
          <Card className="mb-10 w-full shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Members</CardTitle>
              <InvitationDialog id={params.orgId} />
              <Button className="ml-auto" variant="default">
                Invite
              </Button>
            </CardHeader>
            <CardContent>
              {organization?.isPending && !organization?.data ? (
                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <div className="flex space-x-8" key={i}>
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-6 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="py-2 text-left">Email</th>
                      <th className="py-2 text-left">Role</th>
                      <th className="py-2 text-left">Enabled MFA</th>
                      <th className="py-2 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {organization?.data?.members.map((member) => (
                      <tr key={member.id}>
                        <td className="py-2">{member.user.email}</td>
                        <td className="py-2">
                          <div className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium capitalize">
                            {member.role ? member.role : "—"}
                          </div>
                        </td>
                        <td className="py-2">{"-"}</td>
                        <td className="py-2 text-right">
                          <Link
                            to="/org/$orgId/user/$userId"
                            params={{
                              orgId: params.orgId,
                              userId: member.id,
                            }}
                          >
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 cursor-pointer"
                            >
                              <EditIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
          {/* Invitations Card */}
          <Card className="w-full shadow-xs">
            <CardHeader>
              <CardTitle>Invitations</CardTitle>
            </CardHeader>
            <CardContent>
              {organization?.isPending && !organization?.data ? (
                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <div className="flex space-x-8" key={i}>
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-6 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="py-2 text-left">Email</th>
                      <th className="py-2 text-left">Role</th>
                      <th className="py-2 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {organization?.data?.invitations?.map((invitee) => {
                      if (invitee.status === "pending") {
                        return (
                          <tr key={invitee.id} className="">
                            <td className="py-2">{invitee.email}</td>
                            <td className="py-2">
                              <div className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium capitalize">
                                {invitee.role ? invitee.role : "—"}
                              </div>
                            </td>
                            <td className="py-2 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 cursor-pointer"
                                  >
                                    <Ellipsis color="gray" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-full rounded-xl p-1">
                                  <Button
                                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-white p-2 text-[14px] text-red-400 shadow-none hover:bg-red-200/60"
                                    onMouseEnter={() =>
                                      logoutRef.current?.startAnimation()
                                    }
                                    onMouseLeave={() =>
                                      logoutRef.current?.stopAnimation()
                                    }
                                    onClick={(e) =>
                                      cancelInvitation(e, invitee.id)
                                    }
                                  >
                                    <LogoutIcon size={16} ref={logoutRef} />
                                    <p>Cancel Invitation</p>
                                  </Button>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
