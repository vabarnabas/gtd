import Head from "next/head"
import { useRouter } from "next/router"
import useSWR from "swr"

import FolderPage from "../components/folder-page"
import Layout from "../components/layout"
import Spinner from "../components/spinner"
import { FolderHelper } from "../helpers/FolderHelper"
import { requestHelper } from "../services/requestHelper"
import { useErrorHandler } from "../services/useErrorHandler"
import { Folder, Task } from "../types/prisma.types"

export default function Home() {
  const { errorHandler } = useErrorHandler()
  const router = useRouter()
  const id = router.query.id as string | undefined

  const {
    data: folderData,
    error: folderError,
    isLoading: folderIsLoading,
    mutate: folderMutate,
  } = useSWR("/folders/my", () =>
    errorHandler(async () => await requestHelper.getMy<Folder>("folders"))
  )

  const {
    data: taskData,
    error: taskError,
    isLoading: taskIsLoading,
    mutate: taskMutate,
  } = useSWR("/tasks/my", () =>
    errorHandler(async () => await requestHelper.getMy<Task>("tasks"))
  )

  const { data: userData } = useSWR("/current", () =>
    errorHandler(async () => await requestHelper.currentUser())
  )

  const error = folderError || taskError

  const isLoading = folderIsLoading || taskIsLoading

  return (
    <Layout
      fetchFolders={folderMutate}
      fetchTasks={taskMutate}
      folders={folderData}
      user={userData}
    >
      <>
        <Head>
          <title>{`NoteBox${
            folderData && id
              ? ` - ${FolderHelper.findFolder(folderData, id as string).title}`
              : ""
          }`}</title>
        </Head>
        {!error ? (
          !isLoading && folderData && taskData ? (
            <FolderPage tasks={taskData} id={id} fetchTasks={taskMutate} />
          ) : (
            <Spinner />
          )
        ) : (
          <div>Something went wrong.</div>
        )}
      </>
    </Layout>
  )
}
