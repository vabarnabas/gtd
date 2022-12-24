import { useRouter } from "next/router"
import { HiPlus } from "react-icons/hi"

import useModalStore from "../../store/modal.store"
import TaskRow from "../task-row"

export default function EmptyTaskRow() {
  const openModal = useModalStore((state) => state.openModal)
  const router = useRouter()
  const id = router.query.id as string

  return (
    <div
      onClick={() => openModal({ modal: "new-task", id })}
      className="group relative h-full w-full rounded-b-lg only:rounded-lg"
    >
      <div className="invisible">
        <TaskRow id="empty" description="" status="" title="" />
      </div>
      <div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-b-lg bg-white text-blue-500 hover:bg-blue-50 group-only:rounded-lg">
        <HiPlus className="duration-400 text-xl transition-all ease-out group-hover:scale-[1.10]" />
      </div>
    </div>
  )
}
