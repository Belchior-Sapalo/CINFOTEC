import React, { type ReactNode } from 'react'

export default function EnrollmentCardContainer({children, className}:{children: ReactNode, className: string}) {
  return (
    <div className={className}>{children}</div>
  )
}
