import React from "react"

import { Task } from "../../types/prisma.types"
import TaskGrid from "../task-grid"

interface Props {
  tasks: Task[]
  id?: string
  fetchTasks: () => void
}

export default function FolderPage({ tasks, id, fetchTasks }: Props) {
  return (
    <div className="flex h-full">
      {id ? (
        <div className="flex h-full w-full flex-col items-center rounded-md">
          <div className="h-full w-full overflow-y-auto">
            <TaskGrid
              tasks={tasks.filter((task) => task.folderId === id)}
              fetchTasks={fetchTasks}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
