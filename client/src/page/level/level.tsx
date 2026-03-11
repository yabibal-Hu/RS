import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components/Loading";
import { SettingService } from "@/services/settingService";
import { motion } from "framer-motion";
import {
  Crown,
  Calendar,
  Award,
  Lock,
  Unlock,
  Zap,
  Gift,
  Sparkles,
} from "lucide-react";
import { showToast } from "@/utils/toast";

interface Vip {
  id: number;
  name: string;
  description: string;
  commission: number;
  dailyTask: number;
  incomePerTask: number;
  price: number;
  logoDir: string;
  dailyIncome: number;
  unlocked: boolean;
}

export default function ProductPage() {
  const [vip, setVip] = useState<Vip[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCurrentBalance, setUserCurrentBalance] = useState(0);
  const [userVipLevel, setUserVipLevel] = useState("");
  const [currentLevelPrice, setCurrentLevelPrice] = useState(0);
  const navigate = useNavigate();

  const vipImages: { [key: string]: string } = {
    "0": "/images/vip/0.png",
    "1": "/images/vip/1.png",
    "2": "/images/vip/2.png",
    "3": "/images/vip/3.png",
    "4": "/images/vip/4.png",
    "5": "/images/vip/5.png",
    "6": "/images/vip/6.png",
    "7": "/images/vip/7.png",
    "8": "/images/vip/8.png",
    "9": "/images/vip/9.png",
    "10": "/images/vip/10.png",
    "11": "/images/vip/11.png",
  };

  useEffect(() => {
    const fetchVipInfo = async () => {
      try {
        setLoading(true);
        const vipData = await SettingService.allVips();
        const currentVipLevel = vipData.userVip.profile.vipName;
        const currentLevelPrice =
          vipData.vips.find((level: any) => level.name === currentVipLevel)
            ?.price || 0;
        setCurrentLevelPrice(currentLevelPrice);
        setUserCurrentBalance(vipData.userVip.profile.currentBalance);
        setUserVipLevel(currentVipLevel || "0");

        if (vipData.vips && Array.isArray(vipData.vips)) {
          const processedVip = vipData.vips.map((level: any) => ({
            id: level.id,
            name: level.name,
            description: level.description || "",
            commission: level.commission || 0,
            dailyTask: level.dailyTask || 0,
            incomePerTask: level.incomePerTask || 0,
            price: level.price || 0,
            logoDir: level.logoDir || "",
            dailyIncome: level.dailyIncome || 0,
            unlocked: Number(level.name) <= Number(currentVipLevel),
          }));

          setVip(processedVip);
        }
      } catch (error) {
        console.error("Failed to fetch VIP data:", error);
        if (
          error instanceof Error &&
          (error.message.includes("401") || error.message.includes("403"))
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVipInfo();
  }, []);

  const handleUnlock = (levelName: string, price: number) => {
    if (userVipLevel == "0") {
      showToast.error(
        "Please deposit first to unlock VIP levels.",
      );
      navigate("/deposit");
      return;
    }
    navigate(
      `/deposit?amount=${price}&vip=${levelName}&balance=${userCurrentBalance}&currentLevelPrice=${currentLevelPrice}`,
    );
  };

  // const getNextVipLevel = () => {
  //   const currentLevel = parseInt(userVipLevel);
  //   return vip.find((v) => parseInt(v.name) === currentLevel + 1);
  // };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-6 px-3 relative">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-lg shadow-amber-200 flex items-center justify-center animate-float">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-serif text-amber-800 mb-1">
            VIP Levels
          </h1>
          <p className="text-amber-500 text-sm">
            Unlock exclusive benefits and earn more
          </p>
        </div>

        {/* Current VIP Status - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-amber-600 text-xs">Current VIP Level</p>
                <h2 className="text-xl font-bold text-amber-900">
                  VIP {userVipLevel}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <p className="text-amber-600 text-xs">Balance</p>
              <p className="text-lg font-bold text-amber-900">
                {userCurrentBalance} ETB
              </p>
            </div>
          </div>
        </motion.div>

        {/* VIP Grid - Smaller Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vip?.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Compact Card */}
              <div
                className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                ${
                  level.unlocked
                    ? "border-emerald-200"
                    : "border-amber-200 hover:border-amber-300"
                }`}
              >
                {/* Card Header Gradient - Thinner */}
                <div
                  className={`h-1.5 w-full bg-gradient-to-r ${
                    level.unlocked
                      ? "from-emerald-400 to-green-500"
                      : "from-amber-400 to-orange-400"
                  }`}
                ></div>

                {/* Status Badge - Smaller */}
                <div className="absolute top-3 left-2">
                  {level.unlocked ? (
                    <div className="flex items-center gap-0.5 px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-full border border-emerald-200">
                      <Unlock className="w-2.5 h-2.5" />
                      <span className="text-[10px] font-medium">UNLOCKED</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full border border-amber-200">
                      <Lock className="w-2.5 h-2.5" />
                      <span className="text-[10px] font-medium">LOCKED</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {/* VIP Icon and Level - Smaller */}
                    <div className="flex flex-col items-center mt-3">
                      <div
                        className={`relative w-24 h-24 rounded-full my-2 flex items-center justify-center
                      ${
                        level.unlocked
                          ? "bg-gradient-to-br from-amber-400 to-orange-400"
                          : "bg-gradient-to-br from-amber-200 to-orange-200"
                      }`}
                      >
                        <img
                          src={
                            vipImages[Number(level.name) ] ||
                            "/images/gift.png"
                          }
                          alt={`VIP ${level.name}`}
                          className="w-24 h-24 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/gift.png";
                          }}
                        />

                        {/* Level Number - Smaller */}
                        <div
                          className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold
                        ${
                          level.unlocked
                            ? "bg-emerald-500 text-white"
                            : "bg-amber-200 text-amber-700"
                        }`}
                        >
                          VIP {level.name}
                        </div>
                      </div>

                      <h3 className="text-sm font-serif text-amber-900 text-center line-clamp-1">
                        {level.description || `VIP Level ${level.name}`}
                      </h3>
                    </div>

                    {/* Compact Stats - Only 2 stats (Per Task & Daily Income) */}
                    <div className="grid grid-cols-1 gap-2 mb-3">
                      <div className="bg-amber-50/50 rounded-lg p-2 text-center border border-amber-100">
                        <div className="flex items-center justify-center gap-0.5 text-amber-500 mb-0.5">
                          <Zap className="w-3 h-3" />
                          <span className="text-[10px]">Daily Task</span>
                        </div>
                        <p className="text-base font-bold text-emerald-600">
                          {level.incomePerTask} ETB
                        </p>
                      </div>

                      <div className="bg-amber-50/50 rounded-lg p-2 text-center border border-amber-100">
                        <div className="flex items-center justify-center gap-0.5 text-amber-500 mb-0.5">
                          <Calendar className="w-3 h-3" />
                          <span className="text-[10px]">Weekly</span>
                        </div>
                        <p className="text-base font-bold text-amber-800">
                          {level.dailyIncome * 7} ETB
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Price and Action - Compact */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-2 py-1.5 bg-amber-100/50 rounded-lg border border-amber-200">
                      <span className="text-amber-700 text-xs">Price</span>
                      <span className="text-base font-bold text-amber-900">
                        {level.price} ETB
                      </span>
                    </div>

                    <button
                      onClick={() => handleUnlock(level.name, level.price)}
                      disabled={level.unlocked}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1
                        ${
                          level.unlocked
                            ? "bg-emerald-100 text-emerald-600 border border-emerald-200 cursor-default"
                            : "bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white shadow-md hover:shadow-lg active:scale-95"
                        }`}
                    >
                      {level.unlocked ? (
                        <>
                          <Unlock className="w-3 h-3" />
                          <span className="text-xs">Unlocked</span>
                        </>
                      ) : (
                        <>
                          <Gift className="w-3 h-3" />
                          <span className="text-xs">Upgrade</span>
                        </>
                      )}
                    </button>

                    {/* Yearly Earning Hint - Smaller */}
                    {!level.unlocked && (
                      <p className="text-[10px] text-center text-amber-400">
                        ✨ {(level.dailyIncome * 365).toLocaleString()} ETB/year
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Footer - Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-amber-200">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <p className="text-xs text-amber-600">
              Higher levels = better rewards
            </p>
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
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
