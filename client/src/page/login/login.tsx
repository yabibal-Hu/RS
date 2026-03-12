import { useState } from "react";
import ErrorPopup from "@/components/ErrorPopup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { useSearchParams } from "react-router-dom";
import { AuthService } from "@/services/authService";
import { decodeToken } from "@/lib/jwt";
import { BeatLoader } from "react-spinners";
import {
  Eye,
  EyeOff,
  Lock,
  Phone,
  UserPlus,
  LogIn,
  Shield,
  Users,
  Key,
  ChevronDown,
  Crown,
  // Sparkles,
  User,
  CheckCircle,
  Award,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "@/utils/toast";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCountryCode, setShowCountryCode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: "+251",
    name: "Ethiopia",
    flag: "🇪🇹",
  });

  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const inviteFromUrl = searchParams[0]?.get("ref");
  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    inviteCode: inviteFromUrl || "",
  });

  // Country code options
  const countryCodes = [
    { code: "+1", name: "USA", flag: "🇺🇸" },
    { code: "+44", name: "UK", flag: "🇬🇧" },
    { code: "+91", name: "India", flag: "🇮🇳" },
    { code: "+86", name: "China", flag: "🇨🇳" },
    { code: "+251", name: "Ethiopia", flag: "🇪🇹" },
    { code: "+254", name: "Kenya", flag: "🇰🇪" },
    { code: "+255", name: "Tanzania", flag: "🇹🇿" },
    { code: "+256", name: "Uganda", flag: "🇺🇬" },
    { code: "+234", name: "Nigeria", flag: "🇳🇬" },
    { code: "+27", name: "South Africa", flag: "🇿🇦" },
    { code: "+20", name: "Egypt", flag: "🇪🇬" },
    { code: "+212", name: "Morocco", flag: "🇲🇦" },
  ];

  // Handle Register
  const handleRegister = async () => {
    setLoading(true);

    if (!registerData.name || registerData.name.trim().length < 2) {
      setError("Please enter user Name");
      setLoading(false);
      return;
    }

    const phoneWithoutCode = registerData.phone
      .replace(selectedCountry.code, "")
      .trim();
    if (phoneWithoutCode.length < 9 || phoneWithoutCode.length > 14) {
      setError("Invalid phone number");
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters!");
      setLoading(false);
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const fullPhone = selectedCountry.code + phoneWithoutCode;
      const res = await AuthService.register(
        fullPhone,
        registerData.password,
        registerData.inviteCode,
        registerData.name,
      );
      if (res.success) {
        showToast.success("Account created successfully!");
        setIsLogin(true);
        setLoading(false);
      } else {
        setLoading(false);
        setError(res.error || "Unable to create account. Try again.");
      }
    } catch (err: any) {
      setLoading(false);
      showToast.error(err.message);
      console.error(err);
    }
  };

  // Handle Login
  const handleLogin = async () => {
    setLoading(true);
    // remove userName from localstorage
    localStorage.removeItem("userName");
    localStorage.removeItem("vipLevel");
    const phoneWithoutCode = loginData.phone
      .replace(selectedCountry.code, "")
      .trim();

    if (phoneWithoutCode.length < 9 || phoneWithoutCode.length > 14) {
      setError("Invalid phone number");
      setLoading(false);
      return;
    }

    try {
      const fullPhone = selectedCountry.code + phoneWithoutCode;
      const result = await AuthService.login(fullPhone, loginData.password);

      if (result.success) {
        authClient.setToken(result.token);
        showToast.success("Login successful!");

        const decodedToken = decodeToken(result.token);
        const userRole = decodedToken?.role;
        if (
          userRole === "ADMIN" ||
          userRole === "SUPER_ADMIN" ||
          userRole === "WITHDRAW"
        ) {
          window.location.href = "/admin/orders";
          navigate("/admin/orders");
        } else if (userRole === "USER") {
          navigate("/");
        } else {
          window.location.href = "/login";
        }
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      showToast.error(err.message);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl"
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -50, 50, -50],
              x: [null, 50, -50, 50],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block space-y-8"
          >
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 border-2 border-amber-400/30 rounded-full"
                />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-2xl relative z-10">
                  <Crown className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-serif text-amber-800">LUXURY</h1>
                <p className="text-amber-500">Premium Investment Platform</p>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-amber-800 mb-2">
                      Daily Earnings
                    </h3>
                    <p className="text-amber-600 text-sm">
                      Complete tasks and earn daily rewards with our innovative
                      platform
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-amber-800 mb-2">
                      VIP Benefits
                    </h3>
                    <p className="text-amber-600 text-sm">
                      Unlock exclusive perks and higher returns as you level up
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-amber-800 mb-2">
                      Referral Program
                    </h3>
                    <p className="text-amber-600 text-sm">
                      Earn lifetime commissions on your referrals' activities
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-800">10K+</p>
                <p className="text-xs text-amber-500">Active Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-800">$2M+</p>
                <p className="text-xs text-amber-500">Total Earned</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-800">24/7</p>
                <p className="text-xs text-amber-500">Support</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Auth Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <Card className="bg-white/95 backdrop-blur-lg border-2 border-amber-200 rounded-3xl overflow-hidden">
              {/* Decorative Header */}
              <div className="relative h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400">
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />
              </div>

              <CardContent className="p-8">
                {/* Toggle Buttons */}
                <div className="flex gap-2 mb-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isLogin
                        ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg"
                        : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <LogIn className="w-4 h-4" />
                      <span>Login</span>
                    </div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 ${
                      !isLogin
                        ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg"
                        : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Register</span>
                    </div>
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  {/* Login Form */}
                  {isLogin && (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-serif text-amber-800 mb-2">
                          Welcome Back
                        </h2>
                        <p className="text-amber-500 text-sm">
                          Sign in to continue your journey
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Phone Input */}
                        <div className="space-y-2">
                          <Label className="text-amber-700 font-medium flex items-center gap-2">
                            <Phone className="w-4 h-4 text-amber-500" />
                            Phone Number
                          </Label>
                          <div className="flex gap-2">
                            {/* Country Code */}
                            <div className="relative w-24">
                              <button
                                type="button"
                                onClick={() =>
                                  setShowCountryCode(!showCountryCode)
                                }
                                className="w-full flex items-center justify-between bg-white border-2 border-amber-200 rounded-xl px-3 py-2.5 text-amber-700 hover:border-amber-400 transition-colors"
                              >
                                <div className="flex items-center gap-1">
                                  <span className="text-lg">
                                    {selectedCountry.flag}
                                  </span>
                                  <span className="font-medium">
                                    {selectedCountry.code}
                                  </span>
                                </div>
                                <ChevronDown
                                  className={`w-4 h-4 text-amber-400 transition-transform ${
                                    showCountryCode ? "rotate-180" : ""
                                  }`}
                                />
                              </button>

                              {/* Country Dropdown */}
                              <AnimatePresence>
                                {showCountryCode && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-40"
                                      onClick={() => setShowCountryCode(false)}
                                    />
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="absolute top-full left-0 mt-1 w-48 bg-white border-2 border-amber-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto"
                                    >
                                      {countryCodes.map((country) => (
                                        <button
                                          key={country.code}
                                          type="button"
                                          onClick={() => {
                                            setSelectedCountry(country);
                                            setShowCountryCode(false);
                                          }}
                                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-amber-50 transition-colors"
                                        >
                                          <span className="text-xl">
                                            {country.flag}
                                          </span>
                                          <div className="flex-1 text-left">
                                            <div className="text-sm font-medium text-amber-800">
                                              {country.name}
                                            </div>
                                            <div className="text-xs text-amber-500">
                                              {country.code}
                                            </div>
                                          </div>
                                          {selectedCountry.code ===
                                            country.code && (
                                            <CheckCircle className="w-4 h-4 text-amber-500" />
                                          )}
                                        </button>
                                      ))}
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Phone Number */}
                            <Input
                              type="tel"
                              placeholder="Enter phone number"
                              value={loginData.phone}
                              onChange={(e) =>
                                setLoginData((prev) => ({
                                  ...prev,
                                  phone: e.target.value.replace(/\D/g, ""),
                                }))
                              }
                              className="flex-1 border-2 border-amber-200 bg-white text-amber-800 placeholder:text-amber-400 rounded-xl focus:border-amber-400 focus:ring-amber-400"
                            />
                          </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                          <Label className="text-amber-700 font-medium flex items-center gap-2">
                            <Lock className="w-4 h-4 text-amber-500" />
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={loginData.password}
                              onChange={(e) =>
                                setLoginData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className="w-full border-2 border-amber-200 bg-white text-amber-800 placeholder:text-amber-400 rounded-xl pr-12 focus:border-amber-400 focus:ring-amber-400"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-600"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Login Button */}
                      <Button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        {loading ? (
                          <div className="flex items-center justify-center gap-3">
                            <BeatLoader color="white" size={10} />
                            <span>Authenticating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <Shield className="w-5 h-5" />
                            <span> Login</span>
                          </div>
                        )}
                      </Button>

                      {/* Security Badge */}
                      <div className="flex items-center justify-center gap-2 p-4 bg-amber-50 rounded-xl border border-amber-200">
                        <Shield className="w-5 h-5 text-amber-500" />
                        <p className="text-sm text-amber-700">
                          Your information encrypted
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {/* Register Form */}
                  {!isLogin && (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-serif text-amber-800 mb-2">
                          Create Account
                        </h2>
                        <p className="text-amber-500 text-sm">
                          Join our community and start earning
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Full Name */}
                        <div className="space-y-2">
                          <Label className="text-amber-700 font-medium flex items-center gap-2">
                            <User className="w-4 h-4 text-amber-500" />
                            User Name
                          </Label>
                          <Input
                            type="text"
                            placeholder="Enter your User Name"
                            value={registerData.name}
                            onChange={(e) =>
                              setRegisterData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full border-2 border-amber-200 bg-white text-amber-800 placeholder:text-amber-400 rounded-xl focus:border-amber-400 focus:ring-amber-400"
                          />
                        </div>

                        {/* Phone Input */}
                        <div className="space-y-2">
                          <Label className="text-amber-700 font-medium flex items-center gap-2">
                            <Phone className="w-4 h-4 text-amber-500" />
                            Phone Number
                          </Label>
                          <div className="flex gap-2">
                            {/* Country Code */}
                            <div className="relative w-24">
                              <button
                                type="button"
                                onClick={() =>
                                  setShowCountryCode(!showCountryCode)
                                }
                                className="w-full flex items-center justify-between bg-white border-2 border-amber-200 rounded-xl px-3 py-2.5 text-amber-700 hover:border-amber-400 transition-colors"
                              >
                                <div className="flex items-center gap-1">
                                  <span className="text-lg">
                                    {selectedCountry.flag}
                                  </span>
                                  <span className="font-medium">
                                    {selectedCountry.code}
                                  </span>
                                </div>
                                <ChevronDown
                                  className={`w-4 h-4 text-amber-400 transition-transform ${
                                    showCountryCode ? "rotate-180" : ""
                                  }`}
                                />
                              </button>

                              {/* Country Dropdown */}
                              <AnimatePresence>
                                {showCountryCode && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-40"
                                      onClick={() => setShowCountryCode(false)}
                                    />
                                    <motion.div
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      className="absolute top-full left-0 mt-1 w-48 bg-white border-2 border-amber-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto"
                                    >
                                      {countryCodes.map((country) => (
                                        <button
                                          key={country.code}
                                          type="button"
                                          onClick={() => {
                                            setSelectedCountry(country);
                                            setShowCountryCode(false);
                                          }}
                                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-amber-50 transition-colors"
                                        >
                                          <span className="text-xl">
                                            {country.flag}
                                          </span>
                                          <div className="flex-1 text-left">
                                            <div className="text-sm font-medium text-amber-800">
                                              {country.name}
                                            </div>
                                            <div className="text-xs text-amber-500">
                                              {country.code}
                                            </div>
                                          </div>
                                          {selectedCountry.code ===
                                            country.code && (
                                            <CheckCircle className="w-4 h-4 text-amber-500" />
                                          )}
                                        </button>
                                      ))}
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>

                            {/* Phone Number */}
                            <Input
                              type="tel"
                              placeholder="Enter phone number"
                              value={registerData.phone}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  phone: e.target.value.replace(/\D/g, ""),
                                }))
                              }
                              className="flex-1 border-2 border-amber-200 bg-white text-amber-800 placeholder:text-amber-400 rounded-xl focus:border-amber-400 focus:ring-amber-400"
                            />
                          </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                          <Label className="text-amber-700 font-medium flex items-center gap-2">
                            <Key className="w-4 h-4 text-amber-500" />
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a password (min 6 characters)"
                              value={registerData.password}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  password: e.target.value,
                                }))
                              }
                              className="w-full border-2 border-amber-200 bg-white text-amber-800 placeholder:text-amber-400 rounded-xl pr-12 focus:border-amber-400 focus:ring-amber-400"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-600"
                            >
                              {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                          <Label className="text-amber-700 font-medium flex items-center gap-2">
                            <Key className="w-4 h-4 text-amber-500" />
                            Confirm Password
                          </Label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={registerData.confirmPassword}
                              onChange={(e) =>
                                setRegisterData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              className="w-full border-2 border-amber-200 bg-white text-amber-800 placeholder:text-amber-400 rounded-xl pr-12 focus:border-amber-400 focus:ring-amber-400"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-600"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Invitation Code */}
                        <div className="space-y-2">
                          <Label className="text-amber-700 font-medium flex items-center gap-2">
                            <Users className="w-4 h-4 text-amber-500" />
                            Invitation Code
                          </Label>
                          <Input
                            type="text"
                            placeholder="Enter invitation code"
                            value={registerData.inviteCode}
                            disabled={!!inviteFromUrl}
                            onChange={(e) =>
                              setRegisterData((prev) => ({
                                ...prev,
                                inviteCode: e.target.value,
                              }))
                            }
                            className="w-full border-2 border-amber-200 bg-white text-amber-800 placeholder:text-amber-400 rounded-xl focus:border-amber-400 focus:ring-amber-400 disabled:opacity-60"
                          />
                          {inviteFromUrl && (
                            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Code pre-filled from link
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Register Button */}
                      <Button
                        onClick={handleRegister}
                        disabled={loading}
                        className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        {loading ? (
                          <div className="flex items-center justify-center gap-3">
                            <BeatLoader color="white" size={10} />
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <UserPlus className="w-5 h-5" />
                            <span>Create Account</span>
                          </div>
                        )}
                      </Button>

                      {/* Welcome Bonus */}
                      {/* <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 border border-amber-300">
                        <div className="flex items-center gap-3 mb-2">
                          <Sparkles className="w-5 h-5 text-amber-600" />
                          <h4 className="font-serif text-amber-800">
                            Welcome Bonus
                          </h4>
                        </div>
                        <div className="grid grid-cols- gap-2 text-center">
                          <div>
                            <p className="text-lg font-bold text-amber-800">
                              50
                            </p>
                            <p className="text-xs text-amber-600">ETB</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-amber-800">
                              10%
                            </p>
                            <p className="text-xs text-amber-600">Commission</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-amber-800">
                              1
                            </p>
                            <p className="text-xs text-amber-600">Tasks</p>
                          </div>
                        </div>
                      </div> */}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer Links */}
                <div className="mt-6 pt-6 border-t border-amber-200 text-center">
                  <p className="text-xs text-amber-500">
                    By continuing, you agree to our{" "}
                    <a
                      href="#"
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Terms
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Error Popup */}
      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
    </div>
  );
}
