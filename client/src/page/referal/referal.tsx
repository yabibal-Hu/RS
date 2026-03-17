import { Users } from "lucide-react";
import ReferralCard from "@/components/ReferralCard";
import { useEffect, useState } from "react";
import { Loader } from "@/components/Loading";
import { UserService } from "@/services/userService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Referral = () => {
  const [loading, setLoading] = useState(true);
  const [invitationCode, setInvitationCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("rsToken");
    const fetchUserData = async () => {
      const response = await UserService.getReferral();
      if (response.success) {
        setInvitationCode(response.data.invitationCode);
        setLoading(false);
      }
    };
    if (token) {
      fetchUserData();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-3 relative">
      {/* Single static background element */}
      <div className="fixed top-20 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/5 to-orange-400/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Header - Static */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-md flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-serif text-amber-800 mb-0.5">
            Referral Program
          </h1>
          <p className="text-xs text-amber-500">
            Invite friends and earn together!
          </p>
        </div>

        {/* Referral Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Referral Link Card - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <ReferralCard invitationCode={invitationCode} />
          </div>

          {/* Stats Cards - Takes 1 column */}
          <div className="space-y-3">
            {/* This space can be used for future stats cards */}
          </div>
        </div>

        {/* Button - Centered and mobile-optimized */}
        <div className="flex justify-center mt-5">
          <Button
            onClick={() => navigate("/referal-network")}
            className="w-full max-w-[280px] h-12 text-base font-serif bg-gradient-to-r from-amber-400 to-orange-400 active:from-amber-500 active:to-orange-500 text-white border-0 shadow"
          >
            Show Referral Network
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Referral;
