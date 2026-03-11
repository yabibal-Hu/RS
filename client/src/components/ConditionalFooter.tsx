// components/ConditionalFooter.tsx
import { useLocation } from "react-router-dom";
import { useAuth } from "../lib/hooks/useAuth";
import Footer from "./Footer";

const ConditionalFooter = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  // Routes where footer should NOT be shown
  const noFooterRoutes = [
    "/login",
    "/admin",
    "/admin/users",
    "/admin/orders",
    "/admin/settings",
  ];

  // Check if current route is in noFooterRoutes
  const shouldHideFooter = noFooterRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  // Hide footer conditions:
  // 1. On noFooterRoutes
  // 2. For admin users (even if they somehow navigate to user routes)
  if (shouldHideFooter || isAdmin) {
    return null;
  }

  // Show footer only for authenticated non-admin users
  return isAuthenticated ? <Footer /> : null;
};

export default ConditionalFooter;
