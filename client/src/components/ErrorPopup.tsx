import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ErrorPopupProps {
  message: string;
  onClose: () => void;
}

export default function ErrorPopup({ message, onClose }: ErrorPopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/95 backdrop-blur-md border-2 border-rose-200 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Top Gradient Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-rose-400 to-rose-500" />

          <div className="px-6 py-4 flex items-center gap-4">
            {/* Icon Container */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex-shrink-0"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            {/* Content */}
            <div className="flex-1">
              <p className="text-rose-800 font-serif text-sm font-medium">
                {message}
              </p>
              {/* <p className="text-rose-400 text-[10px] mt-0.5">
                Auto-closing in 2 seconds...
              </p> */}
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors border border-rose-200"
            >
              <X className="w-4 h-4 text-rose-500" />
            </motion.button>
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 2, ease: "linear" }}
            className="h-0.5 bg-gradient-to-r from-rose-400 to-rose-500"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
