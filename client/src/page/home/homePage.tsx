import { CardContent } from "@/components/ui/card";
import LandingCarousel from "@/components/LandingCarousel";
import BalanceCard from "@/components/BalanceCard";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "@/components/Loading";
import { UserService } from "@/services/userService";
import CompanyProfile from "@/components/CompanyProfile";
import { motion } from "framer-motion";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { showToast } from "@/utils/toast";
import LevelCard from "@/components/levelCard";

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [referralIncome, setReferralIncome] = useState(0);
  const [vipLevel, setVipLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const navigate = useNavigate();
  // const [showWelcomeCard, setShowWelcomeCard] = useState(false);

  // useEffect(() => {
  //   const welcomeCardShown = localStorage.getItem("welcomeCardShown");
  //   if (welcomeCardShown === "true") {
  //     setShowWelcomeCard(true);
  //   }
  // }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await UserService.info();
        setLoading(false);
        if (response.success) {
          setBalance(response?.user.profile.currentBalance);
          setReferralIncome(response?.user.profile.referralIncome);
          if (response?.user.profile.vip === null) {
            setVipLevel("0");
          } else {
            setVipLevel(response?.user.profile.vip.name);     
              localStorage.setItem("vipLevel", response?.user.profile.vip.name); 
          }
          setLoading(false);
          localStorage.setItem("userName", response?.user.name);
        } else {
          setLoading(false);
          showToast.error("Failed to fetch user data.");
        }
      } catch (error) {
        setLoading(false);
        showToast.error(
          error instanceof Error ? error.message : "An error occurred.",
        );
        if (
          error instanceof Error &&
          (error.message.includes("401") || error.message.includes("403"))
        ) {
          navigate("/login");
        }
      }
    };
    fetchUserData();
  }, []);

  const quickActions = [
    {
      name: "Deposit",
      path: "/deposit",
      icon: ArrowDownTrayIcon,
      gradient: "from-amber-400 to-orange-400",
      bgGradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      iconColor: "text-white",
    },
    {
      name: "Withdraw",
      path: "/withdraw",
      icon: ArrowUpTrayIcon,
      gradient: "from-amber-400 to-orange-400",
      bgGradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      iconColor: "text-white",
    },
    {
      name: "Company",
      path: "/#",
      icon: BuildingOfficeIcon,
      gradient: "from-amber-400 to-orange-400",
      bgGradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      iconColor: "text-white",
    },
    // {
    //   name: "Telegram",
    //   href: "https://t.me/ethio3m",
    //   icon: PaperAirplaneIcon,
    //   gradient: "from-amber-400 to-orange-400",
    //   bgGradient: "from-amber-50 to-orange-50",
    //   borderColor: "border-amber-200",
    //   iconColor: "text-white",
    // },
  ];

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader />;
        </div>
      );
    }

  return (
    <div className="min-h-screen  pb-4 px-2 relative">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl -z-10"></div>

      <CompanyProfile
        show={showCompanyProfile}
        setShow={setShowCompanyProfile}
      />

      {/* {showWelcomeCard && <WelcomeCard vipLevel={vipLevel} />} */}

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left"
        >
          <h1 className="text-2xl font-serif text-amber-800">Welcome Back!</h1>
          {/* <p className="text-amber-500 text-sm">Ready to earn today?</p> */}
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <LandingCarousel />
        </motion.div>

        {/* Balance Card */}
        {/* <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BalanceCard
            balance={balance}
            VipLevel={vipLevel || "0"}
            referralIncome={referralIncome || 0}
          />
        </motion.div> */}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CardContent className="p-2">
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Link to={action.path} className="block">
                    <div
                      className={`bg-white/90 backdrop-blur-sm rounded-xl border-2 ${action.borderColor} p-4 text-center shadow-lg hover:shadow-xl transition-all`}
                    >
                      <div
                        className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <action.icon
                          className={`w-6 h-6 ${action.iconColor}`}
                        />
                      </div>
                      <span className="text-xs font-medium text-amber-800">
                        {action.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </motion.div>
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BalanceCard
            balance={balance}
            VipLevel={vipLevel || "0"}
            referralIncome={referralIncome || 0}
          />
        </motion.div>
        <LevelCard />

        {/* Announcement */}
        {/* <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Announcement />
        </motion.div> */}

        {/* Member List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* <MemberList /> */}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-amber-400 pt-2"
        >
          {/* <p>© 2025 Your Platform. All rights reserved.</p> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
