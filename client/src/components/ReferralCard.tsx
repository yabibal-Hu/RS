import {  CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Copy,
  Share2,
  Sparkles,
  Check,
  Gift,
  Crown,
  Users,
  Star,
  Award,
  Zap,
} from "lucide-react";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { motion } from "framer-motion";

interface ReferralCardProps {
  invitationCode: string;
}

export default function ReferralCard({ invitationCode }: ReferralCardProps) {
  const refLink = `${window.location.origin}/login?ref=${invitationCode}`;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.success("✨ Referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on this amazing platform!",
          text: `Use my referral code ${invitationCode} to get started and earn bonuses together! 🎁`,
          url: refLink,
        });
        toast.success("🎉 Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative h-full"
    >
      {/* Main Card */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-amber-200 overflow-hidden h-full">
        {/* Top Gradient Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 animate-gradient-x"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, #f59e0b 1px, transparent 0)",
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-amber-400/10 rounded-full blur-3xl"></div>

        {/* Corner Decorations */}
        <div className="absolute top-4 right-4">
          <div className="relative">
            <Crown className="w-8 h-8 text-amber-400/30" />
            <Crown className="w-8 h-8 text-amber-400 absolute top-0 left-0 animate-pulse" />
          </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <Award className="w-8 h-8 text-amber-400/30" />
        </div>

        <CardContent className="relative p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center gap-2 mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            <h2 className="text-2xl font-serif text-amber-800 mb-2">
              Share & Earn
            </h2>
            <p className="text-amber-500 text-sm">
              Invite friends and earn 10% commission on their deposits
            </p>
          </div>

          {/* Invitation Code Display */}
          <div className="mb-8">
            <p className="text-amber-600 text-sm font-medium mb-3 text-center">
              Your Referral Code
            </p>
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl blur-xl opacity-20"></div>

              {/* Code Display */}
              <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-3">
                  <Zap className="w-6 h-6 text-amber-400" />
                  <span className="text-4xl font-mono font-bold text-amber-800 tracking-wider">
                    {invitationCode}
                  </span>
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-amber-50/50 rounded-xl p-4 text-center border border-amber-200">
              <Users className="w-5 h-5 text-amber-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-amber-800">
                Referral Bonus
              </div>
              <div className="text-xs text-amber-500">10% commission</div>
            </div>
            <div className="bg-amber-50/50 rounded-xl p-4 text-center border border-amber-200">
              <Star className="w-5 h-5 text-amber-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-amber-800">
                Welcome Gift
              </div>
              <div className="text-xs text-amber-500">50 ETB bonus</div>
            </div>
          </div>

          {/* Referral Link */}
          <div className="mb-6">
            <label className="text-amber-700 text-sm font-medium mb-2 block">
              Share this link
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  value={refLink}
                  readOnly
                  className="bg-amber-50/50 border-amber-200 text-amber-800 h-12 pr-12 rounded-xl placeholder:text-amber-400"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2
                    w-8 h-8 rounded-lg bg-amber-100 hover:bg-amber-200
                    flex items-center justify-center transition-all border border-amber-200"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-amber-600" />
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={copyToClipboard}
                className="w-full h-12 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500
                text-white font-medium border-0 shadow-lg rounded-xl"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </motion.div>
            <motion.div
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={shareLink}
                className="w-full h-12 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500
                text-white font-medium border-0 shadow-lg rounded-xl"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </motion.div>
          </div>

          {/* Info Badge */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <p className="text-sm text-amber-600">
                Earn commission on your friends' deposits
              </p>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-amber-300/30 rounded-full"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                }}
                animate={{
                  y: [null, -20, 20, -20],
                  x: [null, 20, -20, 20],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        </CardContent>
      </div>

      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </motion.div>
  );
}
