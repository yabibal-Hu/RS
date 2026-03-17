import { useEffect, useState } from "react";
import {
  UserCircleIcon,
  PhoneIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  CurrencyDollarIcon as CurrencyDollarIconSolid,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  TrendingUp,
  Sparkles,
  Zap,
  Medal,
  Target,
} from "lucide-react";

type Member = {
  id: number;
  name: string;
  phone: string;
  vip: number;
  balance: string;
  profit?: string;
};

const sampleMembers: Member[] = [
  {
    id: 1,
    name: "Alice Johnson",
    phone: "+25101****12",
    vip: 2,
    balance: "12,615 ETB",
    profit: "+1,250 ETB",
  },
  {
    id: 2,
    name: "Brian Smith",
    phone: "+25103****23",
    vip: 5,
    balance: "55,312 ETB",
    profit: "+4,820 ETB",
  },
  {
    id: 3,
    name: "Catherine Lee",
    phone: "+25115****45",
    vip: 3,
    balance: "17,200 ETB",
    profit: "+1,890 ETB",
  },
  {
    id: 4,
    name: "Daniel Kim",
    phone: "+25102****34",
    vip: 4,
    balance: "26,452 ETB",
    profit: "+2,150 ETB",
  },
  {
    id: 5,
    name: "Emily Davis",
    phone: "+25118****56",
    vip: 2,
    balance: "9,600 ETB",
    profit: "+950 ETB",
  },
  {
    id: 6,
    name: "Frank Moore",
    phone: "+25123****78",
    vip: 6,
    balance: "79,450 ETB",
    profit: "+6,320 ETB",
  },
  {
    id: 7,
    name: "Grace Wilson",
    phone: "+25111****67",
    vip: 3,
    balance: "13,452 ETB",
    profit: "+1,120 ETB",
  },
  {
    id: 8,
    name: "Henry Anderson",
    phone: "+25133****90",
    vip: 4,
    balance: "31,000 ETB",
    profit: "+2,850 ETB",
  },
  {
    id: 9,
    name: "Isabella Taylor",
    phone: "+25105****21",
    vip: 5,
    balance: "51,482 ETB",
    profit: "+4,210 ETB",
  },
  {
    id: 10,
    name: "Jack Thomas",
    phone: "+25122****43",
    vip: 1,
    balance: "5,300 ETB",
    profit: "+420 ETB",
  },
];

