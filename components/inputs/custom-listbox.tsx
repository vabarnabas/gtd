import { Listbox, Transition } from "@headlessui/react"
import clsx from "clsx"
import React, { Fragment } from "react"
import { HiOutlineChevronDown } from "react-icons/hi"

interface Props {
  value: any
  onChange: (e: any) => void
  options: any[]
  icon: JSX.Element
  selectionKey?: string
  error?: string
}

export default function CustomListbox({
  value,
  onChange,
  options,
  icon,
  selectionKey,
  error,
}: Props) {
  return (
    <div className="">
      <Listbox value={value} onChange={onChange}>
        <div className="relative w-full">
          <div className="relative flex items-center">
            <Listbox.Button
              className={clsx(
                "cursor-pointers relative w-full rounded-md bg-gray-100  py-1 pl-8 pr-3 text-left focus:outline-none dark:bg-[#333]"
              )}
            >
              <span className="flex items-center justify-between truncate text-gray-500 dark:text-gray-50">
                {value[selectionKey || "title"]} <HiOutlineChevronDown />
              </span>
            </Listbox.Button>
            <span className="absolute left-3 text-gray-400">{icon}</span>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white p-1 py-1 text-sm text-gray-500 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#333] dark:text-gray-50">
              {options.map((option, stateIdx) => (
                <Listbox.Option
                  key={stateIdx}
                  className={({ active }) =>
                    clsx(
                      "relative cursor-pointer select-none rounded-md py-1 px-1",
                      active ? "bg-blue-500 text-white" : null
                    )
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option[selectionKey || "title"]}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="mt-0.5 pl-2 text-xs text-rose-500">{error}</p>}
    </div>
  )
}
