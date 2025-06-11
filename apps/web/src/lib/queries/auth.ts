import { queryOptions } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const authQueries = {
  // Session query
  session: () =>
    queryOptions({
      queryKey: ["auth", "session"],
      queryFn: () => authClient.getSession(),
      staleTime: 5 * 60 * 1000,
    }),

  // Organizations list
  organizations: () =>
    queryOptions({
      queryKey: ["organizations"],
      queryFn: () => authClient.organization.list(),
      staleTime: 2 * 60 * 1000,
    }),

  // Active member
  activeMember: () =>
    queryOptions({
      queryKey: ["organization", "activeMember"],
      queryFn: () => authClient.organization.getActiveMember(),
      staleTime: 2 * 60 * 1000,
    }),

  // Full organization
  fullOrganization: (organizationId?: string) =>
    queryOptions({
      queryKey: ["organization", organizationId, "full"],
      queryFn: () =>
        authClient.organization.getFullOrganization({
          query: { organizationId },
        }),
      enabled: !!organizationId,
      staleTime: 2 * 60 * 1000,
    }),

  activeOrganization: () =>
    queryOptions({
      queryKey: ["organization", "activeOrganization"],
      queryFn: () => authClient.useActiveOrganization(),
      staleTime: 2 * 60 * 1000,
    }),

  listOrganization: () =>
    queryOptions({
      queryKey: ["organization", "listOrganization"],
      queryFn: () => authClient.useListOrganizations(),
      staleTime: 2 * 60 * 1000,
    }),
};
