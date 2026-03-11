// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { isValidToken } from "../lib/jwt";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  // Check if token exists and is valid
  if (!token || !isValidToken()) {
    localStorage.removeItem("token"); // Clear invalid token
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
