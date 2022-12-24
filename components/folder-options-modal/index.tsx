import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
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
import CustomButton, { ButtonStyle } from "../inputs/custom-button"
import CustomListbox from "../inputs/custom-listbox"
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

  const { data, error, isLoading } = useSWR(
    `folders/my/${currentModal.id}`,
    () =>
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
      !foldersIsLoading &&
      foldersData &&
      !isLoading &&
      data &&
      currentModal.id &&
      FolderHelper.findParent(foldersData, currentModal.id)
    ) {
      setSelectedFolder(FolderHelper.findParent(foldersData, currentModal.id))
    }
  }, [isLoading, data, currentModal, foldersData, foldersIsLoading])

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
  } = form

  return (
    <BaseModal title="Folder Options" isOpen={isOpen} onClose={closeModal}>
      {!error || !foldersError ? (
        !isLoading && data && !foldersIsLoading && foldersData ? (
          <div className="w-full space-y-3">
            <div className="w-full rounded-md bg-gray-100 py-1 px-3 text-gray-400 outline-none dark:bg-[#333] dark:text-gray-300">
              {data.title}
            </div>
            <CustomListbox
              value={selectedFolder}
              onChange={(e) => {
                setValue("parentId", e.title)
                setSelectedFolder(e)
              }}
              icon={<TiFlowChildren />}
              options={
                [{ id: "", title: "No Parent" }, ...foldersData] as Folder[]
              }
            />
            <div className="flex flex-col gap-y-3">
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
              <div className="flex gap-x-3">
                <button
                  onClick={async () => {
                    openModal({ modal: "new-folder", id: currentModal.id })
                  }}
                  className="w-full rounded-md bg-blue-500 px-2 py-1 text-white outline-none hover:bg-blue-600"
                >
                  Create Subfolder
                </button>
                <CustomButton
                  text="Delete Folder"
                  style={ButtonStyle.ERROR_PRIMARY}
                  onClick={() =>
                    openModal({
                      modal: "confirm",
                      action: async () => {
                        await requestHelper.delete<Folder>(
                          "folders",
                          currentModal.id as string
                        )
                        router.push("/")
                        closeModal()
                        fetchFolders && (await fetchFolders())
                        createToast({
                          title: "Success",
                          subtitle: "You have successfully deleted the folder.",
                          expiration: 10000,
                          type: "success",
                        })
                      },
                    })
                  }
                />
              </div>
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
