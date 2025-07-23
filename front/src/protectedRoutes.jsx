import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export function ProtectedRoutes() {
  const { isAuth } = useAuth();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}