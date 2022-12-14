import { Listbox, Transition } from "@headlessui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import clsx from "clsx"
import { useRouter } from "next/router"
import React, { Fragment, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { HiOutlineChevronDown } from "react-icons/hi"
import useSWR from "swr"
import * as yup from "yup"

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

  const {
    data: foldersData,
    error: foldersError,
    isLoading: foldersIsLoading,
  } = useSWR("folders", () =>
    errorHandler(async () => await requestHelper.getMy<Folder>("folders"))
  )

  const [selectedFolder, setSelectedFolder] = useState<Folder>({
    id: "",
    title: "No Parent",
    parentId: null,
    userId: "",
    createdAt: new Date(Date.now()),
  })

  useEffect(() => {
    if (
      !isLoading &&
      data &&
      !foldersIsLoading &&
      foldersData &&
      (data as Folder).parentId
    ) {
      setSelectedFolder(
        (foldersData as Folder[]).filter((folder) => folder.id)[0]
      )
    }
  }, [])

  const defaultValues: FormValues = {
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
    // register,
    // handleSubmit,
    setValue,
    formState: { errors },
  } = form

  console.log(data)

  return (
    <BaseModal title="Folder Options" isOpen={isOpen} onClose={closeModal}>
      {!error || !foldersError ? (
        !isLoading && data && !foldersIsLoading && foldersData ? (
          <div className="w-full space-y-3">
            <div className="w-full rounded-md bg-gray-100 py-1 px-3 text-gray-400 outline-none">
              {data.title}
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
                      {selectedFolder?.title} <HiOutlineChevronDown />
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
                      {(foldersData as Folder[]).map((folder, stateIdx) => (
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
            <div className="flex gap-x-3">
              <button
                onClick={async () => {
                  errorHandler(async () => {
                    requestHelper.update<Folder>(
                      "folders",
                      {
                        parentId:
                          selectedFolder?.id === "" ? null : selectedFolder.id,
                      },
                      currentModal.id as string
                    )
                    fetchFolders && (await fetchFolders())
                  })
                  router.push("/")
                  closeModal()
                }}
                className="w-full rounded-md bg-blue-500 px-2 py-1 text-white outline-none hover:bg-blue-600"
              >
                Update Folder
              </button>
              <button
                onClick={() =>
                  openModal({
                    modal: "confirm",
                    action: async () => {
                      await requestHelper.delete<Folder>(
                        "folders",
                        currentModal.id as string
                      )
                      closeModal()
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
