import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCog2, TrendingUp, ShoppingBag, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AdminService } from "@/services/adminService";
import { useAuth } from "@/lib/hooks/useAuth";

export default function AdminDashboard() {
  // const [searchTerm, setSearchTerm] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalWithdraws, setTotalWithdraws] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [pendingDeposits, setPendingDeposits] = useState(0);
  const [pendingWithdraws, setPendingWithdraws] = useState(0);
  const [totalDepositAmounts, setTotalDepositAmounts] = useState(0);
  const [totalWithdrawAmounts, setTotalWithdrawAmounts] = useState(0);
  const [numberOfUsersWithEachVipName, setNumberOfUsersWithEachVipName] =
    useState<{ vipName: string; count: number  }[]>([]);
  const { isAuthenticated, isSuperAdmin, isWithdraw } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname; // Full path (e.g., "/products/ildfhv")

  // Extract last segment
  const lastSegment = path.split("/").pop(); // "ildfhv" or "dfhdvskjfg"

  // handle last url change

  useEffect(() => {
    // if (!userData || userData.role !== "ADMIN") {
    //   // User is not an admin
    //   navigate("/login");
    //   return;
    // }

    // fetchAdminData
    const fetchAdminData = async () => {
      // if (!token) {
      //   // window.location.href = "/login";
      //   navigate("/login");
      //   return;
      // }
      try {
        const response = await AdminService.getUsersInfo();
        // const data = await response.json();
        setTotalUsers(response.totalUsers);
        console.log("response", response.totalWithdrawAmounts);
        setActiveUsers(response.activeUsers);
        setTotalWithdraws(response.totalWithdraws);
        setTotalDeposits(response.totalDeposits);
        setPendingDeposits(response.pendingDeposits);
        setPendingWithdraws(response.pendingWithdraws);
        setTotalDepositAmounts(response.totalDepositAmounts);
        setTotalWithdrawAmounts(response.totalWithdrawAmounts);
        setNumberOfUsersWithEachVipName(response.numberOfUsersWithEachVipName);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, [ navigate]);
  const handleLogout = () => {
    authClient.removeToken();
    navigate("/login");
  };
  // Mock admin stats

  return (
    <div className="h-full min-h-screen">
      <div>
        <div className="space-y-6 px-auto p-2 sm:p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-gray-200 font-bold">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-400 ">
                Manage users, transactions, and platform settings
              </p>
            </div>
            {/* <Button>
            <Filter className="h-4 w-4 mr-2" />
            Export Data
          </Button> */}
            <Button className="relative w-28 h-10 " onClick={handleLogout}>
              {/* Bottom/Right Overlap */}
              <div className="absolute bottom-0  right-0 w-full h-full bg-secondary rounded-xl translate-x-0 translate-y-1  "></div>

              {/* Main Card */}
              <div
                className="absolute overflow-hidden grid grid-cols-2 gap-2 top-0 left-0 w-full h-full bg-gray-600 text-orange-500 border-1 border-gray-700 rounded-xl shadow-lg ${
              "
              >
                <div className=" flex items-center rounded-xl bg-orange-700/10 backdrop-blur-md hover:bg-white/20 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  />
                  {/* icon from lucide-react*/}
                  <LogOut className="h-6 w-6 mx-auto" />
                  <p className="text-md font-bold ml-2 ">Logout</p>
                </div>
              </div>
            </Button>
          </div>

          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {!isWithdraw && isAuthenticated && (
              <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm text-gray-100 font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeUsers} active users
                  </p>
                </CardContent>
              </Card>
            )}
            {!isWithdraw && isAuthenticated && (
              <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm text-gray-100 font-medium">
                    Users by VIP
                  </CardTitle>
                  <UserCog2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <div className="grid grid-cols-2">
                  {/* sort by vipName  */}
                  {numberOfUsersWithEachVipName
                    .sort((a, b) => Number(a.vipName) - Number(b.vipName))
                    .map((user, index) => (
                      <CardContent
                        key={index}
                        className="flex flex-row items-center justify-between space-y-0 "
                      >
                        <div className="text-sm ">VIP {user.vipName || 0}</div>
                        <p className="text-xs text-muted-foreground">
                          {user.count} users
                        </p>
                      </CardContent>
                    ))}
                </div>
              </Card>
            )}
            <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm text-gray-100 font-medium">
                  Total Withdrawals
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl grid grid-cols-2 font-bold">
                  <p>{totalWithdraws}</p>
                  <p className="border-l-2 text-xl text-right border-gray-400 pl-2">
                    {totalWithdrawAmounts} ETB
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {pendingWithdraws} pending withdrawals
                </p>
              </CardContent>
            </Card>
            {!isWithdraw && isAuthenticated && (
              <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm text-gray-100 font-medium">
                    Total Deposits
                  </CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 text-2xl font-bold">
                    <p>{totalDeposits}</p>
                    <p className="border-l-2 text-xl text-right border-gray-400 pl-2">
                      {totalDepositAmounts} ETB
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {pendingDeposits} pending deposits
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Admin Tabs */}
          <Tabs defaultValue={lastSegment} className="w-full">
            <TabsList
              className={`grid w-full  grid-cols-${
                isWithdraw ? 1 : isSuperAdmin ? 3 : 2
              }`}
            >
              {!isWithdraw && isAuthenticated && (
                <TabsTrigger
                  onClick={() => navigate("/admin/users")}
                  value="users"
                >
                  Users
                </TabsTrigger>
              )}
              <TabsTrigger
                onClick={() => navigate("/admin/orders")}
                value="orders"
              >
                Orders
              </TabsTrigger>
              {isSuperAdmin && isAuthenticated && (
                <TabsTrigger
                  onClick={() => navigate("/admin/settings")}
                  value="settings"
                >
                  Settings
                </TabsTrigger>
              )}
            </TabsList>
            <Outlet />
          </Tabs>
        </div>
      </div>
    </div>
  );
}
