import { Listbox, Transition } from "@headlessui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import clsx from "clsx"
import React, { Fragment, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { HiOutlineChevronDown } from "react-icons/hi"
import useSWR from "swr"
import * as yup from "yup"

import { FolderHelper } from "../../helpers/FolderHelper"
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
  })
  const { createToast } = useToast()

  const { data, error, isLoading } = useSWR("fetchFolders", () =>
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
        title: "Success.",
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
                        <Listbox.Option
                          className={({ active }) =>
                            clsx(
                              "relative cursor-pointer select-none rounded-md py-1 px-1",
                              active ? "bg-blue-500 text-white" : null
                            )
                          }
                          value={{ id: null, title: "No Parent" }}
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                No Parent
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                        {(data as Folder[]).map((folder, stateIdx) => (
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
