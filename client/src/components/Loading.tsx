import { motion } from "framer-motion";

export const Loader = ({
  loading = true,
  size = 100,
  message = "Loading",
  accentColor = "#f59e0b", // Default amber color
}: {
  loading?: boolean;
  size?: number;
  message?: string;
  accentColor?: string;
}) => {
  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center  backdrop-blur-md"
    >
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-amber-200/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl"></div>

      <div className="relative flex flex-col items-center space-y-8">
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
              initial={{
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100,
                opacity: 0,
              }}
              animate={{
                x: [null, Math.random() * 100 - 50, Math.random() * 100 - 50],
                y: [null, Math.random() * 100 - 50, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Main Loader Container */}
        <div className="relative" style={{ width: size, height: size }}>
          {/* Outer Ring with Gradient */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${accentColor}, transparent, ${accentColor}, transparent)`,
              mask: "radial-gradient(transparent 65%, black 66%)",
              WebkitMask: "radial-gradient(transparent 65%, black 66%)",
            }}
          />

          {/* Second Ring - Opposite Direction */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, transparent, ${accentColor}80, transparent, ${accentColor}80, transparent)`,
              mask: "radial-gradient(transparent 70%, black 71%)",
              WebkitMask: "radial-gradient(transparent 70%, black 71%)",
            }}
          />

          {/* Inner Circle with Logo */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-4 flex items-center justify-center bg-amber-500/50 rounded-full shadow-xl border-2 border-amber-200"
          >
            <img
              src="/images/system/Logo.webp"
              alt="Loading"
              className="w-3/4 h-3/4 object-contain"
            />
          </motion.div>

          {/* Pulsing Dots Around */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transform: `rotate(${i * 60}deg) translateY(-${size / 2}px)`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Message with Luxury Typography */}
        <div className="text-center space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-2xl text-amber-800 font-light tracking-wide"
          >
            {message}
          </motion.p>

          {/* Animated Progress Dots */}
          <div className="flex justify-center space-x-3">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
              />
            ))}
          </div>

          {/* Elegant Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-amber-400 font-light italic"
          >
            Please wait while we prepare your experience
          </motion.p>
        </div>

        {/* Bottom Decorative Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 rounded-full"
        />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
};
