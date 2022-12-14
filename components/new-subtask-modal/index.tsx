import { Listbox, Transition } from "@headlessui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import clsx from "clsx"
import React, { Fragment, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { HiOutlineChevronDown } from "react-icons/hi"
import * as yup from "yup"

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
}

export default function NewSubtaskModal({ isOpen, fetchTasks }: Props) {
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

  const [selected, setSelected] = useState(itemStates[0])
  const [task, setTask] = useState<Task>({} as Task)
  const [folder, setFolder] = useState<Folder>({} as Folder)

  const { createToast } = useToast()

  useEffect(() => {
    errorHandler(async () => {
      const taskData = await requestHelper.getSpecific<Task>(
        "tasks",
        currentModal.id as string
      )

      setTask(taskData)

      if (taskData.folderId !== null) {
        const folderData = await requestHelper.getSpecific<Folder>(
          "folders",
          taskData.folderId
        )

        setFolder(folderData)
      }
    })
  }, [currentModal.id, errorHandler])

  const defaultValues: FormValues = {
    title: "",
    description: "",
    status: selected.name,
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
    formState: { errors },
  } = form
  const onSubmit = handleSubmit((data) => createSubtask(data as Task))

  const createSubtask = async (data: Task) => {
    errorHandler(async () => {
      const user = await requestHelper.currentUser()

      await requestHelper.create<Task>("tasks", {
        ...data,
        userId: user.id,
        folderId: folder.id,
        parentId: task.id,
      })
      fetchTasks && (await fetchTasks())
      closeModal()
      createToast({
        title: "Success",
        subtitle: "You have successfully created a new subtask.",
        expiration: 10000,
        type: "success",
      })
    })
  }

  return (
    <BaseModal title="Create New Subtask" isOpen={isOpen} onClose={closeModal}>
      {Object.keys(task).length !== 0 && Object.keys(folder).length !== 0 ? (
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
            <div className="w-full rounded-md bg-gray-100 py-1 px-3 text-gray-400 outline-none">
              {`${folder.title} / ${task.title}`}
            </div>
            <div className="">
              <Listbox
                value={selected}
                onChange={(e) => {
                  setValue("status", e.name)
                  setSelected(e)
                }}
              >
                <div className="relative w-full">
                  <Listbox.Button
                    className={clsx(
                      "cursor-pointers relative w-full rounded-md py-1 px-3 text-left focus:outline-none",
                      selected.className
                    )}
                  >
                    <span className="flex items-center justify-between truncate">
                      {selected.name} <HiOutlineChevronDown />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white p-1 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {itemStates.map((state, stateIdx) => (
                        <Listbox.Option
                          key={stateIdx}
                          className={({ active }) =>
                            clsx(
                              "relative cursor-pointer select-none rounded-md py-1 px-1",
                              active ? state.className : null
                            )
                          }
                          value={state}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {state.name}
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
              {errors.status?.message && (
                <p className="mt-0.5 pl-2 text-xs text-rose-500">
                  {errors.status.message}
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
