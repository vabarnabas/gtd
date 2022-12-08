import { HiFolder } from "react-icons/hi"
import BreadCrumb from "../components/breadcrumb"
import Layout from "../components/layout"
import TaskCard from "../components/task-card"

export default function Home() {
  return (
    <Layout>
      <div className="flex h-full w-full flex-col items-center rounded-md px-4 pt-4 pb-2 shadow">
        <div className="h-full overflow-y-auto pr-3">
          <BreadCrumb
            className="mb-3 w-full text-sm"
            path={[
              {
                name: "Folder 1",
                path: "a",
              },
              {
                name: "Folder 2",
              },
            ]}
          />
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
