import { Listbox, Transition } from "@headlessui/react"
import clsx from "clsx"
import React, { Fragment, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { HiOutlineChevronDown } from "react-icons/hi"

import { FolderHelper } from "../../helpers/FolderHelper"
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
        title: "Success.",
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
            <div className="w-full rounded-md bg-gray-100 py-1 px-3 text-gray-400 outline-none">
              {`${
                FolderHelper.findFolder(folders, task.folderId as string).title
              } / ${task.title}`}
            </div>
            <div className="">
              <Listbox
                value={selectedFolder}
                onChange={(e) => {
                  setValue("parentId", e.title)
                  setSelectedFolder(e)
                }}
              >
                <div className="relative w-full">
                  <Listbox.Button
                    className={clsx(
                      "cursor-pointers relative w-full rounded-md bg-gray-100 py-1 px-3 text-left focus:outline-none"
                    )}
                  >
                    <span className="flex items-center justify-between truncate text-gray-500">
                      {selectedFolder.title} <HiOutlineChevronDown />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white p-1 py-1 text-gray-500 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {folders.map((folder, stateIdx) => (
                        <Listbox.Option
                          key={stateIdx}
                          className={({ active }) =>
                            clsx(
                              "relative cursor-pointer select-none rounded-md py-1 px-1",
                              active ? "bg-blue-500 text-white" : null
                            )
                          }
                          value={folder}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {folder.title}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
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
