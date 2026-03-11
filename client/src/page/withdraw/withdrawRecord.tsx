import { Loader } from "@/components/Loading";
import { UserService } from "@/services/userService";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  Clock,
  CheckCircle,
  Calendar,
  Download,
} from "lucide-react";

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
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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
         <Loader />;
       </div>
     );
   }

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-lg shadow-amber-200 flex items-center justify-center animate-float">
              <History className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-serif text-amber-800 mb-2">
            Withdrawal History
          </h1>
          <p className="text-amber-500">
            Track all your withdrawal transactions
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200 shadow-lg"
          >
            <p className="text-amber-600 text-xs mb-1">Total Withdrawn</p>
            <p className="text-xl font-bold text-amber-900">
              {totalWithdrawn.toFixed(2)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-emerald-600 text-xs">Completed</span>
              <CheckCircle className="w-3 h-3 text-emerald-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200 shadow-lg"
          >
            <p className="text-amber-600 text-xs mb-1">Pending</p>
            <p className="text-sm font-bold text-amber-900">
              {pendingWithdrawals.toFixed(2)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-amber-600 text-xs">Processing</span>
              <Clock className="w-3 h-3 text-amber-500" />
            </div>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-2 border border-amber-200 shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex justify-evenly w-full">
              {["ALL", "COMPLETED", "PENDING"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === status
                      ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md"
                      : "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Withdrawal List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-serif text-amber-800">
                All Withdrawals
              </h2>
              <p className="text-amber-500 text-sm mt-1">
                {filteredHistory.length} transaction
                {filteredHistory.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>

          {filteredHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                <History className="w-10 h-10 text-amber-400" />
              </div>
              <p className="text-amber-800 font-medium mb-2">
                No withdrawals yet
              </p>
              <p className="text-amber-500 text-sm">
                {filter === "ALL"
                  ? "Make your first withdrawal to see history here"
                  : `No ${filter.toLowerCase()} withdrawals found`}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-amber-50/50 rounded-xl p-4 border border-amber-200 hover:border-amber-300 transition-all"
                >
                  {/* Top Row - Amount & Status */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white text-lg">
                        {getPaymentIcon(entry.paymentMethod)}
                      </div>
                      <div>
                        <p className="text-amber-900 font-bold text-lg">
                          {entry.amount.toFixed(2)} ETB
                        </p>
                        <p className="text-amber-600 text-sm">
                          {entry.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${getStatusBadge(entry.status)}`}
                    >
                      {getStatusIcon(entry.status)}
                      <span className="text-xs font-medium">
                        {entry.status}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row - Date & Time */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(entry.createdAt)}</span>
                    </div>
                  </div>

                  {/* Transaction ID (optional - can be shown on hover or expand) */}
                  {/* <div className="mt-2 text-xs text-amber-400 font-mono">
                    ID: {entry.id.slice(0, 8)}...{entry.id.slice(-4)}
                  </div> */}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Footer */}
        {filteredHistory.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-amber-400 text-sm">
              Showing {filteredHistory.length} of {withdrawalHistory.length}{" "}
              total transactions
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
