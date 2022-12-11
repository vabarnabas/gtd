import Head from "next/head"
import useModalStore from "../../store/modal.store"
import ChangePasswordModal from "../change-password-modal"
import Navbar from "../navbar"
import NewTaskModal from "../new-task-modal"
import Toast from "../toast"
import ToastHandler from "../toast/toast-handler"

interface Props {
  children: JSX.Element
  fetchTasks?: () => void
}

export default function Layout({ children, fetchTasks }: Props) {
  const currentModal = useModalStore((state) => state.currentModal)
  const closeModal = useModalStore((state) => state.closeModal)

  return (
    <div className="h-screen w-screen select-none bg-gray-100 text-slate-700">
      <Head>
        <title>GTD App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <ToastHandler position="topRight" toastComponent={Toast} />
      <div className="h-full w-full pt-12">{children}</div>
      <ChangePasswordModal isOpen={currentModal.modal === "change-password"} />
      <NewTaskModal
        fetchTasks={fetchTasks && fetchTasks}
        isOpen={currentModal.modal === "new-task"}
      />
    </div>
  )
}
