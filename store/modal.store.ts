import create from "zustand"

interface Modal {
  modal: string
  id?: string
}

interface ModalStore {
  currentModal: Modal
  openModal: (input: Modal) => void
  closeModal: () => void
}

const useModalStore = create<ModalStore>()((set) => ({
  currentModal: { modal: "" },
  openModal: (input: Modal) => set((state) => ({ currentModal: input })),
  closeModal: () => set((state) => ({ currentModal: { modal: "" } })),
}))

export default useModalStore
