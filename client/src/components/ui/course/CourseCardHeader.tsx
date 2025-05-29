import type { ReactNode } from "react";

export default function CourseCardHeader({
  children,
  className
}: {
  children: ReactNode;
  className?: string
}) {
  return (
    <header className={className}>
      {children}
    </header>
  );
}
