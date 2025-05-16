import type { ReactNode } from "react";

export default function InfoCardFooter({children}:{children: ReactNode}){
    return (
        <footer>
            {children}
        </footer>
    )
}