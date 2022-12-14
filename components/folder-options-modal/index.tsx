import React from "react"
import { FormProvider, useForm } from "react-hook-form"
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

interface FormValues {
  parentId: string
}

export default function FolderOptionsModal({ isOpen, fetchFolders }: Props) {
  const currentModal = useModalStore((state) => state.currentModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const { errorHandler } = useErrorHandler()

  const { createToast } = useToast()

  const { data, error, isLoading, mutate } = useSWR("fetchFolders", () =>
    errorHandler(
      async () =>
        await requestHelper.getSpecific<Folder>(
          "folders",
          currentModal.id as string
        )
    )
  )

  const defaultValues: FormValues = {
    parentId: "",
  }

  const form = useForm<FormValues>({
    defaultValues,
  })
  const { handleSubmit } = form
  const onSubmit = handleSubmit(() => {})

  return (
    <BaseModal title="Folder Options" isOpen={isOpen} onClose={closeModal}>
      {!isLoading && data ? (
        <FormProvider {...form}>
          <form className="w-full space-y-3" onSubmit={onSubmit}>
            <div className="w-full rounded-md bg-gray-100 py-1 px-3 text-gray-400 outline-none">
              {data.title}
            </div>
          </form>
        </FormProvider>
      ) : (
        <Spinner />
      )}
    </BaseModal>
  )
}
