import { createContext, useContext, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import Loader from "@/components/loader";
import { useAuth } from "./auth-provider";
import { useNavigate } from "@tanstack/react-router";

const OrgContext = createContext<
  ReturnType<typeof authClient.useActiveOrganization> | undefined
>(undefined);

export const OrgProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const organization = authClient.useActiveOrganization();

  useEffect(() => {
    if (auth?.data?.session?.id) {
      // Force refetch organization data when auth state changes
      organization.refetch();
    }
  }, [auth?.data?.session?.id]);

  return (
    <OrgContext.Provider value={organization}>{children}</OrgContext.Provider>
  );
};

export function useOrg() {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error("useOrg must be used within an OrgProvider");
  }
  return context;
}
