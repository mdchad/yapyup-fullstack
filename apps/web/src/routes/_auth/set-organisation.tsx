import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/set-organisation")({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6"></div>
    </div>
  );
}
