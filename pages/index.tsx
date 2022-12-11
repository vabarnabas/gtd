import { useEffect, useState } from "react"
import Layout from "../components/layout"
import TaskCard from "../components/task-card"
import { requestHelper } from "../services/requestHelper"
import { Task } from "../types/prisma.types"

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  useEffect(() => {
    const getData = async () => {
      const data = await requestHelper.getAll<Task>("tasks")
      setTasks(data)
    }

    getData()
  }, [])

  return (
    <Layout>
      <div className="flex h-full w-full flex-col items-center rounded-md px-4 pt-4 pb-2 shadow">
        <div className="h-full w-full overflow-y-auto pr-3">
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {tasks.length !== 0 &&
              tasks.map((task) => <TaskCard {...task} key={task.id} />)}
          </div>
        </div>
      </div>
    </Layout>
  )
}
