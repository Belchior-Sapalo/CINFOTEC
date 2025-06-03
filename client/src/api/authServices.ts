import axios from "axios";
import type { IForgotPassword, ILogin, IRegister, IResetPassword } from "../types/auth";
import { AUTH_TOKEN, BASE_URL } from "./consts";

export const handleLogin = async (reqBody: ILogin) => {
  return await axios.post(`${BASE_URL}/users/auth/login`, reqBody);
};

export const handleForgotPassword = async (reqBody: IForgotPassword) => {
  return await axios.post(`${BASE_URL}/users/auth/forgot-password`, reqBody);
}

export const handleResetPassword = async (reqBody: IResetPassword) => {
  return await axios.post(`${BASE_URL}/users/auth/reset-password`, reqBody);
}

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

