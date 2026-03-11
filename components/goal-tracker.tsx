"use client"

import { useState } from "react"
import { useStudy } from "@/lib/study-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export function GoalTracker() {
  const { dailyGoalHours, todayHoursStudied, setDailyGoal, addStudyTime } = useStudy()
  const [showAdjust, setShowAdjust] = useState(false)

  const progress = Math.min((todayHoursStudied / dailyGoalHours) * 100, 100)
  const remaining = Math.max(dailyGoalHours - todayHoursStudied, 0)
  const isComplete = progress >= 100

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base font-medium">
          <span className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Daily Goal
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdjust(!showAdjust)}
            className="h-7 text-xs"
          >
            Adjust
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Ring */}
        <div className="flex items-center gap-4">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <svg className="absolute h-full w-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-muted"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)}
                strokeLinecap="round"
                className={cn(
                  "transition-all duration-500",
                  isComplete ? "text-green-500" : "text-primary"
                )}
              />
            </svg>
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{Math.round(progress)}%</div>
            </div>
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground">
                {todayHoursStudied.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/ {dailyGoalHours} hrs</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  isComplete ? "bg-green-500" : "bg-primary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {isComplete
                ? "Goal achieved! Keep going!"
                : `${remaining.toFixed(1)} hours remaining`}
            </p>
          </div>
        </div>

        {/* Goal Adjustment */}
        {showAdjust && (
          <div className="space-y-3 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Daily Goal</span>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setDailyGoal(Math.max(1, dailyGoalHours - 1))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center font-mono font-medium text-foreground">
                  {dailyGoalHours}h
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setDailyGoal(Math.min(12, dailyGoalHours + 1))}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Log Study Time</span>
              <div className="flex gap-1">
                {[0.5, 1, 2].map((hrs) => (
                  <Button
                    key={hrs}
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={() => addStudyTime(hrs)}
                  >
                    +{hrs}h
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievement Message */}
        {isComplete && (
          <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-2 text-sm text-green-600 dark:text-green-400">
            <Target className="h-4 w-4" />
            <span>Daily goal reached!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
