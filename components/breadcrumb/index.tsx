import clsx from "clsx"
import { useRouter } from "next/router"
import React from "react"
import { HiChevronRight } from "react-icons/hi"

interface Props {
  path: {
    label: string
    path?: string | null
  }[]
  className?: string
}

export default function BreadCrumb({ path, className }: Props) {
  const router = useRouter()

  return (
    <div
      className={clsx("flex w-full items-center space-x-1 text-sm", className)}
    >
      {path.map((item, idx) => (
        <div
          onClick={() => item.path && router.push(item.path)}
          key={item.label + idx}
          className="flex items-center"
        >
          <p
            className={clsx("", {
              "cursor-pointer text-blue-500 hover:underline":
                item.path !== undefined,
              "cursor-default": item.path === undefined,
            })}
          >
            {item.label}
          </p>
          {idx < path.length - 1 ? (
            <HiChevronRight className="ml-2 text-blue-500" />
          ) : null}
        </div>
      ))}
    </div>
  )
}
