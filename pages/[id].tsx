import { useRouter } from "next/router"
import useSWR from "swr"

import FolderPage from "../components/folder-page"
import Layout from "../components/layout"
import Spinner from "../components/spinner"
import { requestHelper } from "../services/requestHelper"
import { useErrorHandler } from "../services/useErrorHandler"
import useModalStore from "../store/modal.store"
import { Folder, Task } from "../types/prisma.types"

export default function Home() {
  const openModal = useModalStore((state) => state.openModal)
  const { errorHandler } = useErrorHandler()
  const router = useRouter()
  const id = router.query.id as string | undefined

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
          <FolderPage
            folders={folderData}
            tasks={taskData}
            id={id}
            fetchTasks={taskMutate}
          />
        ) : (
          <Spinner />
        )
      ) : (
        <div>Something went wrong.</div>
      )}
    </Layout>
  )
}
