import React from "react"

import useModalStore from "../../store/modal.store"
import { Task } from "../../types/prisma.types"
import TaskGrid from "../task-grid"

interface Props {
  tasks: Task[]
  id?: string
  fetchTasks: () => void
}

export default function FolderPage({ tasks, id, fetchTasks }: Props) {
  const openModal = useModalStore((state) => state.openModal)

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
      ) : (
        <div className="mt-10 flex h-full w-full items-start justify-center">
          <p className="font-medium">
            Please select a folder{" "}
            <span
              onClick={() => openModal({ modal: "new-folder" })}
              className="inline cursor-pointer text-blue-500 hover:text-blue-600"
            >
              or create one
            </span>
            .
          </p>
        </div>
      )}
    </div>
  )
}
