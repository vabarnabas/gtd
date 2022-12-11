import type { PropsWithChildren } from "react"
import { createContext, useMemo, useReducer } from "react"
import { useContext } from "react"
import { v4 as uuidv4 } from "uuid"

export type ToastType = "success" | "error" | "warning"

export type CreateToastType = {
  title: string
  subtitle?: string
  expiration: number
  type: ToastType
}

export type ToastProps = {
  id: string
  title: string
  subtitle?: string
  expiration: number
  type: ToastType
  icon?: JSX.Element
  action?: (...params: any) => void
  actiontitle?: string
}

type Action =
  | { type: "generate_toast"; toast: ToastProps }
  | { type: "remove_toast"; id: string }
  | { type: "expire" }

interface Context {
  toastQueue: ToastProps[]
  createToast: (toast: CreateToastType) => void
  removeToast: (id: string) => void
}

const reducer = (state: ToastProps[], action: Action): ToastProps[] => {
  switch (action.type) {
    case "generate_toast":
      return [...state, { ...action.toast, id: uuidv4() }]
    case "remove_toast":
      return state.filter((toast) => toast.id !== action.id)
    case "expire":
      return state.filter((toast) => toast.expiration > Date.now())
    default:
      return state
  }
}

const ToastContext = createContext<Context>({} as any)

export function ToastProvider({ children }: PropsWithChildren<unknown>) {
  const [state, dispatch] = useReducer(reducer, [])

  const actions = useMemo(
    () => ({
      generateToast: (toast: ToastProps) => {
        dispatch({ type: "generate_toast", toast })
      },
      removeToast: (id: string) => {
        dispatch({ type: "remove_toast", id })
      },
      expireToast: () => {
        dispatch({ type: "expire" })
      },
    }),
    []
  )

  const createToast = ({
    title,
    subtitle,
    expiration,
    type,
  }: CreateToastType) => {
    actions.generateToast({
      id: uuidv4(),
      expiration: Date.now() + expiration,
      title,
      subtitle,
      type: type,
    })
  }

  return (
    <ToastContext.Provider
      value={{ toastQueue: state, ...actions, createToast }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
