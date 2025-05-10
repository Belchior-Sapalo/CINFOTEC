import type { Role } from "./auth"

export interface ILinks {
    id: number
    to: string
    label: string
    roles: Role[]
}