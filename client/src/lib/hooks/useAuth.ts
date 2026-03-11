// hooks/useAuth.ts
import { useMemo } from "react";
import { decodeToken, isValidToken } from "../jwt";

export const useAuth = () => {
  const token = localStorage.getItem("rsToken");

  return useMemo(() => {
    if (!token || !isValidToken()) {
      return {
        isAuthenticated: false,
        isAdmin: false,
        isSuperAdmin: false,
        isWithdraw: false,
        userRole: null,
        userId: null,
      };
    }

    const decoded = decodeToken(token);
    return {
      isAuthenticated: true,
      isAdmin: decoded?.role === "ADMIN",
      isWithdraw: decoded?.role === "WITHDRAW",
      isSuperAdmin: decoded?.role === "SUPER_ADMIN",
      userRole: decoded?.role || null,
      userId: decoded?.userId || null,
    };
  }, [token]);
};
