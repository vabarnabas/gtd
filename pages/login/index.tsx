import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { makeRequest } from "../../services/makeRequest"
import TokenService from "../../services/token.service"

interface FormValues {
  email: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const tokenservice = new TokenService()
  const [error, setError] = useState("")
  const defaultValues: FormValues = {
    email: "",
    password: "",
  }

  const schema = z.object({
    email: z.string().min(1, "Required Field"),
    password: z.string().min(1, "Required Field"),
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

  const onSubmit = handleSubmit((data) => {
    login(data)
  })

  const login = async (data: FormValues) => {
    setError("")
    const response = await makeRequest("POST", {
      baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
      path: "auth/local/signin",
      body: JSON.stringify({ identifier: data.email, password: data.password }),
    })

    if (response?.access_token) {
      await tokenservice.saveToken(response.access_token)
      router.push("/")
    } else {
      setError("Invalid Credentials")
    }
  }

  return (
    <div className="flex h-screen w-screen select-none items-center justify-center bg-white text-slate-700">
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-3">
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
            {error && (
              <p className="mt-0.5 pl-2 text-xs text-rose-500">{error}</p>
            )}
          </div>
          <button className="w-full rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
            Login
          </button>
        </form>
      </FormProvider>
    </div>
  )
}
