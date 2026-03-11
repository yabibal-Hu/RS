import {  useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {  useNavigate } from "react-router-dom";
import { Loader } from "@/components/Loading";
import { UserService } from "@/services/userService";
import {
  BanknotesIcon,
  CreditCardIcon,
  ArrowLeftOnRectangleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Exchange, ToUSDT } from "@/components/Exchange";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  
  KeyIcon,
} from "lucide-react";

const Profile = () => {
  const [balance, setBalance] = useState(0);
  const [referralIncome, setReferralIncome] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const navigate = useNavigate();
  const [totalCommission, setTotalCommission] = useState(0);
  const [loading, setLoading] = useState(true);
  const [vipLevel, setVipLevel] = useState("0");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  // const [selectedCurrency, setSelectedCurrency] = useState("ETB");
  const [quantizationLevel, setQuantizationLevel] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await UserService.getBalance();
        setBalance(userInfo.userInfo.profile.currentBalance);
        setReferralIncome(userInfo.userInfo.profile.referralIncome);
        setTotalCommission(userInfo.totalCommission._sum.amount);
        setTotalDeposit(userInfo.totalDeposit._sum.amount);
        setTotalWithdraw(userInfo.totalWithdraw._sum.amount);
        setVipLevel(userInfo.userInfo.profile.vipName);
        setPhone(userInfo.userInfo.phone);
        setName(userInfo.userInfo.name);
        setQuantizationLevel(0);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("vipLevel", vipLevel);
  }, [vipLevel]);

  const handleLogout = () => {
    authClient.removeToken();
    navigate("/login");
  };

  // const downloadApp = () => {
  //   const link = document.createElement("a");
  //   link.href = "/MSC.apk";
  //   link.download = "app.apk";
  //   link.click();
  // };

  const exchange = (amount: number) => {
    return Exchange(amount);
  };

  // const Currency = [
  //   { value: "ETB", label: "ETB", price: 1, flag: "🇪🇹" },
  //   { value: "EUR", label: "EUR", price: 185, flag: "🇪🇺" },
  //   { value: "ZMW", label: "ZMW", price: 0.5, flag: "🇿🇲" },
  //   { value: "ZAR", label: "ZAR", price: 9.7, flag: "🇿🇦" },
  //   { value: "NGN", label: "NGN", price: 0.1, flag: "🇳🇬" },
  //   { value: "KES", label: "KES", price: 1.2, flag: "🇰🇪" },
  // ];

  // useEffect(() => {
  //   const storedCurrency = localStorage.getItem("selectedCurrency");
  //   if (storedCurrency) {
  //     setSelectedCurrency(storedCurrency);
  //   }
  // }, []);

  // const handleCurrencyChange = (value: string) => {
  //   setSelectedCurrency(value);
  //   localStorage.setItem("selectedCurrency", value);
  // };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen ">
        {/* Header with Welcome and Quantization Level */}
        <div className="bg-white/90 backdrop-blur-sm border-b rounded-b-2xl border-amber-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-500 text-xs">Welcome Back</p>
              <div className="flex items-center gap-2">
                <div className="bg-amber-100 rounded-full px-3 py-1 flex items-center gap-1">
                  {/* <Zap className="w-3 h-3 text-amber-600" /> */}
                  <span className="text-xs font-medium text-amber-700">
                    VIP {quantizationLevel}
                  </span>
                </div>
                <h1 className="text-lg font-semibold text-amber-900">
                  {name || phone}
                </h1>
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
              <Select
                value={selectedCurrency}
                onValueChange={handleCurrencyChange}
              >
                <SelectTrigger className="w-[120px] h-8 bg-amber-50 border-amber-200 text-amber-700 text-xs">
                  <span>💱 Exchange</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-amber-200">
                  {Currency.map((method) => (
                    <SelectItem
                      key={method.value}
                      value={method.value}
                      className="text-amber-700 text-xs"
                    >
                      <div className="flex items-center gap-1">
                        <span>{method.flag}</span>
                        <span>{method.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Total Assets Card */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-br from-amber-400 to-orange-400 rounded-2xl p-5 shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>

            <p className="text-white/80 text-xs mb-1">Total Assets</p>
            <p className="text-3xl font-bold text-white mb-2">
              $
              {ToUSDT(
                (balance || 0) + (referralIncome || 0) + (totalCommission || 0),
              ).toLocaleString()}
            </p>

            <div className="flex items-center justify-between">
              <p className="text-white/80 text-xs">Total Revenue</p>
              <p className="text-white font-semibold text-sm">
                ${totalCommission?.toLocaleString()}
              </p>
            </div>
          </motion.div> */}

          {/* Stats Grid - Balance, Commission, Deposit, Withdraw in one card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-amber-200 shadow-lg"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Balance */}
              <div>
                <p className="text-amber-500 text-xs mb-1">Balance</p>
                <p className="text-xl font-bold text-amber-900">
                  $
                  {ToUSDT(
                    vipLevel === "0"
                      ? (balance || 0) + (referralIncome || 0)
                      : balance || 0,
                  ).toLocaleString()}
                </p>
                <p className="text-xs text-amber-400">
                  ≈{" "}
                  {vipLevel === "0"
                    ? exchange((balance || 0) + (referralIncome || 0)).value
                    : exchange(balance || 0).value}{" "}
                  {exchange(balance || 0).currency}
                </p>
              </div>

              {/* Commission */}
              <div>
                <p className="text-amber-500 text-xs mb-1">Commission</p>
                <p className="text-xl font-bold text-amber-900">
                  ${ToUSDT(totalCommission || 0).toLocaleString()}
                </p>
                <p className="text-xs text-amber-400">
                  ≈ {exchange(totalCommission || 0).value}{" "}
                  {exchange(totalCommission || 0).currency}
                </p>
              </div>

              {/* Deposit */}
              <div>
                <p className="text-amber-500 text-xs mb-1">Deposit</p>
                <p className="text-xl font-bold text-amber-900">
                  ${ToUSDT(totalDeposit || 0).toLocaleString()}
                </p>
                <p className="text-xs text-amber-400">
                  ≈ {exchange(totalDeposit || 0).value}{" "}
                  {exchange(totalDeposit || 0).currency}
                </p>
              </div>

              {/* Withdraw */}
              <div>
                <p className="text-amber-500 text-xs mb-1">Withdraw</p>
                <p className="text-xl font-bold text-amber-900">
                  ${ToUSDT(totalWithdraw || 0).toLocaleString()}
                </p>
                <p className="text-xs text-amber-400">
                  ≈ {exchange(totalWithdraw || 0).value}{" "}
                  {exchange(totalWithdraw || 0).currency}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons - Horizontal Flex */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-3 pb-2 scrollbar-hide"
          >
            <button
              onClick={() => navigate("/deposit")}
              className=" flex w-full items-center justify-evenly h-16 bg-linear-to-br from-amber-400 to-orange-400 rounded-2xl shadow-lg"
            >
              <BanknotesIcon className="w-6 h-6 text-white mb-1" />
              <span className="text-white text-xs font-medium">Deposit</span>
            </button>
            <button
              onClick={() => navigate("/deposit/record")}
              className=" flex w-full items-center justify-evenly h-16 bg-linear-to-br from-amber-400 to-orange-400 rounded-2xl shadow-lg"
            >
              <DocumentTextIcon className="w-6 h-6 text-white mb-1" />
              <span className="text-white text-xs font-medium">
                Deposit Record
              </span>
            </button>
            <button
              onClick={() => navigate("/withdraw")}
              className=" flex w-full items-center justify-evenly h-16 bg-linear-to-br from-amber-400 to-orange-400 rounded-2xl shadow-lg"
            >
              <CreditCardIcon className="w-6 h-6 text-white mb-1" />
              <span className="text-white text-xs font-medium">Withdraw</span>
            </button>
            <button
              onClick={() => navigate("/withdraw/record")}
              className=" flex w-full items-center justify-evenly h-16 bg-linear-to-br from-amber-400 to-orange-400 rounded-2xl shadow-lg"
            >
              <DocumentTextIcon className="w-6 h-6 text-white mb-1" />
              <span className="text-white text-xs font-medium">
                Withdraw Record
              </span>
            </button>
            {/* change password */}
            <button
              onClick={() => navigate("/account")}
              className=" flex w-full items-center justify-evenly h-16 bg-linear-to-br from-amber-400 to-orange-400 rounded-2xl shadow-lg"
            >
              <KeyIcon className="w-6 h-6 text-white mb-1" />
              <span className="text-white text-xs font-medium">
                Change Password
              </span>
            </button>
            {/* logout button */}
            <button
              onClick={handleLogout}
              className=" flex w-full items-center justify-evenly h-16 bg-linear-to-br from-gray-500 to-gray-700 rounded-2xl shadow-lg"
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6 text-white mb-1" />
              <span className="text-white text-xs font-medium">Logout</span>
            </button>
          </motion.div>
          {/* <button
              onClick={() => navigate("/withdraw")}
              className="flex w-full items-center justify-evenly h-16 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl shadow-lg"
            >
              <CreditCardIcon className="w-6 h-6 text-amber-600 mb-1" />
              <span className="text-amber-700 text-xs font-medium">Withdraw</span>
            </button>

            <button
              onClick={() => navigate("/deposit")}
              className="flex w-full items-center justify-evenly h-16 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl shadow-lg"
            >
              <DocumentTextIcon className="w-6 h-6 text-amber-600 mb-1" />
              <span className="text-amber-700 text-xs font-medium">Detail</span>
            </button>

            <button
              onClick={() => navigate("/referral")}
              className="flex w-full items-center justify-evenly h-16 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl shadow-lg"
            >
              <GiftIcon className="w-6 h-6 text-amber-600 mb-1" />
              <span className="text-amber-700 text-xs font-medium">Invite</span>
            </button>

            <button
              onClick={() => navigate("/transfer")}
              className="flex w-full items-center justify-evenly h-16 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl shadow-lg"
            >
              <svg
                className="w-6 h-6 text-amber-600 mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <span className="text-amber-700 text-xs font-medium">Transfer</span>
            </button> */}
          {/* Removed extra closing tag here */}
          {/* End of Action Buttons */}

          {/* News and Security Center */}
          {/* <div className="grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                  <DocumentTextIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-amber-900 font-medium">News</p>
                  <p className="text-amber-500 text-xs">Latest updates</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-amber-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                  <ShieldCheckIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-amber-900 font-medium">Security</p>
                  <p className="text-amber-500 text-xs">Center</p>
                </div>
              </div>
            </motion.div>
          </div> */}
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </>
  );
};

export default Profile;
