import create from "zustand"

interface Modal {
  modal: string
  id?: string
  secondaryId?: string
  action?: () => void
}

interface ModalStore {
  currentModal: Modal
  openModal: (input: Modal) => void
  closeModal: () => void
}

const useModalStore = create<ModalStore>()((set) => ({
  currentModal: { modal: "" },
  openModal: (input: Modal) => set(() => ({ currentModal: input })),
  closeModal: () => set(() => ({ currentModal: { modal: "" } })),
}))

export default useModalStore
