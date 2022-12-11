import React, { Fragment, useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { string, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import BaseModal from "../base-modal"

import { Task } from "../../types/prisma.types"
import TokenService from "../../services/token.service"
import useModalStore from "../../store/modal.store"
import { requestHelper } from "../../services/requestHelper"
import { useToast } from "../../providers/toast.provider"
import Spinner from "../spinner"
import { useRouter } from "next/router"

interface Props {
  isOpen: boolean
  className?: string
}

interface FormValues {
  oldPassword: string
  password: string
  passwordAgain: string
}

export default function ChangePasswordModal({ isOpen, className }: Props) {
  const closeModal = useModalStore((state) => state.closeModal)
  const router = useRouter()
  const tokenservice = new TokenService()

  const { createToast } = useToast()

  const defaultValues: FormValues = {
    oldPassword: "",
    password: "",
    passwordAgain: "",
  }

  const schema = z
    .object({
      oldPassword: z.string().min(1, "Required Field"),
      password: z.string().min(1, "Required Field"),
      passwordAgain: z.string().min(1, "Required Field"),
    })
    .superRefine(({ password, passwordAgain }, ctx) => {
      if (password !== passwordAgain) {
        ctx.addIssue({
          code: "custom",
          message: "The Passwords did not Match",
          path: ["passwordAgain"],
        })
      }
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
  const onSubmit = handleSubmit((data) => changePassword(data))

  const changePassword = async (data: {
    oldPassword: string
    password: string
  }) => {
    try {
      await requestHelper.changePassword(data.oldPassword, data.password)
      closeModal()
      createToast({
        title: "Success.",
        subtitle: "You have successfully changed your password.",
        expiration: 10000,
        type: "success",
      })
      await tokenservice.deleteToken()
      router.push("/login")
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
            Open
          </button>
        </form>
      </FormProvider>
    </BaseModal>
  )
}
