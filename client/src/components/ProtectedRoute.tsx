// // components/ProtectedRoute.tsx
// "use client";

// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { authClient } from "@/lib/auth-client";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requiredRole?: "USER" | "ADMIN";
// }

// export default function ProtectedRoute({
//   children,
//   requiredRole,
// }: ProtectedRouteProps) {
//   const router = useRouter();

//   useEffect(() => {
//     const token = authClient.getToken();
//     const userRole = authClient.getUserRole();

//     if (!token) {
//       router.replace("/login");
//       return;
//     }

//     if (requiredRole === "ADMIN" && userRole !== "ADMIN") {
//      // clear the token and redirect to the login page
//       authClient.removeToken();
//       router.replace("/login");
//       return;
//     }
//   }, [router, requiredRole]);

//   return <>{children}</>;
// }
