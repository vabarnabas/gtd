import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import BreadCrumb from "../components/breadcrumb"
import Layout from "../components/layout"
import Spinner from "../components/spinner"
import TaskGrid from "../components/task-grid"
import { FolderHelper } from "../helpers/FolderHelper"
import { useToast } from "../providers/toast.provider"
import { requestHelper } from "../services/requestHelper"
import { Folder, Task } from "../types/prisma.types"

export default function Home() {
  const { createToast } = useToast()
  const router = useRouter()
  const id = router.query.id as string

  const [tasks, setTasks] = useState<Task[]>([])
  const [folders, setFolders] = useState<Folder[]>([])

  const fetchTasks = async () => {
    try {
      const data = await requestHelper.getMy<Task>("tasks")
      setTasks(data)
    } catch {
      createToast({
        title: "Something went wrong.",
        subtitle: "Something went wrong on our end, please try again.",
        expiration: 10000,
        type: "error",
      })
    }
  }
  const fetchFolders = async () => {
    try {
      const data = await requestHelper.getMy<Folder>("folders")
      setFolders(data)
    } catch {
      createToast({
        title: "Something went wrong.",
        subtitle: "Something went wrong on our end, please try again.",
        expiration: 10000,
        type: "error",
      })
    }
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
