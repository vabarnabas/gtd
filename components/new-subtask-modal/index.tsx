import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import { useToast } from "../../providers/toast.provider"
import { requestHelper } from "../../services/requestHelper"
import { useErrorHandler } from "../../services/useErrorHandler"
import useModalStore from "../../store/modal.store"
import { Folder, Task } from "../../types/prisma.types"
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
}

export default function NewSubtaskModal({ isOpen, fetchTasks }: Props) {
  const closeModal = useModalStore((state) => state.closeModal)
  const { errorHandler } = useErrorHandler()

  const itemStates = [
    {
      name: "To Do",
      className: "bg-gray-100 text-gray-500",
    },
    {
      name: "In Progress",
      className: "bg-blue-100 text-blue-500",
    },
    {
      name: "Done",
      className: "bg-green-100 text-green-500",
    },
    {
      name: "Closed",
      className: "bg-rose-100 text-rose-500",
    },
  ]

  const [selected, setSelected] = useState(itemStates[0])
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<Folder>({} as Folder)
  const { createToast } = useToast()

  useEffect(() => {
    const getData = async () => {
      const data = await requestHelper.getMy<Folder>("folders")
      setSelectedFolder(data[0])
      setFolders(data)
    }

    getData()
  }, [])

  const defaultValues: FormValues = {
    title: "",
    description: "",
    status: selected.name,
    folderId: "",
  }

  const schema = z.object({
    title: z.string().min(1, "Required Field"),
    description: z.string().min(1, "Required Field"),
    status: z.string().min(1, "Required Field"),
  })

  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  })
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form
  const onSubmit = handleSubmit((data) => createTask(data as Task))

  const createTask = async (data: Task) => {
    errorHandler(async () => {
      const user = await requestHelper.currentUser()

      await requestHelper.create<Task>("tasks", {
        ...data,
        userId: user.id,
        folderId: selectedFolder.id,
      })
      fetchTasks && (await fetchTasks())
      closeModal()
      createToast({
        title: "Success.",
        subtitle: "You have successfully created a new task.",
        expiration: 10000,
        type: "success",
      })
    })
  }

  return (
    <BaseModal title="Create New Task" isOpen={isOpen} onClose={closeModal}>
      {folders.length !== 0 ? (
        <FormProvider {...form}>
          <form className="w-full space-y-3" onSubmit={onSubmit}>
            <div className="">
              <input
                className="w-full rounded-md bg-gray-100 py-1 px-3 outline-none"
                {...register("title")}
                placeholder="Title"
              />
              {errors.title?.message && (
                <p className="mt-0.5 pl-2 text-xs text-rose-500">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="">
              <textarea
                className="w-full resize-none rounded-md bg-gray-100 py-1 px-3 outline-none"
                {...register("description")}
                placeholder="Description"
              />
              {errors.description?.message && (
                <p className="mt-0.5 pl-2 text-xs text-rose-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <button className="w-full rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
              Create
            </button>
          </form>
        </FormProvider>
      ) : (
        <Spinner />
      )}
    </BaseModal>
  )
}
