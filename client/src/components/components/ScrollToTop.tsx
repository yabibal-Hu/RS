

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    
    // Don't scroll to top on any admin routes
    // This covers: /admin, /admin/users, /admin/orders, /admin/settings
    if (pathname.startsWith("/admin")) {
      return;
    }

    // Scroll to top for all user routes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}
