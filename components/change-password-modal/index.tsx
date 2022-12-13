import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/router"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import * as yup from "yup"

import { useToast } from "../../providers/toast.provider"
import { requestHelper } from "../../services/requestHelper"
import TokenService from "../../services/token.service"
import { useErrorHandler } from "../../services/useErrorHandler"
import useModalStore from "../../store/modal.store"
import BaseModal from "../base-modal"

interface Props {
  isOpen: boolean
  className?: string
}

interface FormValues {
  oldPassword: string
  password: string
  passwordAgain: string
}

export default function ChangePasswordModal({ isOpen }: Props) {
  const closeModal = useModalStore((state) => state.closeModal)
  const router = useRouter()
  const { errorHandler } = useErrorHandler()
  const tokenservice = new TokenService()

  const { createToast } = useToast()

  const schema = yup.object().shape({
    oldPassword: yup.string().required("Required Field"),
    password: yup.string().required("Required Field"),
    passwordAgain: yup.string().required("Required Field"),
  })

  const form = useForm<FormValues>({
    resolver: yupResolver(schema),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form
  const onSubmit = handleSubmit((data) => changePassword(data))

  const changePassword = async (data: {
    oldPassword: string
    password: string
  }) => {
    errorHandler(async () => {
      await requestHelper.changePassword(data.oldPassword, data.password)
      createToast({
        title: "Success.",
        subtitle: "You have successfully changed your password.",
        expiration: 10000,
        type: "success",
      })
      await tokenservice.deleteToken()
      router.push("/login")
      closeModal()
    })
  }

  return (
    <BaseModal title="Change Password" isOpen={isOpen} onClose={closeModal}>
      <FormProvider {...form}>
        <form className="w-full space-y-3" onSubmit={onSubmit}>
          <div className="">
            <input
              type="password"
              className="w-full rounded-md bg-gray-100 py-1 px-3 outline-none"
              {...register("oldPassword")}
              placeholder="Old Password"
            />
            {errors.oldPassword?.message && (
              <p className="mt-0.5 pl-2 text-xs text-rose-500">
                {errors.oldPassword.message}
              </p>
            )}
          </div>
          <div className="">
            <input
              type="password"
              className="w-full rounded-md bg-gray-100 py-1 px-3 outline-none"
              {...register("password")}
              placeholder="Password"
            />
            {errors.password?.message && (
              <p className="mt-0.5 pl-2 text-xs text-rose-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="">
            <input
              type="password"
              className="w-full rounded-md bg-gray-100 py-1 px-3 outline-none"
              {...register("passwordAgain")}
              placeholder="Confirm Password"
            />
            {errors.passwordAgain?.message && (
              <p className="mt-0.5 pl-2 text-xs text-rose-500">
                {errors.passwordAgain.message}
              </p>
            )}
          </div>
          <button className="w-full rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
            Update
          </button>
        </form>
      </FormProvider>
    </BaseModal>
  )
}
