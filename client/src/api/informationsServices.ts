import axios from "axios";
import { AUTH_TOKEN, BASE_URL } from "./consts";
import type { IInformation } from "@/types/information";

export const handleGetAllInformations = async () => {
  return await axios.get(`${BASE_URL}/informations`);
};

export const handleGetInformation = async (id: string) => {
  return await axios.get(`${BASE_URL}/informations/${id}`);
};


export const handleGetInformationImage = async (id: string) => {
  return axios.get(`${BASE_URL}/informations/image/${id}`, {
    responseType: "blob",
  });
};


export const handleCreateInformation = async (data: IInformation, atach: File) => {
  const formData = new FormData();

  formData.append("title", data.title)
  formData.append("category", data.category)
  formData.append("body", data.body)
  formData.append("image", atach)

  return axios.post(`${BASE_URL}/informations`, formData, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN()}`
    }
  })
}

export const handleUpdateInformation = async ({id, data}: {id: string, data: IInformation}) => {
  return axios.patch(`${BASE_URL}/informations/${id}`, data, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN()}`
    }
  })
}

export const handleDeleteInformation = async (id: string) => {
  return axios.delete(`${BASE_URL}/informations/${id}`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN()}`
    }
  })
}