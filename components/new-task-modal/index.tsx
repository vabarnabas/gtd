import React, { Fragment, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import BaseModal from "../base-modal"
import { Listbox, Transition } from "@headlessui/react"
import clsx from "clsx"
import { HiOutlineChevronDown } from "react-icons/hi"
import { makeRequest } from "../../services/makeRequest"
import { Task } from "../../types/prisma.types"

interface Props {
  isOpen: boolean
  onClose: () => void
  className?: string
}

interface FormValues {
  title: string
  description: string
  status: string
}

export default function NewTaskModal({ isOpen, onClose, className }: Props) {
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

  const [selected, setSelected] = useState(itemStates[0])

  const defaultValues: FormValues = {
    title: "",
    description: "",
    status: selected.name,
  }

  const schema = z.object({
    title: z.string().min(1, "Required Field"),
    description: z.string().min(1, "Required Field"),
    status: z.string().min(1, "Required Field"),
  })

  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
  })
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form
  const onSubmit = handleSubmit((data) => createTask(data as Task))

  const createTask = (data: Task) => {
    makeRequest("POST", {
      baseUrl: process.env.NEXT_PUBLIC_API_URL as string,
      path: "tasks",
      body: JSON.stringify(data),
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0MmVjOWMwLTNmMWYtNDJmNi05NjViLTY5Mzc3Y2QxY2UyZiIsImlkZW50aWZpZXIiOiJzdXBlcmFkbWluQHJvc3p0aS5jb20iLCJ1c2VyTmFtZSI6IlN1cGVyIEFkbWluIiwiaWF0IjoxNjcwNjg3ODQ2LCJleHAiOjE2NzA2OTE0NDZ9.KkG3kuP_qjFeFhxnDtnmB3au5c-IPBmiDhwwznxi5-A",
    })
  }

  return (
    <BaseModal title="Create New Task" isOpen={isOpen} onClose={onClose}>
      <FormProvider {...form}>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="">
            <input
              className="w-full rounded-md bg-gray-100 py-1 px-3 outline-none"
              {...register("title")}
              placeholder="Title"
            />
            {errors.title?.message && (
              <p className="mt-0.5 pl-2 text-xs text-rose-500">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="">
            <textarea
              className="w-full resize-none rounded-md bg-gray-100 py-1 px-3 outline-none"
              {...register("description")}
              placeholder="Description"
            />
            {errors.description?.message && (
              <p className="mt-0.5 pl-2 text-xs text-rose-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="">
            <Listbox
              value={selected}
              onChange={(e) => {
                setValue("status", e.name)
                setSelected(e)
              }}
            >
              <div className="relative w-full">
                <Listbox.Button
                  className={clsx(
                    "cursor-pointers relative w-full rounded-md py-1 px-3 text-left focus:outline-none",
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
            {errors.status?.message && (
              <p className="mt-0.5 pl-2 text-xs text-rose-500">
                {errors.status.message}
              </p>
            )}
          </div>
          <button className="w-full rounded-md bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
            Open
          </button>
        </form>
      </FormProvider>
    </BaseModal>
  )
}
