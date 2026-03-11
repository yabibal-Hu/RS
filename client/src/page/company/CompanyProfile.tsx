import {
  Users,
  Award,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Package,
  Globe2,
  Crown,
  Sparkles,
  Target,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import MemberList from "@/components/MemberList";

export default function CompanyProfile() {
  const features = [
    {
      icon: Package,
      title: "Product Solutions",
      description:
        "750,000+ industrial and electronic products from 2,500+ leading suppliers",
      color: "from-amber-400 to-orange-400",
      iconColor: "text-white",
    },
    {
      icon: Award,
      title: "Industry Leadership",
      description: "85+ years of innovation in industrial distribution",
      color: "from-amber-400 to-orange-400",
      iconColor: "text-white",
      bonuses: [
        { target: "RS PRO", reward: "Own Brand Portfolio" },
        { target: "DesignSpark", reward: "Engineering Community" },
        { target: "OKdo", reward: "SBC & IoT Solutions" },
      ],
    },
    {
      icon: Wrench,
      title: "Service Solutions",
      description:
        "End-to-end supply chain, inventory management, and digital procurement",
      color: "from-amber-400 to-orange-400",
      iconColor: "text-white",
    },
    {
      icon: Shield,
      title: "Sustainability Focus",
      description: "Committed to net-zero emissions and sustainable sourcing",
      color: "from-amber-400 to-orange-400",
      iconColor: "text-white",
    },
  ];

  const stats = [
    { value: "85+", label: "Years", icon: Clock },
    { value: "750K+", label: "Products", icon: Package },
    { value: "30+", label: "Countries", icon: Globe2 },
    { value: "8.5K", label: "Employees", icon: Users },
  ];

  const benefits = [
    "Global multi-channel distributor",
    "830,000+ products in stock",
    "Next-day delivery to 32 countries",
    "2,500+ trusted supplier partners",
    "RS PRO quality-assured own brand",
    "Digital procurement solutions",
  ];

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-lg shadow-amber-200 flex items-center justify-center animate-float">
              <ShoppingCart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-serif text-amber-800 mb-2">
            RS Group plc
          </h1>
          <p className="text-amber-500 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            For the makers and builders
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Company Info (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 overflow-hidden"
            >
              <div className="relative h-64">
                <img
                  className="w-full h-full object-cover"
                  src="/images/system/company.jpeg"
                  alt="RS Group Distribution Center"
                />
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/50 to-orange-900/50 "></div>

                {/* <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 to-transparent"></div> */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl font-serif text-white mb-2">
                    Global Industrial Distributor
                  </h2>
                  <p className="text-white/90 text-sm max-w-2xl">
                    RS Group provides product and service solutions that help
                    customers with their industrial operations, from design and
                    maintenance to production and supply chain.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="group bg-white/90 backdrop-blur-sm rounded-xl p-5 border border-amber-200 hover:border-amber-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-serif text-amber-800 text-lg mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-amber-600 text-sm leading-relaxed">
                          {feature.description}
                        </p>

                        {/* Iconic Products for Awards feature */}
                        {feature.bonuses && (
                          <div className="mt-3 space-y-2">
                            {feature.bonuses.map((bonus, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs bg-amber-50/50 p-2 rounded-lg border border-amber-200"
                              >
                                <span className="text-amber-600">
                                  {bonus.target}:
                                </span>
                                <span className="font-bold text-amber-800">
                                  {bonus.reward}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-amber-200"
            >
              <h3 className="text-lg font-serif text-amber-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                Corporate Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className="bg-amber-50/50 rounded-lg p-4 border border-amber-200 text-center group hover:border-amber-300 transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400/10 to-orange-400/10 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="text-xl font-bold text-amber-800 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs text-amber-500">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-6 border border-amber-300"
            >
              <h4 className="font-serif text-amber-800 text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Why Partner with RS Group?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-amber-700 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side - MemberList */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-4">
              <MemberList />
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          {/* <button className="group relative bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            <div className="relative z-10 flex items-center justify-center gap-3">
              <Briefcase className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Explore Solutions</span>
            </div>
          </button> */}

          <p className="text-amber-500 text-sm mt-4 flex items-center justify-center gap-2">
            <Crown className="w-4 h-4" />
            Serving over 1 million customers worldwide since 1937
          </p>
        </motion.div>

        {/* Footer */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 pt-4 border-t border-amber-200"
        >
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-amber-600">Business Status:</span>
              <span className="text-amber-800 font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                LSE: RS1 • Active
              </span>
            </div>
            <span className="text-amber-400">© 2025 RS Group plc</span>
          </div>
        </motion.div> */}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
