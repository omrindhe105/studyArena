"use client"

import { useStudy, getRandomQuote } from "@/lib/study-context"
import { StudyTimer } from "@/components/study-timer"
import { TierBadge } from "@/components/tier-badge"
import { GoalTracker } from "@/components/goal-tracker"
import { TaskList } from "@/components/task-list"
import { NotesPanel } from "@/components/notes-panel"
import { StudyGraph } from "@/components/study-graph"
import { Achievements } from "@/components/achievements"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Maximize2, Quote } from "lucide-react"
import { useState, useEffect } from "react"


interface DashboardProps {
  activeTab: string
}

export function Dashboard({ activeTab }: DashboardProps) {
  const { toggleFocusMode } = useStudy()
  const [quote, setQuote] = useState("")

  useEffect(() => {
    setQuote(getRandomQuote())
  }, [])

  if (activeTab === "notes") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Notes</h1>
          <p className="text-sm text-muted-foreground">Capture your study insights</p>
        </div>
        <div className="max-w-2xl">
          <NotesPanel />
        </div>
      </div>
    )
  }

  if (activeTab === "tasks") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="text-sm text-muted-foreground">Manage your study tasks</p>
        </div>
        <div className="max-w-xl">
          <TaskList />
        </div>
      </div>
    )
  }

  if (activeTab === "analytics") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your study progress</p>
        </div>
        <div className="grid max-w-4xl gap-6 lg:grid-cols-2">
          <StudyGraph />
          <Achievements />
        </div>
      </div>
    )
  }

  if (activeTab === "settings") {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure your preferences</p>
        </div>
        <Card className="max-w-xl border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Theme</p>
                <p className="text-xs text-muted-foreground">
                  Toggle between light and dark mode
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Use the toggle in the sidebar
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Pomodoro Duration</p>
                <p className="text-xs text-muted-foreground">
                  Default: 25 min focus, 5 min break
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Default</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Browser notifications for timers
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main Dashboard
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Button onClick={toggleFocusMode} className="gap-2">
          <Maximize2 className="h-4 w-4" />
          Focus Mode
        </Button>
      </div>

      {/* Motivational Quote */}
      <Card className="mb-6 border-border bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="flex items-center gap-3 py-4">
          <Quote className="h-5 w-5 flex-shrink-0 text-primary" />
          <p className="text-sm text-foreground italic">{quote}</p>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6">
          <StudyTimer />
          <TierBadge />
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          <GoalTracker />
          <TaskList />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <NotesPanel />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <StudyGraph />
        <Achievements />
      </div>
    </div>
  )
}
