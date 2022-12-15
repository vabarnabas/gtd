import clsx from "clsx"
import { useRouter } from "next/router"
import React from "react"
import { FaHome } from "react-icons/fa"
import { HiChevronRight } from "react-icons/hi"
import ScrollContainer from "react-indiana-drag-scroll"

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
    <ScrollContainer
      className={clsx("flex w-full items-center space-x-1 text-sm", className)}
    >
      <div className="flex items-center text-blue-500">
        <FaHome className="cursor-pointer" onClick={() => router.push("/")} />
        {path.length !== 0 ? <HiChevronRight className="ml-2" /> : null}
      </div>
      {path.map((item, idx) => (
        <div
          onClick={() => item.path && router.push(item.path)}
          key={item.label + idx}
          className="flex items-center"
        >
          <p
            className={clsx("w-max break-keep", {
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
    </ScrollContainer>
  )
}
