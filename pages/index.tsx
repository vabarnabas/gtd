import BreadCrumb from "../components/breadcrumb"
import Layout from "../components/layout"
import TaskCard from "../components/task-card"
import useFolderStore from "../store/folder.store"
import { v4 as uuidv4 } from "uuid"
import NewTaskModal from "../components/new-task-modal"

export default function Home() {
  return (
    <Layout>
      <div className="flex h-full w-full flex-col items-center rounded-md px-4 pt-4 pb-2 shadow">
        <NewTaskModal isOpen={true} onClose={() => {}} />

        <div className="h-full overflow-y-auto pr-3">
          {/* <BreadCrumb
            className="mb-3 w-full text-sm"
            path={folders.map((folder) => {
              return {
                name: folder.name,
                path: folder.parentFolderId,
                id: folder.id,
              }
            })}
          /> */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            <TaskCard />
            <TaskCard />
            <TaskCard />
            <TaskCard />
            <TaskCard />
            <TaskCard />
            <TaskCard />
          </div>
        </div>
      </div>
    </Layout>
  )
}
