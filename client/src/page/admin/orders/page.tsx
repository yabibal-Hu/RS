import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  Copy,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Search,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BeatLoader } from "react-spinners";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { AdminService } from "@/services/adminService";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";

// const API_URL = (import.meta.env.VITE_IMAGE_BASE_URL as string) || "";

interface Orders {
  id: string;
  amount: number;
  type: string;
  phone: string;
  status: string;
  accountOwner: string;
  useAccount: string;
  receipt: string;
  createdAt: string;
  paymentMethod: string;
  depositType: string;
  name:string
}

export default function Order() {
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Orders[]>([]);
  const [totalPages, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // const [fullPageLoading, setFullPageLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const { isAuthenticated, isWithdraw } = useAuth();
  //  get all orders
  // Token check moved to useEffect
  useEffect(() => {
    // if (!token) {
    //   window.location.href = "/login";
    //   return;
    // }
  }, []);
  const handleLimitChange = (newLimit: number) => {
    setPageSize(newLimit);
  };

  const handlePageChange = (newPage: number) => {
    const clampedPage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(clampedPage);
  };

  const fetchOrders = async (page: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await AdminService.getOrders(page, pageSize, search);
      setOrders(response.orders);
      setTotalPage(response.totalPages);
      // setFullPageLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, pageSize, search]);

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      active: "default",
      suspended: "destructive",
      pending: "secondary",
      completed: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  const filteredOrders = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();

    if (!lowerSearch) return orders;

    const isNumericSearch = !isNaN(Number(lowerSearch));

    const filtered = orders.filter((t) => {
      if (isNumericSearch) {
        return (
          t.amount.toString().includes(lowerSearch) ||
          t.phone.toLowerCase().includes(lowerSearch)
        );
      } else {
        return (
          t.status.toLowerCase().includes(lowerSearch) ||
          t.paymentMethod.toLowerCase().includes(lowerSearch) ||
          t.type.toLowerCase().includes(lowerSearch)
        );
      }
    });

    if (!sortField) return filtered;

    return filtered.sort((a, b) => {
      let valA = a[sortField as keyof typeof a];
      let valB = b[sortField as keyof typeof b];

      if (sortField === "date") {
        valA = new Date(valA as string).getTime();
        valB = new Date(valB as string).getTime();
      }

      if (typeof valA === "string" && typeof valB === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [orders, searchTerm, sortField, sortDirection]); // <-- added `orders`
  // date formater function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [loading, setLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const handleApprove = (id: string, type: string, status: string) => {
    setSelectedOrderId(id);
    setSelectedStatus(status);
    setSelectedType(type);
  };

  const handleConfirm = async () => {
    // if (!token) {
    //   window.location.href = "/login";
    //   return;
    // }
    try {
      setLoading(true);
      const res = await AdminService.approveOrder(
        Number(selectedOrderId),
        selectedType,
        selectedStatus,
      );
      if (res.success) {
        toast.success("Order approved successfully!");
        // setIsMainDialogOpen(true);
        // close Dialog
        setSelectedOrderId(null);
        setSelectedStatus("");
        setSelectedType("");
      }
      await res.json;
      fetchOrders(currentPage);
    } catch (error) {
      console.error("Error approving order:", error);
    } finally {
      setLoading(false);
    }
  };

  // Test if the image exists by opening this URL in browser
  // if (fullPageLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <div>
      {/* {fullPageLoading && <Loader />} */}
      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
          <CardHeader>
            <div className="flex flex-col space-y-4">
              {/* Title and Search Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Title Section */}
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-gray-100 text-lg sm:text-xl">
                    Order Management
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Review and manage all platform orders
                  </CardDescription>
                </div>

                {/* Search Section */}
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-40 md:w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Buttons Row */}
              {!isWithdraw && isAuthenticated && (
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setSearch("DEPOSIT")}
                    className="bg-green-400 flex-1  text-black sm:flex-none "
                    size="sm"
                  >
                    Deposit
                  </Button>
                  <Button
                    onClick={() => setSearch("WITHDRAW")}
                    className="bg-red-400 text-black flex-1  sm:flex-none "
                    size="sm"
                  >
                    Withdraw
                  </Button>
                  <Button
                    onClick={() => setSearch("VIP_UPGRADE")}
                    className="bg-yellow-200 text-black flex-1 sm:flex-none "
                    size="sm"
                  >
                    Vip Upgrade
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("type")}
                  >
                    Type
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("method")}
                  >
                    Method
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    Date
                  </TableHead>
                  {/* <TableHead>Actions</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* sort by status*/}
                {filteredOrders
                  .sort((a, b) => {
                    if (a.status === "PENDING" && b.status !== "PENDING") {
                      return -1;
                    } else if (
                      a.status !== "PENDING" &&
                      b.status === "PENDING"
                    ) {
                      return 1;
                    } else if (
                      a.status === "REJECTED" &&
                      b.status !== "PENDING"
                    ) {
                      return 1;
                    } else if (
                      a.status !== "REJECTED" &&
                      b.status === "REJECTED"
                    ) {
                      return -1;
                    } else {
                      return 0;
                    }
                  })
                  .map((order) => (
                    <TableRow
                      key={order.id}
                      className={`${
                        order.type === "DEPOSIT"
                          ? "bg-[#33836f]"
                          : order.type === "FUND_D"
                            ? "bg-[#799209]"
                            : order.type === "FUND_W"
                              ? "bg-[#799209]"
                              : "bg-[#79473c]"
                      }`}
                      /* <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm"> */
                    >
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell className="font-medium">
                        <div>
                          <p>
                        {order.name}

                          </p>
                          <p>
                        {order.phone}

                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.depositType}</Badge>
                      </TableCell>
                      <TableCell>${order.amount.toFixed(2)}</TableCell>
                      <TableCell>{order.paymentMethod}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {/* {order.status === "PENDING" && (
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    onClick={() =>
                                      handleApprove(
                                        order.id,
                                        order.type,
                                        "COMPLETED"
                                      )
                                    }
                                    variant="ghost"
                                    size="sm"
                                    disabled={
                                      loading &&
                                      selectedStatus === "COMPLETED" &&
                                      selectedOrderId === order.id
                                    }
                                  >
                                    {loading &&
                                    selectedStatus === "COMPLETED" &&
                                    selectedOrderId === order.id ? (
                                      <BeatLoader color="blue" size={8} />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className=" sm:max-w-lg">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Approve Order
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to accept this order
                                      with status:{" "}
                                      <b className="text-green-600">
                                        COMPLETED
                                      </b>
                                      ?
                                    </AlertDialogDescription>
                                    <div className="flex items-center justify-center space-x-2">
                                      <p className="font-bold">{order.type}:</p>
                                      <p className="font-bold text-green-600">
                                        {order.amount} ETB
                                      </p>
                                    </div>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      disabled={loading}
                                      className="text-white"
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleConfirm}
                                      disabled={loading}
                                    >
                                      {loading
                                        ? "Approving..."
                                        : "Yes, Approve"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    onClick={() =>
                                      handleApprove(
                                        order.id,
                                        order.type,
                                        "REJECTED"
                                      )
                                    }
                                    disabled={
                                      loading &&
                                      selectedStatus === "REJECTED" &&
                                      selectedOrderId === order.id
                                    }
                                    variant="ghost"
                                    size="sm"
                                  >
                                    {loading &&
                                    selectedStatus === "REJECTED" &&
                                    selectedOrderId === order.id ? (
                                      <BeatLoader color="blue" size={8} />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-red-600" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="sm:max-w-lg">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Approve Order
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to reject this order
                                      with status:{" "}
                                      <b className="text-red-600">REJECTED</b>?
                                    </AlertDialogDescription>
                                    <div className="flex items-center justify-center space-x-2">
                                      <p className="font-bold">{order.type}:</p>
                                      <p className="font-bold text-red-600">
                                        {order.amount} ETB
                                      </p>
                                    </div>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      disabled={loading}
                                      className="text-white"
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleConfirm}
                                      disabled={loading}
                                    >
                                      {loading
                                        ? "Approving..."
                                        : "Yes, Approve"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )} */}
                          {(order?.type === "DEPOSIT" ||
                            order?.type === "FUND_D") && (
                            // close Dialog when orderApproved is true
                            <AlertDialog
                            // open={isMainDialogOpen}
                            // onOpenChange={setIsMainDialogOpen}
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  // onClick={() => setIsMainDialogOpen(true)}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>

                              <AlertDialogContent
                                className={
                                  isFullscreen
                                    ? "max-w-[100vw] h-[90vh] p-4"
                                    : "sm:max-w-lg max-h-[80vh]"
                                }
                              >
                                <AlertDialogHeader className="flex flex-row justify-between items-center">
                                  <AlertDialogTitle className="text-gray-100">
                                    Receipt
                                  </AlertDialogTitle>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setIsFullscreen((prev) => !prev)
                                      }
                                      className="text-white"
                                    >
                                      {isFullscreen ? (
                                        <Minimize2 className="h-4  w-4" />
                                      ) : (
                                        <Maximize2 className="h-4  w-4" />
                                      )}
                                    </Button>
                                    <AlertDialogCancel
                                      disabled={loading}
                                      onClick={() => {
                                        setIsFullscreen(false);
                                        // setIsMainDialogOpen(false);
                                      }}
                                      className="text-white w-fit"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </AlertDialogCancel>
                                  </div>
                                </AlertDialogHeader>

                                <div
                                  className={`flex justify-center   items-center ${
                                    isFullscreen ? "h-100 w-auto" : "max-h-100"
                                  }`}
                                >
                                  <img
                                    src={`${order?.receipt}`}
                                    alt="Order receipt"
                                    className="h-full w-full object-contain"
                                  />
                                </div>

                                {order.status === "PENDING" && (
                                  <div className="flex items-center justify-center space-x-4 -mb-8">
                                    <div className="bg-green-400 w-fit rounded-lg border border-dashed">
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            onClick={() =>
                                              handleApprove(
                                                order.id,
                                                order.type,
                                                "COMPLETED",
                                              )
                                            }
                                            variant="ghost"
                                            size="sm"
                                            disabled={
                                              loading &&
                                              selectedStatus === "COMPLETED" &&
                                              selectedOrderId === order.id
                                            }
                                          >
                                            {loading &&
                                            selectedStatus === "COMPLETED" &&
                                            selectedOrderId === order.id ? (
                                              <BeatLoader
                                                color="blue"
                                                size={8}
                                              />
                                            ) : (
                                              <>
                                                <span>Complete</span>
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                              </>
                                            )}
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="sm:max-w-lg text-gray-100">
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Approve Order
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              <span className="text-gray-300">
                                                Are you sure you want to accept
                                                this order with status:{" "}
                                              </span>
                                              <b className="text-green-600">
                                                COMPLETED
                                              </b>
                                              ?
                                            </AlertDialogDescription>
                                            <div className="flex items-center justify-center space-x-2">
                                              <p className="font-bold">
                                                {order.type}:
                                              </p>
                                              <p className="font-bold text-green-600">
                                                {order.amount} ETB
                                              </p>
                                            </div>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel
                                              disabled={loading}
                                              className="text-white"
                                            >
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={handleConfirm}
                                              disabled={loading}
                                            >
                                              {loading
                                                ? "Approving..."
                                                : "Yes, Approve"}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>

                                    <div className="bg-red-400 w-fit rounded-lg border border-dashed">
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            onClick={() =>
                                              handleApprove(
                                                order.id,
                                                order.type,
                                                "REJECTED",
                                              )
                                            }
                                            disabled={
                                              loading &&
                                              selectedStatus === "REJECTED" &&
                                              selectedOrderId === order.id
                                            }
                                            variant="ghost"
                                            size="sm"
                                          >
                                            {loading &&
                                            selectedStatus === "REJECTED" &&
                                            selectedOrderId === order.id ? (
                                              <BeatLoader
                                                color="blue"
                                                size={8}
                                              />
                                            ) : (
                                              <>
                                                <span>Reject</span>
                                                <XCircle className="h-4 w-4 text-red-600" />
                                              </>
                                            )}
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="sm:max-w-lg text-gray-100">
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Approve Order
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              <span className="text-gray-300">
                                                Are you sure you want to reject
                                                this order with status:{" "}
                                              </span>
                                              <b className="text-red-600">
                                                REJECTED
                                              </b>
                                              ?
                                            </AlertDialogDescription>
                                            <div className="flex items-center justify-center space-x-2">
                                              <p className="font-bold">
                                                {order.type}:
                                              </p>
                                              <p className="font-bold text-red-600">
                                                {order.amount} ETB
                                              </p>
                                            </div>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel
                                              disabled={loading}
                                              className="text-white"
                                            >
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={handleConfirm}
                                              disabled={loading}
                                            >
                                              {loading
                                                ? "Approving..."
                                                : "Yes, Approve"}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>
                                )}
                                <AlertDialogFooter />
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                          {(order?.type === "WITHDRAW" ||
                            order?.type === "FUND_W") && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="sm:max-w-lg">
                                <AlertDialogHeader className="flex flex-row justify-between items-center">
                                  <AlertDialogTitle className="text-gray-100">
                                    Withdraw Information
                                  </AlertDialogTitle>
                                  <div className="flex items-center gap-2">
                                    <AlertDialogCancel
                                      disabled={loading}
                                      onClick={() => setIsFullscreen(false)}
                                      className="text-white w-fit"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </AlertDialogCancel>
                                  </div>
                                </AlertDialogHeader>

                                <div className="flex items-center justify-between space-x-4 text-gray-100">
                                  <p className="font-bold sm:w-1/6 w-full sm:text-left ">
                                    Name:
                                  </p>
                                  <p className="font-bold sm:w-1/2 w-full sm:text-right  text-orange-500">
                                    {order.accountOwner}
                                  </p>
                                </div>

                                <div className="flex items-center justify-center space-x-4 text-gray-100">
                                  <p className="font-bold sm:w-1/2 w-full sm:text-left ">
                                    Payment Method:
                                  </p>
                                  <p className="font-bold sm:w-1/6 w-full sm:text-right  text-orange-500">
                                    {order.paymentMethod}
                                  </p>
                                </div>

                                {/* Account Number with Copy Button */}
                                <div className="flex items-center justify-center space-x-4 text-gray-100 p-2 bg-gray-700 rounded-lg">
                                  {/* <div className="flex items-center space-x-4 flex-1"> */}
                                  <p className="font-bold sm:w-1/2 w-full sm:text-left ">
                                    Account Number:
                                  </p>
                                  <div className="w-full sm:w-1/2 items-center justify-start">
                                    <span className="font-bold flex-1 sm:text-right  text-orange-500 break-all">
                                      {order.useAccount || order.phone}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      id={`copy-btn-${order.id}`}
                                      onClick={(event) => {
                                        const accountNumber =
                                          order.useAccount || order.phone;
                                        const button = event.currentTarget;

                                        navigator.clipboard
                                          .writeText(accountNumber)
                                          .then(() => {
                                            // Change button to show success state
                                            button.innerHTML = `
                  <div class="flex items-center gap-1 text-green-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-xs">Copied!</span>
                  </div>
                `;
                                            button.classList.add(
                                              "bg-green-900",
                                              "hover:bg-green-800",
                                            );

                                            // Revert back after 2 seconds
                                            setTimeout(() => {
                                              button.innerHTML = `
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  `;
                                              button.classList.remove(
                                                "bg-green-900",
                                                "hover:bg-green-800",
                                              );
                                            }, 2000);
                                          })
                                          .catch((err) => {
                                            console.error(
                                              "Failed to copy: ",
                                              err,
                                            );
                                            // Show error state
                                            button.innerHTML = `
                  <div class="flex items-center gap-1 text-red-500">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span class="text-xs">Failed</span>
                  </div>
                `;
                                            button.classList.add(
                                              "bg-red-900",
                                              "hover:bg-red-800",
                                            );

                                            setTimeout(() => {
                                              button.innerHTML = `
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  `;
                                              button.classList.remove(
                                                "bg-red-900",
                                                "hover:bg-red-800",
                                              );
                                            }, 2000);
                                          });
                                      }}
                                      className="ml-2 shrink-0 hover:bg-gray-700 transition-all duration-200"
                                    >
                                      <span>Copy</span>{" "}
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {/* </div> */}
                                </div>

                                <div className="flex items-center justify-center space-x-4 text-gray-100">
                                  <p className="font-bold sm:w-1/6 w-full sm:text-left ">
                                    Amount:
                                  </p>
                                  <p className="font-bold sm:w-1/6 w-full sm:text-right  text-orange-500">
                                    {order.amount}
                                  </p>
                                </div>

                                {order.status === "PENDING" && (
                                  <div className="flex items-center justify-center space-x-4">
                                    <div className="bg-green-400 px-2 w-fit rounded-lg border border-dashed my-4 ">
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            onClick={() =>
                                              handleApprove(
                                                order.id,
                                                order.type,
                                                "COMPLETED",
                                              )
                                            }
                                            variant="ghost"
                                            size="sm"
                                            disabled={
                                              loading &&
                                              selectedStatus === "COMPLETED" &&
                                              selectedOrderId === order.id
                                            }
                                          >
                                            {loading &&
                                            selectedStatus === "COMPLETED" &&
                                            selectedOrderId === order.id ? (
                                              <BeatLoader
                                                color="blue"
                                                size={8}
                                              />
                                            ) : (
                                              <>
                                                <span>Complete</span>
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                              </>
                                            )}
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className=" sm:max-w-lg text-gray-100">
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Approve Order
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              <span className="text-gray-300">
                                                Are you sure you want to accept
                                                this order with status:{" "}
                                              </span>
                                              <b className="text-green-600">
                                                COMPLETED
                                              </b>
                                              ?
                                            </AlertDialogDescription>
                                            <div className="flex items-center justify-center space-x-2">
                                              <p className="font-bold">
                                                {order.type}:
                                              </p>
                                              <p className="font-bold text-green-600">
                                                {order.amount} ETB
                                              </p>
                                            </div>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel
                                              disabled={loading}
                                              className="text-white"
                                            >
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={handleConfirm}
                                              disabled={loading}
                                            >
                                              {loading
                                                ? "Approving..."
                                                : "Yes, Approve"}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                    <div className="bg-red-400 px-2 w-fit rounded-lg border border-dashed my-4">
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            onClick={() =>
                                              handleApprove(
                                                order.id,
                                                order.type,
                                                "REJECTED",
                                              )
                                            }
                                            disabled={
                                              loading &&
                                              selectedStatus === "REJECTED" &&
                                              selectedOrderId === order.id
                                            }
                                            variant="ghost"
                                            size="sm"
                                          >
                                            {loading &&
                                            selectedStatus === "REJECTED" &&
                                            selectedOrderId === order.id ? (
                                              <BeatLoader
                                                color="blue"
                                                size={8}
                                              />
                                            ) : (
                                              <>
                                                <span>Reject</span>
                                                <XCircle className="h-4 w-4 text-red-600" />
                                              </>
                                            )}
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="sm:max-w-lg text-gray-100">
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Approve Order
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              <span className="text-gray-300">
                                                Are you sure you want to reject
                                                this order with status:{" "}
                                              </span>
                                              <b className="text-red-600">
                                                REJECTED
                                              </b>
                                              ?
                                            </AlertDialogDescription>
                                            <div className="flex items-center justify-center space-x-2">
                                              <p className="font-bold">
                                                {order.type}:
                                              </p>
                                              <p className="font-bold text-red-600">
                                                {order.amount} ETB
                                              </p>
                                            </div>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel
                                              disabled={loading}
                                              className="text-white"
                                            >
                                              Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={handleConfirm}
                                              disabled={loading}
                                            >
                                              {loading
                                                ? "Approving..."
                                                : "Yes, Approve"}
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  </div>
                                )}
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                      {/* </Button>
                                </AlertDialogTrigger> */}
                    </TableRow>
                  ))}
              </TableBody>
              {/* Pagination */}
            </Table>
            <div className="flex justify-end items-center mt-3 text-xs text-gray-200 gap-2">
              <div className="flex space-x-1">
                {[10, 20, 50].map((limit) => (
                  <button
                    key={limit}
                    onClick={() => handleLimitChange(limit)}
                    className={`px-2 py-1 text-xs border rounded-md transition-colors ${
                      limit === pageSize
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {limit}
                  </button>
                ))}
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "5px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    opacity: currentPage === 1 ? 0.5 : 1,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  &lt;
                </button>
                <p className="px-2 text-gray-200 ">
                  {currentPage} / {totalPages}
                </p>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "5px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  &gt;
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
