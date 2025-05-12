import axios from "axios"
import { BASE_URL } from "./consts"

export const handleGelAllCourses = async () => {
    return await axios.get(`${BASE_URL}/courses`)
}