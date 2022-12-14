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

export default function TaskModal({ isOpen }: Props) {
  const currentModal = useModalStore((state) => state.currentModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const { errorHandler } = useErrorHandler()

  const { data, error, isLoading, isValidating } = useSWR(
    `tasks/${currentModal.id}`,
    () =>
      errorHandler(
        async () =>
          await requestHelper.getSpecific<Task>(
            "tasks",
            currentModal.id as string
          )
      )
  )

  return (
    <BaseModal title="" isOpen={isOpen} onClose={closeModal}>
      {!error ? (
        !isLoading && data ? (
          <div className="w-full">
            <div className="prose mt-3 max-h-[512px] w-full select-text flex-col overflow-x-hidden text-sm scrollbar-hide prose-a:text-blue-500 prose-code:h-max">
              <Marked>{data.description}</Marked>
            </div>
            {/* <CustomButton style={ButtonStyle.BASE_PRIMARY} text="a" /> */}
          </div>
        ) : (
          <Spinner />
        )
      ) : (
        <div className="">Something went wrong.</div>
      )}
    </BaseModal>
  )
}
