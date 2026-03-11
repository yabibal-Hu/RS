import {
  TrendingUp,
  Users,
  Zap,
  Gift,
  Star,
  Award,
  Target,
  Shield,
} from "lucide-react";
import ReferralCard from "@/components/ReferralCard";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loading";
import { UserService } from "@/services/userService";
import { motion } from "framer-motion";

interface Referral {
  id: number;
  amount: number;
  createdAt: string;
}

const Referral = () => {
  const [totalReferrals, setTotalReferrals] = useState("");
  const [activeReferrals, setActiveReferrals] = useState("");
  const [loading, setLoading] = useState(true);
  const [invitationCode, setInvitationCode] = useState("");
  const [totalCommission, setTotalCommission] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUserData = async () => {
      const response = await UserService.getReferral();
      if (response.success) {
        setTotalReferrals(response.data.referrals);
        setActiveReferrals(response.data.activeReferrals);
        setInvitationCode(response.data.invitationCode);
        setTotalCommission(response.data.totalCommission || 0);
        setLoading(false);
      }
    };
    if (token) {
      fetchUserData();
    }
  }, []);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen ">
          <Loader />;
        </div>
      );
    }

  return (
    <div className="min-h-screen  py-8 px-4 relative">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl -z-10"></div>


      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-lg shadow-amber-200 flex items-center justify-center animate-float">
              <Users className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-serif text-amber-800 mb-2">
            Referral Program
          </h1>
          <p className="text-amber-500">Invite friends and earn together!</p>
        </motion.div>

        {/* Referral Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Referral Link Card - Takes 2 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <ReferralCard invitationCode={invitationCode} />
          </motion.div>

          {/* Stats Cards - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Total Referrals Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6 relative overflow-hidden group hover:shadow-2xl transition-all">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-2xl"></div>

              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-amber-600 text-sm mb-1">Total Referrals</p>
                  <p className="text-4xl font-bold text-amber-900">
                    {totalReferrals}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-amber-200">
                <span className="text-amber-500 text-sm">Network Size</span>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    Number(totalReferrals) > 0
                      ? "bg-emerald-100 text-emerald-600 border border-emerald-200"
                      : "bg-amber-100 text-amber-600 border border-amber-200"
                  }`}
                >
                  {Number(totalReferrals) > 0 ? "🌐 Growing" : "✨ Start now"}
                </span>
              </div>

              {/* Progress indicator */}
              <div className="mt-4">
                <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(Number(totalReferrals) * 10, 100)}%`,
                    }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>

            {/* Active Referrals Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6 relative overflow-hidden group hover:shadow-2xl transition-all">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-full blur-2xl"></div>

              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-amber-600 text-sm mb-1">
                    Active Referrals
                  </p>
                  <p className="text-4xl font-bold text-amber-900">
                    {activeReferrals}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-400 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-amber-200">
                <span className="text-amber-500 text-sm">Active Network</span>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    Number(activeReferrals) > 0
                      ? "bg-emerald-100 text-emerald-600 border border-emerald-200"
                      : "bg-amber-100 text-amber-600 border border-amber-200"
                  }`}
                >
                  {Number(activeReferrals) > 0 ? "⚡ Live" : "🎯 Invite more!"}
                </span>
              </div>

              {/* Active users indicator */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(Math.min(Number(activeReferrals), 5))].map(
                    (_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 border-2 border-white flex items-center justify-center"
                      >
                        <span className="text-[10px] text-white font-bold">
                          👤
                        </span>
                      </div>
                    ),
                  )}
                </div>
                <span className="text-xs text-amber-500">active now</span>
              </div>
            </div>

            {/* Commission Preview Card */}
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 border border-amber-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-amber-700 text-sm">Commission Earned</p>
                  <p className="text-xl font-bold text-amber-900">
                    {totalCommission} ETB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-white/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-amber-600">Bonus Rate</p>
                  <p className="text-sm font-bold text-emerald-600">10%</p>
                </div>
                <div className="bg-white/50 rounded-lg p-2 text-center">
                  <p className="text-xs text-amber-600">Welcome Gift</p>
                  <p className="text-sm font-bold text-emerald-600">50 ETB</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-xl font-serif text-amber-800 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <Gift className="w-6 h-6" />,
                title: "Share Your Link",
                description: "Share your unique referral link with friends",
                color: "from-amber-400 to-orange-400",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Friends Join",
                description: "They sign up using your referral code",
                color: "from-amber-400 to-orange-400",
              },
              {
                icon: <Star className="w-6 h-6" />,
                title: "Earn Rewards",
                description: "Get 10% commission on their deposits",
                color: "from-amber-400 to-orange-400",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-amber-200 text-center group hover:shadow-xl transition-all"
              >
                <div
                  className={`w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <div className="text-white">{step.icon}</div>
                </div>
                <h3 className="font-serif text-amber-800 mb-2">{step.title}</h3>
                <p className="text-sm text-amber-500">{step.description}</p>

                {/* Step number */}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200">
                  <span className="text-xs font-bold text-amber-600">
                    {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-amber-200 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-amber-800 mb-1">
                Lifetime Commission
              </h3>
              <p className="text-sm text-amber-500">
                Earn 10% commission on all deposits made by your referrals,
                forever!
              </p>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-amber-200 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-serif text-amber-800 mb-1">
                Instant Payouts
              </h3>
              <p className="text-sm text-amber-500">
                Commission is credited instantly to your balance. Withdraw
                anytime!
              </p>
            </div>
          </div>
        </motion.div>
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

export default Referral;
