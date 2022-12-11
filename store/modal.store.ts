import { Folder } from "../types/folder.types"
import create from "zustand"
import { persist } from "zustand/middleware"

interface ModalStore {
  currentModal: string
  openModal: (input: string) => void
  closeModal: () => void
}

const useModalStore = create<ModalStore>()((set) => ({
  currentModal: "",
  openModal: (input: string) => set((state) => ({ currentModal: input })),
  closeModal: () => set((state) => ({ currentModal: "" })),
}))

export default useModalStore
