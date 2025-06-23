import { createLazyFileRoute } from "@tanstack/react-router";
import NotesLayout from "@/components/notes-layout";

export const Route = createLazyFileRoute("/_protected/notes")({
  component: RouteComponent,
});

function RouteComponent() {
  return <NotesLayout />;
}
