import clsx from "clsx"

interface Props {
  array: string[]
  className?: string
}

export default function TextPath({ array, className }: Props) {
  return (
    <div className="">
      {array.map((item, idx) => (
        <p
          className={clsx("inline", className, {
            "text-sm text-gray-400": idx !== array.length - 1,
          })}
          key={item + idx}
        >
          {item}
          {idx !== array.length - 1 ? (
            <span className="text-sm"> / </span>
          ) : null}
        </p>
      ))}
    </div>
  )
}
