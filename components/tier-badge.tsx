"use client"

import { useStudy } from "@/lib/study-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const tiers = [
  {
    name: "Newbie",
    icon: Star,
    range: "1-3 hours",
    description: "Just getting started",
    gradient: "from-slate-400 to-slate-500",
  },
  {
    name: "Legend",
    icon: Zap,
    range: "3-6 hours",
    description: "Building momentum",
    gradient: "from-primary to-emerald-500",
  },
  {
    name: "GOAT",
    icon: Trophy,
    range: "6+ hours",
    description: "Unstoppable force",
    gradient: "from-amber-400 to-orange-500",
  },
]

export function TierBadge() {
  const { todayHoursStudied, getTier } = useStudy()
  const currentTier = getTier()

  const currentTierIndex = currentTier.level - 1
  const TierIcon = tiers[currentTierIndex].icon

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Trophy className="h-4 w-4 text-primary" />
          Study Tier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Tier Display */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-muted/50 to-muted p-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                tiers[currentTierIndex].gradient
              )}
            >
              <TierIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className={cn("text-2xl font-bold", currentTier.color)}>
                {currentTier.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {todayHoursStudied.toFixed(1)} hours today
              </div>
              <div className="mt-1 text-xs text-muted-foreground/70">
                {tiers[currentTierIndex].description}
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-primary/5" />
          <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-primary/10" />
        </div>

        {/* All Tiers */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">All Tiers</div>
          <div className="grid grid-cols-3 gap-2">
            {tiers.map((tier, index) => {
              const Icon = tier.icon
              const isActive = index + 1 === currentTier.level
              const isLocked = index + 1 > currentTier.level

              return (
                <div
                  key={tier.name}
                  className={cn(
                    "relative flex flex-col items-center rounded-lg p-3 text-center transition-all",
                    isActive
                      ? "bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/30"
                      : isLocked
                        ? "bg-muted/30 opacity-50"
                        : "bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br",
                      isLocked ? "from-slate-400 to-slate-500" : tier.gradient
                    )}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div
                    className={cn(
                      "text-xs font-semibold",
                      isActive ? "text-primary" : "text-foreground"
                    )}
                  >
                    {tier.name}
                  </div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    {tier.range}
                  </div>
                  {isActive && (
                    <div className="absolute -top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress to next tier */}
        {currentTier.level < 3 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress to {tiers[currentTierIndex + 1].name}</span>
              <span className="font-medium text-foreground">
                {currentTier.level === 1
                  ? `${Math.min(todayHoursStudied, 3).toFixed(1)}/3 hrs`
                  : `${Math.min(todayHoursStudied, 6).toFixed(1)}/6 hrs`}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                  tiers[currentTierIndex + 1].gradient
                )}
                style={{
                  width: `${Math.min(
                    (todayHoursStudied / (currentTier.level === 1 ? 3 : 6)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
