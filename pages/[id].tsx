import { useRouter } from "next/router"
import { useEffect } from "react"
import useSWR from "swr"

import BreadCrumb from "../components/breadcrumb"
import Layout from "../components/layout"
import Spinner from "../components/spinner"
import TaskGrid from "../components/task-grid"
import { FolderHelper } from "../helpers/FolderHelper"
import { requestHelper } from "../services/requestHelper"
import { useErrorHandler } from "../services/useErrorHandler"
import useModalStore from "../store/modal.store"
import { Folder, Task } from "../types/prisma.types"

export default function Home() {
  const openModal = useModalStore((state) => state.openModal)
  const { errorHandler } = useErrorHandler()
  const router = useRouter()
  const id = router.query.id as string

  const {
    data: folderData,
    error: folderError,
    isLoading: folderIsLoading,
    mutate: folderMutate,
  } = useSWR("fetchFolders", () =>
    errorHandler(async () => await requestHelper.getMy<Folder>("folders"))
  )

  const {
    data: taskData,
    error: taskError,
    isLoading: taskIsLoading,
    mutate: taskMutate,
  } = useSWR("fetchTasks", () =>
    errorHandler(async () => await requestHelper.getMy<Task>("tasks"))
  )

  const error = folderError || taskError

  const isLoading = folderIsLoading || taskIsLoading

  useEffect(() => {
    if (!folderIsLoading && folderData && FolderHelper.isIn(folderData, id)) {
      router.push("/")
    }
  }, [folderData, folderIsLoading, id, router])

  return (
    <Layout fetchFolders={folderMutate} fetchTasks={taskMutate}>
      {!error ? (
        !isLoading &&
        folderData &&
        taskData &&
        !FolderHelper.isIn(folderData, id) ? (
          <div className="flex h-full w-full flex-col items-center rounded-md px-6 pt-4 pb-2 shadow">
            <div className="mb-4 flex w-full items-center justify-center gap-x-4">
              <BreadCrumb
                path={[
                  ...FolderHelper.findDeepParents(
                    folderData as Folder[],
                    id
                  ).reverse(),
                  FolderHelper.findFolder(folderData as Folder[], id),
                ].map((folder) => {
                  return {
                    label: folder.title,
                    path: FolderHelper.isSame(folder, id)
                      ? undefined
                      : `/${folder.id}`,
                  }
                })}
              />
              <p
                onClick={() => {
                  openModal({ modal: "folder-options", id })
                }}
                className="cursor-pointer text-sm text-blue-500 hover:text-blue-600 hover:underline"
              >
                Options
              </p>
            </div>

            <div className="h-full w-full overflow-y-auto">
              <TaskGrid
                tasks={(taskData as Task[]).filter(
                  (task) => task.folderId === id
                )}
                fetchTasks={taskMutate}
              />
            </div>
          </div>
        ) : (
          <Spinner />
        )
      ) : (
        <div>Something went wrong.</div>
      )}
    </Layout>
  )
}
