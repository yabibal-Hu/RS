import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@/components/Loading";
import { SettingService } from "@/services/settingService";
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
      showToast.error("Please deposit first to unlock VIP levels.");
      navigate("/deposit");
      return;
    }
    navigate(
      `/deposit?amount=${price}&vip=${levelName}&balance=${userCurrentBalance}&currentLevelPrice=${currentLevelPrice}`,
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-2 relative">
      {/* Single static background element */}
      <div className="fixed top-20 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/5 to-orange-400/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Header - Static */}
        <div className="mb-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-md flex items-center justify-center">
              <Crown className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-serif text-amber-800 mb-0.5">
            VIP Levels
          </h1>
          <p className="text-amber-500 text-xs">
            Unlock exclusive benefits and earn more
          </p>
        </div>

        {/* Current VIP Status - Static */}
        <div className="bg-white/95 rounded-lg shadow border border-amber-200 p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-amber-600 text-[10px]">Current VIP Level</p>
                <h2 className="text-lg font-bold text-amber-900">
                  VIP {userVipLevel}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <p className="text-amber-600 text-[10px]">Balance</p>
              <p className="text-base font-bold text-amber-900">
                {userCurrentBalance} ETB
              </p>
            </div>
          </div>
        </div>

        {/* VIP Grid - Simple cards without animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {vip?.map((level) => (
            <div key={level.id} className="relative">
              {/* Simple Card */}
              <div
                className={`bg-white/95 rounded-lg shadow border-2 overflow-hidden
                ${level.unlocked ? "border-emerald-200" : "border-amber-200"}`}
              >
                {/* Card Header - Thin line */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${
                    level.unlocked
                      ? "from-emerald-400 to-green-500"
                      : "from-amber-400 to-orange-400"
                  }`}
                ></div>

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  {level.unlocked ? (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded-full border border-emerald-200">
                      <Unlock className="w-2 h-2" />
                      <span className="text-[8px] font-medium">UNLOCKED</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded-full border border-amber-200">
                      <Lock className="w-2 h-2" />
                      <span className="text-[8px] font-medium">LOCKED</span>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {/* VIP Icon */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`relative w-20 h-20 rounded-full my-1 flex items-center justify-center
                      ${
                        level.unlocked
                          ? "bg-gradient-to-br from-amber-400 to-orange-400"
                          : "bg-gradient-to-br from-amber-200 to-orange-200"
                      }`}
                      >
                        <img
                          src={
                            vipImages[Number(level.name)] || "/images/gift.png"
                          }
                          alt={`VIP ${level.name}`}
                          className="w-20 h-20 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/images/gift.png";
                          }}
                        />

                        {/* Level Number */}
                        <div
                          className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                        ${
                          level.unlocked
                            ? "bg-emerald-500 text-white"
                            : "bg-amber-200 text-amber-700"
                        }`}
                        >
                          VIP {level.name}
                        </div>
                      </div>

                      <h3 className="text-xs text-amber-900 text-center line-clamp-1 mt-2">
                        {level.description || `VIP Level ${level.name}`}
                      </h3>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-1.5">
                      <div className="bg-amber-50/50 rounded-lg p-1.5 text-center border border-amber-100">
                        <div className="flex items-center justify-center gap-0.5 text-amber-500 mb-0.5">
                          <Zap className="w-2.5 h-2.5" />
                          <span className="text-[8px]">Per Task</span>
                        </div>
                        <p className="text-sm font-bold text-emerald-600">
                          {level.incomePerTask} ETB
                        </p>
                      </div>

                      <div className="bg-amber-50/50 rounded-lg p-1.5 text-center border border-amber-100">
                        <div className="flex items-center justify-center gap-0.5 text-amber-500 mb-0.5">
                          <Calendar className="w-2.5 h-2.5" />
                          <span className="text-[8px]">Weekly</span>
                        </div>
                        <p className="text-sm font-bold text-amber-800">
                          {level.dailyIncome * 7} ETB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Price and Action */}
                  <div className="space-y-1.5 mt-2">
                    <div className="flex items-center justify-between px-2 py-1 bg-amber-100/50 rounded-lg border border-amber-200">
                      <span className="text-amber-700 text-[10px]">Price</span>
                      <span className="text-sm font-bold text-amber-900">
                        {level.price} ETB
                      </span>
                    </div>

                    <button
                      onClick={() => handleUnlock(level.name, level.price)}
                      disabled={level.unlocked}
                      className={`w-full py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1
                        ${
                          level.unlocked
                            ? "bg-emerald-100 text-emerald-600 border border-emerald-200 cursor-default"
                            : "bg-gradient-to-r from-amber-400 to-orange-400 active:from-amber-500 active:to-orange-500 text-white shadow-sm"
                        }`}
                    >
                      {level.unlocked ? (
                        <>
                          <Unlock className="w-2.5 h-2.5" />
                          <span>Unlocked</span>
                        </>
                      ) : (
                        <>
                          <Gift className="w-2.5 h-2.5" />
                          <span>Upgrade</span>
                        </>
                      )}
                    </button>

                    {/* Yearly Earning Hint */}
                    {!level.unlocked && (
                      <p className="text-[8px] text-center text-amber-400">
                        ✨ {(level.dailyIncome * 365).toLocaleString()} ETB/year
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/95 rounded-full border border-amber-200">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
            <p className="text-[10px] text-amber-600">
              Higher levels = better rewards
            </p>
          </div>
        </div>
      </div>

      <style>{`
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
