import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AdminService } from "@/services/adminService";
import { Loader } from "@/components/Loading";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface User {
  id: string; // ✅ Change to string (API returns "cmi7fnwtw0003cf8u6hf23k73")
  name: string | null;
  phone: string;
  role: string;
  status: string;
  inviteCode: string;
  invitedBy: string | null;
  invitedAt: string | null;
  createdAt: string;
  profile: {
    vip: {
      name: string;
    } | null;
    currentBalance: number;
  };
  transactions?: Transaction[];
  orders?: Order[];
  totalDeposits: number;
  totalWithdraws: number;
  totalOrders: number;
}

interface Transaction {
  id?: number;
  type: string;
  amount: number;
  createdAt?: string;
}

interface Order {
  id?: number;
  amount: number;
  status: string;
  type?: string;
  paymentMethod?: string;
  createdAt?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await AdminService.getAllUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchTerm,
        sortBy: "",
        sortOrder: "",
      });

      if (!response.success) {
        throw new Error("Failed to fetch users");
      }

      setUsers(response.users); // ✅ Fix: 'users' not 'user'
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearchTerm]);

  const fetchUserDetails = async (userId: string) => {
    try {
      setLoadingDetails(true);
      const response = await AdminService.getUserDetails(userId);

      if (response.success) {
        setSelectedUser(response.user);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to load user details");
    } finally {
      setLoadingDetails(false);
    }
  };


  const handleUserClick = async (user: User) => {
    await fetchUserDetails(user.id);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearchTerm, pagination.limit]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (error) {
    return <div className="text-red-500 p-6">Error: {error}</div>;
  }
  if (loadingDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800/80 from-slate-600/80 to-gray-700/80  w-full mx-auto md:p-4">
      <CardHeader className="p-2 md:p-6">
        {/* 
 <Card className="bg-gray-200 w-full mx-auto p-2 md:p-4">
      <CardHeader className="p-4 md:p-6">
*/}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-gray-100 text-lg md:text-xl truncate">
              User Management
            </CardTitle>
            <CardDescription className="truncate">
              Review and manage user accounts
            </CardDescription>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search name, phone, or invite code..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 w-full md:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Users Table */}
      <div className="bg-gray-50 rounded-lg shadow overflow-hidden mx-1 md:mx-0">
        {loading ? (
          <div className="p-8 text-center flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading users...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      VIP
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deposits
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Withdraws
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {user.name || "---"}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {user.phone}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {user.inviteCode}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          VIP {user.profile.vip ? user.profile.vip.name : "0"}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          {formatCurrency(user.profile.currentBalance)} ETB
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-600">
                          {formatCurrency(user.totalDeposits)} ETB
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-red-600">
                          {formatCurrency(user.totalWithdraws)} ETB
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination - Mobile Responsive */}
            <div className="px-3 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="text-sm text-gray-700 text-center md:text-left">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total,
                  )}{" "}
                  of {pagination.total} users
                </div>

                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700 whitespace-nowrap">
                      Show:
                    </span>
                    <div className="flex space-x-1">
                      {[10, 20, 50].map((limit) => (
                        <button
                          key={limit}
                          onClick={() => handleLimitChange(limit)}
                          className={`px-2 py-1 text-xs border rounded-md text-gray-700 ${
                            pagination.limit === limit
                              ? "bg-green-500 text-white border-green-500"
                              : "bg-white border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {limit}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-700 "
                    >
                      &lt;
                    </button>

                    <div className="flex space-x-1">
                      {Array.from(
                        { length: Math.min(5, pagination.pages) },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-2 py-1 text-sm border rounded-md min-w-[2rem] ${
                                pagination.page === pageNum
                                  ? "bg-green-500 text-white border-green-500"
                                  : "border-gray-300 hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}

                      {pagination.pages > 5 && (
                        <>
                          <span className="px-1 py-1">...</span>
                          <button
                            onClick={() => handlePageChange(pagination.pages)}
                            className={`px-2 py-1 text-sm border rounded-md ${
                              pagination.page === pagination.pages
                                ? "bg-green-500 text-white border-green-500"
                                : "border-gray-600 hover:bg-gray-100 text-gray-600"
                            }`}
                          >
                            {pagination.pages}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-gray-700"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {!loading && users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found matching your search criteria.
        </div>
      )}

      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={closeModal}
        loading={loadingDetails}
      />
    </Card>
  );
}

function UserDetailsModal({
  user,
  isOpen,
  onClose,
  loading,
}: UserDetailsModalProps) {
  if (!isOpen) return null;

  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

   const handleDeleteUser = async () => {
try {
      setIsDeleting(true);    
      await AdminService.deleteUser(user?.id || "");
      onClose();
      setIsDeleting(false);
    } catch (err) {
      console.error("Error deleting user:", err);
    } 
   };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "DEPOSIT":
        return "text-blue-600 bg-blue-50";
      case "WITHDRAW":
        return "text-red-600 bg-red-50";
      case "COMMISSION":
        return "text-green-600 bg-green-50";
      case "TASK":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-green-600 bg-green-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "REJECTED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-cyan-900/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Delete User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="">
                <AlertDialogContent className="sm:max-w-lg text-gray-100">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                    <AlertDialogDescription>
                      <span className="text-gray-300">
                        Are you sure you want to delete this user?
                      </span>
                      <br />
                      <b className="text-green-600">All data will be lost</b>
                    </AlertDialogDescription>
                    <div className="flex items-center justify-center space-x-2">
                      {/* phone */}
                      <p className="font-bold">{user?.phone}</p>
                      <p className="font-bold text-green-600">
                        {/* {order.amount} ETB */}
                      </p>
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      disabled={isDeleting}
                      className="text-white"
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteUser}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Yes, Delete User"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogContent>
            </AlertDialog>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
              <span className="text-gray-600">Loading user details...</span>
            </div>
          ) : user ? (
            <>
              {/* User Info Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Basic Information Card */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h3 className="font-semibold text-gray-700 mb-3 text-lg">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="text-gray-800">
                        {user.name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Phone:</span>
                      <span className="text-gray-800 font-mono">
                        {user.phone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === "1"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status === "1" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Invite Code:
                      </span>
                      <span className="text-gray-800 font-mono">
                        {user.inviteCode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Invited By:
                      </span>
                      <span className="text-gray-800">
                        {user.invitedBy || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Joined:</span>
                      <span className="text-gray-800">
                        {formatDateTime(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Summary Card */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h3 className="font-semibold text-gray-700 mb-3 text-lg">
                    Financial Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Current Balance:
                      </span>
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(user.profile.currentBalance)} ETB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        VIP Level:
                      </span>
                      <span className="text-purple-600 font-semibold">
                        VIP {user.profile.vip ? user.profile.vip.name : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Total Deposits:
                      </span>
                      <span className="text-blue-600 font-semibold">
                        {formatCurrency(user.totalDeposits)} ETB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Total Withdraws:
                      </span>
                      <span className="text-red-600 font-semibold">
                        {formatCurrency(user.totalWithdraws)} ETB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Total Orders:
                      </span>
                      <span className="text-gray-600 font-semibold">
                        {formatCurrency(user.totalOrders)} ETB
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Section */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-4 text-lg">
                  Transaction History ({user.transactions?.length || 0})
                </h3>
                <div className="bg-white border rounded-lg overflow-hidden">
                  {!user.transactions || user.transactions.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No transactions found
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {user.transactions.map((transaction, index) => (
                        <div
                          key={index}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(
                                  transaction.type,
                                )}`}
                              >
                                {transaction.type}
                              </span>
                              {transaction.createdAt && (
                                <span className="text-sm text-gray-500">
                                  {formatDateTime(transaction.createdAt)}
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-lg font-semibold ${
                                transaction.type === "DEPOSIT" ||
                                transaction.type === "COMMISSION" ||
                                transaction.type === "TASK"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "DEPOSIT" ||
                              transaction.type === "COMMISSION" ||
                              transaction.type === "TASK"
                                ? "+"
                                : "-"}
                              {formatCurrency(transaction.amount)} ETB
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Orders Section */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-4 text-lg">
                  Order History ({user.orders?.length || 0})
                </h3>
                <div className="bg-white border rounded-lg overflow-hidden">
                  {!user.orders || user.orders.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No orders found
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {user.orders.map((order, index) => (
                        <div
                          key={index}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <p className="font-semibold text-gray-800">
                                Amount: {formatCurrency(order.amount)} ETB
                              </p>
                              <div className="flex space-x-4 text-sm text-gray-600">
                                {order.paymentMethod && (
                                  <span>Method: {order.paymentMethod}</span>
                                )}
                                {order.type && <span>Type: {order.type}</span>}
                                {order.createdAt && (
                                  <span>{formatDateTime(order.createdAt)}</span>
                                )}
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(
                                order.status,
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No user data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
