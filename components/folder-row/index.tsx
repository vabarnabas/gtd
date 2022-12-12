import autoAnimate from "@formkit/auto-animate"
import { useRouter } from "next/router"
import React, { useEffect, useRef } from "react"
import { FiCornerDownRight } from "react-icons/fi"

import { FolderHelper } from "../../helpers/FolderHelper"
import { Folder } from "../../types/prisma.types"

interface Props {
  folders: Folder[]
  folder: Folder
}

export default function FolderRow({ folder, folders }: Props) {
  const parent = useRef(null)
  const router = useRouter()

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  return (
    <div className=" text-gray-600">
      <div
        onClick={(e) => {
          e.stopPropagation()
          router.push(`/${folder.id}`)
        }}
        key={folder.id}
        className="group flex cursor-pointer items-center rounded-md py-1.5 px-2 hover:bg-gray-100"
      >
        {!FolderHelper.isTopLevel(folders, folder.id) ? (
          <FiCornerDownRight className="mr-1.5" />
        ) : null}
        <p>{folder.title}</p>
        <div className="ml-auto font-semibold"></div>
      </div>
      <div ref={parent} className="pl-3">
        {FolderHelper.findChildren(folders, folder.id).length !== 0
          ? FolderHelper.findChildren(folders, folder.id).map((subFolder) => (
              <FolderRow
                key={subFolder.id}
                folders={folders}
                folder={subFolder}
              />
            ))
          : null}
      </div>
    </div>
  )
}
