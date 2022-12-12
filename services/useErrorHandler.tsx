import { ToastProps, useToast } from "../providers/toast.provider"

export const useErrorHandler = () => {
  const { createToast } = useToast()

  const errorHandler = async (
    callbackFn: (...params: any) => void,
    options?: { log?: boolean; customToastProps?: ToastProps }
  ) => {
    try {
      await callbackFn()
    } catch (e) {
      if (options?.log) console.log(e)
      {
        options?.customToastProps
          ? createToast(options.customToastProps)
          : createToast({
              title: "Something went wrong.",
              subtitle: "Something went wrong on our end, please try again.",
              expiration: 10000,
              type: "error",
            })
      }
    }
  }

  return { errorHandler }
}
