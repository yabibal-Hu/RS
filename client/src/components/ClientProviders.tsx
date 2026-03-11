// "use client";

// import { useState } from "react";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useLocation } from "react-router-dom";
// export default function ClientProviders({ children }: { children: React.ReactNode }) {
//   const [queryClient] = useState(() => new QueryClient());

//   const { pathname } = useLocation();

//  const isAdminRoute = pathname.startsWith("/welcome");
//  const isLoginRoute = pathname.startsWith("/login");
//  // console.log("isAdminRoute:", isAdminRoute);
//   return (
//     <QueryClientProvider client={queryClient}>
//       <TooltipProvider delayDuration={100}>
//         <div className={` ${isAdminRoute || isLoginRoute ? "mb-0" : "mb-[80px]"}`}>
//           {children}
//         </div>
//       </TooltipProvider>
//     </QueryClientProvider>
//   );
// }
