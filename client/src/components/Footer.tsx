import { useLocation, Link } from "react-router-dom";
import {
  HomeIcon,
  GiftIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  UsersIcon as UsersIconSolid,
  GiftIcon as GiftIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  SparklesIcon as SparklesIconSolid,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function Footer() {
  const location = useLocation();

  // Luxury Gold/Black Theme Navigation
  const navigation = [
    {
      name: "Home",
      href: "/",
      icon: <HomeIcon className="w-5 h-5" />,
      activeIcon: <HomeIconSolid className="w-5 h-5" />,
    },
    {
      name: "VIP",
      href: "/product",
      icon: <GiftIcon className="w-5 h-5" />,
      activeIcon: <GiftIconSolid className="w-5 h-5" />,
    },
    {
      name: "Tasks",
      href: "/task",
      icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
      activeIcon: <SparklesIconSolid className="w-5 h-5" />,
    },
    {
      name: "Team",
      href: "/referral",
      icon: <UserGroupIcon className="w-5 h-5" />,
      activeIcon: <UsersIconSolid className="w-5 h-5" />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <UserCircleIcon className="w-5 h-5" />,
      activeIcon: <UserCircleIconSolid className="w-5 h-5" />,
    },
  ];

  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/60 backdrop-blur-md border-t border-amber-200 shadow-lg"
    >
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>

      {/* Decorative Corner Elements */}
      <div className="absolute -top-1 left-4 w-2 h-2 bg-amber-400 rounded-full blur-sm"></div>
      <div className="absolute -top-1 right-4 w-2 h-2 bg-orange-400 rounded-full blur-sm"></div>

      <nav className="flex items-center justify-around max-w-md mx-auto px-2 py-1">
        {navigation.map((item) => {
          const isCurrent = location.pathname === item.href;

          return (
            <Link key={item.name} to={item.href} className="relative group">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-700"
                    : "text-amber-400 hover:text-amber-600 hover:bg-amber-50/50"
                }`}
              >
                {/* Active Indicator Dot */}
                {isCurrent && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-1 w-1 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Icon Container */}
                <div
                  className={`relative transition-all duration-200 ${
                    isCurrent ? "scale-110" : "group-hover:scale-105"
                  }`}
                >
                  {isCurrent ? (
                    <div className="text-amber-600">{item.activeIcon}</div>
                  ) : (
                    <div className="text-amber-400 group-hover:text-amber-600">
                      {item.icon}
                    </div>
                  )}

                  {/* Glow Effect on Active */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 0.3, scale: 1.5 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 bg-amber-400 rounded-full blur-md -z-10"
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    isCurrent
                      ? "text-amber-700"
                      : "text-amber-400 group-hover:text-amber-600"
                  }`}
                >
                  {item.name}
                </span>

                {/* Bottom Border on Hover */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                />
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-amber-900/5 to-transparent pointer-events-none"></div>

      {/* Safe Area Padding for Mobile */}
      <div className="h-[env(safe-area-inset-bottom)] bg-transparent"></div>
    </motion.footer>
  );
}
