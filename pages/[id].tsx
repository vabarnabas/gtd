import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import BreadCrumb from "../components/breadcrumb"
import Layout from "../components/layout"
import Spinner from "../components/spinner"
import TaskGrid from "../components/task-grid"
import { FolderHelper } from "../helpers/FolderHelper"
import { requestHelper } from "../services/requestHelper"
import { useErrorHandler } from "../services/useErrorHandler"
import { Folder, Task } from "../types/prisma.types"

export default function Home() {
  const { errorHandler } = useErrorHandler()
  const router = useRouter()
  const id = router.query.id as string

  const [tasks, setTasks] = useState<Task[]>([])
  const [folders, setFolders] = useState<Folder[]>([])

  const fetchTasks = () => {
    errorHandler(async () => {
      const data = await requestHelper.getMy<Task>("tasks")
      setTasks(data)
    })
  }
  const fetchFolders = () => {
    errorHandler(async () => {
      const data = await requestHelper.getMy<Folder>("folders")
      setFolders(data)
    })
  }

  useEffect(() => {
    fetchFolders()
    fetchTasks()
  }, [])

  return (
    <Layout fetchTasks={fetchTasks}>
      <div className="flex h-full w-full flex-col items-center rounded-md px-4 pt-4 pb-2 shadow">
        {folders.length !== 0 ? (
          <BreadCrumb
            className="mb-4"
            path={[
              ...FolderHelper.findDeepParents(folders, id).reverse(),
              FolderHelper.findFolder(folders, id),
            ].map((folder) => {
              return {
                label: folder.title,
                path: FolderHelper.isSame(folder, id)
                  ? undefined
                  : `/${folder.id}`,
              }
            })}
          />
        ) : null}
        {tasks.length !== 0 ? (
          <div className="h-full w-full overflow-y-auto">
            <TaskGrid
              tasks={tasks.filter((task) => task.folderId === id)}
              fetchTasks={fetchTasks}
            />
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </Layout>
  )
}
