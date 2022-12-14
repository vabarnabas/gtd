import { Menu, Transition } from "@headlessui/react"
import clsx from "clsx"
import { useRouter } from "next/router"
import { Fragment } from "react"
import { HiChevronDown } from "react-icons/hi"

import TokenService from "../../services/token.service"
import useModalStore from "../../store/modal.store"

export default function Navbar() {
  const openModal = useModalStore((state) => state.openModal)
  const router = useRouter()
  const tokenservice = new TokenService()

  const menuItems = [
    {
      title: "New Task",
      action: () => {
        openModal({ modal: "new-task" })
      },
    },
    {
      title: "New Folder",
      action: () => {
        openModal({ modal: "new-folder" })
      },
    },
    {
      title: "Change Password",
      action: () => {
        openModal({ modal: "change-password" })
      },
    },
    {
      title: "Logout",
      action: async () => {
        await tokenservice.deleteToken()
        router.push("/login")
      },
    },
  ]

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex h-12 items-center justify-between rounded-b-md bg-white px-6 shadow">
      <div
        onClick={() => router.push("/")}
        className="cursor-pointer font-medium"
      >
        GettingThings<span className="inline text-blue-500">Done</span>
      </div>
      <Menu as="div" className="">
        <div className="relative flex items-center justify-between">
          <Menu.Button className="flex items-center space-x-2 rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-600">
            <p className="">Menu</p>
            <HiChevronDown />
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
            <Menu.Items className="absolute top-0 right-0 z-10 mt-9 w-48 rounded-md border border-gray-100 bg-white p-1 text-sm shadow-md">
              {menuItems.map((item) => (
                <Menu.Item key={item.title}>
                  {({ active }) => (
                    <div
                      onClick={() => item.action()}
                      className={clsx(
                        "flex cursor-pointer items-center justify-start rounded-md px-1 py-1",
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
