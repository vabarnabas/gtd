import useModalStore from "../../store/modal.store"

export default function Navbar() {
  const openModal = useModalStore((state) => state.openModal)

  return (
    <div className="fixed inset-x-0 top-0 flex h-12 items-center justify-between rounded-b-md bg-white px-6 shadow">
      <div className="font-medium">
        Test<span className="inset text-blue-500">Project</span>
      </div>
      <button
        onClick={() => openModal("new-task")}
        className="rounded-md bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
      >
        New Task
      </button>
    </div>
  )
}
