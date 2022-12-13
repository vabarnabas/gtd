import { useRouter } from "next/router"
import useSWR from "swr"

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

  return (
    <Layout fetchFolders={folderMutate} fetchTasks={taskMutate}>
      {!error ? (
        !isLoading && folderData && taskData ? (
          <div className="flex h-full w-full flex-col items-center rounded-md px-4 pt-4 pb-2 shadow">
            <BreadCrumb
              className="mb-4"
              path={[
                ...FolderHelper.findDeepParents(folderData, id).reverse(),
                FolderHelper.findFolder(folderData, id),
              ].map((folder) => {
                return {
                  label: folder.title,
                  path: FolderHelper.isSame(folder, id)
                    ? undefined
                    : `/${folder.id}`,
                }
              })}
            />

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
