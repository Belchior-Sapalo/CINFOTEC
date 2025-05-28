import { MdLogin, MdLogout } from "react-icons/md";
import { Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar } from "../Avatar";

interface ButtonProps {
  className?: string
}

const defaultClassName = "text-white bg-sky-800 hover:bg-sky-900 transition-all p-2 rounded-full cursor-pointer flex items-center justify-center h-10 w-10";
export function GoToAuthButton({ className = defaultClassName }: ButtonProps) {
  const { state } = useAuth();
  return (
    <Link to={state.isAuthenticated ? "/" : "/auth"}className={`${
      state.isAuthenticated ? "hidden" : "flex"
    } ${className}`}>
      <MdLogin />
    </Link>
  );
}

export function GoToProfileButton({
  className,
}: ButtonProps) {
  const { state } = useAuth();
  return (
    <Link
      to="/perfil"
      className={`${state.isAuthenticated ? "flex" : "hidden"} ${className}`}
    >
      <Avatar name={state.user?.name}/>
    </Link>
  );
}

export function SubmitButton({
  loading,
  label,
  actionLabel,
}: {
  loading: boolean;
  label: string;
  actionLabel: string;
}) {
  return (
    <button
      disabled={loading}
      type="submit"
      className={`${
        loading
          ? "bg-gray-300 text-gray-500 font-bold py-1 px-4 rounded cursor-not-allowed"
          : "bg-sky-800 hover:bg-sky-900 transition-all text-white font-bold py-1 px-4 rounded cursor-pointer"
      }`}
    >
      {loading ? actionLabel : label}
    </button>
  );
}

export function LogoutButton({className = defaultClassName}: ButtonProps) {
  const { state, logout } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className={`${
        state.isAuthenticated ? "flex" : "hidden"
      } ${className}`}
    >
      <MdLogout />
    </button>
  );
}
