import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { BiCheckbox } from "react-icons/bi"
import { HiFolder } from "react-icons/hi"
import { TiFlowChildren } from "react-icons/ti"
import useSWR from "swr"
import * as yup from "yup"

import { TaskHelper } from "../../helpers/TaskHelper"
import { useToast } from "../../providers/toast.provider"
import { requestHelper } from "../../services/requestHelper"
import { useErrorHandler } from "../../services/useErrorHandler"
import useModalStore from "../../store/modal.store"
import { Folder, Task } from "../../types/prisma.types"
import BaseModal from "../base-modal"
import CustomButton, { ButtonStyle } from "../inputs/custom-button"
import CustomListbox from "../inputs/custom-listbox"
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

export default function NewTaskModal({ isOpen, fetchTasks }: Props) {
  const currentModal = useModalStore((state) => state.currentModal)
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

  const [selectedStatus, setSelectedStatus] = useState(itemStates[0])
  const [selectedFolder, setSelectedFolder] = useState<Folder>({} as Folder)
  const [selectedTask, setSelectedTask] = useState<Task>({
    id: "",
    title: "No Parent",
    parentId: null,
    userId: "",
    createdAt: new Date(Date.now()),
  } as Task)
  const { createToast } = useToast()

  const {
    data: folderData,
    error: folderError,
    isLoading: folderIsLoading,
  } = useSWR("fetchFolders", () =>
    errorHandler(async () => await requestHelper.getMy<Folder>("folders"))
  )

  const { data: taskData, isLoading: taskIsLoading } = useSWR(
    "fetchTasks",
    () => errorHandler(async () => await requestHelper.getMy<Task>("tasks"))
  )

  useEffect(() => {
    if (!taskIsLoading && taskData && currentModal.secondaryId) {
      setSelectedTask(TaskHelper.findTask(taskData, currentModal.secondaryId))
    }
  }, [taskIsLoading, taskData, currentModal])

  useEffect(() => {
    if (!folderIsLoading && folderData) {
      currentModal.id
        ? setSelectedFolder(
            (folderData as Folder[]).filter(
              (folder) => folder.id === currentModal.id
            )[0]
          )
        : setSelectedFolder(folderData[0])
    }
  }, [folderIsLoading, folderData, currentModal])

  const defaultValues: FormValues = {
    title: "",
    description: "",
    status: selectedStatus.name,
    folderId: "",
    parentId: null,
  }

  const schema = yup.object().shape({
    title: yup.string().required("Required Field"),
    description: yup.string().required("Required Field"),
    status: yup.string().required("Required Field"),
  })

  const form = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  })
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = form
  const onSubmit = handleSubmit((data) => createTask(data as Task))

  const createTask = (data: Task) => {
    errorHandler(async () => {
      const user = await requestHelper.currentUser()

      await requestHelper.create<Task>("tasks", {
        ...data,
        userId: user.id,
        folderId: selectedFolder.id,
        parentId: selectedTask?.id === "" ? null : selectedTask.id,
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

  console.log(getValues())

  return (
    <BaseModal title="Create New Task" isOpen={isOpen} onClose={closeModal}>
      {!folderIsLoading && folderData && !taskIsLoading && taskData ? (
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
                rows={5}
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
            <CustomListbox
              value={selectedTask}
              onChange={(e) => {
                setValue("parentId", e.title)
                setSelectedTask(e)
              }}
              icon={<TiFlowChildren />}
              options={
                [{ id: "", title: "No Parent" }, ...taskData] as Folder[]
              }
            />
            <CustomListbox
              value={selectedFolder}
              onChange={(e) => {
                setValue("folderId", e.title)
                setSelectedFolder(e)
              }}
              icon={<HiFolder />}
              options={folderData as Folder[]}
            />
            <CustomListbox
              value={selectedStatus}
              onChange={(e) => {
                setValue("status", e.title)
                setSelectedStatus(e)
              }}
              icon={<BiCheckbox />}
              options={itemStates}
              selectionKey="name"
            />
            <CustomButton text="Create" style={ButtonStyle.BASE_PRIMARY} />
          </form>
        </FormProvider>
      ) : (
        <Spinner />
      )}
    </BaseModal>
  )
}
