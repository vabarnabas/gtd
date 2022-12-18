import autoAnimate from "@formkit/auto-animate"
import React, { useEffect, useRef } from "react"
import { HiPlus } from "react-icons/hi"

import { FolderHelper } from "../../helpers/FolderHelper"
import useModalStore from "../../store/modal.store"
import { Folder } from "../../types/prisma.types"
import FolderRow from "../folder-row"

interface Props {
  folders: Folder[]
  id?: string
}

export default function FolderList({ folders }: Props) {
  const openModal = useModalStore((state) => state.openModal)
  const parent = useRef(null)

  useEffect(() => {
    parent.current && autoAnimate(parent.current)
  }, [parent])

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation()
          openModal({ modal: "new-folder" })
        }}
        className="mb-3 flex cursor-pointer items-center justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600 md:w-[240px] md:py-1"
      >
        <HiPlus className="" />
        <p className="ml-1">Create New Folder</p>
      </div>
      <div ref={parent} className="">
        {folders &&
          folders.length !== 0 &&
          FolderHelper.findTopLevel(folders).map((folder) => (
            <FolderRow key={folder.id} folders={folders} folder={folder} />
          ))}
      </div>
    </>
  )
}
