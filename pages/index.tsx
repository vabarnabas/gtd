import useSWR from "swr"

import FolderRow from "../components/folder-row"
import Layout from "../components/layout"
import Spinner from "../components/spinner"
import { FolderHelper } from "../helpers/FolderHelper"
import { requestHelper } from "../services/requestHelper"
import { useErrorHandler } from "../services/useErrorHandler"
import { Folder } from "../types/prisma.types"

export default function Home() {
  const { errorHandler } = useErrorHandler()

  const { data, error, isLoading, mutate } = useSWR("fetchFolders", () =>
    errorHandler(async () => await requestHelper.getMy<Folder>("folders"))
  )

  return (
    <Layout fetchFolders={mutate}>
      <div className="flex h-full w-full flex-col items-center rounded-md px-4 pt-4 pb-2 shadow">
        {!error ? (
          !isLoading && data ? (
            <div className="w-full rounded-md bg-white p-4 shadow-md">
              <p className="mb-3 text-lg font-bold">My Folders</p>
              {FolderHelper.findTopLevel(data).map((folder) => (
                <FolderRow key={folder.id} folders={data} folder={folder} />
              ))}
            </div>
          ) : (
            <Spinner />
          )
        ) : (
          <div className="">Something went wrong.</div>
        )}
      </div>
    </Layout>
  )
}
