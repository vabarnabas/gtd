import autoAnimate from "@formkit/auto-animate"
import React, { useEffect, useRef } from "react"

import { Task } from "../../types/prisma.types"
import EmptyTaskCard from "../empty-task-card"
import TaskCard from "../task-card"

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
    "To Do": 2,
    "In Progress": 1,
    Done: 3,
    Closed: 4,
  }

  return (
    <div
      ref={parent}
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
      <EmptyTaskCard />
    </div>
  )
}
