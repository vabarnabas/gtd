import clsx from "clsx"
import React from "react"
import { HiChevronRight } from "react-icons/hi"

interface Props {
  path: {
    name: string
    path?: string
  }[]
  className?: string
}

export default function BreadCrumb({ path, className }: Props) {
  console.log(path.length)

  return (
    <div className={clsx("flex items-center space-x-1", className)}>
      {path.map((item, idx) => (
        <div key={item.name} className="flex items-center">
          <p
            className={clsx("", {
              "cursor-pointer text-blue-500 hover:underline":
                item.path !== undefined,
              "cursor-default": item.path === undefined,
            })}
          >
            {item.name}
          </p>
          {idx < path.length - 1 ? (
            <HiChevronRight className="ml-2 text-blue-500" />
          ) : null}
        </div>
      ))}
    </div>
  )
}
