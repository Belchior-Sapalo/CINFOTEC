import axios from "axios";
import type { ILogin, IRegister } from "../types/auth";
import { BASE_URL } from "./consts";

export const handleLogin = async (reqBody: ILogin) => {
  return await axios.post(`${BASE_URL}/users/auth/login`, reqBody);
};

export const handleRegister = async (reqBody: IRegister) => {
  return await axios.post(`${BASE_URL}/users/auth/register`, reqBody);
};
