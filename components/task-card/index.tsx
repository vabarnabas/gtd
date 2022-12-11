import { Listbox, Menu, Transition } from "@headlessui/react"
import clsx from "clsx"
import { Fragment, useState } from "react"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { HiOutlineChevronDown } from "react-icons/hi"
import { Task } from "../../types/task.types"

interface Props {
  title: string
  description: string
  status: string
}

export default function TaskCard({ title, description, status }: Props) {
  const menuItems = [
    {
      title: "Subtasks",
      action: () => {},
    },
    {
      title: "Edit",
      action: () => {},
    },
    {
      title: "Change Folder",
      action: () => {},
    },
    {
      title: "Delete",
      action: () => {},
    },
  ]

  const itemStates = [
    {
      name: "To Do",
      bg: "bg-gray-200",
      text: "text-gray-600",
    },
    {
      name: "In Progress",
      bg: "bg-blue-100",
      text: "text-blue-500",
    },
    {
      name: "Done",
      bg: "bg-green-100",
      text: "text-green-500",
    },
  ]

  const [selected, setSelected] = useState(
    itemStates.find((state) => state.name === status) || itemStates[0]
  )

  return (
    <div className="relative h-max w-full rounded-lg bg-white p-4 shadow-md">
      <Menu as="div" className="">
        <div className="relative flex items-center justify-between">
          <p className="text-lg font-bold">{title}</p>
          <Menu.Button>
            <BiDotsVerticalRounded className=" cursor-pointer" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute top-0 right-0 z-10 mt-6 w-32 rounded-md border border-gray-100 bg-white p-1 shadow-md">
              {menuItems.map((item) => (
                <Menu.Item key={item.title}>
                  {({ active }) => (
                    <div
                      className={clsx(
                        "flex cursor-pointer items-center justify-start rounded-md px-1 py-1 text-sm",
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
      <p className="mt-3 h-20 min-w-full overflow-y-auto text-sm">
        {description}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-2 text-sm">
        <button className="rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
          Open
        </button>
        <div className="flex items-center gap-x-3">
          {/* <p className="cursor-pointer text-blue-500 hover:text-blue-600">
            Create Subtask
          </p> */}
          <Listbox value={selected} onChange={setSelected}>
            <div className="relative w-28 text-sm">
              <Listbox.Button
                className={clsx(
                  "cursor-pointers relative w-full rounded-md py-1 px-2 text-left font-medium focus:outline-none",
                  selected.bg,
                  selected.text
                )}
              >
                <span className="flex items-center justify-between truncate">
                  {selected.name} <HiOutlineChevronDown />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white p-1 py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {itemStates.map((state, stateIdx) => (
                    <Listbox.Option
                      key={stateIdx}
                      className={({ active }) =>
                        clsx(
                          "relative cursor-pointer select-none rounded-md py-1 px-1",
                          active ? state.bg : null,
                          active ? state.text : null
                        )
                      }
                      value={state}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {state.name}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
          {/* <input className="ml-auto aspect-square w-6 rounded-md bg-gray-100 text-center text-xs" /> */}
        </div>
      </div>
    </div>
  )
}
