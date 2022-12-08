import { Folder } from "./../types/folder.types"
import create from "zustand"
import { persist } from "zustand/middleware"

interface FolderStore {
  folders: Folder[]
  createFolder: (input: Folder) => void
}

const useFolderStore = create<FolderStore>()(
  persist((set) => ({
    folders: [],
    createFolder: (input: Folder) =>
      set((state) => ({ folders: [...state.folders, input] })),
  }))
)

export default useFolderStore
