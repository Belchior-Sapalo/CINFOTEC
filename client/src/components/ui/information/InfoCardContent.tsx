import type { ReactNode } from "react";

export default function InfoCardContent({children, className}:{children: ReactNode, className: string}){
    return (
        <div>
            {children}
        </div>
    )
}