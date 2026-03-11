"use client"

import { useState } from "react"
import { StudyProvider } from "@/lib/study-context"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { FocusMode } from "@/components/focus-mode"

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <StudyProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Dashboard activeTab={activeTab} />
        </main>

        {/* Focus Mode Overlay */}
        <FocusMode />
      </div>
    </StudyProvider>
  )
}
