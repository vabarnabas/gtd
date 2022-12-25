import autoAnimate from "@formkit/auto-animate"
import { useRouter } from "next/router"
import React, { useEffect, useRef } from "react"
import { FiCornerDownRight } from "react-icons/fi"
import { MdFolder, MdFolderShared } from "react-icons/md"

import { FolderHelper } from "../../helpers/FolderHelper"
import { Folder } from "../../types/prisma.types"
import TextPath from "../text-path"

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
    <div ref={parent} className="">
      <div
        onClick={(e) => {
          e.stopPropagation()
          router.push(`/${folder.id}`)
        }}
        key={folder.id}
        className="group flex cursor-pointer items-center rounded-md py-1.5 px-2 hover:bg-gray-100 dark:hover:bg-[#333]"
      >
        {!FolderHelper.isTopLevel(folders, folder.id) ? (
          <FiCornerDownRight />
        ) : folder.sharedWith.length !== 0 ? (
          <MdFolderShared />
        ) : (
          <MdFolder />
        )}
        <div className="ml-1.5">
          <TextPath
            array={[
              ...FolderHelper.findDeepParents(folders, folder.id).reverse(),
              FolderHelper.findFolder(folders, folder.id),
            ].map((folder) => folder.title)}
            className=""
          />
        </div>
        {/* <div className="ml-auto rounded-md bg-blue-500 py-1 px-2 text-white hover:bg-blue-600">
          <HiPlus className="text-sm" />
        </div> */}
      </div>
      <div className="pl-2">
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
