import React, { type ReactNode } from 'react'

export default function EnrollmentCardAction({children, className}:{children: ReactNode, className: string}) {
  return (
    <div className={className}>{children}</div>
  )
}
