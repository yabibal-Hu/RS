import { ReferralNetwork } from "@/components/ReferralList";
import { UserService } from "@/services/userService";
import { Award } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ReferralStats = {
  level1?: number;
  level2?: number;
  level3?: number;
  totalReferrals?: number;
};

export const ReferralNetworkPage = () => {
  const [referralData, setReferralData] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("rsToken");
    const fetchUserData = async () => {
      const response = await UserService.getReferralNetwork();
      if (response.success) {
        setReferralData(response.data);
        setLoading(false);
      }
    };
    if (token) {
      fetchUserData();
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-14 h-14 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-amber-600 text-sm">Loading network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-6 px-3">
      <div className="max-w-6xl mx-auto">
        {/* Page Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-lg shadow-amber-200 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-amber-800 mb-1">
            Referral Network
          </h1>
          <p className="text-sm sm:text-base text-amber-500 px-4">
            Visualize your referral tree and track your network growth
          </p>
        </motion.div>

        {/* Network Visualization */}
        {referralData && <ReferralNetwork data={referralData} />}

        {/* Stats Cards - Mobile Optimized Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-6"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-amber-200 text-center">
            <p className="text-amber-500 text-[10px] sm:text-xs mb-1">
              Level 1
            </p>
            <p className="text-xl sm:text-2xl font-bold text-amber-800">
              {referralData?.level1 || 0}
            </p>
            <p className="text-[8px] sm:text-xs text-amber-400 truncate">
              Direct
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-amber-200 text-center">
            <p className="text-amber-500 text-[10px] sm:text-xs mb-1">
              Level 2
            </p>
            <p className="text-xl sm:text-2xl font-bold text-amber-800">
              {referralData?.level2 || 0}
            </p>
            <p className="text-[8px] sm:text-xs text-amber-400 truncate">
              2nd Level
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-amber-200 text-center">
            <p className="text-amber-500 text-[10px] sm:text-xs mb-1">
              Level 3
            </p>
            <p className="text-xl sm:text-2xl font-bold text-amber-800">
              {referralData?.level3 || 0}
            </p>
            <p className="text-[8px] sm:text-xs text-amber-400 truncate">
              3rd Level
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-3 sm:p-4 border border-amber-300 text-center">
            <p className="text-amber-600 text-[10px] sm:text-xs mb-1">Total</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-800">
              {referralData?.totalReferrals || 0}
            </p>
            <p className="text-[8px] sm:text-xs text-amber-500 truncate">
              Network
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 mt-6"
        >
          <button className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-1">
            <Share2 className="w-3 h-3" />
            Share Link
          </button>
          <button className="px-4 py-2 bg-white/90 backdrop-blur-sm hover:bg-amber-50 text-amber-700 rounded-lg text-xs sm:text-sm font-medium border border-amber-200 shadow-md hover:shadow-lg transition-all flex items-center gap-1">
            <Users className="w-3 h-3" />
            View All
          </button>
        </motion.div> */}
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
};

export default ReferralNetworkPage;
