import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/services/authService";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Key,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Crown,
} from "lucide-react";
import { showToast } from "@/utils/toast";

export default function Account() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showRequirements, setShowRequirements] = useState(false);
  const navigate = useNavigate();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("rsToken") : null;

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
  }, [token]);

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (newPassword.length < 6) {
      showToast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== passwords.confirm) {

      showToast.error("New passwords don't match");
      return;
    }

    const response = await AuthService.changePassword(
      currentPassword,
      newPassword,
    );

    if (!response.success) {
      showToast.error(response.error || "Failed to change password");
      return;
    }

    showToast.success("Password changed successfully! Please login again.");

    setPasswords({ current: "", new: "", confirm: "" });
    setTimeout(() => navigate("/login"), 2000);
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const pwd = passwords.new;
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 6) strength += 25;
    if (pwd.match(/[A-Z]/)) strength += 25;
    if (pwd.match(/[0-9]/)) strength += 25;
    if (pwd.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthColor =
    strength <= 25
      ? "bg-rose-500"
      : strength <= 50
        ? "bg-orange-500"
        : strength <= 75
          ? "bg-amber-500"
          : "bg-emerald-500";

  return (
    <div className="min-h-screen  py-8 px-4 relative">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-lg shadow-amber-200 flex items-center justify-center animate-float">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-serif text-amber-800 mb-2">
            Account Security
          </h1>
          <p className="text-amber-500">
            Manage your account security settings
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Change Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 overflow-hidden">
              {/* Top Gradient Bar */}
              <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>

              <CardHeader className="relative pb-4">
                <div className="flex items-center gap-2">
                  {/* <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-lg">
                    <Lock className="w-4 h-4 text-white" />
                  </div> */}
                  <div>
                    <CardTitle className="text-xl font-serif text-amber-800">
                      Change Password
                    </CardTitle>
                    <CardDescription className="text-amber-500">
                      Update your account password for enhanced security
                    </CardDescription>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4">
                  <Crown className="w-6 h-6 text-amber-300" />
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-amber-700 text-sm font-medium">
                      Current Password
                    </Label>
                    <span className="text-xs text-amber-400 bg-amber-50 px-2 py-1 rounded-full">
                      Required
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="Enter current password"
                      className="bg-amber-50/50 border-amber-200 text-amber-800 h-12 pl-10 pr-4 rounded-xl placeholder:text-amber-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      value={passwords.current}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          current: e.target.value,
                        }))
                      }
                    />
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-amber-700 text-sm font-medium">
                      New Password
                    </Label>
                    <span className="text-xs text-amber-400 bg-amber-50 px-2 py-1 rounded-full">
                      Min 6 characters
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      className="bg-amber-50/50 border-amber-200 text-amber-800 h-12 pl-10 pr-4 rounded-xl placeholder:text-amber-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      value={passwords.new}
                      onFocus={() => setShowRequirements(true)}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          new: e.target.value,
                        }))
                      }
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                  </div>

                  {/* Password Strength Indicator */}
                  {passwords.new && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-amber-600">
                          Password Strength
                        </span>
                        <span className="text-xs font-medium text-amber-700">
                          {strength}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${strength}%` }}
                          className={`h-full ${strengthColor} rounded-full`}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-amber-700 text-sm font-medium">
                      Confirm New Password
                    </Label>
                    <span className="text-xs text-amber-400 bg-amber-50 px-2 py-1 rounded-full">
                      Must match
                    </span>
                  </div>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-amber-50/50 border-amber-200 text-amber-800 h-12 pl-10 pr-4 rounded-xl placeholder:text-amber-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords((prev) => ({
                          ...prev,
                          confirm: e.target.value,
                        }))
                      }
                    />
                    <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-400" />
                  </div>

                  {/* Match Indicator */}
                  {passwords.confirm && passwords.new && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-center gap-1 text-xs mt-1 ${
                        passwords.new === passwords.confirm
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {passwords.new === passwords.confirm ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          <span>Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          <span>Passwords don't match</span>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() =>
                      handleChangePassword(passwords.current, passwords.new)
                    }
                    className="w-full bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 relative overflow-hidden group"
                    disabled={
                      !passwords.current || !passwords.new || !passwords.confirm
                    }
                  >
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      Update Password
                    </span>
                  </Button>
                </motion.div>

                {/* Password Requirements */}
                <motion.div
                  initial={false}
                  animate={{ height: showRequirements ? "auto" : 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200">
                    <p className="text-sm font-medium text-amber-700 mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Password Requirements:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-amber-600">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            passwords.new.length >= 6
                              ? "bg-emerald-500"
                              : "bg-amber-300"
                          }`}
                        />
                        At least 6 characters long
                      </li>
                      <li className="flex items-center gap-2 text-amber-600">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            /[A-Z]/.test(passwords.new)
                              ? "bg-emerald-500"
                              : "bg-amber-300"
                          }`}
                        />
                        Include at least one uppercase letter
                      </li>
                      <li className="flex items-center gap-2 text-amber-600">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            /[0-9]/.test(passwords.new)
                              ? "bg-emerald-500"
                              : "bg-amber-300"
                          }`}
                        />
                        Include at least one number
                      </li>
                      <li className="flex items-center gap-2 text-amber-600">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            /[^A-Za-z0-9]/.test(passwords.new)
                              ? "bg-emerald-500"
                              : "bg-amber-300"
                          }`}
                        />
                        Include at least one special character
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-6 border border-amber-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-serif text-amber-800">
                Security Tips
              </h3>
            </div>

            <div className="space-y-3">
              {[
                "Use a strong, unique password - avoid using the same password on multiple sites",
                "Enable 2FA when available for an extra layer of security",
                "Regularly update your password every 3-6 months",
                "Never share your password with anyone",
                "Use a password manager to store complex passwords",
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">{tip}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
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
