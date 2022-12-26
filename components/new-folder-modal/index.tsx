import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { TiFlowChildren } from "react-icons/ti"
import useSWR from "swr"
import * as yup from "yup"

import { FolderHelper } from "../../helpers/FolderHelper"
import { useToast } from "../../providers/toast.provider"
import { requestHelper } from "../../services/requestHelper"
import { useErrorHandler } from "../../services/useErrorHandler"
import useModalStore from "../../store/modal.store"
import { Folder } from "../../types/prisma.types"
import BaseModal from "../base-modal"
import CustomListbox from "../inputs/custom-listbox"
import Spinner from "../spinner"

interface Props {
  isOpen: boolean
  fetchFolders?: () => void
  className?: string
}

interface FormValues {
  title: string
  parentId: string
}

export default function NewFolderModal({ isOpen, fetchFolders }: Props) {
  const currentModal = useModalStore((state) => state.currentModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const { errorHandler } = useErrorHandler()

  const [selectedFolder, setSelectedFolder] = useState<Folder>({
    id: "",
    title: "No Parent",
    createdAt: new Date(Date.now()),
    userId: "",
    parentId: null,
    sharedWith: [],
  })
  const { createToast } = useToast()

  const { data, error, isLoading } = useSWR("/folders/my", () =>
    errorHandler(async () => await requestHelper.getMy<Folder>("folders"))
  )

  useEffect(() => {
    if (!isLoading && data && currentModal.id) {
      setSelectedFolder(FolderHelper.findFolder(data, currentModal.id))
    }
  }, [isLoading, data, currentModal])

  const defaultValues: FormValues = {
    title: "",
    parentId: "",
  }

  const schema = yup.object().shape({
    title: yup.string().required("Required Field"),
  })

  const form = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  })
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form
  const onSubmit = handleSubmit((data) => createFolder(data as Folder))

  const createFolder = async (data: Folder) => {
    errorHandler(async () => {
      const user = await requestHelper.currentUser()

      await requestHelper.create<Folder>("folders", {
        ...data,
        userId: user.id,
        parentId: selectedFolder?.id === "" ? null : selectedFolder.id,
      })
      fetchFolders && (await fetchFolders())
      closeModal()
      createToast({
        title: "Success",
        subtitle: "You have successfully created a new folder.",
        expiration: 10000,
        type: "success",
      })
    })
  }

  return (
    <BaseModal title="Create New Folder" isOpen={isOpen} onClose={closeModal}>
      {!error ? (
        !isLoading && data ? (
          <FormProvider {...form}>
            <form className="w-full space-y-3" onSubmit={onSubmit}>
              <div className="">
                <input
                  className="w-full rounded-md bg-gray-100 py-1 px-3 outline-none dark:bg-[#333] dark:text-gray-50"
                  {...register("title")}
                  placeholder="Title"
                />
                {errors.title?.message && (
                  <p className="mt-0.5 pl-2 text-xs text-rose-500">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <CustomListbox
                value={selectedFolder}
                onChange={(e) => {
                  setValue("parentId", e.title)
                  setSelectedFolder(e)
                }}
                icon={<TiFlowChildren />}
                options={[{ id: "", title: "No Parent" }, ...data] as Folder[]}
              />
              <button className="w-full rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
                Create
              </button>
            </form>
          </FormProvider>
        ) : (
          <Spinner />
        )
      ) : (
        <div className="">Something went wrong.</div>
      )}
    </BaseModal>
  )
}
