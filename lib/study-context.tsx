"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface DayRecord {
  date: string;
  hoursStudied: number;
  keyPoints: string[];
}

export interface StudyState {
  // Timer
  timerMinutes: number;
  timerSeconds: number;
  // timerHours: number
  isRunning: boolean;
  isPomodoroMode: boolean;
  isBreak: boolean;
  customMinutes: number;

  // Goals
  dailyGoalHours: number;
  todayHoursStudied: number;

  // Tasks
  tasks: Task[];

  // Notes
  dailyNotes: string;
  yesterdayPoints: string[];
  tomorrowPlan: string;
  revisionNotes: string;

  // History
  studyHistory: DayRecord[];
  streak: number;

  // Focus Mode
  focusModeActive: boolean;

  // Theme
  isDarkMode: boolean;
}

interface StudyContextType extends StudyState {
  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setCustomTime: (minutes: number) => void;
  togglePomodoroMode: () => void;

  // Goal actions
  setDailyGoal: (hours: number) => void;
  addStudyTime: (hours: number) => void;

  // Task actions
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;

  // Notes actions
  setDailyNotes: (notes: string) => void;
  setTomorrowPlan: (plan: string) => void;
  setRevisionNotes: (notes: string) => void;

  // Focus mode
  toggleFocusMode: () => void;

  // Theme
  toggleTheme: () => void;

  // Tier info
  getTier: () => { name: string; level: number; color: string };
}

const defaultTasks: Task[] = [
  { id: "1", title: "Algorithms", completed: false },
  { id: "2", title: "Operating Systems", completed: false },
  { id: "3", title: "Distributed Systems", completed: false },
  { id: "4", title: "DBMS", completed: false },
];

const motivationalQuotes = [
  "The secret of getting ahead is getting started.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Don't watch the clock; do what it does. Keep going.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "It always seems impossible until it's done.",
  "The future depends on what you do today.",
  "Quality is not an act, it is a habit.",
];

export function getRandomQuote() {
  return motivationalQuotes[
    Math.floor(Math.random() * motivationalQuotes.length)
  ];
}

const StudyContext = createContext<StudyContextType | null>(null);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StudyState>({
    timerMinutes: 25,
    timerSeconds: 0,
    isRunning: false,
    isPomodoroMode: true,
    isBreak: false,
    customMinutes: 25,
    dailyGoalHours: 6,
    todayHoursStudied: 0,
    tasks: defaultTasks,
    dailyNotes: "",
    yesterdayPoints: [],
    tomorrowPlan: "",
    revisionNotes: "",
    studyHistory: [
      {
        date: "2026-03-10",
        hoursStudied: 4.5,
        keyPoints: ["Data structures", "Algorithms"],
      },
      {
        date: "2026-03-09",
        hoursStudied: 5.2,
        keyPoints: ["Operating systems", "Memory management"],
      },
      {
        date: "2026-03-08",
        hoursStudied: 3.8,
        keyPoints: ["Databases", "SQL"],
      },
      {
        date: "2026-03-07",
        hoursStudied: 6.1,
        keyPoints: ["Networking", "TCP/IP"],
      },
      { date: "2026-03-06", hoursStudied: 4.0, keyPoints: ["System design"] },
      {
        date: "2026-03-05",
        hoursStudied: 5.5,
        keyPoints: ["Distributed systems"],
      },
      {
        date: "2026-03-04",
        hoursStudied: 4.8,
        keyPoints: ["Algorithms review"],
      },
    ],
    streak: 7,
    focusModeActive: false,
    isDarkMode: true,
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (state.isRunning) {
      interval = setInterval(() => {
        setState((prev) => {
          if (prev.timerSeconds > 0) {
            return { ...prev, timerSeconds: prev.timerSeconds - 1 };
          } else if (prev.timerMinutes > 0) {
            return {
              ...prev,
              timerMinutes: prev.timerMinutes - 1,
              timerSeconds: 59,
              todayHoursStudied: ((s) => s + 1 / 60)(prev.todayHoursStudied), // Increment study time by 1 minute
            };
          } else {
            // Timer completed
            if (prev.isPomodoroMode) {
              const newIsBreak = !prev.isBreak;
              return {
                ...prev,
                isRunning: false,
                isBreak: newIsBreak,
                timerMinutes: newIsBreak ? 5 : 25,
                timerSeconds: 0,
              };
            }
            return { ...prev, isRunning: false };
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isRunning]);

  const startTimer = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isRunning: false,
      timerMinutes: prev.isPomodoroMode
        ? prev.isBreak
          ? 5
          : 25
        : prev.customMinutes,
      timerSeconds: 0,
      todayHoursStudied: 0,
    }));
  }, []);

  const setCustomTime = useCallback((minutes: number) => {
    setState((prev) => ({
      ...prev,
      customMinutes: minutes,
      timerMinutes: minutes,
      timerSeconds: 0,
      isPomodoroMode: false,
      isRunning: false,
    }));
  }, []);

  const togglePomodoroMode = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isPomodoroMode: !prev.isPomodoroMode,
      timerMinutes: !prev.isPomodoroMode ? 25 : prev.customMinutes,
      timerSeconds: 0,
      isBreak: false,
      isRunning: false,
    }));
  }, []);

  const setDailyGoal = useCallback((hours: number) => {
    setState((prev) => ({ ...prev, dailyGoalHours: hours }));
  }, []);

  const addStudyTime = useCallback((hours: number) => {
    setState((prev) => ({
      ...prev,
      todayHoursStudied: prev.todayHoursStudied + hours,
    }));
  }, []);

  const addTask = useCallback((title: string) => {
    setState((prev) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        { id: Date.now().toString(), title, completed: false },
      ],
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    }));
  }, []);

  const removeTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }, []);

  const setDailyNotes = useCallback((notes: string) => {
    setState((prev) => ({ ...prev, dailyNotes: notes }));
  }, []);

  const setTomorrowPlan = useCallback((plan: string) => {
    setState((prev) => ({ ...prev, tomorrowPlan: plan }));
  }, []);

  const setRevisionNotes = useCallback((notes: string) => {
    setState((prev) => ({ ...prev, revisionNotes: notes }));
  }, []);

  const toggleFocusMode = useCallback(() => {
    setState((prev) => ({ ...prev, focusModeActive: !prev.focusModeActive }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => {
      const newIsDark = !prev.isDarkMode;
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", newIsDark);
      }
      return { ...prev, isDarkMode: newIsDark };
    });
  }, []);

  const getTier = useCallback(() => {
    const hours = state.todayHoursStudied;
    if (hours >= 6) return { name: "GOAT", level: 3, color: "text-amber-400" };
    if (hours >= 3) return { name: "Legend", level: 2, color: "text-primary" };
    return { name: "Newbie", level: 1, color: "text-muted-foreground" };
  }, [state.todayHoursStudied]);

  return (
    <StudyContext.Provider
      value={{
        ...state,
        startTimer,
        pauseTimer,
        resetTimer,
        setCustomTime,
        togglePomodoroMode,
        setDailyGoal,
        addStudyTime,
        addTask,
        toggleTask,
        removeTask,
        setDailyNotes,
        setTomorrowPlan,
        setRevisionNotes,
        toggleFocusMode,
        toggleTheme,
        getTier,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  return context;
}
