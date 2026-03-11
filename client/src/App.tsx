import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./page/login/login";
import Dashboard from "./page/home/homePage";
import UserLevelsPage from "./page/level/level";
import Deposit from "./page/deposit/deposit";
import Withdraw from "./page/withdraw/withdraw";
import ConditionalFooter from "./components/ConditionalFooter"; // Updated import
import TaskPage from "./page/task/task";
import Referral from "./page/referal/referal";
import Profile from "./page/profile/profile";
import DepositRecord from "./page/deposit/record";
import WithdrawRecord from "./page/withdraw/withdrawRecord";
import Account from "./page/account/acount";
import Header from "./components/Header";
import AdminDashboard from "./page/admin/dashboard";
import UserManagement from "./page/admin/users/page";
import Order from "./page/admin/orders/page";
import Setting from "./page/admin/settings/page";
import AdminRoute from "./routeComponent/AdminRoute";
import ProtectedRoute from "./routeComponent/ProtectedRoute";
import { Toaster } from "sonner";
import SuperAdminRoute from "./routeComponent/SuperAdmin";
import CustomerServiceButton from "./components/CustomerServiceButton";
import ScrollToTop from "./components/components/ScrollToTop";
import ComingSoon from "./page/comingPage";
import { useEffect, useState } from "react";
import { isValidToken } from "./lib/jwt";
import GenerateCertificate from "./components/GenerateCRT";
import CompanyProfile from "./page/company/CompanyProfile";
// Import the font (this adds the @font-face rules)


const App = () => {
  // check the user is login or not by token in the local storage
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
   const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
   useEffect(() => {
      const storedCurrency = localStorage.getItem("selectedCurrency");
      if (!storedCurrency) {
        localStorage.setItem("selectedCurrency", "ETB");        
      }
   }, []);

   useEffect(() => {
     // Check authentication status on initial load
     checkAuthentication();
     // Set up interval to check token expiration periodically
     const checkInterval = setInterval(() => {
       checkAuthentication();
     }, 60000); // Check every minute

     // Listen for storage changes (when token is set/removed in other tabs)
     const handleStorageChange = (e: StorageEvent) => {
       if (e.key === "token" || e.key === null) {
         checkAuthentication();
       }
     };

     // Listen for custom logout events
     const handleLogout = () => {
       checkAuthentication();
     };

     window.addEventListener("storage", handleStorageChange);
     window.addEventListener("logout", handleLogout);

     return () => {
       clearInterval(checkInterval);
       window.removeEventListener("storage", handleStorageChange);
       window.removeEventListener("logout", handleLogout);
     };
   }, []);

   const checkAuthentication = () => {
     const hasValidToken = isValidToken();
     setIsAuthenticated(hasValidToken);

     // Only set loading to false on initial check
     if (isCheckingAuth) {
       setIsCheckingAuth(false);
     }

     // If token is invalid but exists in storage, clean it up
     if (!hasValidToken && localStorage.getItem("token")) {
       localStorage.removeItem("token");
       localStorage.removeItem("userData");
       localStorage.removeItem("selectedCurrency");
       
     }
   };

   // Redirect if not authenticated and not on login page
   useEffect(() => {
    console.log("fack");
     if (
       !isCheckingAuth &&
       !isAuthenticated &&
       window.location.pathname !== "/login"
     ) {
       // Use Navigate component instead of window.location for better React Router integration
       // The redirection will be handled by the Routes below
     }
   }, [isAuthenticated, isCheckingAuth]);

   if (isCheckingAuth) {
     // Show loading spinner while checking authentication
     return (
       <div className="flex items-center justify-center min-h-screen">
         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
       </div>
     );
   }

  return (
    <div className="mx-4 pb-16 mt-16">
      <BrowserRouter>
        <Header />
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/crt" element={<GenerateCertificate />} />

          {/* Protected Routes for all authenticated users */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product"
            element={
              <ProtectedRoute>
                <UserLevelsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/coming-soon"
            element={
              <ProtectedRoute>
                <ComingSoon />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deposit"
            element={
              <ProtectedRoute>
                <Deposit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deposit/record"
            element={
              <ProtectedRoute>
                <DepositRecord />
              </ProtectedRoute>
            }
          />

          <Route
            path="/withdraw"
            element={
              <ProtectedRoute>
                <Withdraw />
              </ProtectedRoute>
            }
          />

          <Route
            path="/withdraw/record"
            element={
              <ProtectedRoute>
                <WithdrawRecord />
              </ProtectedRoute>
            }
          />

          <Route
            path="/task"
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/referral"
            element={
              <ProtectedRoute>
                <Referral />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company"
            element={
              <ProtectedRoute>
                <CompanyProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          {/* Admin Only Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          >
            <Route
              path="users"
              element={
                <AdminRoute privilege="WITHDRAW">
                  <UserManagement />
                </AdminRoute>
              }
            />
            <Route
              path="orders"
              element={
                <AdminRoute>
                  <Order />
                </AdminRoute>
              }
            />

            <Route
              path="settings"
              element={
                <SuperAdminRoute>
                  <Setting />
                </SuperAdminRoute>
              }
            />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/coming-soon" replace />} />
        </Routes>

        {/* Replace Footer with ConditionalFooter */}
        <ConditionalFooter />
      </BrowserRouter>
      <CustomerServiceButton />
      {/* <Toaster position="top-right" /> */}
      <Toaster
        position="top-center"
        toastOptions={{
          className: "font-serif",
          duration: 4000,
          style: {
            border: "1px solid rgba(245, 158, 11, 0.2)",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            color: "#92400e", // amber-800
            boxShadow:
              "0 10px 25px -5px rgba(245, 158, 11, 0.2), 0 8px 10px -6px rgba(245, 158, 11, 0.1)",
            borderRadius: "1rem",
            padding: "1rem",
          },
        }}
      />
    </div>
  );
};

export default App;
