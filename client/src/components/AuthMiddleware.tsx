

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const routeConfig = {
  public: ['/login', '/signup', '/forbidden'],
  user: [
    '/',
    '/profile',
    '/deposit',
    '/withdraw',
    '/account',
    '/referral',
    '/deposit/record',
    '/withdraw/record',
    '/task',
    'orders',
  ],
  admin: ['/admin', '/admin/users', '/admin/settings', '/admin/orders'],
};

export default function AuthMiddleware({ children }: AuthMiddlewareProps) {
 const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    
    const checkAccess = () => {
      const token = authClient.getToken();
      const userRole = authClient.getUserRole();

      // Public routes - redirect if already logged in
      if (routeConfig.public.some((route) => location.pathname.startsWith(route))) {
        if (token) {
          const redirectPath = userRole === "ADMIN" ? "/admin" : "/";
          navigate(redirectPath);
        }
        return;
      }

      // Admin routes - strict check
      if (
        routeConfig.admin.some((route) => location.pathname.startsWith(route))
      ) {
        if (!token || userRole !== "ADMIN") {
          authClient.removeToken();
          navigate("/login");
          return;
        }
      }

      // User routes - require authentication
      if (
        routeConfig.user.some((route) => location.pathname.startsWith(route))
      ) {
        if (!token) {
          const loginUrl = `/login?from=${encodeURIComponent(
            location.pathname
          )}`;
          navigate(loginUrl);
          return;
        }
      }
    };

    checkAccess();
  }, [location.pathname, navigate]);

  return <>{children}</>;
}