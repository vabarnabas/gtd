import React, { Fragment, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import BaseModal from "../base-modal"
import { Listbox, Transition } from "@headlessui/react"
import clsx from "clsx"
import { HiOutlineChevronDown } from "react-icons/hi"
import { Folder, Task } from "../../types/prisma.types"
import TokenService from "../../services/token.service"
import useModalStore from "../../store/modal.store"
import { requestHelper } from "../../services/requestHelper"
import { useToast } from "../../providers/toast.provider"
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

export default function NewTaskModal({ isOpen, className, fetchTasks }: Props) {
  const closeModal = useModalStore((state) => state.closeModal)

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
  const tokenservice = new TokenService()
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
    try {
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
    } catch {
      createToast({
        title: "Something went wrong.",
        subtitle: "Something went wrong on our end, please try again.",
        expiration: 10000,
        type: "error",
      })
    }
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
            <div className="">
              <Listbox
                value={selectedFolder}
                onChange={(e) => {
                  setValue("folderId", e.title)
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
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white p-1 py-1 text-gray-500 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
              {errors.status?.message && (
                <p className="mt-0.5 pl-2 text-xs text-rose-500">
                  {errors.status.message}
                </p>
              )}
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
