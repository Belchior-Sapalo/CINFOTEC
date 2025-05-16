import axios from "axios"
import { AUTH_TOKEN, BASE_URL } from "./consts"
import type { ICourse } from "@/types/course"

export const handleCreateCourse = async ({data}: {data: ICourse}) => {
    return axios.post(`${BASE_URL}/courses`, data, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN()}`
        }
    })
}

export const handleGelAllCourses = async () => {
    return await axios.get(`${BASE_URL}/courses`)
}

export const handleGelCourse = async (id: string) => {
    return await axios.get(`${BASE_URL}/courses/${id}`)
}


export const handleDeleteCourse = async ({id}: {id: string}) => {
    return axios.delete(`${BASE_URL}/courses/${id}`, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN()}`
        }
    })
}

export const handleUpdateCourse = async ({id, data}: {id: string, data: ICourse}) => {
    return axios.patch(`${BASE_URL}/courses/${id}`, data, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN()}`
        }
    })
}