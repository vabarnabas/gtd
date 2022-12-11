import useModalStore from "../../store/modal.store"
import Navbar from "../navbar"
import NewTaskModal from "../new-task-modal"

interface Props {
  children: JSX.Element
}

export default function Layout({ children }: Props) {
  const currentModal = useModalStore((state) => state.currentModal)
  const closeModal = useModalStore((state) => state.closeModal)

  return (
    <div className="h-screen w-screen select-none bg-gray-100 text-slate-700">
      <Navbar />
      <div className="h-full w-full pt-12">{children}</div>
      <NewTaskModal isOpen={currentModal === "new-task"} />
    </div>
  )
}
