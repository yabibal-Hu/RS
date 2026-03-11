// components/SuperAdminRoute.tsx
import { Navigate } from "react-router-dom";
import { decodeToken, isValidToken } from "../lib/jwt";

interface SuperAdminRouteProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({
  children,
  fallbackPath = "/admin",
}) => {
  const token = localStorage.getItem("rsToken");

  // Check if token exists and is valid
  if (!token || !isValidToken()) {
    localStorage.removeItem("rsToken"); // Clear invalid token
    return <Navigate to="/login" replace />;
  }

  // Decode token to get role
  const decodedToken = decodeToken(token);
  const userRole = decodedToken?.role;

  // Check if user has SuperADMIN role
  if (userRole !== "SUPER_ADMIN") {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default SuperAdminRoute;
