"use client";

import { useStudy } from "@/lib/study-context";
import { Play, Pause, RotateCcw, Clock, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function StudyTimer() {
  const {
    timerMinutes,
    timerSeconds,
    isRunning,
    isPomodoroMode,
    isBreak,
    startTimer,
    pauseTimer,
    resetTimer,
    setCustomTime,
    togglePomodoroMode,
    isLoading,
  } = useStudy();

  const formatTime = (mins: number, secs: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const presetTimes = [60, 120, 180];
  const [customHours, setCustomHours] = useState("");
  const [customMinutes, setCustomMinutes] = useState("");





  const handleSetCustomTime = () => {
    const hours = parseInt(customHours) || 0;
    const minutes = parseInt(customMinutes) || 0;
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes > 0) {
      setCustomTime(totalMinutes);
    }
    setCustomHours("");
    setCustomMinutes("");
  };




  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <Clock className="h-4 w-4 text-primary" />
          Study Timer
          {isPomodoroMode && (
            <span className="ml-auto flex items-center gap-1 text-xs font-normal text-muted-foreground">
              {isBreak ? (
                <>
                  <Coffee className="h-3 w-3" /> Break
                </>
              ) : (
                "Focus"
              )}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="relative flex h-40 w-40 items-center justify-center">
            <div className="text-center">
              {isLoading ? (
                <div className="font-mono text-4xl font-bold tracking-tight text-card-foreground">
                  Loading...
                </div>
              ) : (
                <div className="font-mono text-4xl font-bold tracking-tight text-card-foreground">
                  {formatTime(timerMinutes, timerSeconds)}
                </div>
              )}
              <div className="mt-1 text-xs text-muted-foreground">
                {isPomodoroMode
                  ? isBreak
                    ? "Break Time"
                    : "Focus Time"
                  : "Custom Timer"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={resetTimer}
            className="h-10 w-10 rounded-full"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={isRunning ? pauseTimer : startTimer}
            className={cn(
              "h-14 w-14 rounded-full",
              isRunning
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-primary hover:bg-primary/90",
            )}
          >
            {isRunning ? (
              <Pause className="h-6 w-6 text-destructive-foreground" />
            ) : (
              <Play className="h-6 w-6 text-primary-foreground" />
            )}
          </Button>
          <Button
            size="sm"
            variant={isPomodoroMode ? "default" : "outline"}
            onClick={togglePomodoroMode}
            className="rounded-full px-3"
          >
            Pomodoro
          </Button>
        </div>

        {!isPomodoroMode && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-center gap-2">
              {presetTimes.map((time) => (
                <Button
                  key={time}
                  size="sm"
                  variant="ghost"
                  onClick={() => setCustomTime(time)}
                  className="text-xs"
                >
                  {time}m
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="hh"
                value={customHours}
                onChange={(e) => setCustomHours(e.target.value)}
                className="w-16 rounded-md border border-border bg-background px-2 py-1 text-sm"
              />

              <span className="text-sm text-muted-foreground">:</span>

              <input
                type="text"
                inputMode="numeric"
                placeholder="mm"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="w-16 rounded-md border border-border bg-background px-2 py-1 text-sm"
              />

              <Button
                size="sm"
                onClick={handleSetCustomTime}
                className="text-xs"
              >
                Set
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
