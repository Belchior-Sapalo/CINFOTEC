
import type { ReactNode } from "react";

export default function FAB({onClick, className, children}: {onClick: Function,  className?: string, children: ReactNode}) {

  return (
    true && (
      <button
        onClick={() => onClick()}
        className={`${className ? className : "cursor-pointer fixed bottom-6 right-6 z-50 bg-detail bg-gray-900 text-white p-3 rounded-full shadow-lg transition-all lg:hidden"}`}
      >
        {children}
      </button>
    )
  );
}
