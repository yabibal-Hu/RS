import { useEffect, useState } from "react";
import { Loader } from "@/components/Loading";
import { UserService } from "@/services/userService";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  CheckCircle,
  Clock,
} from "lucide-react";

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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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
        return <CheckCircle className="w-4 h-4" />;
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const statCardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { stiffness: 300, damping: 20 },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: { stiffness: 400, damping: 10 },
    },
  };

  return (
    <div className="min-h-screen  py-8 px-4 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-300/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -30, 30, -30],
              x: [null, 30, -30, 30],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl -z-10"
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-8 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200 relative"
          >
            <History className="w-10 h-10 text-white" />
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur-xl -z-10"
            />
          </motion.div>

          <motion.h1
            className="text-3xl font-serif text-amber-800 mb-2"
            animate={{
              scale: [1, 1.02, 1],
              textShadow: [
                "0 0 0 rgba(245,158,11,0)",
                "0 0 8px rgba(245,158,11,0.3)",
                "0 0 0 rgba(245,158,11,0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Deposit History
          </motion.h1>

          <motion.p
            className="text-amber-500"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Your elegant transaction records
          </motion.p>
        </motion.div>

        {/* Stats Cards with Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
        >
          <motion.div
            variants={statCardVariants}
            whileHover="hover"
            className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-amber-200 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-orange-400/0"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <p className="text-amber-500 text-xs mb-2 font-serif tracking-wider uppercase">
              Total Transactions
            </p>
            <motion.p
              className="text-3xl font-serif text-amber-900"
              key={depositHistory.length}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {depositHistory.length}
            </motion.p>
            <p className="text-xs text-amber-400 mt-2">lifetime deposits</p>
          </motion.div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200 shadow-lg"
            >
              <p className="text-amber-600 text-xs mb-1">Total Deposited</p>
              <p className="text-sm font-bold text-amber-900">
                {totalDeposited.toFixed(2)}
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
                {pendingAmount.toFixed(2)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-amber-600 text-xs">Processing</span>
                <Clock className="w-3 h-3 text-amber-500" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl p-2 border border-amber-200 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex justify-evenly w-full">
              {["ALL", "COMPLETED", "PENDING"].map((status) => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === status
                      ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-md"
                      : "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200"
                  }`}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Timeline View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <motion.h2
              className="text-md font-serif text-amber-800 flex items-center gap-2"
              // animate={{ x: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span className="w-1 h-6 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full"></span>
              Transaction Timeline
            </motion.h2>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="text-xs text-amber-400 bg-amber-50 px-3 py-1 rounded-full border border-amber-200"
            >
              {filteredHistory.length} records
            </motion.span>
          </div>

          <AnimatePresence mode="wait">
            {filteredHistory.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 text-center border border-amber-200"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"
                >
                  <span className="text-4xl">📭</span>
                </motion.div>
                <p className="text-amber-800 text-lg mb-2 font-serif">
                  No Records Found
                </p>
                <p className="text-amber-500 text-sm mb-4">
                  Your deposit history will appear here
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/deposit")}
                  className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Make a Deposit
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {filteredHistory.map((entry, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    onHoverStart={() => setHoveredId(entry.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    className="relative"
                  >
                    {/* Ultra Compact Card */}
                    <motion.div
                      whileHover={{ scale: 1.01, x: 2 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                      className="bg-white rounded-lg border border-amber-100 p-2 relative hover:shadow-sm transition-all"
                    >
                      <div className="grid grid-cols-12 gap-1 items-center text-xs">
                        {/* Status Icon - Col 1 */}
                        <div className="col-span-1">
                          <motion.div
                            animate={{
                              rotate: entry.status === "PENDING" ? [0, 360] : 0,
                            }}
                            transition={{
                              duration: 2,
                              repeat: entry.status === "PENDING" ? Infinity : 0,
                              ease: "linear",
                            }}
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              entry.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-600"
                                : entry.status === "PENDING"
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-rose-100 text-rose-600"
                            }`}
                          >
                            {getStatusIcon(entry.status)}
                          </motion.div>
                        </div>

                        {/* Amount - Col 2-3 */}
                        <div className="col-span-2">
                          <span className="font-medium text-amber-900">
                            {entry.amount.toFixed(2)}
                          </span>
                          <span className="text-[8px] ml-0.5 text-amber-400">
                            ETB
                          </span>
                        </div>

                        {/* Payment Method - Col 4-5 */}
                        <div className="col-span-2">
                          <span className="text-[9px] bg-amber-50 px-1.5 py-0.5 rounded-full text-amber-600 border border-amber-200 truncate block text-center">
                            {entry.paymentMethod}
                          </span>
                        </div>

                        {/* Date - Col 6-8 */}
                        <div className="col-span-3 text-[9px] text-amber-500">
                          {formatDate(entry.createdAt)}
                        </div>

                        {/* Time - Col 9 */}
                        <div className="col-span-1 text-[9px] text-amber-500">
                          {formatTime(entry.createdAt)}
                        </div>

                        {/* Status - Col 10-11 */}
                        <div className="col-span-2">
                          <span
                            className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium border block text-center ${getStatusColor(entry.status)}`}
                          >
                            {entry.status}
                          </span>
                        </div>
                      </div>

                      {/* Hover indicator line */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: hoveredId === entry.id ? "100%" : 0 }}
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer summary */}
          {/* {filteredHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 pt-4 border-t border-amber-100"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-amber-600">
                      Completed: {totalDeposited.toFixed(2)} ETB
                    </span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="text-amber-600">
                      Pending: {pendingAmount.toFixed(2)} ETB
                    </span>
                  </motion.div>
                  {rejectedAmount > 0 && (
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                      <span className="text-amber-600">
                        Rejected: {rejectedAmount.toFixed(2)} ETB
                      </span>
                    </motion.div>
                  )}
                </div>
                <motion.span
                  className="text-amber-300 text-xs flex items-center gap-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-3 h-3" />
                  Last updated: {new Date().toLocaleDateString()}
                </motion.span>
              </div>
            </motion.div>
          )} */}
        </motion.div>

        {/* Floating Action Button */}
        {/* <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15,
            delay: 0.6,
          }}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate("/deposit")}
          className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full shadow-xl flex items-center justify-center text-white z-50"
        >
          <ArrowRight className="w-6 h-6" />
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-xl -z-10"
          />
        </motion.button> */}
      </div>
    </div>
  );
}
