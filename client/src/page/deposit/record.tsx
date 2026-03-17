import { useEffect, useState } from "react";
import { Loader } from "@/components/Loading";
import { UserService } from "@/services/userService";
import { useNavigate } from "react-router-dom";
import { History, CheckCircle, Clock } from "lucide-react";

interface Deposit {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
}

export default function DepositRecord() {
  const [depositHistory, setDepositHistory] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepositHistory = async () => {
      try {
        const response = await UserService.getDepositOrders();
        setDepositHistory(response.orders);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching deposit history:", error);
        setIsLoading(false);
      }
    };

    fetchDepositHistory();
  }, []);

  const filteredHistory = depositHistory.filter((entry) =>
    filter === "ALL" ? true : entry.status === filter,
  );

  const totalDeposited = depositHistory
    .filter((entry) => entry.status === "COMPLETED")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const pendingAmount = depositHistory
    .filter((entry) => entry.status === "PENDING")
    .reduce((sum, entry) => sum + entry.amount, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header - Static */}
        <div className="mb-5 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-md flex items-center justify-center">
              <History className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-serif text-amber-800 mb-0.5">
            Deposit History
          </h1>
          <p className="text-xs text-amber-500">Your transaction records</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/95 rounded-lg p-3 border border-amber-200 shadow">
            <p className="text-amber-600 text-[10px] mb-0.5">Total Deposited</p>
            <p className="text-base font-bold text-amber-900">
              {totalDeposited.toFixed(2)}
            </p>
            <div className="flex items-center gap-0.5 mt-0.5">
              <span className="text-emerald-600 text-[8px]">Completed</span>
              <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white/95 rounded-lg p-3 border border-amber-200 shadow">
            <p className="text-amber-600 text-[10px] mb-0.5">Pending</p>
            <p className="text-base font-bold text-amber-900">
              {pendingAmount.toFixed(2)}
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

        {/* Timeline View - Simplified */}
        <div className="bg-white/95 rounded-lg shadow border border-amber-200 p-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-serif text-amber-800 flex items-center gap-1">
              <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full"></span>
              Transaction Timeline
            </h2>
            <span className="text-[8px] text-amber-400 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {filteredHistory.length} records
            </span>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 text-center border border-amber-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <span className="text-3xl">📭</span>
              </div>
              <p className="text-amber-800 text-sm mb-1 font-serif">
                No Records Found
              </p>
              <p className="text-amber-500 text-[10px] mb-3">
                Your deposit history will appear here
              </p>
              <button
                onClick={() => navigate("/deposit")}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full text-[10px] font-medium shadow-sm active:from-amber-500 active:to-orange-500"
              >
                Make a Deposit
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-lg border border-amber-100 p-2 hover:border-amber-200 transition-colors"
                >
                  {/* Mobile-optimized layout */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          entry.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {getStatusIcon(entry.status)}
                      </div>
                      <span className="font-medium text-sm text-amber-900">
                        {entry.amount.toFixed(2)} ETB
                      </span>
                    </div>
                    <span
                      className={`text-[8px] px-2 py-0.5 rounded-full font-medium border ${getStatusColor(entry.status)}`}
                    >
                      {entry.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-amber-500 pl-6">
                    <span className="bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {entry.paymentMethod}
                    </span>
                    <span>
                      {formatDate(entry.createdAt)} •{" "}
                      {formatTime(entry.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back to Deposit Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/deposit")}
            className="w-full max-w-[200px] py-2.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium border border-amber-200 active:bg-amber-200 transition-colors"
          >
            ← Back to Deposit
          </button>
        </div>
      </div>
    </div>
  );
}
