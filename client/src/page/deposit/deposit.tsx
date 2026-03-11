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
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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
    const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 },
    },
    hover: {
      scale: 1.02,
      y: -2,
      transition: { type: "spring" as const, stiffness: 400, damping: 10 },
    },
  };

  return (
    <div className="min-h-screen  py-8 px-4 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-300/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -30, 30, -30],
              x: [null, 30, -30, 30],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl -z-10"
      />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200 relative"
          >
            <span className="text-3xl">💰</span>
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full blur-xl -z-10"
            />
          </motion.div>

          <motion.h1
            className="text-3xl font-serif text-amber-800 mb-2 drop-shadow-sm"
            animate={{
              scale: [1, 1.02, 1],
              textShadow: [
                "0 0 0 rgba(245,158,11,0)",
                "0 0 8px rgba(245,158,11,0.3)",
                "0 0 0 rgba(245,158,11,0)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Make a Deposit
          </motion.h1>

          <motion.p
            className="text-amber-500 font-light"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Add funds to start earning commissions
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Amount Selection Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredCard("amount")}
            onHoverEnd={() => setHoveredCard(null)}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-orange-400/0"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: hoveredCard === "amount" ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center"
              >
                {redirectedVip ? (
                  <Crown className="w-5 h-5 text-white" />
                ) : (
                  <Wallet className="w-5 h-5 text-white" />
                )}
              </motion.div>
              <h2 className="text-xl font-serif text-amber-800">
                {redirectedVip
                  ? `Upgrade to VIP ${redirectedVip}`
                  : "Deposit Amount"}
              </h2>
            </div>

            <div className="space-y-4">
              {redirectedVip ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Current Balance */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-amber-50/50 rounded-xl p-4 border border-amber-200"
                    >
                      <p className="text-amber-500 text-xs mb-2 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Your Balance
                      </p>
                      <motion.p
                        className="text-2xl font-serif text-amber-800"
                        key={userBalance}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        {exchange(Number(userBalance)).value}{" "}
                        <span className="text-sm font-light text-amber-400">
                          {exchange(Number(userBalance)).currency}
                        </span>
                      </motion.p>
                    </motion.div>

                    {/* Required Amount */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-4 border border-amber-300"
                    >
                      <p className="text-amber-600 text-xs mb-2 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Required
                      </p>
                      <motion.p
                        className="text-2xl font-serif text-amber-800"
                        key={amount}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        {(
                          exchange(handleVipPrice(redirectedVip)).value -
                          (exchange(Number(userBalance)).value +
                            exchange(handleVipPrice(vipLevel)).value)
                        ).toFixed(2)}{" "}
                        <span className="text-sm font-light text-amber-400">
                          {exchange(Number(userBalance)).currency}
                        </span>
                      </motion.p>
                    </motion.div>
                  </div>

                  {/* Deposit history button */}
                  <motion.div
                    className="flex items-center justify-center p-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => navigate("/deposit/record")}
                      className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      View Deposit Record
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Balance & VIP Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-amber-50/50 rounded-xl p-4 border border-amber-200"
                    >
                      <p className="text-amber-500 text-xs mb-2">
                        Your Balance
                      </p>
                      <motion.p
                        className="text-2xl font-serif text-amber-800"
                        key={userBalance}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        {exchange(Number(userBalance)).value}{" "}
                        <span className="text-sm font-light text-amber-400">
                          {exchange(Number(userBalance)).currency}
                        </span>
                      </motion.p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-amber-50/50 rounded-xl p-4 border border-amber-200"
                    >
                      <p className="text-amber-500 text-xs mb-2">Select VIP</p>
                      <Select
                        onValueChange={(value) => setSelectedVip(value)}
                        value={selectedVip}
                      >
                        <SelectTrigger className="bg-white border-amber-200 text-amber-700 h-12 rounded-xl">
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
                                className="text-amber-700 hover:bg-amber-50"
                              >
                                <div className="flex items-center gap-4">
                                  <span>VIP {vip.name}</span>
                                  <span className="text-amber-400 text-sm">
                                    {exchange(vip.price).value}{" "}
                                    {exchange(vip.price).currency}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>

                  {/* Deposit history button */}
                  <motion.div
                    className="flex items-center justify-center w-full p-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => navigate("/deposit/record")}
                      className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      View Deposit Record
                    </button>
                  </motion.div>

                  {/* Required Amount if VIP selected */}
                  <AnimatePresence>
                    {selectedVip && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-amber-50/50 rounded-xl p-4 border border-amber-200"
                        >
                          <p className="text-amber-500 text-xs mb-2">
                            VIP {selectedVip} Price
                          </p>
                          <motion.p
                            className="text-2xl font-serif text-amber-800"
                            key={selectedVip}
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            {exchange(handleVipPrice(selectedVip)).value}{" "}
                            <span className="text-sm font-light text-amber-400">
                              {exchange(Number(userBalance)).currency}
                            </span>
                          </motion.p>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-4 border border-amber-300"
                        >
                          <p className="text-amber-600 text-xs mb-2">
                            Required Amount
                          </p>
                          <motion.p
                            className="text-2xl font-serif text-amber-800"
                            key={amount}
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring" }}
                          >
                            {(
                              exchange(Number(handleVipPrice(selectedVip)))
                                .value -
                              (exchange(Number(userBalance)).value +
                                exchange(handleVipPrice(vipLevel)).value)
                            ).toFixed(2)}{" "}
                            <span className="text-sm font-light text-amber-400">
                              {exchange(Number(userBalance)).currency}
                            </span>
                          </motion.p>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </motion.div>

          {/* Payment Method Card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredCard("payment")}
            onHoverEnd={() => setHoveredCard(null)}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-orange-400/0"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: hoveredCard === "payment" ? 360 : 0 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center"
              >
                <span className="text-white">💳</span>
              </motion.div>
              <h2 className="text-xl font-serif text-amber-800">
                Payment Details
              </h2>
            </div>

            <div className="space-y-4">
              {/* Bank Selection */}
              <div className="space-y-2">
                <Label className="text-amber-700">Select Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(value: string) => {
                    setPaymentMethod(value);
                    setOwner(
                      bankInfo.find((b) => b.bankName === value)?.owner || "",
                    );
                  }}
                >
                  <SelectTrigger className="bg-white border-amber-200 text-amber-700 h-12 rounded-xl">
                    <SelectValue placeholder="Choose payment method" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-amber-200">
                    {bankInfo.map((method) => (
                      <SelectItem
                        key={method.id}
                        value={method.bankName}
                        className="text-amber-700 hover:bg-amber-50"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            className="w-6 h-6 rounded-full"
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
                    className="space-y-2"
                  >
                    <Label className="text-amber-700">Account Number</Label>
                    <div className="relative">
                      <Input
                        value={accountNumber}
                        readOnly
                        className="bg-amber-50/50 border-amber-200 text-amber-800 h-12 pr-12"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={handleCopy}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-600 hover:bg-amber-100 p-2 rounded-full"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Receipt Upload */}
              <div className="space-y-3 pt-2">
                <Label className="text-amber-700 flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Upload Payment Receipt
                </Label>

                {!file ? (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="border-2 border-dashed border-amber-200 rounded-xl p-6 text-center hover:border-amber-300 transition-colors bg-amber-50/30"
                  >
                    <input
                      type="file"
                      id="receipt"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <label htmlFor="receipt" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                        >
                          <FileUp className="w-6 h-6 text-amber-500" />
                        </motion.div>
                        <p className="text-amber-800 font-medium mb-1">
                          Upload Payment Proof
                        </p>
                        <p className="text-amber-400 text-sm mb-3">
                          Screenshot or photo of transaction
                        </p>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm shadow-md"
                        >
                          Choose File
                        </motion.div>
                      </div>
                    </label>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-amber-50/50 rounded-xl p-4 border border-amber-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-medium text-amber-800">
                            {file.name.length > 20
                              ? file.name.slice(0, 20) + "..."
                              : file.name}
                          </p>
                          <p className="text-amber-400 text-xs">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleRemoveFile}
                        className="w-8 h-8 rounded-full bg-rose-100 hover:bg-rose-200 flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4 text-rose-500" />
                      </motion.button>
                    </div>

                    {previewUrl && file.type.startsWith("image/") && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg overflow-hidden border border-amber-200"
                      >
                        <img
                          src={previewUrl}
                          alt="Receipt preview"
                          className="w-full h-auto"
                        />
                      </motion.div>
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
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                    <span className="text-white">📊</span>
                  </div>
                  <h2 className="text-xl font-serif text-amber-800">
                    Deposit Summary
                  </h2>
                </div>

                <div className="space-y-3">
                  <motion.div
                    className="flex justify-between text-amber-700"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <span>Deposit Amount:</span>
                    <motion.span
                      className="font-serif font-bold"
                      key={amount}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      {exchange(Number(amount)).value}{" "}
                      {exchange(Number(amount)).currency}
                    </motion.span>
                  </motion.div>

                  <motion.div
                    className="flex justify-between text-amber-700"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span>Processing Fee:</span>
                    <span className="font-serif text-emerald-600 font-medium">
                      FREE
                    </span>
                  </motion.div>

                  <motion.div
                    className="border-t border-amber-200 pt-3 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex justify-between text-amber-800 font-serif text-lg">
                      <span>Total:</span>
                      <motion.span
                        className="text-amber-900 font-bold"
                        key={amount}
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      >
                        {exchange(Number(amount)).value}{" "}
                        {exchange(Number(amount)).currency}
                      </motion.span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              disabled={!amount || !paymentMethod || !file || isSubmitting}
              onClick={handleDeposit}
              className="w-full h-14 text-lg font-serif bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 relative z-10">
                  <span>💰</span>
                  <span>Confirm Deposit</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
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
