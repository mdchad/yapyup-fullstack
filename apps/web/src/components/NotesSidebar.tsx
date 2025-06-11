import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function NotesSidebar() {
  return (
    <aside className="w-full bg-white md:w-80 md:sticky md:top-0 md:self-start flex-shrink-0 space-y-6 p-6 border-l border-l-gray-200">
      {/* Properties */}
      <section>
        <h2 className="text-base font-semibold mb-4">Properties</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="bg-yellow-100 text-yellow-800 rounded px-2 py-0.5 text-xs">
              Backlog
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Priority</span>
            <span className="text-muted-foreground">No priority</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Lead</span>
            <span className="flex items-center gap-1">
              <Avatar className="w-5 h-5">
                <AvatarFallback>IM</AvatarFallback>
              </Avatar>
              <span className="text-xs">irsyad.muhd</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Members</span>
            <span className="text-muted-foreground">Add members</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Teams</span>
            <span className="text-xs">ENG</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Start date</span>
            <span className="text-muted-foreground">-</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Target date</span>
            <span className="text-muted-foreground">-</span>
          </div>
        </div>
      </section>
      <Separator />
      {/* Milestones */}
      <section>
        <h2 className="text-base font-semibold mb-4">Milestones</h2>
        <span className="text-muted-foreground text-sm">
          Add milestones to organize work within your project and break it into
          more granular stages.
        </span>
      </section>
      <Separator />
      {/* Progress */}
      <section>
        <h2 className="text-base font-semibold mb-4">Progress</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Scope</span>
            <span>8</span>
          </div>
          <div className="flex justify-between">
            <span>Completed</span>
            <span>4 • 50%</span>
          </div>
          <Progress value={50} className="h-2" />
          <div>
            <div className="text-xs mb-1">Assignees</div>
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback>IM</AvatarFallback>
              </Avatar>
              <span className="text-xs">irsyad.muhd</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              No assignee 5
            </div>
          </div>
        </div>
      </section>
      <Separator />
      {/* Activity */}
      <section>
        <h2 className="text-base font-semibold mb-4">Activity</h2>
        <div className="text-xs text-muted-foreground">
          irsyad.muhd created the project · Apr 18
        </div>
      </section>
    </aside>
  );
}
