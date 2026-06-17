import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import {
  Shield,
  ChevronDown,
  Sparkles,
  Award,
  LogOut,
  User,
  Key,
  User2Icon,
  Settings2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";

export default function Header() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [homeClickCount, setHomeClickCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [vipLevel, setVipLevel] = useState("0");
  const [userName, setUserName] = useState("");
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const redirectFlag = useRef(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const currentPath = location.pathname;

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHomeClick = () => {
    navigate("/");
    if (clickTimer.current) clearTimeout(clickTimer.current);

    setHomeClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        redirectFlag.current = true;
        return 0;
      } else {
        clickTimer.current = setTimeout(() => {
          setHomeClickCount(0);
        }, 1000);
        return newCount;
      }
    });
  };
  // fetch vip level and username from localStorage on mount
  useEffect(() => {
    const storedVipLevel = localStorage.getItem("vipLevel");
    const storedUserName = localStorage.getItem("userName");
    if (storedVipLevel) setVipLevel(storedVipLevel);
    else setVipLevel("0");
    if (storedUserName) setUserName(storedUserName);
    else setUserName("");
    // Do something with the fetched values, e.g., set them in state
  }, [currentPath, handleHomeClick, showUserMenu]);

  useEffect(() => {
    if (redirectFlag.current) {
      redirectFlag.current = false;
      navigate("/admin");
    }
  }, [homeClickCount, navigate]);

  const menuItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Key, label: "Change Password", href: "/account" },
    { icon: LogOut, label: "Logout", href: "/logout" },
  ];
  console.log("currentPath", currentPath);
  if (currentPath === "/404") {
    return;
  }
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`
        fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 
        ${
          isScrolled
            ? "bg-gray-900/90 backdrop-blur-md border-b border-amber-200 shadow-lg"
            : "bg-gradient-to-b from-white/9 via-amber-50/90 to-transparent"
        }
      `}
    >
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 "></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHomeClick}
            className="flex items-center gap-3 group relative"
          >
            {/* Logo Container */}
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 p-0.5 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                  {/* <Crown className="w-6 h-6 text-amber-500" /> */}
                  <img
                    src="/images/system/Logo2.webp"
                    alt="Profile"
                    className="w-9 h-9 rounded-lg object-cover border-2 border-white"
                  />
                </div>
              </div>

              {/* Animated glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-3 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-3xl blur-xl -z-10"
              />
            </div>

            {/* Brand Text */}
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-serif font-bold text-amber-800 tracking-tight">
                  RS
                </span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>

              {/* <span className="text-xs font-medium text-amber-500 tracking-wide">
                Premium Investment Platform
              </span> */}
            </div>

            {/* Decorative Corner */}
            <div className="absolute -bottom-1 -right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-full h-full border-r-2 border-b-2 border-amber-400 rounded-br-lg"></div>
            </div>
          </motion.button>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Admin Badge */}
            {isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/admin")}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 
                text-white shadow-md hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <Shield className="w-4 h-4 relative z-10" />
                <span className="text-sm font-semibold relative z-10">
                  ADMIN
                </span>
                <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 relative z-10" />
              </motion.button>
            )}

            {/* User Profile Menu */}
            <div className="relative" ref={userMenuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-1.5 rounded-xl 
                hover:from-amber-200 hover:to-orange-200 border border-amber-200 transition-all duration-300 group relative"
              >
                <div className="relative">
                  <div className="w-10 h-10  flex items-center justify-center">
                    <Settings2 />
                  </div>
                  {/* <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div> */}
                </div>

                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-amber-700">
                    Welcome back
                  </p>
                  <p className="text-sm font-bold text-amber-900">{userName}</p>
                </div>

                {currentPath !== "/login" && (
                  <ChevronDown
                    className={`w-4 h-4 text-amber-600 transition-transform duration-300 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                )}
              </motion.button>

              {/* User Dropdown Menu */}
              {currentPath !== "/login" && (
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-amber-200 overflow-hidden z-50"
                    >
                      <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
                        <div className="flex  justify-evenly gap-0 text-sm font-medium text-amber-800 mx-auto">
                          {userName && (
                            <span className="w-4 h-4 text-amber-500">
                              <User2Icon />
                            </span>
                          )}
                          <span> {userName}</span>
                        </div>
                      </div>

                      <div className="p-2">
                        {menuItems.map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <motion.button
                              key={index}
                              whileHover={{ x: 4 }}
                              onClick={() => {
                                setShowUserMenu(false);
                                item.label === "Logout"
                                  ? (authClient.removeToken(),
                                    navigate("/logout"))
                                  : navigate(item.href);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-amber-50 transition-colors group"
                            >
                              <Icon className="w-4 h-4 text-amber-500 group-hover:text-amber-600" />
                              <span className="text-sm text-amber-700 group-hover:text-amber-800">
                                {item.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>

                      <div className="p-2 border-t border-amber-200 bg-amber-50/50">
                        <div className="flex items-center gap-2 px-3 py-1">
                          <Award className="w-4 h-4 text-amber-500" />
                          {vipLevel ? (
                            <span className="text-xs text-amber-600">
                              VIP Level {vipLevel}
                            </span>
                          ) : (
                            <span className="text-xs text-amber-600">
                              Not a VIP
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Line on Scroll */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            exit={{ width: "0%" }}
            className="h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
          />
        )}
      </AnimatePresence>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-amber-400/5 to-orange-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-orange-400/5 to-amber-400/5 rounded-full blur-3xl"></div>
      </div>
    </motion.header>
  );
}
