import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const {state} = useAuth();
  const location = useLocation();

  if (!state.user?.isAdmin && !state.user?.isSuperAdmin) {
    return <Navigate to="/" state={{from: location}} replace />;
  }

  return <>{children}</>;
}