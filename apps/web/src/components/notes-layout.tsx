import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Card, CardContent } from "@repo/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/dialog";
import { Label } from "@repo/ui/label";
import { Plus, FileText } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, trpc } from "@/utils/trpc";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NotesLayout({ permissions }: { permissions: any }) {
  const [selectedNote, setSelectedNote] = useState<any | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  const { data: notes } = useQuery(trpc.getNotes.queryOptions());
  const createNote = useMutation({
    ...trpc.createNote.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: trpc.getNotes.queryKey() });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) return;

    const newNote = {
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
    };

    createNote.mutate(newNote);

    setSelectedNote(null);
    setIsCreateDialogOpen(false);
    setNewNoteTitle("");
    setNewNoteContent("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold">Notes</h1>
            {permissions && (
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    New Note
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Note</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        placeholder="Enter note title..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <textarea
                        id="content"
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Enter note content..."
                        rows={6}
                        className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleCreateNote}>Create Note</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notes && notes.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No notes yet</p>
              <p className="text-sm">Create your first note to get started</p>
            </div>
          ) : (
            <div className="p-2">
              {notes &&
                notes.map((note) => (
                  <Card
                    key={note.id}
                    className={`mb-2 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedNote?.id === note.id
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                    onClick={() => setSelectedNote(note)}
                  >
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm truncate">
                        {note.title}
                      </h3>
                      {note.content && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {note.content.length > 80
                            ? note.content.substring(0, 80) + "..."
                            : note.content}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDate(note.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="p-6 border-b border-gray-200 bg-white">
              <h1 className="text-2xl font-bold">{selectedNote.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Created {formatDate(selectedNote.createdAt)}
              </p>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose max-w-none">
                {selectedNote.content ? (
                  <div className="whitespace-pre-wrap">
                    {selectedNote.content}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No content</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Select a note
              </h2>
              <p className="text-gray-500">
                Choose a note from the sidebar to view its content
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
