import clsx from "clsx"
import React from "react"

import { FolderHelper } from "../../helpers/FolderHelper"
import useModalStore from "../../store/modal.store"
import { Folder, Task } from "../../types/prisma.types"
import BreadCrumb from "../breadcrumb"
import FolderList from "../folder-list"
import TaskGrid from "../task-grid"

interface Props {
  folders: Folder[]
  tasks: Task[]
  id?: string
  fetchTasks: () => void
}

export default function FolderPage({ folders, tasks, id, fetchTasks }: Props) {
  const openModal = useModalStore((state) => state.openModal)

  return (
    <div className="h-full px-6">
      <div className="my-4 flex">
        <BreadCrumb
          path={
            id
              ? [
                  ...FolderHelper.findDeepParents(folders, id).reverse(),
                  FolderHelper.findFolder(folders, id),
                ].map((folder) => {
                  return {
                    label: folder.title,
                    path: FolderHelper.isSame(folder, id)
                      ? undefined
                      : `/folders/${folder.id}`,
                  }
                })
              : []
          }
        />
        <p
          onClick={() => {
            id && openModal({ modal: "folder-options", id })
          }}
          className={clsx("ml-auto w-min cursor-pointer text-sm ", {
            "text-blue-500 hover:text-blue-600 hover:underline": id,
            "text-gray-400": !id,
          })}
        >
          Options
        </p>
      </div>
      <div className="flex h-full gap-x-8">
        <div
          className={clsx("", {
            "hidden flex-col md:flex": id,
            "w-full md:w-auto": !id,
          })}
        >
          <FolderList folders={folders} />
        </div>
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
    </div>
  )
}
