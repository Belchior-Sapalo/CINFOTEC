import type { ReactNode } from "react";

interface Props{
  children: ReactNode
  className?: string
}

export default function CourseCardContainer(props:Props) {
  return (
    <div
      className={`${props.className ? props.className : "border border-gray-200 p-4 rounded-md transition-all shadow shadow-gray-100 flex flex-col gap-2"}`}
    >
      {props.children}
    </div>
  );
}
