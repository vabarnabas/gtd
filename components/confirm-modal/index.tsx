import React from "react"

import { useErrorHandler } from "../../services/useErrorHandler"
import useModalStore from "../../store/modal.store"
import BaseModal from "../base-modal"

interface Props {
  isOpen: boolean
  className?: string
}

export default function ConfirmModal({ isOpen }: Props) {
  const currentModal = useModalStore((state) => state.currentModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const { errorHandler } = useErrorHandler()

  return (
    <BaseModal title="Confirm" isOpen={isOpen} onClose={closeModal}>
      <div>
        <div className="flex items-center justify-center gap-x-4">
          <p className="flex aspect-square h-10 items-center justify-center rounded-full bg-blue-200 text-lg text-blue-500">
            ?
          </p>
          <p className="text-left text-base">
            Are you sure you would like to continue with this action? It cannot
            be reverted in the future.
          </p>
        </div>
        <div className="mt-6 flex justify-between">
          <button
            onClick={(e) => {
              e.preventDefault()
              errorHandler(async () => {
                currentModal.action && (await currentModal.action())
                closeModal()
              })
            }}
            className="rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
          >
            Continue
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              closeModal()
            }}
            className="rounded-md px-2 py-1 text-blue-500 hover:text-blue-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
