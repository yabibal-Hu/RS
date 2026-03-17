import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Check,
  CheckCircle,
  Copy,
  FileUp,
  X,
  Crown,
  Shield,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserService } from "@/services/userService";
import { SettingService } from "@/services/settingService";
import { Exchange } from "@/components/Exchange";
import { Loader } from "@/components/Loading";
import { showToast } from "@/utils/toast";
import { motion, AnimatePresence } from "framer-motion";

interface BankInfo {
  id: string;
  bankName: string;
  name: string;
  accNumber: string;
  owner: string;
  logo: string;
}
interface Vip {
  id: number;
  name: string;
  price: number;
}

const Deposit = () => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [bankInfo, setBankInfo] = useState<BankInfo[]>([]);
  const [vipLevels, setVipLevels] = useState<Vip[]>([]);
  const [vipLevel, setVipLevel] = useState<string>("");
  const [selectedVip, setSelectedVip] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userBalance, setUserBalance] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [owner, setOwner] = useState<string>("ETB");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectedVip = searchParams.get("vip");
  const [isLoading, setIsLoading] = useState(true);

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

  const [isCopied, setIsCopied] = useState(false);
  const accountNumber =
    bankInfo.find((b) => b.bankName === paymentMethod)?.accNumber || "";

  const handleCopy = async () => {
    if (!accountNumber) {
      showToast.error("No account number available to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(accountNumber);
      setIsCopied(true);
      showToast.success("✨ Account number copied!");

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      showToast.error("Failed to copy");
    }
  };

  const handleVipPrice = (vipName: string) => {
    const vip = vipLevels?.find((v) => v.name === vipName);
    return vip ? vip.price : 0;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    if (redirectedVip) {
      setAmount(
        (
          handleVipPrice(redirectedVip) -
          (Number(userBalance) + handleVipPrice(vipLevel))
        ).toString(),
      );
    }
    if (selectedVip) {
      setAmount(
        (
          handleVipPrice(selectedVip) -
          Number(userBalance) -
          handleVipPrice(vipLevel)
        ).toString(),
      );
    }
  }, [redirectedVip, paymentMethod, selectedVip]);

  useEffect(() => {
    const token = localStorage.getItem("rsToken");
    if (!token) {
      return;
    }
  }, []);

  const handleDeposit = async () => {
    if (!amount || !paymentMethod) {
      showToast.error("Please enter amount and select payment method");
      return;
    }
    if (!file) {
      showToast.error("Please upload a receipt");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("paymentMethod", paymentMethod);
      if (redirectedVip) {
        formData.append("depositType", "VIP_UPGRADE");
      } else {
        formData.append("depositType", "DEPOSIT");
        formData.append("type", "DEPOSIT");
      }

      if (file) {
        formData.append("receipt", file);
      }

      const res = await UserService.deposit(formData);

      if (res.success) {
        showToast.success(`Deposit of ${amount} ETB initiated successfully!`);
        setAmount("");
        setPaymentMethod("");
        setFile(null);
        navigate("/deposit/record");
      } else {
        showToast.error(res.error || "Deposit failed");
      }
    } catch (error: any) {
      console.error("Deposit error:", error);
      showToast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchBankInfo = async () => {
      const token = localStorage.getItem("rsToken");
      if (!token) return;

      const type = "DEPOSIT";
      try {
        const bank = await SettingService.banks(type);
        const vips = await SettingService.allVips();
        setVipLevels(vips.vips);
        setBankInfo(bank.banks);
        setVipLevel(bank.userBalance.vipName || "");
        setUserBalance(bank.userBalance.currentBalance || "0");
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching bank info:", error);
      }
    };
    fetchBankInfo();
  }, [navigate]);

  const exchange = (balance: number) => {
    return Exchange(balance, owner);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Simplified animations for mobile
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced stagger for faster loading
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }, // Simple fade instead of spring
    },
  };

  return (
    <div className="min-h-screen py-4 px-3 relative overflow-hidden">
      {/* Simplified Background - Reduced particles for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map(
          (
            _,
            i, // Reduced from 20 to 8 particles
          ) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-300/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, -20, 20, -20],
              }}
              transition={{
                duration: Math.random() * 15 + 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ),
        )}
      </div>

      {/* Single gradient orb for background depth */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="fixed top-20 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl -z-10"
      />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header - Simplified animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-6"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-2xl">💰</span>
          </div>

          <h1 className="text-2xl font-serif text-amber-800 mb-1">
            Make a Deposit
          </h1>

          <p className="text-amber-500 text-sm">
            Add funds to start earning commissions
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* Amount Selection Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                {redirectedVip ? (
                  <Crown className="w-4 h-4 text-white" />
                ) : (
                  <Wallet className="w-4 h-4 text-white" />
                )}
              </div>
              <h2 className="text-lg font-serif text-amber-800">
                {redirectedVip
                  ? `Upgrade to VIP ${redirectedVip}`
                  : "Deposit Amount"}
              </h2>
            </div>

            <div className="space-y-3">
              {redirectedVip ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Current Balance */}
                    <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200">
                      <p className="text-amber-500 text-xs mb-1 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Your Balance
                      </p>
                      <p className="text-lg font-serif text-amber-800">
                        {exchange(Number(userBalance)).value}{" "}
                        <span className="text-xs font-light text-amber-400">
                          {exchange(Number(userBalance)).currency}
                        </span>
                      </p>
                    </div>

                    {/* Required Amount */}
                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-3 border border-amber-300">
                      <p className="text-amber-600 text-xs mb-1 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Required
                      </p>
                      <p className="text-lg font-serif text-amber-800">
                        {(
                          exchange(handleVipPrice(redirectedVip)).value -
                          (exchange(Number(userBalance)).value +
                            exchange(handleVipPrice(vipLevel)).value)
                        ).toFixed(2)}{" "}
                        <span className="text-xs font-light text-amber-400">
                          {exchange(Number(userBalance)).currency}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Deposit history button */}
                  <button
                    onClick={() => navigate("/deposit/record")}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    View Deposit Record
                  </button>
                </>
              ) : (
                <>
                  {/* Balance & VIP Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200">
                      <p className="text-amber-500 text-xs mb-1">
                        Your Balance
                      </p>
                      <p className="text-lg font-serif text-amber-800">
                        {exchange(Number(userBalance)).value}{" "}
                        <span className="text-xs font-light text-amber-400">
                          {exchange(Number(userBalance)).currency}
                        </span>
                      </p>
                    </div>

                    <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200">
                      <p className="text-amber-500 text-xs mb-1">Select VIP</p>
                      <Select
                        onValueChange={(value) => setSelectedVip(value)}
                        value={selectedVip}
                      >
                        <SelectTrigger className="bg-white border-amber-200 text-amber-700 h-10 rounded-lg text-sm">
                          <SelectValue placeholder="Choose level" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-amber-200">
                          {vipLevels
                            ?.filter(
                              (vip) => Number(vip.name) > Number(vipLevel),
                            )
                            .map((vip) => (
                              <SelectItem
                                key={vip.id}
                                value={vip.name.toString()}
                                className="text-amber-700 hover:bg-amber-50 text-sm"
                              >
                                <div className="flex items-center gap-3">
                                  <span>VIP {vip.name}</span>
                                  <span className="text-amber-400 text-xs">
                                    {exchange(vip.price).value}{" "}
                                    {exchange(vip.price).currency}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Deposit history button */}
                  <button
                    onClick={() => navigate("/deposit/record")}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                  >
                    View Deposit Record
                  </button>

                  {/* Required Amount if VIP selected */}
                  <AnimatePresence>
                    {selectedVip && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3"
                      >
                        <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-200">
                          <p className="text-amber-500 text-xs mb-1">
                            VIP {selectedVip} Price
                          </p>
                          <p className="text-lg font-serif text-amber-800">
                            {exchange(handleVipPrice(selectedVip)).value}{" "}
                            <span className="text-xs font-light text-amber-400">
                              {exchange(Number(userBalance)).currency}
                            </span>
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-3 border border-amber-300">
                          <p className="text-amber-600 text-xs mb-1">
                            Required Amount
                          </p>
                          <p className="text-lg font-serif text-amber-800">
                            {(
                              exchange(Number(handleVipPrice(selectedVip)))
                                .value -
                              (exchange(Number(userBalance)).value +
                                exchange(handleVipPrice(vipLevel)).value)
                            ).toFixed(2)}{" "}
                            <span className="text-xs font-light text-amber-400">
                              {exchange(Number(userBalance)).currency}
                            </span>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </motion.div>

          {/* Payment Method Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <span className="text-white text-sm">💳</span>
              </div>
              <h2 className="text-lg font-serif text-amber-800">
                Payment Details
              </h2>
            </div>

            <div className="space-y-3">
              {/* Bank Selection */}
              <div className="space-y-1">
                <Label className="text-amber-700 text-sm">
                  Select Payment Method
                </Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(value: string) => {
                    setPaymentMethod(value);
                    setOwner(
                      bankInfo.find((b) => b.bankName === value)?.owner || "",
                    );
                  }}
                >
                  <SelectTrigger className="bg-white border-amber-200 text-amber-700 h-10 rounded-lg text-sm">
                    <SelectValue placeholder="Choose payment method" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-amber-200">
                    {bankInfo.map((method) => (
                      <SelectItem
                        key={method.id}
                        value={method.bankName}
                        className="text-amber-700 hover:bg-amber-50 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            className="w-5 h-5 rounded-full"
                            src={
                              bankLogos[method.bankName] ||
                              "/images/bank/default.jpg"
                            }
                            alt={method.bankName}
                          />
                          <span>{method.bankName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Account Number */}
              <AnimatePresence>
                {accountNumber && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1"
                  >
                    <Label className="text-amber-700 text-sm">
                      Account Number
                    </Label>
                    <div className="relative">
                      <Input
                        value={accountNumber}
                        readOnly
                        className="bg-amber-50/50 border-amber-200 text-amber-800 h-10 pr-10 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-amber-600 hover:bg-amber-100 p-1.5 rounded-full transition-colors"
                      >
                        {isCopied ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Receipt Upload */}
              <div className="space-y-2 pt-1">
                <Label className="text-amber-700 text-sm flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5" />
                  Upload Payment Receipt
                </Label>

                {!file ? (
                  <div className="border-2 border-dashed border-amber-200 rounded-lg p-4 text-center hover:border-amber-300 transition-colors bg-amber-50/30">
                    <input
                      type="file"
                      id="receipt"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <label htmlFor="receipt" className="cursor-pointer block">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                          <FileUp className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-amber-800 text-sm font-medium mb-1">
                          Upload Payment Proof
                        </p>
                        <p className="text-amber-400 text-xs mb-2">
                          Screenshot or photo of transaction
                        </p>
                        <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs">
                          Choose File
                        </div>
                      </div>
                    </label>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-amber-50/50 rounded-lg p-3 border border-amber-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm text-amber-800">
                            {file.name.length > 15
                              ? file.name.slice(0, 15) + "..."
                              : file.name}
                          </p>
                          <p className="text-amber-400 text-xs">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveFile}
                        className="w-7 h-7 rounded-full bg-rose-100 hover:bg-rose-200 flex items-center justify-center transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                    </div>

                    {previewUrl && file.type.startsWith("image/") && (
                      <div className="rounded-lg overflow-hidden border border-amber-200">
                        <img
                          src={previewUrl}
                          alt="Receipt preview"
                          className="w-full h-auto"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Deposit Summary */}
          <AnimatePresence>
            {amount && paymentMethod && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                    <span className="text-white text-sm">📊</span>
                  </div>
                  <h2 className="text-lg font-serif text-amber-800">
                    Deposit Summary
                  </h2>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-amber-700 text-sm">
                    <span>Deposit Amount:</span>
                    <span className="font-serif font-medium">
                      {exchange(Number(amount)).value}{" "}
                      {exchange(Number(amount)).currency}
                    </span>
                  </div>

                  <div className="flex justify-between text-amber-700 text-sm">
                    <span>Processing Fee:</span>
                    <span className="font-serif text-emerald-600 font-medium">
                      FREE
                    </span>
                  </div>

                  <div className="border-t border-amber-200 pt-2 mt-1">
                    <div className="flex justify-between text-amber-800 font-serif text-base">
                      <span>Total:</span>
                      <span className="text-amber-900 font-bold">
                        {exchange(Number(amount)).value}{" "}
                        {exchange(Number(amount)).currency}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div
            variants={itemVariants}
            className="sticky bottom-2" // Sticky on mobile
          >
            <Button
              disabled={!amount || !paymentMethod || !file || isSubmitting}
              onClick={handleDeposit}
              className="w-full h-12 text-base font-serif bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white border-0 shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>💰</span>
                  <span>Confirm Deposit</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Deposit;
