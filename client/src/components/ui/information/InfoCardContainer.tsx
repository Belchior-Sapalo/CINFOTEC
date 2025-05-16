import type { ReactNode } from "react";

export default function InfoCardContainer({children, className}:{children: ReactNode, className?: string}) {
  return (
    <div className={`${className ? className : "border flex flex-col gap-4 justify-between border-gray-300 p-4 rounded-md shadow"}`}>
        {children}
    </div>
  );
}
