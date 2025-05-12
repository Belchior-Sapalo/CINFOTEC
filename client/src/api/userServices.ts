import axios from "axios";
import { AUTH_TOKEN, BASE_URL } from "./consts";

export const handleGetProfile = async () => {
  return await axios.get(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN()}`,
    },
  });
};

export const handleUpdateName = async (data: { name: string}) => {
    console.log(data)
  return await axios.patch(
    `${BASE_URL}/users/me/name`,
    data,
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN()}`,
        'Content-Type': 'application/json'
      },
    }
  );
};

export const handleUpdateEmail = async (data: { email: string, password: string  }) => {
  return await axios.patch(
    `${BASE_URL}/users/me/email`,
    data,
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN()}`,
        'Content-Type': 'application/json'
      },
    }
  );
};

export const handleUpdateBI = async (data: { bi: string }) => {
  return await axios.patch(
    `${BASE_URL}/users/me/bi`,
    data,
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN()}`,
        'Content-Type': 'application/json'
      },
    }
  );
};

export const handleUpdatePhone = async (data: {
  phoneNumber: string;
}) => {
  return await axios.patch(
    `${BASE_URL}/users/me/phone`,
    data,
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN()}`,
        'Content-Type': 'application/json'
      },
    }
  );
};

export const handleUpdatePassword = async (data: {
  password: string,
  newPassword: string
}) => {
  return await axios.patch(
    `${BASE_URL}/users/me/password`,
    data,
    {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN()}`,
        'Content-Type': 'application/json'
      },
    }
  );
};
export const handleDeleteAccount = async () => {
  return await axios.delete(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN()}`,
    },
  });
};
