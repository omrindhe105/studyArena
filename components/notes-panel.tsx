"use client";

import { useStudy } from "@/lib/study-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText, History, Calendar, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";

import { useEffect, useState } from "react";

import { set } from "mongoose";

export function NotesPanel() {
  const {
    dailyNotes,
    yesterdayPoints,
    tomorrowPlan,
    revisionNotes,
    setDailyNotes,
    setTomorrowPlan,
    setRevisionNotes,
  } = useStudy();

  const [notes, setNotes] = useState<
    {
      _id: string;
      notes: string;
      Date: Date;
    }[]
  >([]);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.log("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSave = async () => {
    if (!dailyNotes.trim()) {
      alert("Please enter some notes");
      return;
    }

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: dailyNotes }),
      });

      if (!res.ok) {
        throw new Error("Failed to save note");
      }

      const data = await res.json();
      toast.success(data.message, {
        duration: 3000,
        position: "top-right",
        className: "custom-snackbar",
      });
      fetchNotes();

      setDailyNotes("");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      const res = await fetch("api/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: _id }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete note");
      }

      const data = await res.json();
      toast.success(data.message, {
        duration: 3000,
        position: "top-right",
        className: "custom-snackbar",
      });

      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <FileText className="h-4 w-4 text-primary" />
          Notes & Revision
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="today" className="text-xs">
              Today
            </TabsTrigger>
            <TabsTrigger value="yesterday" className="text-xs">
              Yesterday
            </TabsTrigger>
            <TabsTrigger value="tomorrow" className="text-xs">
              Tomorrow
            </TabsTrigger>
            <TabsTrigger value="revision" className="text-xs">
              Revision
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileText className="h-3 w-3" />
                Daily Notes
              </div>
              <Textarea
                placeholder="Write your study notes for today..."
                value={dailyNotes}
                onChange={(e) => setDailyNotes(e.target.value)}
                className="min-h-[140px] resize-none bg-muted/30 text-sm"
              />
            </div>
            <div className=" flex items-center justify-center   ">
              <button
                className=" mt-4 w-2/4 rounded-md bg-primary  py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary pointer-events-auto cursor-pointer "
                onClick={handleSave}
              >
                save
              </button>
            </div>
          </TabsContent>
          {/* {apiResponce !== null && toast.success(apiResponce)} */}

          <TabsContent value="yesterday" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <History className="h-3 w-3" />
                Key Points from last day
              </div>
              <div className="space-y-4 rounded-lg bg-muted/30 p-3 relative my-2">
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <div
                      key={note._id}
                      className="flex justify-between items-start text-md text-foreground"
                    >
                      <div className="flex gap-3">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        {note.notes}
                      </div>

                      <button
                        className="cursor-pointer rounded-full bg-muted p-1 hover:bg-red-500"
                        onClick={() => handleDelete(note._id)}
                      >
                        X
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No notes from previous days
                  </p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tomorrow" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Tomorrow's Study Plan
              </div>
              <Textarea
                placeholder="Plan what you'll study tomorrow..."
                value={tomorrowPlan}
                onChange={(e) => setTomorrowPlan(e.target.value)}
                className="min-h-[140px] resize-none bg-muted/30 text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="revision" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                Quick Revision Notes
              </div>
              <Textarea
                placeholder="Key concepts to revise..."
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                className="min-h-[140px] resize-none bg-muted/30 text-sm"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
