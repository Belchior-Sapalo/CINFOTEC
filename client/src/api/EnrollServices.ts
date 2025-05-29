import type { IEnrollmentRegister } from "@/types/enrollment"
import axios from "axios"
import { AUTH_TOKEN, BASE_URL } from "./consts"


export const handleRegisterEnrollment = async (data: IEnrollmentRegister) => {
    const formData = new FormData()
    formData.append("courseId", data.courseId)
    formData.append("bi", data.bi)
    formData.append("certf", data.certf)
    formData.append("photo", data.photo)
    formData.append("token", data.token)
    return await axios.post(`${BASE_URL}/enrollments`, formData, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN()}`
        }
    })
}

export const handleGetStudentEnrollments = async () => {
    return await axios(`${BASE_URL}/enrollments/me`, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN()}`
        }
    })
}

export const handleGetEnrollmentProof = async (id: string) => {
    return await axios(`${BASE_URL}/enrollments/proof/${id}`, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN()}`,
        },
        responseType: 'blob'
    });
};


export const handleGetAllEnrollments = async () => {
    return await axios(`${BASE_URL}/enrollments`, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN()}`
        }
    })
}

export const handleApproveEnrollment = async (id: string) => {
    return await axios.patch(`${BASE_URL}/enrollments/${id}/approve`, {}, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN()}`
        }
    })
}

export const handleRejectEnrollment = async (id: string) => {
    return await axios.patch(`${BASE_URL}/enrollments/${id}/reject`, {}, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN()}`
        }
    })
}

export const handleDeleteEnrollment = async (id: string) => {
    return await axios.delete(`${BASE_URL}/enrollments/${id}`, {
        headers: {
            Authorization: `Bearer ${AUTH_TOKEN()}`
        }
    })
}