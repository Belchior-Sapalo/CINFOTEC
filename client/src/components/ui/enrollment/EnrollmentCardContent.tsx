import React, { type ReactNode } from 'react'

export default function EnrollmentCardContent({children, className}:{children: ReactNode, className: string}) {
  return (
    <div className={className}>{children}</div>
  )
}
