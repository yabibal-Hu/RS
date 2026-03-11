import { useEffect } from "react";
import {
  Building,
  Users,
  Award,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  X,
  TrendingUp,
  Star,
  Factory,
  Briefcase,
  Package,
  Globe2,
} from "lucide-react";

interface CompanyProfileProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export default function CompanyProfile({ show, setShow }: CompanyProfileProps) {
  // Close modal when clicking overlay or pressing Escape key
  useEffect(() => {
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [show, setShow]);

  if (!show) return null;

  const features = [
    {
      icon: Factory,
      title: "Global Manufacturing",
      description:
        "Operations in 70+ countries with state-of-the-art production facilities",
      color: "from-blue-500 to-cyan-500",
      iconColor: "text-white",
    },
    {
      icon: Award,
      title: "Industry Leadership",
      description: "120+ years of innovation with 60,000+ patented products",
      color: "from-emerald-500 to-green-500",
      iconColor: "text-white",
      bonuses: [
        { target: "Post-it Notes", reward: "Global Office Essential" },
        { target: "Scotch Tape", reward: "Household Standard" },
        { target: "Scotchgard", reward: "Fabric Protection Pioneer" },
      ],
    },
    
    {
      icon: Zap,
      title: "R&D Innovation",
      description:
        "$1.5B+ annual R&D investment driving breakthrough technologies",
      color: "from-amber-500 to-yellow-500",
      iconColor: "text-white",
    },
    {
      icon: Shield,
      title: "Corporate Responsibility",
      description: "Commitment to sustainability and PFAS phase-out by 2025",
      color: "from-purple-500 to-pink-500",
      iconColor: "text-white",
    },
  ];

  const stats = [
    { value: "120+", label: "Years", icon: Clock },
    { value: "60K+", label: "Products", icon: Package },
    { value: "70+", label: "Countries", icon: Globe2 },
    { value: "61K", label: "Employees", icon: Users },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pb-16">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setShow(false)}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl animate-scaleIn">
        {" "}
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"></div>
        {/* Modal Content */}
        <div className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl shadow-2xl border border-slate-700/50 max-h-[85vh] md:max-h-[90vh] overflow-y-auto">
          {" "}
          {/* Header */}
          <div className="relative p-8 bg-gradient-to-r from-blue-900/40 via-cyan-900/30 to-blue-900/40 border-b border-slate-700/50">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-cyan-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-xl">
                    <Building className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      3M Company
                    </h1>
                    <p className="text-cyan-300 text-sm">
                      Science. Applied to Life.™
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShow(false)}
                  className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700/80 flex items-center justify-center transition-all duration-300 border border-slate-700 hover:border-slate-600"
                >
                  <X className="w-5 h-5 text-gray-300" />
                </button>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-3">
                  Innovation for a Better World
                </h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Transforming ideas into reality that advance industries and
                  improve lives. A global leader in materials science with over
                  a century of innovation.
                </p>
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 overflow-y-scroll">
              <div className="group bg-gradient-to-br from-slate-800/50 to-gray-900/50 rounded-xl p-0 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20">
                
                <div>
                  <img
                    className="w-full rounded-xl"
                    src="/images/RF.jpg"
                    alt=""
                  />
                </div>
              </div>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-slate-800/50 to-gray-900/50 rounded-xl p-5 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                      >
                        <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {feature.description}
                        </p>

                        {/* Iconic Products for Awards feature */}
                        {feature.bonuses && (
                          <div className="mt-3 space-y-2">
                            {feature.bonuses.map((bonus, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs"
                              >
                                <span className="text-gray-400">
                                  {bonus.target}:
                                </span>
                                <span className="font-bold text-cyan-300">
                                  {bonus.reward}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats Section */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Corporate Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-slate-800/50 to-gray-900/50 rounded-xl p-4 border border-slate-700/50 text-center group hover:border-blue-500/30 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900/30 to-cyan-900/30 flex items-center justify-center mx-auto mb-3">
                        <Icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-400">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Benefits List */}
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl p-5 border border-blue-500/30 mb-8">
              <h4 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Why Partner with 3M?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Proven track record of innovation",
                  "Global manufacturing & distribution",
                  "Extensive R&D capabilities",
                  "Trusted brand reputation",
                  "Sustainable business practices",
                  "Diverse product portfolio",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <button
                onClick={() => setShow(false)}
                className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="relative z-10 flex items-center justify-center gap-3">
                  <Briefcase className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                  <span className="text-lg">Explore Opportunities</span>
                </div>
              </button>

              <p className="text-gray-400 text-sm mt-4">
                Driving innovation across industries worldwide since 1902
              </p>
            </div>
          </div>
          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-gray-400">Business Status: </span>
                <span className="text-emerald-400 font-medium">
                  NYSE: MMM • Active
                </span>
              </div>
              <span className="text-gray-500">© 2025 3M Company</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
