import Marked from "marked-react"
import React, { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import useSWR from "swr"

import { useToast } from "../../providers/toast.provider"
import { requestHelper } from "../../services/requestHelper"
import { useErrorHandler } from "../../services/useErrorHandler"
import useModalStore from "../../store/modal.store"
import { Task } from "../../types/prisma.types"
import BaseModal from "../base-modal"
import CustomButton, { ButtonStyle } from "../inputs/custom-button"
import Spinner from "../spinner"

interface Props {
  isOpen: boolean
  fetchTasks?: () => void
  className?: string
}

interface FormValues {
  description: string
}

export default function TaskModal({ isOpen, fetchTasks }: Props) {
  const currentModal = useModalStore((state) => state.currentModal)
  const closeModal = useModalStore((state) => state.closeModal)
  const { errorHandler } = useErrorHandler()
  const [isEdit, setIsEdit] = useState(false)
  const { createToast } = useToast()

  const { data, error, isLoading } = useSWR(`tasks/${currentModal.id}`, () =>
    errorHandler(
      async () =>
        await requestHelper.getSpecific<Task>(
          "tasks",
          currentModal.id as string
        )
    )
  )

  const form = useForm<FormValues>()
  const {
    handleSubmit,
    setValue,
    getValues,
    register,
    formState: { errors },
  } = form

  const onSubmit = handleSubmit((data) =>
    errorHandler(async () => {
      await requestHelper.update<Task>(
        "tasks",
        { description: data.description },
        currentModal.id as string
      )
      closeModal()
      fetchTasks && (await fetchTasks())
      createToast({
        title: "Success",
        subtitle: "You have successfully updated a task.",
        expiration: 10000,
        type: "success",
      })
    })
  )

  console.log(getValues("description"))

  return (
    <BaseModal title={data && data.title} isOpen={isOpen} onClose={closeModal}>
      {!error ? (
        !isLoading && data ? (
          <FormProvider {...form}>
            <div className="flex w-full flex-col">
              {isEdit ? (
                <form onSubmit={onSubmit}>
                  <div className="">
                    <textarea
                      rows={10}
                      className="mb-3 w-full resize-none rounded-md bg-gray-100 py-1 px-3 outline-none"
                      {...register("description")}
                      placeholder="Description"
                    />
                    {errors.description?.message && (
                      <p className="mt-0.5 pl-2 text-xs text-rose-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </form>
              ) : (
                <div className="prose mb-3 max-h-[512px] w-full select-text flex-col overflow-x-hidden text-sm scrollbar-hide prose-a:text-blue-500 prose-code:h-max">
                  <Marked>{data.description}</Marked>
                </div>
              )}
              <div className="mt-auto flex gap-x-4">
                <CustomButton
                  onClick={() => {
                    if (!isEdit) {
                      setValue("description", data.description)
                      setIsEdit(true)
                    } else {
                      onSubmit()
                    }
                  }}
                  style={ButtonStyle.BASE_PRIMARY}
                  text={isEdit ? "Save" : "Edit"}
                  className=""
                />
                {isEdit ? (
                  <CustomButton
                    onClick={() => {
                      setIsEdit(false)
                    }}
                    style={ButtonStyle.BASE_TERTIARY}
                    text="Back"
                    className=""
                  />
                ) : null}
              </div>
            </div>
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
