// components/AdminRoute.tsx
import { Navigate } from "react-router-dom";
import { decodeToken, isValidToken } from "../lib/jwt";

interface AdminRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
  privilege?: "ADMIN" | "SUPER_ADMIN" | "WITHDRAW";
}

const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  fallbackPath = "/",
  privilege,
}) => {
  const token = localStorage.getItem("token");

  // Check if token exists and is valid
  if (!token || !isValidToken()) {
    localStorage.removeItem("token"); // Clear invalid token
    return <Navigate to="/login" replace />;
  }

  // Decode token to get role
  const decodedToken = decodeToken(token);
  const userRole = decodedToken?.role;
  if (userRole === privilege) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check if user has ADMIN role
  if (
    userRole !== "ADMIN" &&
    userRole !== "SUPER_ADMIN" &&
    userRole !== "WITHDRAW"
  ) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
