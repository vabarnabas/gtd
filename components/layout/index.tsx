import Head from "next/head"

import useModalStore from "../../store/modal.store"
import ChangeFolderModal from "../change-folder-modal"
import ChangePasswordModal from "../change-password-modal"
import ConfirmModal from "../confirm-modal"
import Navbar from "../navbar"
import NewFolderModal from "../new-folder-modal"
import NewSubtaskModal from "../new-subtask-modal"
import NewTaskModal from "../new-task-modal"
import Toast from "../toast"
import ToastHandler from "../toast/toast-handler"

interface Props {
  children: JSX.Element
  fetchTasks?: () => void
  fetchFolders?: () => void
}

export default function Layout({ children, fetchTasks, fetchFolders }: Props) {
  const currentModal = useModalStore((state) => state.currentModal)

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
      {currentModal.modal === "confirm" && currentModal.action ? (
        <ConfirmModal isOpen={currentModal.modal === "confirm"} />
      ) : null}
      {currentModal.modal === "change-password" ? (
        <ChangePasswordModal
          isOpen={currentModal.modal === "change-password"}
        />
      ) : null}
      {currentModal.modal === "change-folder" &&
      currentModal.id !== undefined ? (
        <ChangeFolderModal
          fetchTasks={fetchTasks && fetchTasks}
          isOpen={
            currentModal.modal === "change-folder" &&
            currentModal.id !== undefined
          }
        />
      ) : null}
      {currentModal.modal === "new-task" ? (
        <NewTaskModal
          fetchTasks={fetchTasks && fetchTasks}
          isOpen={currentModal.modal === "new-task"}
        />
      ) : null}
      {currentModal.modal === "new-folder" ? (
        <NewFolderModal
          fetchFolders={fetchFolders && fetchFolders}
          isOpen={currentModal.modal === "new-folder"}
        />
      ) : null}
      {currentModal.modal === "new-subtask" && currentModal.id !== undefined ? (
        <NewSubtaskModal
          fetchTasks={fetchTasks && fetchTasks}
          isOpen={
            currentModal.modal === "new-subtask" &&
            currentModal.id !== undefined
          }
        />
      ) : null}
    </div>
  )
}
