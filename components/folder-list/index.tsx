import React from "react"
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
      {FolderHelper.findTopLevel(folders).map((folder) => (
        <FolderRow key={folder.id} folders={folders} folder={folder} />
      ))}
    </>
  )
}
