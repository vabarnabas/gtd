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
      <div className="flex h-full w-full flex-col items-center rounded-md px-6 pt-6 pb-2">
        {!error ? (
          !isLoading && data ? (
            <div className="w-full rounded-md bg-white">
              <div className="mb-5">
                <p className="text-2xl font-bold">My Folders</p>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    openModal({ modal: "new-folder" })
                    // router.push(`/${folder.id}`)
                  }}
                  className="mt-2 flex w-max cursor-pointer items-center justify-center rounded-md text-sm text-blue-500 hover:text-blue-600"
                >
                  <HiPlus className="" />
                  <p className="ml-1">Create New Folder</p>
                </div>
              </div>
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
