import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/router"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { FaUserMinus } from "react-icons/fa"
import { MdFolderShared } from "react-icons/md"
import useSWR from "swr"
import * as yup from "yup"

import { useToast } from "../../providers/toast.provider"
import { requestHelper } from "../../services/requestHelper"
import { useErrorHandler } from "../../services/useErrorHandler"
import useModalStore from "../../store/modal.store"
import { Folder, User } from "../../types/prisma.types"
import BaseModal from "../base-modal"
import Spinner from "../spinner"

interface Props {
  isOpen: boolean
  fetchFolders?: () => void
  className?: string
}

interface FormValues {
  email: string
}

export default function FolderShareModal({ isOpen, fetchFolders }: Props) {
  const router = useRouter()
  const currentModal = useModalStore((state) => state.currentModal)
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const { errorHandler } = useErrorHandler()
  const { createToast } = useToast()

  const { data, error, isLoading, mutate } = useSWR(
    `/folders/${currentModal.id}`,
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
  } = useSWR("folders/my", () =>
    errorHandler(async () => await requestHelper.getMy<Folder>("folders"))
  )

  const defaultValues: FormValues = {
    email: "",
  }

  const schema = yup.object().shape({
    email: yup.string().required("Required Field"),
  })

  const form = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form

  const onSubmit = handleSubmit((data) => {
    errorHandler(async () => {
      const user = requestHelper.getSpecific<User>("users", data.email)

      await requestHelper.connect(currentModal.id as string, (await user).id)
      mutate()
    })
    reset()
  })

  return (
    <BaseModal title="Share Folder" isOpen={isOpen} onClose={closeModal}>
      {!error || !foldersError ? (
        !isLoading && data && !foldersIsLoading && foldersData ? (
          <div className="w-full">
            <FormProvider {...form}>
              <form className="w-full space-y-3" onSubmit={onSubmit}>
                <div className="">
                  <input
                    type="text"
                    className="w-full rounded-md bg-gray-100 py-1 px-3 outline-none dark:bg-[#333] dark:text-gray-50"
                    {...register("email")}
                    placeholder="E-mail"
                  />
                  {errors.email?.message && (
                    <p className="mt-0.5 pl-2 text-xs text-rose-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </form>
            </FormProvider>
            <div className="mt-3 w-full space-y-2 text-gray-800 dark:text-gray-50">
              <p className="mb-3 font-bold ">Shared With</p>
              {(data as Folder).sharedWith.length === 0 ? (
                <div className="flex w-full flex-col items-center justify-center">
                  <MdFolderShared className="text-5xl text-blue-500" />
                  <p className="w-[50%] text-center text-xs">
                    {
                      "It seems like you haven't shared this folder with anyone yet."
                    }
                  </p>
                </div>
              ) : null}
              {(data as Folder).sharedWith &&
                (data as Folder).sharedWith.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center rounded-md py-1.5 px-2 hover:bg-gray-100 dark:hover:bg-[#333]"
                  >
                    <div className="flex items-center space-x-3">
                      <p className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-sm text-gray-50">{`${user.displayName
                        .split(" ")?.[0]
                        .charAt(0)}${user.displayName
                        .split(" ")?.[1]
                        .charAt(0)}`}</p>
                      <div className="">
                        <p className="text-sm text-gray-800 dark:text-gray-50">
                          {user.displayName}
                        </p>
                        <p className="text-xs font-light text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <FaUserMinus
                      onClick={() => {
                        errorHandler(async () => {
                          await requestHelper.disconnect(data.id, user.id)
                          await mutate()
                        })
                      }}
                      className="ml-auto cursor-pointer text-rose-500 hover:text-rose-600"
                    />
                  </div>
                ))}
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
