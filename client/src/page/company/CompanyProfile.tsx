import { motion } from "framer-motion";
import MemberList from "@/components/MemberList";
import {
  Sparkles,
  Crown,
  Users,
  Package,
  Globe2,
  // Clock,
  Award,
  Shield,
  // TrendingUp,
  CheckCircle,
  Building2,
  Calendar,
  // MapPin,
  // Phone,
  // Mail,
  // Globe,
  // Briefcase,
  Star,
} from "lucide-react";

export default function CompanyProfile() {
  return (
    <div className="min-h-screen  py-8 px-4 relative">
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
              <Building2 className="w-10 h-10 text-white" />
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
          {/* Left Side - Image and Info Card (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 overflow-hidden"
            >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Full width image (2 columns) */}
          <div className="lg:col-span-2">
            {/* Hero Image - Full width and height */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 overflow-hidden h-full"
            >
              <div className="relative h-[500px] lg:h-[600px]">
                <img
                  className="w-full h-full object-cover"
                  src="/images/system/company.jpeg"
                  alt="RS Group Distribution Center"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/50 to-orange-900/50"></div>
                
                {/* Centered Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-2xl"
                  >
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                      Global Industrial Distributor
                    </h2>
                    <p className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed">
                      RS Group provides product and service solutions that help
                      customers with their industrial operations, from design and
                      maintenance to production and supply chain.
                    </p>
                    
                    {/* Decorative Divider */}
                    <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto my-6 rounded-full"></div>
                    
                    {/* Stats Overlay */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div>
                        <p className="text-2xl font-bold text-white">85+</p>
                        <p className="text-xs text-amber-200">Years</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">750K+</p>
                        <p className="text-xs text-amber-200">Products</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">30+</p>
                        <p className="text-xs text-amber-200">Countries</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-24 h-24">
                  <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full blur-xl"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-24 h-24">
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-orange-400/30 to-amber-400/30 rounded-full blur-xl"></div>
                </div>
              </div>
            </motion.div>
          </div>
          </div>
            </motion.div>

            {/* Single Comprehensive Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6 overflow-hidden relative"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-2xl -z-10"></div>

              {/* Company Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-200">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-amber-800">
                    About RS Group
                  </h3>
                  <p className="text-xs text-amber-500">
                    LSE: RS1 • Industrial Distribution
                  </p>
                </div>
              </div>

              {/* Company Description */}
              <div className="mb-6">
                <p className="text-amber-700 text-sm leading-relaxed">
                  RS Group is a leading global multi-channel distributor of
                  industrial and electronic products, providing solutions that
                  help customers with their operations from design and
                  maintenance to production and supply chain.
                </p>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-amber-50/50 rounded-xl p-3 text-center border border-amber-200">
                  <Calendar className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-amber-800">1937</p>
                  <p className="text-[10px] text-amber-500">Founded</p>
                </div>
                <div className="bg-amber-50/50 rounded-xl p-3 text-center border border-amber-200">
                  <Users className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-amber-800">8.5K+</p>
                  <p className="text-[10px] text-amber-500">Employees</p>
                </div>
                <div className="bg-amber-50/50 rounded-xl p-3 text-center border border-amber-200">
                  <Package className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-amber-800">750K+</p>
                  <p className="text-[10px] text-amber-500">Products</p>
                </div>
                <div className="bg-amber-50/50 rounded-xl p-3 text-center border border-amber-200">
                  <Globe2 className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-amber-800">30+</p>
                  <p className="text-[10px] text-amber-500">Countries</p>
                </div>
              </div>

              {/* Core Strengths */}
              <div className="mb-6">
                <h4 className="text-sm font-serif text-amber-800 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  Core Strengths
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Global Distribution",
                    "2,500+ Suppliers",
                    "RS PRO Own Brand",
                    "Next-Day Delivery",
                    "Digital Solutions",
                    "Technical Support",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-amber-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact & Location */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-amber-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-amber-700">
                    London, UK (HQ)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-500" />
                  <a
                    href="#"
                    className="text-xs text-amber-700 hover:text-amber-900"
                  >
                    www.rsgroup.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-amber-700">
                    FTSE 250 Listed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                  <span className="text-xs text-amber-700">£2.5B+ Revenue</span>
                </div>
              </div> */}

              {/* Trust Badge */}
              <div className="mt-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-3 text-center border border-amber-300">
                <p className="text-xs text-amber-800 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  Trusted by over 1 million customers worldwide
                </p>
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

        {/* Footer Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-amber-500 text-sm flex items-center justify-center gap-2">
            <Crown className="w-4 h-4" />
            Serving makers and builders since 1937
          </p>
        </motion.div>
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
