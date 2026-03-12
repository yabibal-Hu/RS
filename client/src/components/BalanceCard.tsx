import { motion } from "framer-motion";
import { Wallet,  Crown } from "lucide-react";
import { Exchange, ToUSDT } from "./Exchange";

export default function BalanceCard({
  balance,
  VipLevel,
  referralIncome,
}: {
  balance: number;
  VipLevel: string;
  referralIncome: number;
}) {
  const totalBalance =
    VipLevel === "0" ? (balance || 0) + (referralIncome || 0) : balance || 0;

  const usdtValue = ToUSDT(totalBalance);
  const exchangedPrice = Exchange(totalBalance);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-amber-200 overflow-hidden group"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #f59e0b 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      {/* Top Gradient Bar */}
      <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 animate-gradient-x"></div>

      {/* Decorative Circles */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-3xl"></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-serif text-amber-800">Your Balance</h2>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 bg-amber-100 rounded-full border border-amber-200">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-700">
              VIP {VipLevel}
            </span>
          </div>
        </div>

        {/* Balance Amounts */}
        <div className="space-y-3">
          {/* USDT Balance */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-amber-600">USDT Balance</span>
            <motion.span
              key={usdtValue}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-amber-900"
            >
              {usdtValue}{" "}
              <span className="text-sm font-normal text-amber-500">USDT</span>
            </motion.span>
          </div>

          {/* Local Currency Balance */}
          <div className="flex items-center justify-between pt-2 border-t border-amber-100">
            <span className="text-sm text-amber-600">ETB Balance</span>
            <motion.span
              key={exchangedPrice.value}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xl font-bold text-amber-800"
            >
              {exchangedPrice.value}{" "}
              <span className="text-sm font-normal text-amber-500">
                {exchangedPrice.currency}
              </span>
            </motion.span>
          </div>
        </div>

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-amber-50/50 rounded-lg p-2 text-center border border-amber-200">
            <p className="text-xs text-amber-500">Referral Income</p>
            <p className="text-sm font-bold text-emerald-600">
              {referralIncome} ETB
            </p>
          </div>
          <div className="bg-amber-50/50 rounded-lg p-2 text-center border border-amber-200">
            <p className="text-xs text-amber-500">Total Value</p>
            <p className="text-sm font-bold text-amber-700">
              {totalBalance} ETB
            </p>
          </div>
        </div> */}

        {/* Progress Indicator */}
        {/* <div className="mt-4">
          <div className="flex justify-between text-xs text-amber-400 mb-1">
            <span>Daily Goal</span>
            <span>65%</span>
          </div>
          <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
            />
          </div>
        </div> */}
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </motion.div>
  );
}
