import { createFileRoute } from "@tanstack/react-router";
import OrganisationForm from "@/components/organisation-form";

export const Route = createFileRoute("/auth/create-organisation")({
  component: Organisation,
});

function Organisation() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <OrganisationForm />
      </div>
    </div>
  );
}
