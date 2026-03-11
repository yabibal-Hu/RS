import { useState } from "react";
import { Megaphone, X, Sparkles, Zap, Shield, TrendingUp } from "lucide-react";

export default function Announcement() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // UPDATED: 3M-themed announcement text
  const announcementText =
    "🏭 3M Innovation Update: Celebrating 120+ years of science applied to life. Explore new sustainable solutions! ";

  if (!isVisible) return null;

  return (
    <div className="relative w-full">
      {/* Modern Announcement Bar */}
      <div
        onClick={() => setOpen(true)}
        className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-blue-900/40 border border-blue-500/30 backdrop-blur-sm  cursor-pointer transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-blue-900/30"
      >
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-500/5 to-blue-600/5"></div>

        {/* Content */}
        <div className="relative z-1 max-h-12 my-0 py-0 px-2 flex items-center justify-between">
          <div className="flex items-center  gap-4">
            {/* Icon - Changed from Bell to Megaphone for corporate announcements */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
              <Megaphone className="w-6 h-6 text-white" />
            </div>

            {/* Text Container */}
            <div className="flex-1 overflow-hidden">
              <div className="flex whitespace-nowrap animate-marquee">
                <p className="text-white font-medium mx-8 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  {announcementText}
                </p>
                <p className="text-white font-medium mx-8 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  {announcementText}
                </p>
              </div>
            </div>
          </div>

          {/* View Button */}
          <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 group-hover:from-blue-600/30 group-hover:to-cyan-600/30 transition-all">
            <span className="text-sm font-medium text-blue-300">
              View Details
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 animate-progress"></div>
      </div>

      {/* Modern Modal */}
      {/* Modern Modal */}
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setOpen(false)}
          ></div>

          {/* Scrollable Container */}
          <div className="min-h-screen flex items-start justify-center p-4 pt-10 pb-20">
            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl shadow-2xl border border-slate-700/50 animate-scaleIn my-8">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Megaphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        3M Corporate Announcement
                      </h2>
                      <p className="text-blue-100 text-sm">
                        Science. Applied to Life.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Content - Made scrollable if needed */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                    <span className="text-sm font-semibold text-cyan-300">
                      Innovation & Sustainability Update
                    </span>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    At 3M, we're celebrating over 120 years of transforming
                    ideas into reality that advance industries and improve
                    lives. Our commitment to science applied to life drives our
                    global impact across 70+ countries.
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">
                      <strong>Healthcare Spinoff:</strong> Solventum Corporation
                      now independent
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">
                      <strong>Sustainability:</strong> PFAS production phase-out
                      by 2025
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-300">
                      <strong>Innovation:</strong> 60,000+ products driving
                      global progress
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setIsVisible(false);
                    }}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300"
                  >
                    Got it, thanks!
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-gray-300 font-semibold hover:bg-slate-700 transition-colors border border-slate-700"
                  >
                    Read Later
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/50">
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <span>3M Corporate Communications • Updated: April 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          width: max-content;
          animation: marquee 20s linear infinite;
        }
        
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-progress {
          animation: progress 3s ease-in-out infinite;
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}
