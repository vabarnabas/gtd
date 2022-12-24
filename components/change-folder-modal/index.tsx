import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { TiFlowChildren } from "react-icons/ti"

import { FolderHelper } from "../../helpers/FolderHelper"
import { useToast } from "../../providers/toast.provider"
import { requestHelper } from "../../services/requestHelper"
import { useErrorHandler } from "../../services/useErrorHandler"
import useModalStore from "../../store/modal.store"
import { Folder, Task } from "../../types/prisma.types"
import BaseModal from "../base-modal"
import CustomListbox from "../inputs/custom-listbox"
import Spinner from "../spinner"

interface Props {
  isOpen: boolean
  fetchTasks?: () => void
  className?: string
}

interface FormValues {
  parentId: string
}

export default function ChangeFolderModal({ isOpen, fetchTasks }: Props) {
  const currentModal = useModalStore((state) => state.currentModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const { errorHandler } = useErrorHandler()

  const [task, setTask] = useState<Task>({} as Task)
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<Folder>({} as Folder)
  const { createToast } = useToast()

  useEffect(() => {
    errorHandler(async () => {
      const taskData = await requestHelper.getSpecific<Task>(
        "tasks",
        currentModal.id as string
      )

      setTask(taskData)

      const foldersData = await requestHelper.getMy<Folder>("folders")

      setFolders(foldersData)
    })
  }, [currentModal.id, errorHandler])

  useEffect(() => {
    if (folders.length !== 0 && Object.keys(task).length !== 0) {
      setSelectedFolder(folders.filter((f) => f.id === task.folderId)[0])
    }
  }, [folders, task])

  const defaultValues: FormValues = {
    parentId: "",
  }

  const form = useForm<FormValues>({
    defaultValues,
  })
  const { handleSubmit, setValue } = form
  const onSubmit = handleSubmit(() => changeFolder())

  const changeFolder = async () => {
    errorHandler(async () => {
      await requestHelper.update<Task>(
        "tasks",
        { folderId: selectedFolder.id },
        task.id
      )
      fetchTasks && (await fetchTasks())
      closeModal()
      createToast({
        title: "Success",
        subtitle: "You have successfully updated the folder.",
        expiration: 10000,
        type: "success",
      })
    })
  }

  return (
    <BaseModal title="Change Folder" isOpen={isOpen} onClose={closeModal}>
      {Object.keys(task).length !== 0 && folders.length !== 0 ? (
        <FormProvider {...form}>
          <form className="w-full space-y-3" onSubmit={onSubmit}>
            <div className="w-full rounded-md bg-gray-100 py-1 px-3 text-gray-400 outline-none dark:bg-[#333] dark:text-gray-300">
              {`${
                FolderHelper.findFolder(folders, task.folderId as string).title
              } / ${task.title}`}
            </div>
            <CustomListbox
              value={selectedFolder}
              onChange={(e) => {
                setValue("parentId", e.title)
                setSelectedFolder(e)
              }}
              icon={<TiFlowChildren />}
              options={[{ id: "", title: "No Parent" }, ...folders] as Folder[]}
            />
            <button className="w-full rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
              Update
            </button>
          </form>
        </FormProvider>
      ) : (
        <Spinner />
      )}
    </BaseModal>
  )
}
