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
import {
  Shield,
  Lock,
  Key,
  CheckCircle,
  AlertCircle,
  Sparkles,
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
    <div className="min-h-screen py-4 px-3 relative">
      {/* Single static background element */}
      <div className="fixed top-20 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/5 to-orange-400/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-2xl mx-auto">
        {/* Header - Static */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-md flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-serif text-amber-800 mb-0.5">
            Account Security
          </h1>
          <p className="text-xs text-amber-500">
            Manage your account security settings
          </p>
        </div>

        <div className="space-y-4">
          {/* Change Password Card */}
          <Card className="bg-white/95 rounded-lg shadow border border-amber-200 overflow-hidden">
            {/* Top Gradient Bar - Thinner */}
            <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>

            <CardHeader className="pb-3">
              <div>
                <CardTitle className="text-base font-serif text-amber-800">
                  Change Password
                </CardTitle>
                <CardDescription className="text-xs text-amber-500">
                  Update your account password for enhanced security
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-amber-700 text-xs font-medium">
                    Current Password
                  </Label>
                  <span className="text-[8px] text-amber-400 bg-amber-50 px-1.5 py-0.5 rounded-full">
                    Required
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                    className="bg-amber-50/50 border-amber-200 text-amber-800 h-10 pl-8 pr-3 rounded-lg placeholder:text-amber-400 text-xs"
                    value={passwords.current}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        current: e.target.value,
                      }))
                    }
                  />
                  <Key className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-amber-400" />
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-amber-700 text-xs font-medium">
                    New Password
                  </Label>
                  <span className="text-[8px] text-amber-400 bg-amber-50 px-1.5 py-0.5 rounded-full">
                    Min 6 chars
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    className="bg-amber-50/50 border-amber-200 text-amber-800 h-10 pl-8 pr-3 rounded-lg placeholder:text-amber-400 text-xs"
                    value={passwords.new}
                    onFocus={() => setShowRequirements(true)}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        new: e.target.value,
                      }))
                    }
                  />
                  <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-amber-400" />
                </div>

                {/* Password Strength Indicator */}
                {passwords.new && (
                  <div className="mt-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[8px] text-amber-600">
                        Password Strength
                      </span>
                      <span className="text-[8px] font-medium text-amber-700">
                        {strength}%
                      </span>
                    </div>
                    <div className="h-1 bg-amber-100 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${strength}%` }}
                        className={`h-full ${strengthColor} rounded-full transition-all duration-200`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-amber-700 text-xs font-medium">
                    Confirm New Password
                  </Label>
                  <span className="text-[8px] text-amber-400 bg-amber-50 px-1.5 py-0.5 rounded-full">
                    Must match
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    className="bg-amber-50/50 border-amber-200 text-amber-800 h-10 pl-8 pr-3 rounded-lg placeholder:text-amber-400 text-xs"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        confirm: e.target.value,
                      }))
                    }
                  />
                  <CheckCircle className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-amber-400" />
                </div>

                {/* Match Indicator */}
                {passwords.confirm && passwords.new && (
                  <div
                    className={`flex items-center gap-1 text-[8px] mt-1 ${
                      passwords.new === passwords.confirm
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {passwords.new === passwords.confirm ? (
                      <>
                        <CheckCircle className="w-2.5 h-2.5" />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-2.5 h-2.5" />
                        <span>Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={() =>
                  handleChangePassword(passwords.current, passwords.new)
                }
                className="w-full bg-gradient-to-r from-amber-400 to-orange-400 active:from-amber-500 active:to-orange-500 text-white font-medium text-sm py-2.5 rounded-lg shadow"
                disabled={
                  !passwords.current || !passwords.new || !passwords.confirm
                }
              >
                <span className="flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  Update Password
                </span>
              </Button>

              {/* Password Requirements - Collapsible */}
              {showRequirements && (
                <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200">
                  <p className="text-xs font-medium text-amber-700 mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Password Requirements:
                  </p>
                  <ul className="space-y-1.5 text-xs">
                    <li className="flex items-center gap-1.5 text-amber-600">
                      <div
                        className={`w-1 h-1 rounded-full ${
                          passwords.new.length >= 6
                            ? "bg-emerald-500"
                            : "bg-amber-300"
                        }`}
                      />
                      <span className="text-[9px]">At least 6 characters</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-amber-600">
                      <div
                        className={`w-1 h-1 rounded-full ${
                          /[A-Z]/.test(passwords.new)
                            ? "bg-emerald-500"
                            : "bg-amber-300"
                        }`}
                      />
                      <span className="text-[9px]">One uppercase letter</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-amber-600">
                      <div
                        className={`w-1 h-1 rounded-full ${
                          /[0-9]/.test(passwords.new)
                            ? "bg-emerald-500"
                            : "bg-amber-300"
                        }`}
                      />
                      <span className="text-[9px]">One number</span>
                    </li>
                    <li className="flex items-center gap-1.5 text-amber-600">
                      <div
                        className={`w-1 h-1 rounded-full ${
                          /[^A-Za-z0-9]/.test(passwords.new)
                            ? "bg-emerald-500"
                            : "bg-amber-300"
                        }`}
                      />
                      <span className="text-[9px]">One special character</span>
                    </li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Tips - Compact */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-sm font-serif text-amber-800">
                Security Tips
              </h3>
            </div>

            <div className="space-y-2">
              {[
                "Use a strong, unique password",
                "Enable 2FA when available",
                "Update password every 3-6 months",
                "Never share your password",
                "Use a password manager",
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-1.5">
                  <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[9px] text-amber-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
