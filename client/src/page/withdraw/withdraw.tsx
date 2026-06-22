import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { AlertCircle, Wallet, Shield, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "@/components/Loading";
import { SettingService } from "@/services/settingService";
import { UserService } from "@/services/userService";
import { useNavigate } from "react-router-dom";
import { Exchange, ToETB } from "@/components/Exchange";

interface BankInfo {
  id: string;
  bankName: string;
  name: string;
  accNumber: string;
  owner: string;
  logo: string;
}

const Withdraw = () => {
  const [amount, setAmount] = useState(0);
  const [withdrawMethod, setWithdrawMethod] = useState("");
  const [bankInfo, setBankInfo] = useState<BankInfo[]>([]);
  const [useAccount, setUseAccount] = useState("");
  const [accountOwner, setAccountOwner] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [minWithdraw, setMinWithdraw] = useState(0);
  const [maxWithdraw, setMaxWithdraw] = useState(0);
  const [fullPageLoading, setFullPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [owner, setOwner] = useState("ETB");
  const navigate = useNavigate();

  const bankLogos: { [key: string]: string } = {
    "Commercial Bank of Ethiopia": "/images/bank/cbe.png",
    "Bank of Abyssinia": "/images/bank/boa.png",
    Telebirr: "/images/bank/telebirr.png",
    "Binance TRON (TRC20)": "/images/bank/binance.png",
    Revolut: "/images/bank/revolut.jpg",
    "Monzo Bank": "/images/bank/monzo.png",
    "Central Bank of Kenya": "/images/bank/kenya.png",
    "Central Bank of Nigeria": "/images/bank/nigeria.png",
    "Bank of zambia": "/images/bank/zambia.png",
    "South African Reserve Bank": "/images/bank/S.africa.png",
    "European Central Bank": "/images/bank/eu.png",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("rsToken");
        if (!token) {
          navigate("/login");
          return;
        }

        setFullPageLoading(true);
        const type = "WITHDRAW";

        const response = await SettingService.banks(type);

        if (response && response.banks) {
          setBankInfo(response.banks);
          setAvailableBalance(response.userBalance?.currentBalance || 0);
          setMinWithdraw(response.siteSettings?.minWithdraw || 0);

          const userBalance = response.userBalance?.currentBalance || 0;
          const maxAllowed = response.siteSettings?.maxWithdraw || 0;
          setMaxWithdraw(userBalance < maxAllowed ? userBalance : maxAllowed);
        } else {
          toast.error("Failed to load bank information");
        }
      } catch (error) {
        console.error("Error fetching bank info:", error);
        toast.error("Failed to load withdrawal information");
      } finally {
        setFullPageLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleWithdraw = async () => {
    if (!amount || !withdrawMethod || !useAccount || !accountOwner) {
      toast.error("Please fill all required fields");
      return;
    }

    if (amount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    if (amount < minWithdraw || amount > maxWithdraw) {
      toast.error(`Amount must be between ${minWithdraw} and ${maxWithdraw}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("rsToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const payload: Record<string, string | number> = {
        amount: ToETB(amount, owner),
        method: withdrawMethod,
      };

      payload.useAccount = useAccount;
      payload.accountOwner = accountOwner;
      payload.type = "WITHDRAW";

      const res = await UserService.withdraw(payload);

      if (res && res.success) {
        toast.success(`🎉 Withdrawal of $${amount} initiated successfully!`);
        navigate("/withdraw/record");
        setAmount(0);
        setWithdrawMethod("");
        setUseAccount("");
        setAccountOwner("");
      } else {
        const errorMessage = res?.message || "Failed to create withdraw order";
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("Withdrawal error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const exchange = (balance: number) => {
    return Exchange(balance, owner);
  };

  const fee = (amount * 2) / 100;
  const netAmount = amount - fee;

  if (fullPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const token = localStorage.getItem("rsToken");
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader message="Redirecting to login..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-3 relative">
      {/* Single static background element - no animation */}
      <div className="fixed top-20 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/5 to-orange-400/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-2xl mx-auto">
        {/* Header - Static */}
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-md flex items-center justify-center">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-serif text-amber-800 mb-1">
            Withdraw Funds
          </h1>
          <p className="text-amber-500 text-sm">
            Secure transfers to your account
          </p>
        </div>

        <div className="space-y-4">
          {/* Balance Card */}
          <div className="bg-white/95 rounded-xl shadow border border-amber-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-white flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-amber-600 text-xs mb-0.5 font-medium">
                  Available Balance
                </p>
                <p className="text-2xl font-bold text-amber-900">
                  {exchange(availableBalance).value.toLocaleString()}{" "}
                  <span className="text-sm text-amber-500">
                    {exchange(availableBalance).currency}
                  </span>
                </p>
                <div className="flex justify-between mt-1">
                  <p className="text-amber-600 text-xs">Limits:</p>
                  <p className="text-amber-500 text-xs font-medium">
                    {exchange(minWithdraw).value} -{" "}
                    {exchange(maxWithdraw).value}
                  </p>
                </div>
              </div>
            </div>

            {/* Withdraw history button */}
            <div className="flex items-center justify-center mt-3 pt-2 border-t border-amber-100">
              <button
                onClick={() => navigate("/withdraw/record")}
                className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors text-sm w-full"
              >
                View Withdrawal Record
              </button>
            </div>
          </div>

          {/* Form Cards */}
          <div className="bg-white/95 rounded-xl shadow border border-amber-200 p-4 space-y-4">
            <h2 className="text-lg font-serif text-amber-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white text-xs">
                1
              </div>
              Withdrawal Details
            </h2>

            {/* Payment Method */}
            <div>
              <label className="text-amber-700 text-sm font-medium mb-1.5 block">
                Choose Payment Method
              </label>
              <Select onValueChange={setWithdrawMethod} value={withdrawMethod}>
                <SelectTrigger className="bg-white border-amber-200 text-amber-700 h-11 rounded-lg text-sm">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-white border-amber-200">
                  {bankInfo.map((bank) => (
                    <SelectItem
                      key={bank.id}
                      onClick={() => {
                        setOwner(bank.owner);
                        setAmount(0);
                      }}
                      value={bank.bankName}
                      className="text-amber-700 hover:bg-amber-50 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          className="w-5 h-5 rounded-full"
                          src={
                            bankLogos[bank.bankName] ||
                            "/images/bank/default.jpg"
                          }
                          alt={bank.bankName}
                        />
                        <span>{bank.bankName}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Owner */}
            <div>
              <label className="text-amber-700 text-sm font-medium mb-1.5 block">
                Account Owner
              </label>
              <Input
                value={accountOwner}
                onChange={(e) => setAccountOwner(e.target.value)}
                placeholder="Enter your full name"
                className="bg-amber-50/50 border-amber-200 text-amber-800 h-11 rounded-lg placeholder:text-amber-400 text-sm"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="text-amber-700 text-sm font-medium mb-1.5 block">
                Account Number
              </label>
              <Input
                value={useAccount}
                onChange={(e) => setUseAccount(e.target.value)}
                type="number"
                placeholder="Enter account number"
                className="bg-amber-50/50 border-amber-200 text-amber-800 h-11 rounded-lg placeholder:text-amber-400 text-sm"
              />
            </div>
          </div>

          {/* Amount Card */}
          <div className="bg-white/95 rounded-xl shadow border border-amber-200 p-4">
            <h2 className="text-lg font-serif text-amber-800 flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white text-xs">
                2
              </div>
              Enter Amount
            </h2>

            <div className="relative">
              <Input
                type="number"
                value={amount || ""}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setAmount(isNaN(value) ? 0 : value);
                }}
                className="bg-amber-50/50 border-amber-200 text-amber-800 h-14 text-2xl pr-24 rounded-lg placeholder:text-amber-400"
                placeholder="0.00"
                max={exchange(maxWithdraw).value}
                min={exchange(minWithdraw).value}
                step="0.01"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <span className="text-amber-500 text-sm font-medium">
                  {exchange(amount).currency}
                </span>
                <div className="w-px h-6 bg-amber-200 mx-1"></div>
                <button
                  onClick={() => setAmount(exchange(maxWithdraw).value)}
                  className="text-xs bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                >
                  MAX
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-2">
              <span className="text-amber-500 text-xs">
                Min: {exchange(minWithdraw).value.toLocaleString()}
              </span>
              <span className="text-amber-500 text-xs">
                Max: {exchange(maxWithdraw).value.toLocaleString()}
              </span>
            </div>

            {/* Validation Messages */}
            {amount > 0 && (
              <div className="space-y-2 mt-3">
                {amount > exchange(availableBalance).value && (
                  <div className="bg-rose-50 rounded-lg p-3 border border-rose-200 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-rose-600 text-sm font-medium block">
                        Insufficient Balance
                      </span>
                      <p className="text-rose-500/70 text-xs mt-0.5">
                        Available:{" "}
                        {exchange(availableBalance).value.toLocaleString()}{" "}
                        {exchange(availableBalance).currency}
                      </p>
                    </div>
                  </div>
                )}
                {(amount > exchange(maxWithdraw).value ||
                  amount < exchange(minWithdraw).value) &&
                  amount > 0 && (
                    <div className="bg-rose-50 rounded-lg p-3 border border-rose-200 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
                      <span className="text-rose-600 text-sm">
                        {amount > exchange(maxWithdraw).value
                          ? "Exceeds maximum limit"
                          : "Below minimum limit"}
                      </span>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Summary */}
          {amount > 0 && withdrawMethod && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
              <h3 className="text-base font-serif text-amber-800 mb-3">
                Withdrawal Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-amber-700 text-sm">
                  <span>Amount:</span>
                  <span className="font-medium">
                    {amount.toFixed(2)} {exchange(amount).currency}
                  </span>
                </div>
                <div className="flex justify-between text-amber-700 text-sm">
                  <span>Fee (2%):</span>
                  <span className="text-amber-600">
                    -{fee.toFixed(2)} {exchange(amount).currency}
                  </span>
                </div>
                <div className="flex justify-between text-amber-700 text-sm">
                  <span>Processing:</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    1-3 days
                  </span>
                </div>
                <div className="flex justify-between pt-3 mt-1 border-t border-amber-200">
                  <span className="text-amber-900 font-bold">
                    You'll Receive:
                  </span>
                  <span className="text-emerald-600 font-bold text-lg">
                    {netAmount.toFixed(2)} {exchange(amount).currency}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleWithdraw}
            disabled={
              !amount ||
              !withdrawMethod ||
              !useAccount ||
              !accountOwner ||
              amount > availableBalance ||
              amount < minWithdraw ||
              amount > maxWithdraw ||
              isSubmitting
            }
            className="w-full h-12 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-base rounded-lg shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sticky bottom-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Confirm Withdrawal
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Security Note */}
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-center">
            <p className="text-amber-600 text-xs">
              <Shield className="w-3.5 h-3.5 inline mr-1" />
              Secure withdrawals processed within 1-3 business days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
