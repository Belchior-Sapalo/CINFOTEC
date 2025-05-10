export const Role = {
    PUBLIC: "PUBLIC",
    USER: "USER",
    ADMIN: "ADMIN",
  } as const;
  
export type Role = keyof typeof Role;

export interface ILogin {
    email: string;
    password: string;
}

export interface IRegister {
  name: string,
  email: string,
  bi: string,
  phoneNumber: string,
  password: string,
}