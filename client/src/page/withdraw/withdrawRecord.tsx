import { Loader } from "@/components/Loading";
import { UserService } from "@/services/userService";
import { useEffect, useState } from "react";
import { History, Clock, CheckCircle, Calendar } from "lucide-react";

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
}

export default function WithdrawRecord() {
  const [withdrawalHistory, setWithdrawalHistory] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const fetchWithdrawalHistory = async () => {
      try {
        const response = await UserService.getWithdrawOrders();
        setWithdrawalHistory(response.orders);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching withdrawal history:", error);
        setIsLoading(false);
      }
    };

    fetchWithdrawalHistory();
  }, []);

  // Filter withdrawals based on status
  const filteredHistory = withdrawalHistory.filter((entry) =>
    filter === "ALL" ? true : entry.status === filter,
  );

  // Calculate totals
  const totalWithdrawn = withdrawalHistory
    .filter((entry) => entry.status === "COMPLETED")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const pendingWithdrawals = withdrawalHistory
    .filter((entry) => entry.status === "PENDING")
    .reduce((sum, entry) => sum + entry.amount, 0);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time function
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "PENDING":
        return "bg-amber-50 text-amber-600 border-amber-200";
      default:
        return "bg-amber-50 text-amber-600 border-amber-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-3 h-3" />;
      case "PENDING":
        return <Clock className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  // Get payment method icon
  const getPaymentIcon = (method: string) => {
    const lowerMethod = method.toLowerCase();
    if (lowerMethod.includes("bank")) return "🏦";
    if (lowerMethod.includes("card")) return "💳";
    if (lowerMethod.includes("crypto") || lowerMethod.includes("binance"))
      return "🪙";
    if (lowerMethod.includes("telebirr")) return "📱";
    if (lowerMethod.includes("revolut")) return "💳";
    if (lowerMethod.includes("monzo")) return "🏦";
    return "💸";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-3 relative">
      {/* Single static background element */}
      <div className="fixed top-20 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/5 to-orange-400/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-2xl mx-auto">
        {/* Header - Static */}
        <div className="mb-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-md flex items-center justify-center">
              <History className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-serif text-amber-800 mb-0.5">
            Withdrawal History
          </h1>
          <p className="text-xs text-amber-500">
            Track all your withdrawal transactions
          </p>
        </div>

        {/* Stats Summary - Simplified */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/95 rounded-lg p-3 border border-amber-200 shadow">
            <p className="text-amber-600 text-[10px] mb-0.5">Total Withdrawn</p>
            <p className="text-base font-bold text-amber-900">
              {totalWithdrawn.toFixed(2)}
            </p>
            <div className="flex items-center gap-0.5 mt-0.5">
              <span className="text-emerald-600 text-[8px]">Completed</span>
              <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white/95 rounded-lg p-3 border border-amber-200 shadow">
            <p className="text-amber-600 text-[10px] mb-0.5">Pending</p>
            <p className="text-base font-bold text-amber-900">
              {pendingWithdrawals.toFixed(2)}
            </p>
            <div className="flex items-center gap-0.5 mt-0.5">
              <span className="text-amber-600 text-[8px]">Processing</span>
              <Clock className="w-2.5 h-2.5 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Filter Bar - Simplified */}
        <div className="bg-white/95 rounded-lg p-1.5 border border-amber-200 shadow mb-4">
          <div className="flex justify-evenly">
            {["ALL", "COMPLETED", "PENDING"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors flex-1 mx-0.5 ${
                  filter === status
                    ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white"
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Withdrawal List - Simplified */}
        <div className="bg-white/95 rounded-lg shadow border border-amber-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-serif text-amber-800">
                All Withdrawals
              </h2>
              <p className="text-amber-500 text-[10px] mt-0.5">
                {filteredHistory.length} transaction
                {filteredHistory.length !== 1 ? "s" : ""}
              </p>
            </div>
            {/* Removed download button - unnecessary for mobile */}
          </div>

          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 bg-amber-100 rounded-full flex items-center justify-center">
                <History className="w-7 h-7 text-amber-400" />
              </div>
              <p className="text-amber-800 text-sm font-medium mb-1">
                No withdrawals yet
              </p>
              <p className="text-amber-500 text-[10px]">
                {filter === "ALL"
                  ? "Make your first withdrawal to see history here"
                  : `No ${filter.toLowerCase()} withdrawals found`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-amber-50/50 rounded-lg p-3 border border-amber-200"
                >
                  {/* Mobile-optimized layout */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white text-sm">
                        {getPaymentIcon(entry.paymentMethod)}
                      </div>
                      <div>
                        <p className="text-amber-900 font-bold text-base">
                          {entry.amount.toFixed(2)} ETB
                        </p>
                        <p className="text-amber-600 text-[9px]">
                          {entry.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full border ${getStatusBadge(entry.status)}`}
                    >
                      {getStatusIcon(entry.status)}
                      <span className="text-[8px] font-medium">
                        {entry.status}
                      </span>
                    </div>
                  </div>

                  {/* Date and Time - Row below */}
                  <div className="flex items-center gap-3 text-[9px] pl-10">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Calendar className="w-2.5 h-2.5" />
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{formatTime(entry.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Footer - Simplified */}
        {filteredHistory.length > 0 && (
          <div className="mt-3 text-center">
            <p className="text-amber-400 text-[8px]">
              Showing {filteredHistory.length} of {withdrawalHistory.length}{" "}
              total transactions
            </p>
          </div>
        )}

        {/* Back to Withdraw Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => window.history.back()}
            className="w-full max-w-[200px] py-2.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium border border-amber-200 active:bg-amber-200 transition-colors"
          >
            ← Back to Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}
