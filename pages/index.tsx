import { useCallback, useEffect, useState } from "react"

import Layout from "../components/layout"
import { requestHelper } from "../services/requestHelper"
import TokenService from "../services/token.service"
import { useErrorHandler } from "../services/useErrorHandler"
import { Folder } from "../types/prisma.types"

export default function Home() {
  const { errorHandler } = useErrorHandler()

  const tokenservice = new TokenService()
  const [folders, setFolders] = useState<Folder[]>([])
  const fetchFolders = useCallback(() => {
    errorHandler(async () => {
      const data = await requestHelper.getMy<Folder>("folders")
      setFolders(data)
    })
  }, [errorHandler])

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  return (
    <Layout fetchFolders={fetchFolders}>
      {/* <div className="flex h-full w-full flex-col items-center rounded-md px-4 pt-4 pb-2 shadow">
        {folders.length !== 0 ? (
          <div className="w-full rounded-md bg-white p-4 shadow-md">
            <p className="mb-3 text-lg font-bold">My Folders</p>
            {FolderHelper.findTopLevel(folders).map((folder) => (
              <FolderRow key={folder.id} folders={folders} folder={folder} />
            ))}
          </div>
        ) : (
          <Spinner />
        )}
      </div> */}

      <div className="">
        <p className="">{"folders: " + JSON.stringify(folders)}</p>
        <p className="">{"token: " + tokenservice.getToken()}</p>
      </div>
    </Layout>
  )
}
