import { useRouter } from "next/router"
import { HiPlus } from "react-icons/hi"

import useModalStore from "../../store/modal.store"
import TaskCard from "../task-card"

interface Props {
  action?: () => void
}

export default function EmptyTaskCard({ action }: Props) {
  const openModal = useModalStore((state) => state.openModal)
  const router = useRouter()
  const id = router.query.id as string

  return (
    <div
      onClick={() => openModal({ modal: "new-task", id })}
      className="group relative box-border h-full w-full rounded-lg shadow-md"
    >
      <TaskCard id="empty" description="" status="" title="" />
      <div className="absolute inset-0 box-border flex cursor-pointer items-center justify-center rounded-lg border-2 border-blue-500 bg-white text-blue-500 hover:bg-blue-50">
        <HiPlus className="duration-400 text-4xl transition-all ease-out group-hover:scale-[1.10]" />
      </div>
    </div>
  )
}
