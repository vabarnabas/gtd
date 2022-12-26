import { Listbox, Menu, Transition } from "@headlessui/react"
import clsx from "clsx"
import { Fragment, useState } from "react"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { HiOutlineChevronDown } from "react-icons/hi"

import { useToast } from "../../providers/toast.provider"
import { requestHelper } from "../../services/requestHelper"
import { useErrorHandler } from "../../services/useErrorHandler"
import useModalStore from "../../store/modal.store"
import { Task } from "../../types/prisma.types"

interface Props {
  id: string
  title: string
  description: string
  status: string
  fetchTasks?: () => void
}

export default function TaskRow({ id, title, status, fetchTasks }: Props) {
  const openModal = useModalStore((state) => state.openModal)
  const { errorHandler } = useErrorHandler()
  const { createToast } = useToast()

  const menuItems = [
    {
      title: "New Subtask",
      action: () => {
        openModal({ modal: "new-task", secondaryId: id })
      },
    },
    {
      title: "Change Folder",
      action: () => {
        openModal({ modal: "change-folder", id })
      },
    },
    {
      title: "Delete Task",
      action: () => {
        openModal({
          modal: "confirm",
          action: async () => {
            await requestHelper.delete<Task>("tasks", id)
            fetchTasks && (await fetchTasks())
            createToast({
              title: "Success",
              subtitle: "You have successfully deleted the task.",
              expiration: 10000,
              type: "success",
            })
          },
        })
      },
    },
  ]

  const itemStates = [
    {
      name: "To Do",
      className: "bg-gray-100 text-gray-500 dark:bg-[#444] dark:text-gray-200",
    },
    {
      name: "In Progress",
      className:
        "bg-blue-100 text-blue-500 dark:bg-blue-200 dark:text-blue-600",
    },
    {
      name: "Done",
      className:
        "bg-green-100 text-green-500 dark:bg-green-200 dark:text-green-600",
    },
    {
      name: "Closed",
      className:
        "bg-rose-100 text-rose-500 dark:bg-rose-200 dark:text-rose-600",
    },
  ]

  const [selected, setSelected] = useState(
    itemStates.find((state) => state.name === status) || itemStates[0]
  )

  return (
    <div className="relative h-max w-full bg-inherit px-4 py-2 first:rounded-t-lg">
      <Menu as="div" className="">
        <div className="relative flex items-center justify-between gap-x-5">
          <p
            onClick={() => openModal({ modal: "task", id })}
            className="cursor-pointer text-base font-semibold text-blue-500 hover:text-blue-600"
          >
            {title}
          </p>
          <div className="flex items-center gap-x-2 gap-y-2 text-sm">
            <div className="flex items-center gap-x-3">
              <Listbox
                value={selected}
                onChange={(e) => {
                  errorHandler(async () => {
                    await requestHelper.update<Task>(
                      "tasks",
                      { status: e.name },
                      id
                    )
                    setSelected(e)
                    fetchTasks && fetchTasks()
                  })
                }}
              >
                <div className="relative w-28 text-sm">
                  <Listbox.Button
                    className={clsx(
                      "cursor-pointers relative w-full rounded-md py-1 px-2 text-left font-medium focus:outline-none",
                      selected.className
                    )}
                  >
                    <span className="flex items-center justify-between truncate text-sm">
                      {selected.name} <HiOutlineChevronDown />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white p-1 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#333] sm:text-sm">
                      {itemStates.map((state, stateIdx) => (
                        <Listbox.Option
                          key={stateIdx}
                          className={({ active }) =>
                            clsx(
                              "relative cursor-pointer select-none rounded-md py-1 px-2",
                              active ? state.className : null
                            )
                          }
                          value={state}
                        >
                          {({ selected }) => (
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {state.name}
                            </span>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            <Menu.Button>
              <BiDotsVerticalRounded className=" ml-2 cursor-pointer text-base" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute top-0 right-0 z-10 mt-6 w-32 rounded-md border border-gray-100 bg-white p-1 shadow-md dark:border-[#444] dark:bg-[#333]">
              {menuItems.map((item) => (
                <Menu.Item key={item.title}>
                  {({ active }) => (
                    <div
                      onClick={() => item.action()}
                      className={clsx(
                        "flex cursor-pointer items-center justify-start rounded-md px-2 py-1 text-sm",
                        { "bg-blue-500 text-white": active }
                      )}
                    >
                      <p className="">{item.title}</p>
                    </div>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </div>
      </Menu>
    </div>
  )
}
