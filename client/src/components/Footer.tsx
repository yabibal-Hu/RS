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

export default function Footer() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Navigation items
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

  // Don't show on 404 page
  if (currentPath === "/404" || currentPath === "/login") {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 border-t border-amber-200/30 shadow-lg">
      {/* Simple top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>

      <nav className="flex items-center justify-around max-w-md mx-auto px-1 py-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className="relative flex-1 max-w-[64px]"
            >
              <div
                className={`flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10"
                    : ""
                }`}
              >
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute -top-1 w-1 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" />
                )}

                {/* Icon */}
                <div
                  className={isActive ? "text-amber-500" : "text-amber-400/70"}
                >
                  {isActive ? item.activeIcon : item.icon}
                </div>

                {/* Label */}
                <span
                  className={`text-[9px] font-medium ${
                    isActive ? "text-amber-500" : "text-amber-400/60"
                  }`}
                >
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Safe Area Padding for Mobile */}
      <div className="h-[env(safe-area-inset-bottom)] bg-transparent"></div>
    </footer>
  );
}
