export const Role = {
    PUBLIC: "PUBLIC",
    STUDENT: "STUDENT",
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

export interface IUser {
  id: number;
  name?: string,
  email?: string,
  bi?: string,
  phoneNumber?: string,
  token?: string | null
  role?: Role;
  isAdmin?: boolean;
}

export interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
}

export interface IAuthContext {
  state: IAuthState;
  login: (user: IUser) => void;
  logout: () => void;
}