import type { ReactNode } from "react";

export default function CourseCardHeader({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <header>
      {children}
    </header>
  );
}
