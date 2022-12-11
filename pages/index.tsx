import { useEffect, useRef, useState } from "react"
import FolderRow from "../components/folder-row"
import Layout from "../components/layout"
import Spinner from "../components/spinner"
import TaskCard from "../components/task-card"
import TaskGrid from "../components/task-grid"
import { FolderHelper } from "../helpers/FolderHelper"
import { useToast } from "../providers/toast.provider"
import { requestHelper } from "../services/requestHelper"
import { Folder, Task } from "../types/prisma.types"

export default function Home() {
  const { createToast } = useToast()

  const [folders, setFolders] = useState<Folder[]>([])
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
  }, [])

  return (
    <Layout>
      <div className="flex h-full w-full flex-col items-center rounded-md px-4 pt-4 pb-2 shadow">
        {folders.length !== 0 ? (
          <div className="w-full rounded-md bg-white p-4 shadow-md">
            <p className="mb-3 text-lg font-bold">My Folders</p>
            {FolderHelper.findTopLevel(folders).map((folder) => (
              <FolderRow folders={folders} folder={folder} />
            ))}
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </Layout>
  )
}
