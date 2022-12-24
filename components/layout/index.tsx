import clsx from "clsx"
import Head from "next/head"
import { useRouter } from "next/router"

import { FolderHelper } from "../../helpers/FolderHelper"
import useModalStore from "../../store/modal.store"
import { Folder } from "../../types/prisma.types"
import BreadCrumb from "../breadcrumb"
import ChangeFolderModal from "../change-folder-modal"
import ChangePasswordModal from "../change-password-modal"
import ConfirmModal from "../confirm-modal"
import FolderList from "../folder-list"
import FolderOptionsModal from "../folder-options-modal"
import Navbar from "../navbar"
import NewFolderModal from "../new-folder-modal"
import NewTaskModal from "../new-task-modal"
import Spinner from "../spinner"
import TaskModal from "../task-modal"
import Toast from "../toast"
import ToastHandler from "../toast/toast-handler"

interface Props {
  children: JSX.Element
  fetchTasks?: () => void
  fetchFolders?: () => void
  folders: Folder[]
}

export default function Layout({
  children,
  fetchTasks,
  fetchFolders,
  folders,
}: Props) {
  const router = useRouter()
  const id = router.query.id as string | undefined
  const currentModal = useModalStore((state) => state.currentModal)
  const openModal = useModalStore((state) => state.openModal)

  return (
    <div className="h-screen w-screen select-none text-gray-800 dark:bg-[#222] dark:text-gray-50">
      <Head>
        <title>NoteBox</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      {folders && folders.length !== 0 ? (
        <>
          {folders && folders.length !== 0 ? (
            <div className="fixed inset-x-0 top-12 flex h-12 items-center px-6">
              <BreadCrumb
                path={
                  id
                    ? [
                        ...FolderHelper.findDeepParents(folders, id).reverse(),
                        FolderHelper.findFolder(folders, id),
                      ].map((folder) => {
                        return {
                          label: folder.title,
                          path: FolderHelper.isSame(folder, id)
                            ? undefined
                            : `/${folder.id}`,
                        }
                      })
                    : []
                }
              />
              <p
                onClick={() => {
                  id && openModal({ modal: "folder-options", id })
                }}
                className={clsx("ml-auto w-min cursor-pointer text-sm", {
                  "text-blue-500 hover:text-blue-600 hover:underline": id,
                  "cursor-not-allowed text-gray-400": !id,
                })}
              >
                Options
              </p>
            </div>
          ) : null}
          <ToastHandler position="topRight" toastComponent={Toast} />
          <div className="flex h-full w-full gap-x-8 px-6 pt-24 pb-2">
            <div
              className={clsx("", {
                "hidden flex-col md:flex": id,
                "w-full md:w-auto": !id,
              })}
            >
              <FolderList folders={folders} />
            </div>
            <div className={clsx("w-full", { "hidden md:block": !id })}>
              {children}
            </div>
          </div>
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
          {currentModal.modal === "task" && currentModal.id !== undefined ? (
            <TaskModal
              fetchTasks={fetchTasks && fetchTasks}
              isOpen={
                currentModal.modal === "task" && currentModal.id !== undefined
              }
            />
          ) : null}
          {currentModal.modal === "folder-options" &&
          currentModal.id !== undefined ? (
            <FolderOptionsModal
              fetchFolders={fetchFolders && fetchFolders}
              isOpen={
                currentModal.modal === "folder-options" &&
                currentModal.id !== undefined
              }
            />
          ) : null}
        </>
      ) : (
        <Spinner />
      )}
    </div>
  )
}
