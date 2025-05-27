//export const BASE_URL = "http://192.168.43.58:8080";
export const BASE_URL = "http://localhost:8080";

export const AUTH_TOKEN = () => {
  const savedAuth = localStorage.getItem("auth");
  const parsed = JSON.parse(savedAuth!);
  return parsed.user.token;
};
