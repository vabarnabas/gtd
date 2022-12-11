import { useEffect, useRef, useState } from "react"
import Layout from "../components/layout"
import Spinner from "../components/spinner"
import TaskCard from "../components/task-card"
import TaskGrid from "../components/task-grid"
import { useToast } from "../providers/toast.provider"
import { requestHelper } from "../services/requestHelper"
import { Task } from "../types/prisma.types"

export default function Home() {
  const { createToast } = useToast()

  const [tasks, setTasks] = useState<Task[]>([])
  const fetchTasks = async () => {
    try {
      const data = await requestHelper.getMy<Task>("tasks")
      setTasks(data)
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
    fetchTasks()
  }, [])

  return (
    <Layout fetchTasks={fetchTasks}>
      <div className="flex h-full w-full flex-col items-center rounded-md px-4 pt-4 pb-2 shadow">
        {tasks.length !== 0 ? (
          <div className="h-full w-full overflow-y-auto">
            <TaskGrid tasks={tasks} fetchTasks={fetchTasks} />
          </div>
        ) : (
          <Spinner />
        )}
      </div>
    </Layout>
  )
}
