import { HiPlus } from "react-icons/hi"
import useSWR from "swr"

import FolderRow from "../components/folder-row"
import Layout from "../components/layout"
import Spinner from "../components/spinner"
import { FolderHelper } from "../helpers/FolderHelper"
import { requestHelper } from "../services/requestHelper"
import { useErrorHandler } from "../services/useErrorHandler"
import useModalStore from "../store/modal.store"
import { Folder } from "../types/prisma.types"

export default function Home() {
  const { errorHandler } = useErrorHandler()
  const openModal = useModalStore((state) => state.openModal)

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
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  openModal({ modal: "new-folder" })
                  // router.push(`/${folder.id}`)
                }}
                className="group mt-6 flex cursor-pointer items-center rounded-md border-blue-500 py-1.5 px-2 text-xs text-blue-500 hover:bg-blue-50"
              >
                <HiPlus />
                <p className="ml-1.5">Create New Folder</p>
              </div>
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
