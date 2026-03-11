"use client"

import { useStudy } from "@/lib/study-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { FileText, History, Calendar, BookOpen } from "lucide-react"

export function NotesPanel() {
  const {
    dailyNotes,
    yesterdayPoints,
    tomorrowPlan,
    revisionNotes,
    setDailyNotes,
    setTomorrowPlan,
    setRevisionNotes,
  } = useStudy()

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
          </TabsContent>

          <TabsContent value="yesterday" className="mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <History className="h-3 w-3" />
                Key Points from Yesterday
              </div>
              <div className="space-y-2 rounded-lg bg-muted/30 p-3">
                {yesterdayPoints.length > 0 ? (
                  yesterdayPoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {point}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No notes from yesterday</p>
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
  )
}
