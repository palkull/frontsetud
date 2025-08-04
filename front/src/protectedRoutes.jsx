import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function ProtectedRoutes() {
  const { loading, isAuth } = useAuth();

  console.log('ProtectedRoutes:', { loading, isAuth });
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or similar
  }
  if (!loading && !isAuth) {
    console.log('Redirecting to login');
    return <Navigate to="/login" replace />;
    
  }
  return <Outlet />;
}

export default ProtectedRoutes;