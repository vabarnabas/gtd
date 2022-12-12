import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

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
      alert(token.access_token)
      await tokenservice.saveToken(token.access_token)
      router.push("/")
    })
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit((data) => login(data))}
        className="space-y-3"
      >
        <input
          type="text"
          {...register("email")}
          className="w-full rounded-md bg-gray-100 py-1 px-3 outline-none"
        />
        <input
          type="text"
          {...register("password")}
          className="w-full rounded-md bg-gray-100 py-1 px-3 outline-none"
        />
        <button className="w-full rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
          Create
        </button>
      </form>
    </div>
  )
}
