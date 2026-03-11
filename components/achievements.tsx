"use client"

import { useStudy } from "@/lib/study-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Flame,
  Target,
  Clock,
  Trophy,
  Zap,
  Star,
  Calendar,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  name: string
  description: string
  icon: typeof Flame
  unlocked: boolean
  color: string
}

export function Achievements() {
  const { streak, studyHistory, todayHoursStudied, tasks } = useStudy()

  const totalHours = studyHistory.reduce((sum, d) => sum + d.hoursStudied, 0) + todayHoursStudied
  const completedTasks = tasks.filter((t) => t.completed).length

  const achievements: Achievement[] = [
    {
      id: "first-day",
      name: "First Steps",
      description: "Complete your first study day",
      icon: Star,
      unlocked: totalHours > 0,
      color: "text-amber-400",
    },
    {
      id: "streak-3",
      name: "Consistency",
      description: "Maintain a 3-day streak",
      icon: Flame,
      unlocked: streak >= 3,
      color: "text-orange-500",
    },
    {
      id: "streak-7",
      name: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: Calendar,
      unlocked: streak >= 7,
      color: "text-primary",
    },
    {
      id: "hours-10",
      name: "Dedicated",
      description: "Study for 10 total hours",
      icon: Clock,
      unlocked: totalHours >= 10,
      color: "text-blue-400",
    },
    {
      id: "hours-50",
      name: "Scholar",
      description: "Study for 50 total hours",
      icon: BookOpen,
      unlocked: totalHours >= 50,
      color: "text-indigo-400",
    },
    {
      id: "daily-goal",
      name: "Goal Crusher",
      description: "Complete daily goal",
      icon: Target,
      unlocked: todayHoursStudied >= 6,
      color: "text-green-400",
    },
    {
      id: "tasks-complete",
      name: "Task Master",
      description: "Complete all daily tasks",
      icon: Zap,
      unlocked: completedTasks === tasks.length && tasks.length > 0,
      color: "text-yellow-400",
    },
    {
      id: "goat",
      name: "GOAT Status",
      description: "Reach GOAT tier",
      icon: Trophy,
      unlocked: todayHoursStudied >= 6,
      color: "text-amber-500",
    },
  ]

  const unlockedCount = achievements.filter((a) => a.unlocked).length

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base font-medium">
          <span className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            Achievements
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {unlockedCount}/{achievements.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {achievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <div
                key={achievement.id}
                className={cn(
                  "group relative flex flex-col items-center rounded-lg p-3 text-center transition-all",
                  achievement.unlocked
                    ? "bg-muted/50 hover:bg-muted"
                    : "bg-muted/20 opacity-50"
                )}
              >
                <div
                  className={cn(
                    "mb-2 flex h-10 w-10 items-center justify-center rounded-full transition-transform",
                    achievement.unlocked
                      ? "bg-muted group-hover:scale-110"
                      : "bg-muted/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      achievement.unlocked ? achievement.color : "text-muted-foreground"
                    )}
                  />
                </div>
                <div
                  className={cn(
                    "text-[10px] font-medium leading-tight",
                    achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {achievement.name}
                </div>

                {/* Tooltip */}
                <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-popover px-2 py-1 text-[10px] text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {achievement.description}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
