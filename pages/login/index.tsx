import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/router"
import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import Toast from "../../components/toast"
import ToastHandler from "../../components/toast/toast-handler"
import { requestHelper } from "../../services/requestHelper"
import TokenService from "../../services/token.service"
import { useErrorHandler } from "../../services/useErrorHandler"

interface FormValues {
  email: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const tokenservice = new TokenService()
  const { errorHandler } = useErrorHandler()
  const defaultValues: FormValues = {
    email: "",
    password: "",
  }

  const schema = z.object({
    email: z.string().min(1, "Required Field"),
    password: z.string().min(1, "Required Field"),
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const onSubmit = handleSubmit((data) => {
    login(data)
  })

  const login = (data: FormValues) => {
    errorHandler(async () => {
      const token = await requestHelper.login(data.email, data.password)
      await tokenservice.saveToken(token.access_token)

      router.push("/")
    })
  }

  return (
    <div className="flex h-screen w-screen select-none items-center justify-center bg-white text-slate-700">
      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit((data) => {
              login(data)
            })
          }}
          className="space-y-3"
        >
          <p className="text-2xl font-bold">Login</p>
          <div className="">
            <input
              className="w-full rounded-md bg-gray-100 py-1 px-3 outline-none"
              {...register("email")}
              placeholder="E-mail"
            />
            {errors.email?.message && (
              <p className="mt-0.5 pl-2 text-xs text-rose-500">
                {errors.email.message}
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
          <button className="w-full rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
            Login
          </button>
        </form>
      </FormProvider>
      <ToastHandler position="topRight" toastComponent={Toast} />
    </div>
  )
}
