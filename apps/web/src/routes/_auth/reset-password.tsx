import { createFileRoute } from "@tanstack/react-router";
import { UpdatePasswordForm } from "@/components/update-password-form";
import { z } from "zod";

const tokenSearchSchema = z.object({
  token: z.string(),
});

export const Route = createFileRoute("/_auth/reset-password")({
  component: ResetPassword,
  validateSearch: tokenSearchSchema,
});

function ResetPassword() {
  const { token } = Route.useSearch();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <UpdatePasswordForm token={token} />
      </div>
    </div>
  );
}
