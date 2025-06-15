import { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";
import Loader from "@/components/loader";

const OrgContext = createContext<
  ReturnType<typeof authClient.useActiveOrganization> | undefined
>(undefined);

export const OrgProvider = ({ children }: { children: React.ReactNode }) => {
  const organization = authClient.useActiveOrganization();

  return (
    <OrgContext.Provider value={organization}>{children}</OrgContext.Provider>
  );
};

export function useOrg() {
  const context = useContext(OrgContext);
  if (context === undefined) {
    throw new Error("useOrg must be used within an AuthProvider");
  }
  return context;
}
