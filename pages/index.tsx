import { useEffect, useState } from "react"
import Layout from "../components/layout"
import TaskCard from "../components/task-card"
import { makeRequest } from "../services/makeRequest"
import TokenService from "../services/token.service"
import { Task } from "../types/prisma.types"

export default function Home() {
  const tokenservice = new TokenService()
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => {
    const getData = async () => {
      const token = await tokenservice.getToken()
      const data = await makeRequest("GET", {
        baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
        path: "tasks",
        token,
      })

      setTasks(data)
    }

    getData()
  }, [])

  return (
    <Layout>
      <div className="flex h-full w-full flex-col items-center rounded-md px-4 pt-4 pb-2 shadow">
        <div className="h-full w-full overflow-y-auto pr-3">
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
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {tasks.length !== 0 &&
              tasks.map((task) => <TaskCard {...task} key={task.id} />)}
          </div>
        </div>
      </div>
    </Layout>
  )
}
