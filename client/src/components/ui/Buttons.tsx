import { MdLogin, MdLogout } from "react-icons/md";
import { Link } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

export function GoToAuthButton({ className }: { className: string }) {
  const { state } = useAuth();
  return (
    <Link to={state.isAuthenticated ? "/" : "/auth"} className={className}>
      <MdLogin />
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
      className="bg-sky-800 hover:bg-sky-900 transition-all text-white font-bold py-1 px-4 rounded cursor-pointer"
    >
      {loading ? actionLabel : label}
    </button>
  );
}

export function LogoutButton() {
  const { state, logout } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className={`${
        state.isAuthenticated ? "flex" : "hidden"
      } text-white bg-gray-500 p-2 rounded-full cursor-pointer`}
    >
      <MdLogout />
    </button>
  );
}
