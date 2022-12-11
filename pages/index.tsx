import autoAnimate from "@formkit/auto-animate"
import { useEffect, useRef, useState } from "react"
import Layout from "../components/layout"
import TaskCard from "../components/task-card"
import { requestHelper } from "../services/requestHelper"
import { Task } from "../types/prisma.types"

export default function Home() {
  const parent = useRef(null)

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  const status = {
    "To Do": 1,
    "In Progress": 2,
    Done: 3,
    Closed: 4,
  }

  const [tasks, setTasks] = useState<Task[]>([])
  const fetchTasks = async () => {
    const data = await requestHelper.getAll<Task>("tasks")
    setTasks(data)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <Layout>
      <div className="flex h-full w-full flex-col items-center rounded-md px-4 pt-4 pb-2 shadow">
        <div className="h-full w-full overflow-y-auto pr-3">
          <div
            ref={parent}
            className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          >
            {tasks.length !== 0 &&
              tasks
                .sort(
                  (a, b) =>
                    status[
                      a.status as "To Do" | "In Progress" | "Done" | "Closed"
                    ] -
                    status[
                      b.status as "To Do" | "In Progress" | "Done" | "Closed"
                    ]
                )
                .map((task) => (
                  <TaskCard fetchTasks={fetchTasks} {...task} key={task.id} />
                ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
