import autoAnimate from "@formkit/auto-animate"
import React, { useEffect, useRef } from "react"

import { Task } from "../../types/prisma.types"
import EmptyTaskRow from "../empty-task-row"
import TaskRow from "../task-row"

interface Props {
  tasks: Task[]
  fetchTasks: () => void
}

export default function TaskList({ tasks, fetchTasks }: Props) {
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
      className="grid w-full grid-cols-1 divide-y rounded-lg border"
    >
      {tasks
        .sort(
          (a, b) =>
            status[a.status as "To Do" | "In Progress" | "Done" | "Closed"] -
            status[b.status as "To Do" | "In Progress" | "Done" | "Closed"]
        )
        .map((task) => (
          <TaskRow fetchTasks={fetchTasks} {...task} key={task.id} />
        ))}
      <EmptyTaskRow />
    </div>
  )
}
