import type { ReactNode } from "react";

export default function CourseCardFooter({children, className}:{children: ReactNode, className?: string}){
    return (
        <footer className={className}>
            {children}
        </footer>
    )
}