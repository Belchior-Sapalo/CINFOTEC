import axios from "axios";
import type { ILogin, IRegister } from "../types/auth";
import { AUTH_TOKEN, BASE_URL } from "./consts";

export const handleLogin = async (reqBody: ILogin) => {
  return await axios.post(`${BASE_URL}/users/auth/login`, reqBody);
};

export const handleRegister = async (reqBody: IRegister) => {
  return await axios.post(`${BASE_URL}/users/auth/register`, reqBody);
};

export const handleRegisterAdmin = async (reqBody: IRegister) => {
  return await axios.post(`${BASE_URL}/users/auth/admin/register`, reqBody, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN()}`
    }
  });
};

