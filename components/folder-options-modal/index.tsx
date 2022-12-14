import { useRouter } from "next/router"
import React from "react"
import useSWR from "swr"

import { useToast } from "../../providers/toast.provider"
import { requestHelper } from "../../services/requestHelper"
import { useErrorHandler } from "../../services/useErrorHandler"
import useModalStore from "../../store/modal.store"
import { Folder } from "../../types/prisma.types"
import BaseModal from "../base-modal"
import Spinner from "../spinner"

interface Props {
  isOpen: boolean
  fetchFolders?: () => void
  className?: string
}

export default function FolderOptionsModal({ isOpen, fetchFolders }: Props) {
  const router = useRouter()
  const currentModal = useModalStore((state) => state.currentModal)
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const { errorHandler } = useErrorHandler()
  const { createToast } = useToast()

  const { data, error, isLoading } = useSWR("myFolder", () =>
    errorHandler(
      async () =>
        await requestHelper.getSpecific<Folder>(
          "folders",
          currentModal.id as string
        )
    )
  )

  return (
    <BaseModal title="Folder Options" isOpen={isOpen} onClose={closeModal}>
      {!error ? (
        !isLoading && data ? (
          <div className="w-full space-y-3">
            <div className="w-full rounded-md bg-gray-100 py-1 px-3 text-gray-400 outline-none">
              {data.title}
            </div>
            <button
              onClick={() =>
                openModal({
                  modal: "confirm",
                  action: async () => {
                    await requestHelper.delete<Folder>(
                      "folders",
                      currentModal.id as string
                    )
                    router.push("/")
                    fetchFolders && (await fetchFolders())
                    createToast({
                      title: "Success.",
                      subtitle: "You have successfully deleted the folder.",
                      expiration: 10000,
                      type: "success",
                    })
                  },
                })
              }
              className="w-full rounded-md bg-rose-500 px-2 py-1 text-white outline-none hover:bg-rose-600"
            >
              Delete Folder
            </button>
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
