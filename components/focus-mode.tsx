"use client";

import { useState, useEffect } from "react";
import { useStudy, getRandomQuote } from "@/lib/study-context";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, RotateCcw, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export function FocusMode() {
  const {
    focusModeActive,
    toggleFocusMode,
    timerMinutes,
    timerSeconds,
    isRunning,
    isPomodoroMode,
    isBreak,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useStudy();

  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(getRandomQuote());
  }, [focusModeActive]);

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalSeconds = isPomodoroMode ? (isBreak ? 5 * 60 : 25 * 60) : 0;
  const currentSeconds = timerMinutes * 60 + timerSeconds;
  const progress =
    totalSeconds > 0
      ? ((totalSeconds - currentSeconds) / totalSeconds) * 100
      : 0;

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

  if (!focusModeActive) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFocusMode}
        className="absolute right-6 top-6 h-10 w-10 rounded-full text-muted-foreground hover:text-foreground"
      >
        <X className="h-5 w-5" />
      </Button>

      <div className="flex flex-col items-center gap-12">
        {/* Timer */}
        <div className="relative flex h-80 w-80 items-center justify-center">
          {/* Progress Ring */}
          {/* <svg className="absolute h-full w-full -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-muted/30"
            />
            <circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 150}
              strokeDashoffset={2 * Math.PI * 150 * (1 - progress / 100)}
              strokeLinecap="round"
              className={cn(
                "transition-all duration-1000",
                isBreak ? "text-orange-500" : "text-primary"
              )}
            />
          </svg> */}

          {/* Time Display */}
          <div className="text-center">
            <div className="font-mono text-7xl font-light tracking-tight text-foreground">
              {formatTime(timerMinutes, timerSeconds)}
            </div>
            <div className="mt-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              {isPomodoroMode
                ? isBreak
                  ? "Break Time"
                  : "Focus Time"
                : "Study Session"}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={resetTimer}
            className="h-12 w-12 rounded-full text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            onClick={isRunning ? pauseTimer : startTimer}
            className={cn(
              "h-20 w-20 rounded-full transition-transform hover:scale-105",
              isRunning
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-primary hover:bg-primary/90",
            )}
          >
            {isRunning ? (
              <Pause className="h-8 w-8 text-destructive-foreground" />
            ) : (
              <Play className="h-8 w-8 text-primary-foreground" />
            )}
          </Button>
          <div className="h-12 w-12" /> {/* Spacer for symmetry */}
        </div>

        {/* Motivational Quote */}
        <div className="max-w-md text-center">
          <Quote className="mx-auto mb-3 h-5 w-5 text-primary/50" />
          <p className="text-balance text-lg text-muted-foreground italic">
            {quote}
          </p>
        </div>
      </div>

      {/* Ambient background effect */}
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 opacity-20 transition-colors duration-1000",
          isBreak
            ? "bg-gradient-to-br from-orange-500/20 via-transparent to-transparent"
            : "bg-gradient-to-br from-primary/20 via-transparent to-transparent",
        )}
      />
    </div>
  );
}
