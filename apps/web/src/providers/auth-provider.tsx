import { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";

const AuthContext = createContext<
  ReturnType<typeof authClient.useSession> | undefined
>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const session = authClient.useSession();

  console.log("provider auth", session);

  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
