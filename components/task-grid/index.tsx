import React, { useEffect, useRef } from "react"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { Task } from "../../types/prisma.types"
import TaskCard from "../task-card"
import autoAnimate from "@formkit/auto-animate"

interface Props {
  tasks: Task[]
  fetchTasks: () => void
}

export default function TaskGrid({ tasks, fetchTasks }: Props) {
  const parent = useRef(null)

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  const status = {
    "To Do": 1,
    "In Progress": 2,
    Done: 3,
    Closed: 4,
  }

  return (
    <div
      ref={parent}
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
    >
      {tasks
        .sort(
          (a, b) =>
            status[a.status as "To Do" | "In Progress" | "Done" | "Closed"] -
            status[b.status as "To Do" | "In Progress" | "Done" | "Closed"]
        )
        .map((task) => (
          <TaskCard fetchTasks={fetchTasks} {...task} key={task.id} />
        ))}
    </div>
  )
}
