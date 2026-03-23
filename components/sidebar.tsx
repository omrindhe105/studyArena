"use client";

import { useStudy } from "@/lib/study-context";

import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  BarChart3,
  Settings,
  Flame,
  TrendingUp,
  Calendar,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { set } from "mongoose";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];
interface streakData {
  currentStreak: number;
  longestStreak: number;
  totalDurationMinutes: number;
  averageStudy: {
    sevenDaysHours: number;
    sevenDaysAvg: number;
  };
  last4Days: {
    date: string;
    hoursStudied: number;
  }[];
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { studyHistory, streak, isDarkMode, toggleTheme } = useStudy();
  const [apiData, setApiData] = useState<streakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalDurationMinutes: 0,
    averageStudy: {
      sevenDaysHours: 0,
      sevenDaysAvg: 0,
    },
    last4Days: [
      {
        date: "",
        hoursStudied: 0,
      },
    ],
  });

  const fetchStreak = async () => {
    const res = await fetch("/api/analytics/streaks");
    const data: streakData = await res.json();
    setApiData(data);
    console.log(data);
  };

  useEffect(() => {
    fetchStreak();
  }, []);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <TrendingUp className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">
          StudyArena
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Stats Section */}
      <div className="space-y-3 border-t border-border p-4">
        {/* Streak */}
        <div className="rounded-lg bg-sidebar-accent/50 p-3">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70">
            <Flame className="h-3.5 w-3.5 text-orange-500" />
            Study Streak
          </div>
          <div className="text-2xl font-bold text-sidebar-foreground">
            {apiData ? apiData.currentStreak : 0}{" "}
            <span className="text-sm font-normal text-sidebar-foreground/60">
              days
            </span>
          </div>
        </div>

        {/* Weekly Stats */}
        <div className="rounded-lg bg-sidebar-accent/50 p-3">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-sidebar-foreground/70">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            This Week
          </div>
          <div className="text-2xl font-bold text-sidebar-foreground">
            {apiData ? apiData.averageStudy.sevenDaysHours : 0}{" "}
            <span className="text-sm font-normal text-sidebar-foreground/60">
              hrs
            </span>
          </div>
          <div className="mt-1 text-xs text-sidebar-foreground/60">
            Avg: {apiData ? apiData.averageStudy.sevenDaysAvg : 0} hrs/day
          </div>
        </div>

        {/* Recent History */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-sidebar-foreground/70">
            Recent Sessions
          </div>
          {apiData
            ? apiData.last4Days.map((day, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 text-xs hover:bg-sidebar-accent/30"
                >
                  <span className="text-sidebar-foreground/70">
                    {new Date(day.date).toLocaleDateString("en-us", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-medium text-sidebar-foreground">
                    {day.hoursStudied}h
                  </span>
                </div>
              ))
            : "no data"}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="border-t border-border p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          {isDarkMode ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
    </aside>
  );
}
