import type { IUser } from "./auth"

export interface ICourse {
    id: string
    title: string
    description: string
    duration: string
    payed: boolean
    price: number
    vacancies: number
    createdBy?: IUser
}