import { X } from "lucide-react";
import { useState } from "react";

export default function WelcomeCard({vipLevel}: {vipLevel: string}) {
  const [open, setOpen] = useState(true);

  const handleButtonClick = () => {
    setOpen(false);
    localStorage.removeItem("welcomeCardShown");
  }

  
const imageUrl = vipLevel === "0" ? "/images/new user.png" : "/images/active user.png";
  return (
    <div className="relative w-full">
      {open && (
        <div className="fixed inset-0 z-50 ">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"></div>

          {/* Scrollable Container */}
          <div className="min-h-screen flex items-start justify-center p-4 pt-10 pb-20">
            {/* Modal Content */}
            <div className="relative  w-full max-w-md bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl shadow-2xl border border-slate-700/50 animate-scaleIn my-0">
              {/* Header */}

              <button
                onClick={handleButtonClick}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Content - Made scrollable if needed */}
              <div className="max-h-[70vh]  rounded-4xl">
                <img className="w-full rounded-4xl" src={`${imageUrl}`} alt="" />
                {/* Action Buttons */}
                <div className="flex gap-3  rounded-4xl absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full px-6">
                  <button
                    onClick={handleButtonClick}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-600/80 to-amber-600/60  text-white font-semibold  transition-all duration-300"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/50">
                <div className="flex items-center justify-center text-xs text-gray-500">
                  {/* <span>3M Corporate Communications • Updated: April 2024</span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
