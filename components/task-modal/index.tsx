import Marked from "marked-react"
import React from "react"
import useSWR from "swr"

import { requestHelper } from "../../services/requestHelper"
import { useErrorHandler } from "../../services/useErrorHandler"
import useModalStore from "../../store/modal.store"
import { Task } from "../../types/prisma.types"
import BaseModal from "../base-modal"
import Spinner from "../spinner"

interface Props {
  isOpen: boolean
  fetchTasks?: () => void
  className?: string
}

interface FormValues {
  title: string
  description: string
  status: string
  folderId: string
  parentId: string | null
}

export default function TaskModal({ isOpen, fetchTasks }: Props) {
  const currentModal = useModalStore((state) => state.currentModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const { errorHandler } = useErrorHandler()

  // const itemStates = [
  //   {
  //     name: "To Do",
  //     className: "bg-gray-100 text-gray-500",
  //   },
  //   {
  //     name: "In Progress",
  //     className: "bg-blue-100 text-blue-500",
  //   },
  //   {
  //     name: "Done",
  //     className: "bg-green-100 text-green-500",
  //   },
  //   {
  //     name: "Closed",
  //     className: "bg-rose-100 text-rose-500",
  //   },
  // ]

  const { data: taskData, isLoading: taskIsLoading } = useSWR(
    "getTask",
    () =>
      errorHandler(
        async () =>
          await requestHelper.getSpecific<Task>(
            "tasks",
            currentModal.id as string
          )
      ),
    { keepPreviousData: false, revalidateIfStale: true }
  )

  console.log(taskData)

  return (
    <BaseModal title="" isOpen={isOpen} onClose={closeModal}>
      {!taskIsLoading && taskData ? (
        <div className="flex w-full">
          <div className="prose mt-3 max-h-[512px] w-full select-text flex-col overflow-x-hidden text-sm scrollbar-hide prose-a:text-blue-500 prose-code:h-max">
            <Marked>{taskData.description}</Marked>
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </BaseModal>
  )
}
