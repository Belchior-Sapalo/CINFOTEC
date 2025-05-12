import { useState, type ReactNode, createContext, useContext, useEffect } from "react";
import { Role, type IAuthContext, type IAuthState, type IUser } from "@/types/auth";
import { useNavigate } from "react-router";

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

const initialState: IAuthState = {
  user: null,
  isAuthenticated: false,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<IAuthState>(initialState);
  const navigate = useNavigate()

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      setState(parsed);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(state));
  }, [state]);
  

  const login = (user: IUser | null) => {
    setState({ user, isAuthenticated: true });
    localStorage.setItem('auth', JSON.stringify({ user, isAuthenticated: true }));
  };

  const logout = () => {
    setState(initialState);
    localStorage.removeItem('auth');
    navigate("/", {replace: true})
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
