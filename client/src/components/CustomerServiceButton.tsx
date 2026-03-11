import {
  X,
  HeadphonesIcon,
  Sparkles,
  Crown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomerServiceButton() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // Set default position at bottom-right
  useEffect(() => {
    setPosition({
      x: window.innerWidth - 90,
      y: window.innerHeight - 150,
    });
  }, []);

  // Handle both mouse and touch drag
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;

      const clientX =
        e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const clientY =
        e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

      setPosition({
        x: clientX - offset.current.x,
        y: clientY - offset.current.y,
      });
    };

    const handleUp = () => {
      if (dragging.current) {
        dragging.current = false;

        // Snap to nearest side
        const middle = window.innerWidth / 2;
        setPosition((prev) => ({
          x: prev.x < middle ? 20 : window.innerWidth - 90,
          y: Math.min(Math.max(prev.y, 20), window.innerHeight - 150),
        }));
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove);
    window.addEventListener("touchend", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, []);

  const startDrag = (x: number, y: number) => {
    if (buttonRef.current) {
      dragging.current = true;
      offset.current = {
        x: x - buttonRef.current.getBoundingClientRect().left,
        y: y - buttonRef.current.getBoundingClientRect().top,
      };
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startDrag(e.touches[0].clientX, e.touches[0].clientY);
  };

  // one up two for auto generate when call the function
  const generatenum = () => {
    // Example: return a random number between 1 and 10
    return Math.floor(Math.random() * 4) + 1;
  };

  const supportOptions = [
    {
      name: "Telegram Bot",
      icon: "/images/telegram.png",
      href: "https://t.me/Ethio3MSupport_bot",
      description: "24/7 Automated Support",
      gradient: "from-amber-400 to-orange-400",
    },
    // {
    //   name: "Paul Davis",
    //   icon: "/images/paul.jpg",
    //   href: "https://t.me/etho3m",
    //   description: "Live Agent Support",
    //   gradient: "from-amber-400 to-orange-400",
    //   isRound: true,
    // },
    {
      name: "Telegram Channel",
      icon: "/images/telegram.png",
      href: "https://t.me/ethio3M",
      description: "Updates & Announcements",
      gradient: "from-amber-400 to-orange-400",
    },
  ];

  return (
    <>
      {/* Floating Draggable Button */}
      <motion.div
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          left: position.x,
          top: position.y,
        }}
        className="fixed z-[9999] cursor-grab active:cursor-grabbing select-none"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        drag={false}
        dragMomentum={false}
      >
        {/* Pulse Effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur-lg"
        />

        {/* Main Button */}
        <button
          onClick={() => setOpen(true)}
          className="relative bg-gradient-to-r from-amber-400 to-orange-400 text-white w-14 h-14 flex flex-col items-center justify-center rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/20"
        >
          <HeadphonesIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[8px] font-medium uppercase tracking-wider">
            Support
          </span>

          {/* Notification Dot */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"
          />
        </button>

        {/* Drag Handle Indicator */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-amber-200 shadow-lg whitespace-nowrap"
            >
              <span className="text-[10px] text-amber-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Drag to move
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[10000] flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-gray-800/70 backdrop-blur-md rounded-t-3xl shadow-2xl p-6 w-full border-t border-amber-200"
            >
              {/* Top Handle */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-amber-200 rounded-full"></div>

              {/* Header */}
              <div className="flex items-center justify-between mb-6 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg">
                    <HeadphonesIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-amber-800">
                      Customer Support
                    </h2>
                    <p className="text-xs text-amber-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      We're here to help 24/7
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 flex items-center justify-center border border-amber-200 transition-colors"
                >
                  <X className="w-5 h-5 text-amber-600" />
                </motion.button>
              </div>

              {/* Support Options Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {supportOptions.map((option, index) => (
                  <motion.a
                    key={index}
                    // href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group relative"
                  >
                    <div className="bg-gradient-to-b from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 hover:border-amber-300 transition-all duration-300 text-center">
                      {/* Icon Container */}
                      <div className="relative mb-3">
                        <div
                          className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${option.gradient} p-0.5 shadow-lg group-hover:shadow-xl transition-all`}
                        >
                          <div className="w-full h-full rounded-full bg-amber-700/60 flex items-center justify-center overflow-hidden">
                            <img
                              src={option.icon}
                              alt={option.name}
                              className="w-full h-full object-cover p-3"
                              // className={`w-full h-full object-cover ${option.isRound ? "rounded-full" : "p-3"}`}
                            />
                          </div>
                        </div>

                        {/* Online Indicator */}
                        <div className="absolute bottom-1 right-1/2 transform translate-x-6 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                      </div>

                      <h3 className="font-medium text-amber-800 text-sm mb-1">
                        {option.name}
                      </h3>
                      <p className="text-[10px] text-amber-500">
                        {option.description}
                      </p>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Quick Actions */}
              {/* <div className="grid grid-cols-2 gap-3">
                <motion.a
                  href="mailto:support@example.com"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors group"
                >
                  <Send className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
                  <span className="text-sm font-medium text-amber-700">
                    Email Support
                  </span>
                </motion.a>

                <motion.a
                  href="tel:+1234567890"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 rounded-xl border border-amber-200 transition-colors group"
                >
                  <HeadphonesIcon className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">
                    Call Now
                  </span>
                </motion.a>
              </div> */}

              {/* Live Chat Status */}
              <div className="mt-4 pt-4 border-t border-amber-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-200"></div>
                    </div>
                    <span className="text-xs text-amber-600">
                      {generatenum()} agents online
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-amber-500">
                      Premium Support
                    </span>
                  </div>
                </div>

                {/* Response Time */}
                <div className="mt-3 bg-amber-50/50 rounded-lg p-2 text-center border border-amber-200">
                  <p className="text-xs text-amber-600">
                    ⚡ Average response time:{" "}
                    <span className="font-bold text-amber-800">
                      &lt; 5 minutes
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
