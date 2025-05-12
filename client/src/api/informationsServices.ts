import axios from "axios";
import { BASE_URL } from "./consts";

export const handleGetAllInformations = async () => {
  return await axios.get(`${BASE_URL}/informations`);
};

export const handleGetInformationImage = async (id: string) => {
  return axios.get(`${BASE_URL}/informations/image/${id}`, {
    responseType: "blob",
  });
};