export default function MemberList() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  useEffect(() => {
    const pickRandomMembers = () => {
      const shuffled = [...sampleMembers].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    };

    setMembers(pickRandomMembers());

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setMembers(pickRandomMembers());
        setIsAnimating(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const vipColors = [
    "from-amber-400 to-orange-400",
    "from-amber-400 to-orange-400",
    "from-amber-400 to-orange-400",
    "from-amber-400 to-orange-400",
    "from-amber-400 to-orange-400",
    "from-amber-400 to-orange-400",
    "from-amber-400 to-orange-400",
  ];

  const getVipGradient = (vip: number) => {
    return vipColors[Math.min(vip, vipColors.length - 1)];
  };

  const getVipIcon = (vip: number) => {
    if (vip >= 6) return <Crown className="w-2.5 h-2.5 text-white" />;
    if (vip >= 4) return <Medal className="w-2.5 h-2.5 text-white" />;
    return <Zap className="w-2.5 h-2.5 text-white" />;
  };

  const totalActiveBalance = members.reduce((sum, member) => {
    const balanceNum = parseInt(member.balance.replace(/[^0-9]/g, ""));
    return sum + balanceNum;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 p-3 sm:p-4 md:p-5 relative overflow-hidden"
    >
      {/* Decorative Header Pattern */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-amber-400/5 to-transparent"></div>

      {/* Animated Background Particles - Hidden on mobile */}
      <div className="hidden sm:block absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-300/20 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
            }}
            animate={{
              y: [null, -20, 20, -20],
              x: [null, 20, -20, 20],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Header with Stats - Mobile Optimized */}
      <div className="relative mb-3 sm:mb-4 md:mb-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full border-2 border-white"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-serif text-amber-800 truncate">
                Community Hub
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] sm:text-xs text-amber-500 whitespace-nowrap">
                    {members.length} active
                  </p>
                </div>
                <div className="w-px h-2 bg-amber-200"></div>
                <p className="text-[10px] sm:text-xs text-amber-500 truncate">
                  {totalActiveBalance.toLocaleString()} ETB
                </p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg sm:rounded-xl shadow-md transition-all flex-shrink-0"
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setMembers(
                  sampleMembers.sort(() => 0.5 - Math.random()).slice(0, 3),
                );
                setIsAnimating(false);
              }, 500);
            }}
          >
            <ArrowPathIcon
              className={`w-3 h-3 sm:w-4 sm:h-4 text-white ${isAnimating ? "animate-spin" : ""}`}
            />
            <span className="text-[10px] sm:text-xs font-medium hidden xs:inline">
              Refresh
            </span>
          </motion.button>
        </div>

        {/* Stats Pills - Horizontal scroll on mobile */}
        <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3 overflow-x-auto pb-1 scrollbar-hide">
          <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-amber-100 rounded-full border border-amber-200 whitespace-nowrap">
            <span className="text-[9px] sm:text-xs text-amber-700">
              🏆 Top VIP: {Math.max(...members.map((m) => m.vip))}
            </span>
          </div>
          <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-amber-100 rounded-full border border-amber-200 whitespace-nowrap">
            <span className="text-[9px] sm:text-xs text-amber-700">
              💎 Avg: {(totalActiveBalance / members.length).toFixed(0)} ETB
            </span>
          </div>
        </div>
      </div>

      {/* Members List - Mobile Optimized */}
      <div className="space-y-2 sm:space-y-2.5">
        <AnimatePresence mode="wait">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: index * 0.05 }}
              onHoverStart={() => setHoveredMember(member.id)}
              onHoverEnd={() => setHoveredMember(null)}
              className={`relative bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-lg sm:rounded-xl border transition-all duration-300 overflow-hidden ${
                hoveredMember === member.id
                  ? "border-amber-300 shadow-md scale-[1.01]"
                  : "border-amber-200"
              } ${isAnimating ? "opacity-50 scale-95" : "opacity-100 scale-100"}`}
            >
              {/* Background Glow on Hover */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredMember === member.id ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-orange-400/5"
              />

              {/* Rank Badge - Smaller on mobile */}
              <div className="absolute top-2 right-2">
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white/80 rounded-full border border-amber-200 shadow-sm">
                  <span className="text-[8px] sm:text-xs font-bold text-amber-700">
                    #{index + 1}
                  </span>
                  <Zap className="w-2 h-2 sm:w-3 sm:h-3 text-amber-500" />
                </div>
              </div>

              {/* Progress Bar on Hover */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: hoveredMember === member.id ? "100%" : 0 }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"
              />

              <div className="p-2.5 sm:p-3">
                <div className="flex items-center justify-between gap-2">
                  {/* Left Section - User Info */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    {/* Avatar - Smaller on mobile */}
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md">
                        <UserCircleIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>

                      {/* Online Indicator */}
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-white"
                      />

                      {/* VIP Level Badge - Smaller on mobile */}
                      <div className="absolute -top-1.5 -left-1.5">
                        <div
                          className={`px-1 sm:px-1.5 py-0.5 rounded-full bg-gradient-to-r ${getVipGradient(member.vip)} flex items-center gap-0.5 shadow-sm`}
                        >
                          {getVipIcon(member.vip)}
                          <span className="text-[6px] sm:text-[8px] font-bold text-white">
                            {member.vip}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* User Details - Truncated text */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1 sm:gap-2 mb-0.5">
                        {/* <p className="font-bold text-amber-900 text-xs sm:text-sm truncate">
                          {member.name.split(" ")[0]}
                        </p> */}
                        <div className="px-1 sm:px-1.5 py-0.5 bg-amber-100 rounded-full border border-amber-200 hidden xs:block">
                          <span className="text-[6px] sm:text-[8px] text-amber-600">
                            Pro
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <PhoneIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                          <span className="text-[8px] sm:text-xs text-amber-600 font-medium">
                            {member.phone}
                          </span>
                        </div>

                        {member.profit && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center gap-0.5 px-1 py-0.5 bg-emerald-50 rounded-full border border-emerald-200"
                          >
                            <TrendingUp className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-emerald-500" />
                            <span className="text-[6px] sm:text-[8px] font-semibold text-emerald-600">
                              {member.profit}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Balance - Compact */}
                  <div className="text-right flex-shrink-0">
                    <motion.div
                      key={member.balance}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-0.5 sm:gap-1 mb-0.5"
                    >
                      <CurrencyDollarIconSolid className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-500" />
                      <p className="text-xs sm:text-sm font-bold text-amber-900 whitespace-nowrap">
                        {member.balance}
                      </p>
                    </motion.div>

                    {/* Mini Chart Bars - Hidden on very small screens */}
                    <div className="hidden xs:flex items-center justify-end gap-0.5">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{
                            height:
                              hoveredMember === member.id
                                ? [4, 8, 4][i]
                                : [3, 6, 3][i],
                          }}
                          className="w-0.5 sm:w-1 bg-gradient-to-t from-amber-400 to-orange-400 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Info on Hover - Mobile optimized */}
                <AnimatePresence>
                  {hoveredMember === member.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 pt-2 border-t border-amber-200 grid grid-cols-2 gap-1"
                    >
                      <div className="bg-amber-100/50 rounded p-1.5">
                        <p className="text-[8px] text-amber-500">Win Rate</p>
                        <p className="text-xs font-bold text-amber-800">78%</p>
                      </div>
                      <div className="bg-amber-100/50 rounded p-1.5">
                        <p className="text-[8px] text-amber-500">Trades</p>
                        <p className="text-xs font-bold text-amber-800">142</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer with Live Activity - Mobile optimized */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-amber-200">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span className="text-[8px] sm:text-xs text-amber-600 hidden xs:inline">
                Live Feed
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-1 bg-amber-400 rounded-full animate-ping"></div>
              <div className="w-1 h-1 bg-amber-400 rounded-full animate-ping delay-100"></div>
              <div className="w-1 h-1 bg-amber-400 rounded-full animate-ping delay-200"></div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
            <span className="text-[8px] sm:text-xs text-amber-500">
              Auto 4s
            </span>
          </div>
        </div>

        {/* Recent Activity Ticker - Compact */}
        <motion.div
          animate={{ x: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-2 text-[8px] sm:text-xs text-amber-400 bg-amber-50 rounded-lg p-1.5 text-center truncate"
        >
          🔥 {members[0]?.phone.split(" ")[0]} traded •{" "}
          {members[1]?.phone.split(" ")[0]} VIP {members[1]?.vip}
        </motion.div>
      </div>

      {/* Hide scrollbar utility */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:block {
            display: block;
          }
          .xs\\:flex {
            display: flex;
          }
          .xs\\:hidden {
            display: none;
          }
        }
      `}</style>
    </motion.div>
  );
}
