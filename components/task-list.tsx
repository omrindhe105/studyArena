"use client"

import { useState } from "react"
import { useStudy } from "@/lib/study-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { CheckSquare, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function TaskList() {
  const { tasks, addTask, toggleTask, removeTask } = useStudy()
  const [newTask, setNewTask] = useState("")
  const [showInput, setShowInput] = useState(false)

  const completedCount = tasks.filter((t) => t.completed).length
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask.trim())
      setNewTask("")
      setShowInput(false)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base font-medium">
          <span className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-primary" />
            Study Tasks
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {completedCount}/{tasks.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                task.completed
                  ? "bg-muted/30"
                  : "bg-muted/50 hover:bg-muted"
              )}
            >
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="border-muted-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              />
              <label
                htmlFor={task.id}
                className={cn(
                  "flex-1 cursor-pointer text-sm transition-colors",
                  task.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                )}
              >
                {task.title}
              </label>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeTask(task.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {/* Add Task */}
        {showInput ? (
          <div className="flex gap-2">
            <Input
              placeholder="New task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              className="h-9 text-sm"
              autoFocus
            />
            <Button size="sm" onClick={handleAddTask} className="h-9">
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowInput(false)
                setNewTask("")
              }}
              className="h-9"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => setShowInput(true)}
          >
            <Plus className="h-3 w-3" />
            Add Task
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
