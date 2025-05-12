export const BASE_URL = "http://192.168.43.58:8080";
//192.168.43.58

export const AUTH_TOKEN = () => {
  const savedAuth = localStorage.getItem("auth");
  const parsed = JSON.parse(savedAuth!);
  return parsed.user.token;
};
