import { useRouter } from "next/router"
import { FormProvider, useForm } from "react-hook-form"

import { requestHelper } from "../../services/requestHelper"
import TokenService from "../../services/token.service"
import { useErrorHandler } from "../../services/useErrorHandler"

interface FormValues {
  email: string
  password: string
}

export default function Login() {
  const { errorHandler } = useErrorHandler()
  const form = useForm<FormValues>()
  const { handleSubmit, register } = form
  const router = useRouter()
  const tokenservice = new TokenService()

  const login = (data: FormValues) => {
    errorHandler(async () => {
      const token = await requestHelper.login(data.email, data.password)
      await tokenservice.saveToken(token.access_token)
      router.push("/")
    })
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit((data) => login(data))}
          className="flex flex-col space-y-3"
        >
          <p className="text-xl font-bold">Login</p>
          <input
            type="text"
            placeholder="E-mail"
            {...register("email")}
            className="rounded-md bg-gray-100 py-1 px-3 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="rounded-md bg-gray-100 py-1 px-3 outline-none"
          />
          <button className="rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
            Create
          </button>
        </form>
      </FormProvider>
    </div>
  )
}
