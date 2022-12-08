import Navbar from "../navbar"

interface Props {
  children: JSX.Element
}

export default function Layout({ children }: Props) {
  return (
    <div className="grid-container h-screen w-screen select-none bg-gray-100 text-slate-700">
      <Navbar />
      <div className="h-full w-full pt-12">{children}</div>
    </div>
  )
}
