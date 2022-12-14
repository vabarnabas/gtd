import clsx from "clsx"
import React from "react"

export enum ButtonStyle {
  BASE_PRIMARY = "bg-blue-500 text-white hover:bg-blue-600",
  ERROR_PRIMARY = "bg-rose-500 text-white hover:bg-rose-600",
  BASE_TERTIARY = "text-blue-500 hover:text-blue-600",
  ERROR_TERTIARY = "text-rose-500 hover:text-rose-600",
}

interface Props {
  text: string
  style: ButtonStyle
  onClick?: (...params: any) => void
}

export default function CustomButton({ style, text, onClick }: Props) {
  return (
    <button
      onClick={() => onClick && onClick()}
      className={clsx("w-full rounded-md px-2 py-1", style)}
    >
      {text}
    </button>
  )
}
