import clsx from "clsx"
import type { ComponentType } from "react"
import { ToastProps, useToast } from "../../providers/toast.provider"

export type ToastPosition = "topLeft" | "topRight"

type Props = {
  position: ToastPosition
  toastComponent: ComponentType<ToastProps>
}

export default function ToastHandler({
  position,
  toastComponent: ToastComponent,
}: Props) {
  const { toastQueue } = useToast()

  return (
    <div
      className={clsx("fixed top-0 z-50 space-y-2 p-2", {
        "left-0": position === "topLeft",
        "right-0": position === "topRight",
      })}
    >
      {toastQueue.map((toast) => (
        <ToastComponent key={toast.title + toast.expiration} {...toast} />
      ))}
    </div>
  )
}
