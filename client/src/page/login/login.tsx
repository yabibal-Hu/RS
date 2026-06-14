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
  User,
  CheckCircle,
} from "lucide-react";
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
    <div className="min-h-screen  flex items-center justify-center p-3 relative">
      {/* Single static background element */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 -z-10"></div>
      <div className="fixed top-20 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/5 to-orange-400/5 rounded-full blur-3xl -z-10"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Right Side - Auth Card (Full width on mobile) */}
        <div className="w-full">
          <Card className="bg-white/95 border-2 border-amber-200 rounded-2xl overflow-hidden">
            {/* Simple Header Bar */}
            <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>

            <CardContent className="p-5">
              {/* Logo for mobile */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-serif text-amber-800">
                    RS GROUP
                  </h1>
                  <p className="text-[8px] text-amber-500">
                    Premium Investment
                  </p>
                </div>
              </div>

              {/* Toggle Buttons - Simplified */}
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isLogin
                      ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <LogIn className="w-3 h-3" />
                    <span>Login</span>
                  </div>
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    !isLogin
                      ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <UserPlus className="w-3 h-3" />
                    <span>Register</span>
                  </div>
                </button>
              </div>

              {/* Login Form */}
              {isLogin ? (
                <div className="space-y-4">
                  <div className="text-center mb-3">
                    <h2 className="text-base font-serif text-amber-800 mb-0.5">
                      Welcome Back
                    </h2>
                    <p className="text-amber-500 text-[10px]">
                      Sign in to continue your journey
                    </p>
                  </div>

                  <div className="space-y-3 text-amber-800">
                    {/* Phone Input */}
                    <div className="space-y-1">
                      <Label className="text-amber-700 text-[10px] font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3 text-amber-500" />
                        Phone Number
                      </Label>
                      <div className="flex gap-1.5">
                        {/* Country Code */}
                        <div className="relative w-20">
                          <button
                            type="button"
                            onClick={() => setShowCountryCode(!showCountryCode)}
                            className="w-full flex items-center justify-between bg-white border border-amber-200 rounded-lg px-2 py-2 text-amber-700 text-xs"
                          >
                            <div className="flex items-center gap-0.5">
                              <span className="text-sm">
                                {selectedCountry.flag}
                              </span>
                              <span>{selectedCountry.code}</span>
                            </div>
                            <ChevronDown
                              className={`w-3 h-3 text-amber-400 transition-transform ${
                                showCountryCode ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {/* Country Dropdown - Simplified */}
                          {showCountryCode && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowCountryCode(false)}
                              />
                              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-amber-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                                {countryCodes.map((country) => (
                                  <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(country);
                                      setShowCountryCode(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-amber-50 text-xs"
                                  >
                                    <span className="text-base">
                                      {country.flag}
                                    </span>
                                    <div className="flex-1 text-left">
                                      <div className="text-[10px] font-medium text-amber-800">
                                        {country.name}
                                      </div>
                                      <div className="text-[8px] text-amber-500">
                                        {country.code}
                                      </div>
                                    </div>
                                    {selectedCountry.code === country.code && (
                                      <CheckCircle className="w-2.5 h-2.5 text-amber-500" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Phone Number */}
                        <Input
                          type="tel"
                          placeholder="Phone number"
                          value={loginData.phone}
                          onChange={(e) =>
                            setLoginData((prev) => ({
                              ...prev,
                              phone: e.target.value.replace(/\D/g, ""),
                            }))
                          }
                          className="flex-1 h-9 text-xs border border-amber-200 bg-white rounded-lg placeholder:text-amber-400"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="text-gray-700 space-y-1">
                      <Label className="text-amber-700 text-[10px] font-medium flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-500" />
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
                          className="w-full h-9 text-xs border border-amber-200 bg-white rounded-lg pr-8 placeholder:text-amber-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-400"
                        >
                          {showPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Login Button */}
                  <Button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full h-10 text-sm font-medium bg-gradient-to-r from-amber-400 to-orange-400 active:from-amber-500 active:to-orange-500 text-white rounded-lg shadow"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <BeatLoader color="white" size={6} />
                        <span className="text-xs">Authenticating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Login</span>
                      </div>
                    )}
                  </Button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-1 p-2 bg-amber-50 rounded-lg border border-amber-200">
                    <Shield className="w-3 h-3 text-amber-500" />
                    <p className="text-[8px] text-amber-700">
                      Your information is encrypted
                    </p>
                  </div>
                </div>
              ) : (
                /* Register Form */
                <div className="space-y-4 text-amber-800">
                  <div className="text-center mb-2">
                    <h2 className="text-base font-serif text-amber-800 mb-0.5">
                      Create Account
                    </h2>
                    <p className="text-amber-500 text-[10px]">
                      Join our community and start earning
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <Label className="text-amber-700 text-[10px] font-medium flex items-center gap-1">
                        <User className="w-3 h-3 text-amber-500" />
                        User Name
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter your name"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full h-9 text-xs border border-amber-200 bg-white rounded-lg"
                      />
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-1">
                      <Label className="text-amber-700 text-[10px] font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3 text-amber-500" />
                        Phone Number
                      </Label>
                      <div className="flex gap-1.5">
                        {/* Country Code */}
                        <div className="relative w-20">
                          <button
                            type="button"
                            onClick={() => setShowCountryCode(!showCountryCode)}
                            className="w-full flex items-center justify-between bg-white border border-amber-200 rounded-lg px-2 py-2 text-amber-700 text-xs"
                          >
                            <div className="flex items-center gap-0.5">
                              <span className="text-sm">
                                {selectedCountry.flag}
                              </span>
                              <span>{selectedCountry.code}</span>
                            </div>
                            <ChevronDown
                              className={`w-3 h-3 text-amber-400 transition-transform ${
                                showCountryCode ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {/* Country Dropdown - Same as above */}
                          {showCountryCode && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowCountryCode(false)}
                              />
                              <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-amber-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                                {countryCodes.map((country) => (
                                  <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(country);
                                      setShowCountryCode(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-amber-50 text-xs"
                                  >
                                    <span className="text-base">
                                      {country.flag}
                                    </span>
                                    <div className="flex-1 text-left">
                                      <div className="text-[10px] font-medium text-amber-800">
                                        {country.name}
                                      </div>
                                      <div className="text-[8px] text-amber-500">
                                        {country.code}
                                      </div>
                                    </div>
                                    {selectedCountry.code === country.code && (
                                      <CheckCircle className="w-2.5 h-2.5 text-amber-500" />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* Phone Number */}
                        <Input
                          type="tel"
                          placeholder="Phone number"
                          value={registerData.phone}
                          onChange={(e) =>
                            setRegisterData((prev) => ({
                              ...prev,
                              phone: e.target.value.replace(/\D/g, ""),
                            }))
                          }
                          className="flex-1 h-9 text-xs border border-amber-200 bg-white rounded-lg"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <Label className="text-amber-700 text-[10px] font-medium flex items-center gap-1">
                        <Key className="w-3 h-3 text-amber-500" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 6 characters"
                          value={registerData.password}
                          onChange={(e) =>
                            setRegisterData((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          className="w-full h-9 text-xs border border-amber-200 bg-white rounded-lg pr-8"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-400"
                        >
                          {showPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <Label className="text-amber-700 text-[10px] font-medium flex items-center gap-1">
                        <Key className="w-3 h-3 text-amber-500" />
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
                          className="w-full h-9 text-xs border border-amber-200 bg-white rounded-lg pr-8"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-400"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Invitation Code */}
                    <div className="space-y-1">
                      <Label className="text-amber-700 text-[10px] font-medium flex items-center gap-1">
                        <Users className="w-3 h-3 text-amber-500" />
                        Invitation Code
                      </Label>
                      <Input
                        type="text"
                        placeholder="Enter code"
                        value={registerData.inviteCode}
                        disabled={!!inviteFromUrl}
                        onChange={(e) =>
                          setRegisterData((prev) => ({
                            ...prev,
                            inviteCode: e.target.value,
                          }))
                        }
                        className="w-full h-9 text-xs border border-amber-200 bg-white rounded-lg disabled:opacity-60"
                      />
                      {inviteFromUrl && (
                        <p className="text-[8px] text-emerald-600 mt-0.5 flex items-center gap-0.5">
                          <CheckCircle className="w-2 h-2" />
                          Code pre-filled
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Register Button */}
                  <Button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full h-10 text-sm font-medium bg-gradient-to-r from-amber-400 to-orange-400 active:from-amber-500 active:to-orange-500 text-white rounded-lg shadow"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <BeatLoader color="white" size={6} />
                        <span className="text-xs">Creating Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5">
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Create Account</span>
                      </div>
                    )}
                  </Button>
                </div>
              )}

              {/* Footer Links */}
              <div className="mt-4 pt-3 border-t border-amber-200 text-center">
                <p className="text-[8px] text-amber-500">
                  By continuing, you agree to our{" "}
                  <a href="#" className="text-amber-600 font-medium">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-amber-600 font-medium">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Error Popup */}
      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
    </div>
  );
}
