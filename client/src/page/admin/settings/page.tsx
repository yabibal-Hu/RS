import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Building,
  Settings,
  Target,
  Crown,
} from "lucide-react";
import { SettingService } from "@/services/settingService";
// const API_URL = (import.meta.env.VITE_IMAGE_BASE_URL as string) || "";
interface Bank {
  id: number;
  bankName: string;
  accNumber: string;
  owner: string;
  status: string;
  logo: string;
}

interface SettingsForm {
  commission?: string;
  withdrawFee?: string;
  minWithdraw?: number;
  maxWithdraw?: number;
  dallyDepositLimit?: number;
  dallyWithdrawLimit?: number;
  maxDeposit?: number;
  minDeposit?: number;
  dallyDepositLimitAmount?: number;
  dallyWithdrawLimitAmount?: number;
  // other properties...
}

interface TaskInfo {
  id: number;
  taskId: string;
  taskName: string;
  description?: string;
  incomePerTask: number;
  // logoUrl?: string;
  logoDir: File | null;
}

interface Vip {
  id: number;
  name: string;
  price: number;
  dailyIncome: number;
  incomePerTask: number;
  commission: number;
  description?: string;
  logoDir: File | null;
  dailyTask?: number;
}

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState("settings");
  const [banks, setBanks] = useState<Bank[]>([]);
  // const [settings, setSettings] = useState<Setting | null>(null);
  const [taskInfo, setTaskInfo] = useState<TaskInfo[]>([]);
  const [vips, setVips] = useState<Vip[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [settingsForm, setSettingsForm] = useState<SettingsForm>({});
  const [bankForm, setBankForm] = useState<{
    bankName: string;
    accNumber: string;
    owner: string;
    status: string;
    logo: string | File | null;
  }>({
    bankName: "",
    accNumber: "",
    owner: "",
    status: "BOTH",
    logo: null,
  });
  const [taskInfoForm, setTaskInfoForm] = useState<{
    taskId: string;
    taskName: string;
    description: string;
    incomePerTask: number;
    logoDir: string | File | null;
  }>({
    taskId: "",
    taskName: "",
    description: "",
    incomePerTask: 0,
    logoDir: null, // Initial value can still be null
  });
  const [vipForm, setVipForm] = useState<{
    name: string;
    price: number;
    dailyIncome: number;
    incomePerTask: number;
    commission: number;
    description: string;
    logoDir: string | File | null;
    dailyTask: number;
  }>({
    name: "",
    price: 0,
    dailyIncome: 0,
    incomePerTask: 0,
    commission: 0,
    description: "",
    logoDir: null,
    dailyTask: 0,
  });
  // Edit states
  const [editingBank, setEditingBank] = useState<number | null>(null);
  const [editingTaskInfo, setEditingTaskInfo] = useState<number | null>(null);
  const [editingVip, setEditingVip] = useState<number | null>(null);
  // Load all data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [banksRes, settingsRes, taskInfoRes, vipsRes] = await Promise.all([
        SettingService.getBanks(),
        SettingService.getSettings(),
        SettingService.getTaskInfo(),
        SettingService.getVips(),
      ]);
      if (banksRes.success) setBanks(banksRes.banks);
      if (settingsRes.success) {
        // setSettings(settingsRes.data);
        setSettingsForm(settingsRes.data || {});
      }
      if (taskInfoRes.success) setTaskInfo(taskInfoRes.data);
      if (vipsRes.success) setVips(vipsRes.data);
    } catch (error) {
      toast.error("Failed to load settings data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Settings handlers
  const handleSaveSettings = async () => {
    try {
      const response = await SettingService.updateSettings(settingsForm);
      if (response.success) {
        // setSettings(response.data);
        toast.success("Settings updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  // Bank handlers
  const handleCreateBank = async () => {
    try {
      const formData = new FormData();
      formData.append("bankName", bankForm.bankName);
      formData.append("accNumber", bankForm.accNumber);
      formData.append("owner", bankForm.owner);
      formData.append("status", bankForm.status);
      if (bankForm.logo) formData.append("logo", bankForm.logo);

      const response = await SettingService.createBank(formData);
      if (response.success) {
        setBanks((prev) => [...prev, response.data]);
        setBankForm({ bankName: "", accNumber: "", owner: "", status: "BOTH", logo: null });
        toast.success("Bank created successfully");
      }
    } catch (error) {
      toast.error("Failed to create bank");
    }
  };

  const handleUpdateBank = async (id: number) => {
    try {
       const formData = new FormData();
      formData.append("bankName", bankForm.bankName);
      formData.append("accNumber", bankForm.accNumber);
      formData.append("owner", bankForm.owner);
      formData.append("status", bankForm.status);
      if (bankForm.logo) formData.append("logo", bankForm.logo);


      const response = await SettingService.updateBank(id, formData);
      if (response.success) {
        setBanks((prev) =>
          prev.map((bank) => (bank.id === id ? response.data : bank))
        );
        setEditingBank(null);
        setBankForm({ bankName: "", accNumber: "", owner: "", status: "BOTH", logo: null });
        toast.success("Bank updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update bank");
    }
  };

  const handleDeleteBank = async (id: number) => {
    try {
      const response = await SettingService.deleteBank(id);
      if (response.success) {
        setBanks((prev) => prev.filter((bank) => bank.id !== id));
        toast.success("Bank deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete bank");
    }
  };

  // TaskInfo handlers
  const handleCreateTaskInfo = async () => {
    try {
      const formData = new FormData();
      formData.append("taskId", taskInfoForm.taskId);
      formData.append("taskName", taskInfoForm.taskName);
      formData.append("description", taskInfoForm.description);
      formData.append("incomePerTask", taskInfoForm.incomePerTask.toString());

      if (taskInfoForm.logoDir) {
        formData.append("logo", taskInfoForm.logoDir);
      }

      const response = await SettingService.createTaskInfo(formData);
      if (response.success) {
        setTaskInfo((prev) => [...prev, response.data]);
        setTaskInfoForm({
          taskId: "",
          taskName: "",
          description: "",
          incomePerTask: 0,
          logoDir: null,
        });
        toast.success("Task info created successfully");
      }
    } catch (error) {
      toast.error("Failed to create task info");
    }
  };

  const handleUpdateTaskInfo = async (id: number) => {
    try {
      const formData = new FormData();
      formData.append("taskId", taskInfoForm.taskId);
      formData.append("taskName", taskInfoForm.taskName);
      formData.append("description", taskInfoForm.description);
      formData.append("incomePerTask", taskInfoForm.incomePerTask.toString());

      if (taskInfoForm.logoDir) {
        formData.append("logo", taskInfoForm.logoDir);
      }

      const response = await SettingService.updateTaskInfo(id, formData);
      if (response.success) {
        setTaskInfo((prev) =>
          prev.map((task) => (task.id === id ? response.data : task))
        );
        setEditingTaskInfo(null);
        setTaskInfoForm({
          taskId: "",
          taskName: "",
          description: "",
          incomePerTask: 0,
          logoDir: null,
        });
        toast.success("Task info updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update task info");
    }
  };

  const handleDeleteTaskInfo = async (id: number) => {
    try {
      const response = await SettingService.deleteTaskInfo(id);
      if (response.success) {
        setTaskInfo((prev) => prev.filter((task) => task.id !== id));
        toast.success("Task info deleted successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete task info");
    }
  };

  // VIP handlers
  const handleCreateVip = async () => {
    try {
      const formData = new FormData();
      formData.append("name", vipForm.name);
      formData.append("price", vipForm.price.toString());
      formData.append("dailyIncome", vipForm.dailyIncome.toString());
      formData.append("incomePerTask", vipForm.incomePerTask.toString());
      formData.append("commission", vipForm.commission.toString());
      formData.append("description", vipForm.description);
      formData.append("dailyTask", vipForm.dailyTask.toString());

      if (vipForm.logoDir) {
        formData.append("logo", vipForm.logoDir);
      }

      const response = await SettingService.createVip(formData);
      if (response.success) {
        setVips((prev) => [...prev, response.data]);
        setVipForm({
          name: "",
          price: 0,
          dailyIncome: 0,
          incomePerTask: 0,
          commission: 0,
          description: "",
          dailyTask: 0,
          logoDir: null,
        });
        toast.success("VIP level created successfully");
      }
    } catch (error) {
      toast.error("Failed to create VIP level");
    }
  };

  const handleUpdateVip = async (id: number) => {
    try {
      const formData = new FormData();
      formData.append("name", vipForm.name);
      formData.append("price", vipForm.price.toString());
      formData.append("dailyIncome", vipForm.dailyIncome.toString());
      formData.append("incomePerTask", vipForm.incomePerTask.toString());
      formData.append("commission", vipForm.commission.toString());
      formData.append("description", vipForm.description);
      formData.append("dailyTask", vipForm.dailyTask.toString());

      if (vipForm.logoDir) {
        formData.append("logo", vipForm.logoDir);
      }
      const response = await SettingService.updateVip(id, formData);
      if (response.success) {
        setVips((prev) =>
          prev.map((vip) => (vip.id === id ? response.data : vip))
        );
        setEditingVip(null);
        setVipForm({
          name: "",
          price: 0,
          dailyIncome: 0,
          incomePerTask: 0,
          commission: 0,
          description: "",
          logoDir: null,
          dailyTask: 0,
        });
        toast.success("VIP level updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update VIP level");
    }
  };

  const handleDeleteVip = async (id: number) => {
    try {
      const response = await SettingService.deleteVip(id);
      if (response.success) {
        setVips((prev) => prev.filter((vip) => vip.id !== id));
        toast.success("VIP level deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete VIP level");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-200">System Settings</h1>
        <Button
          className="text-gray-200"
          onClick={loadAllData}
          variant="outline"
        >
          Refresh Data
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 sm:grid-cols-4 gap-1 sm:gap-2 bg-gray-600 p-1 rounded-lg shadow-sm border">
          <TabsTrigger
            value="settings"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Platform</span>
            <span className="xs:hidden">Settings</span>
          </TabsTrigger>
          <TabsTrigger
            value="banks"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Building className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Banks</span>
            <span className="xs:hidden">Banks</span>
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Target className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Task Info</span>
            <span className="xs:hidden">Tasks</span>
          </TabsTrigger>
          <TabsTrigger
            value="vips"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">VIP Levels</span>
            <span className="xs:hidden">VIP</span>
          </TabsTrigger>
        </TabsList>

        {/* Platform Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-gray-100">
                  Commission Settings
                </CardTitle>
                <CardDescription>
                  Configure commission rates and structures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-100 font-medium">
                    Commission Rate (%)
                  </label>
                  <Input
                    type="text"
                    value={settingsForm.commission || ""}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        commission: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-100 font-medium">
                    Withdrawal Fee (%)
                  </label>
                  <Input
                    type="text"
                    value={settingsForm.withdrawFee || ""}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        withdrawFee: e.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-gray-100">
                  Withdrawal Settings
                </CardTitle>
                <CardDescription>Configure withdrawal limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-100 font-medium">
                    Minimum Withdrawal
                  </label>
                  <Input
                    type="number"
                    value={settingsForm.minWithdraw || ""}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        minWithdraw: parseInt(e.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-100 font-medium">
                    Maximum Withdrawal
                  </label>
                  <Input
                    type="number"
                    value={settingsForm.maxWithdraw || ""}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        maxWithdraw: parseInt(e.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-gray-100">
                  Deposit Settings
                </CardTitle>
                <CardDescription>Configure deposit limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-100 font-medium">
                    Minimum Deposit
                  </label>
                  <Input
                    type="number"
                    value={settingsForm.minDeposit || ""}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        minDeposit: parseInt(e.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-100 font-medium">
                    Maximum Deposit
                  </label>
                  <Input
                    type="number"
                    value={settingsForm.maxDeposit || ""}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        maxDeposit: parseInt(e.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-gray-100">Daily Limits</CardTitle>
                <CardDescription>
                  Configure daily transaction limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-100 font-medium">
                    Daily Deposit Limit
                  </label>
                  <Input
                    type="number"
                    value={settingsForm.dallyDepositLimit || ""}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        dallyDepositLimit: parseInt(e.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-100 font-medium">
                    Daily Withdrawal Limit
                  </label>
                  <Input
                    type="number"
                    value={settingsForm.dallyWithdrawLimit || ""}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        dallyWithdrawLimit: parseInt(e.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save All Settings
            </Button>
          </div>
        </TabsContent>

        {/* Banks Tab */}
        <TabsContent value="banks" className="space-y-6">
          <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-gray-100">Add New Bank</CardTitle>
              <CardDescription>
                Create a new bank account for deposits/withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Bank Name"
                  value={bankForm.bankName}
                  onChange={(e) =>
                    setBankForm((prev) => ({
                      ...prev,
                      bankName: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Account Number"
                  value={bankForm.accNumber}
                  onChange={(e) =>
                    setBankForm((prev) => ({
                      ...prev,
                      accNumber: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Account Owner"
                  value={bankForm.owner}
                  onChange={(e) =>
                    setBankForm((prev) => ({ ...prev, owner: e.target.value }))
                  }
                />
                {/* Logo Upload */}
                <Input
                  type="file"
                  onChange={(e) =>
                    setBankForm((prev) => ({
                      ...prev,
                      logo: e.target.files?.[0] || null,
                    }))
                  }
                />

                <select
                  value={bankForm.status}
                  onChange={(e) =>
                    setBankForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="border rounded-md px-3 py-2"
                >
                  <option value="DEPOSIT">Deposit Only</option>
                  <option value="WITHDRAW">Withdraw Only</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>
              <Button
                onClick={
                  editingBank
                    ? () => handleUpdateBank(editingBank)
                    : handleCreateBank
                }
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {editingBank ? "Update Bank" : "Add Bank"}
              </Button>
              {editingBank && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingBank(null);
                    setBankForm({
                      bankName: "",
                      accNumber: "",
                      owner: "",
                      status: "BOTH",
                      logo: null,
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel Edit
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-gray-100">
                {/* Bank Accounts ({banks.length || 0}) */}
              </CardTitle>
              <CardDescription>Manage all bank accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {banks?.map((bank) => (
                  <div
                    key={bank.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="font-semibold flex gap-2">
                        {/* <img
                          className="w-8 h-auto"
                          src={`${API_URL}/uploads/system/${bank.logo}`}
                          alt=""
                        /> */}
                        {bank.bankName}
                      </div>
                      <div className="text-sm text-gray-300">
                        Account: {bank.accNumber}
                      </div>
                      <div className="text-sm text-gray-300">
                        Owner: {bank.owner}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          bank.status === "BOTH"
                            ? "default"
                            : bank.status === "DEPOSIT"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {bank.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-300"
                        onClick={() => {
                          setEditingBank(bank.id);
                          setBankForm(bank);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBank(bank.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {banks?.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No banks configured yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Task Info Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-gray-100">Add New Task</CardTitle>
              <CardDescription>
                Create a new task for users to complete
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Task ID"
                  value={taskInfoForm.taskId}
                  onChange={(e) =>
                    setTaskInfoForm((prev) => ({
                      ...prev,
                      taskId: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Task Name"
                  value={taskInfoForm.taskName}
                  onChange={(e) =>
                    setTaskInfoForm((prev) => ({
                      ...prev,
                      taskName: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Description"
                  value={taskInfoForm.description}
                  onChange={(e) =>
                    setTaskInfoForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Income Per Task"
                  value={taskInfoForm.incomePerTask}
                  onChange={(e) =>
                    setTaskInfoForm((prev) => ({
                      ...prev,
                      incomePerTask: parseInt(e.target.value),
                    }))
                  }
                />
                {/* Replace URL input with file input */}
                <div className="md:col-span-1 flex justify-between items-center">
                  <p className="text-sm w-40 text-gray-100 font-medium">
                    Task Logo
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setTaskInfoForm((prev) => ({
                        ...prev,
                        logoDir: e.target.files?.[0] || null,
                      }))
                    }
                    className="mt-1"
                  />
                  {taskInfoForm.logoDir &&
                    typeof taskInfoForm.logoDir !== "string" && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Current Logo:</p>
                        <img
                          src={URL.createObjectURL(taskInfoForm.logoDir)}
                          alt="Current logo"
                          className="w-16 h-16 object-cover rounded mt-1"
                        />
                      </div>
                    )}
                </div>
              </div>
              <Button
                onClick={
                  editingTaskInfo
                    ? () => handleUpdateTaskInfo(editingTaskInfo)
                    : handleCreateTaskInfo
                }
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {editingTaskInfo ? "Update Task" : "Add Task"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-gray-100">
                Available Tasks ({taskInfo.length})
              </CardTitle>
              <CardDescription>Manage all system tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taskInfo.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                       {/* {task.logoDir && (  
                        <img
                          src={`${API_URL}/uploads/system/${task.logoDir}`}
                          alt={task.taskName}
                          className="w-12 h-12 rounded-lg"
                        />
                      )} */}
                      <div>
                        <div className="font-semibold">{task.taskName}</div>
                        <div className="text-sm text-gray-300">
                          ID: {task.taskId}
                        </div>
                        <div className="text-sm text-gray-300">
                          Income: {task.incomePerTask} ETB
                        </div>
                        {task.description && (
                          <div className="text-sm text-gray-300">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-300"
                        onClick={() => {
                          setEditingTaskInfo(task.id);
                          setTaskInfoForm({
                            ...task,
                            description: task.description ?? "",
                            logoDir: task.logoDir ?? "", // Provide a default value if logoDir is undefined
                          });
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTaskInfo(task.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {taskInfo.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No tasks configured yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* VIP Levels Tab */}
        <TabsContent value="vips" className="space-y-6">
          <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-gray-100">Add VIP Level</CardTitle>
              <CardDescription>
                Create a new VIP level with specific benefits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="VIP Name (e.g., 1, 2, 3...)"
                  value={vipForm.name}
                  onChange={(e) =>
                    setVipForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={vipForm.price}
                  onChange={(e) =>
                    setVipForm((prev) => ({
                      ...prev,
                      price: parseInt(e.target.value),
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Daily Income"
                  value={vipForm.dailyIncome}
                  onChange={(e) =>
                    setVipForm((prev) => ({
                      ...prev,
                      dailyIncome: parseInt(e.target.value),
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Income Per Task"
                  value={vipForm.incomePerTask}
                  onChange={(e) =>
                    setVipForm((prev) => ({
                      ...prev,
                      incomePerTask: parseInt(e.target.value),
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Commission (%)"
                  value={vipForm.commission}
                  onChange={(e) =>
                    setVipForm((prev) => ({
                      ...prev,
                      commission: parseInt(e.target.value),
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Daily Tasks"
                  value={vipForm.dailyTask}
                  onChange={(e) =>
                    setVipForm((prev) => ({
                      ...prev,
                      dailyTask: parseInt(e.target.value),
                    }))
                  }
                />
                <Input
                  placeholder="Description"
                  value={vipForm.description}
                  onChange={(e) =>
                    setVipForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="md:col-span-2"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setVipForm((prev) => ({
                      ...prev,
                      logoDir: e.target.files?.[0] || null,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <Button
                onClick={
                  editingVip
                    ? () => handleUpdateVip(editingVip)
                    : handleCreateVip
                }
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {editingVip ? "Update VIP Level" : "Add VIP Level"}
              </Button>
              {vipForm.logoDir && typeof vipForm.logoDir !== "string" && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Current Logo:</p>
                  <img
                    src={URL.createObjectURL(vipForm.logoDir)}
                    alt="Current logo"
                    className="w-16 h-16 object-cover rounded mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-600/80 to-gray-700/80 backdrop-blur-xl border border-slate-800/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-gray-100">
                VIP Levels ({vips.length})
              </CardTitle>
              <CardDescription>
                Manage all VIP levels and their benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vips.map((vip) => (
                  <div
                    key={vip.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {/* {vip.logoDir && (
                        <img
                          src={`${API_URL}/uploads/system/${vip.logoDir}`}
                          alt={`VIP ${vip.name}`}
                          className="w-12 h-12 rounded-lg"
                        />
                      )} */}
                      <div>
                        <div className="font-semibold">VIP {vip.name}</div>
                        <div className="text-sm text-gray-300">
                          Price: {vip.price} ETB
                        </div>
                        <div className="text-sm text-gray-300">
                          Benefits: {vip.dailyIncome} daily, {vip.incomePerTask}{" "}
                          per task, {vip.commission}% commission
                        </div>
                        {vip.description && (
                          <div className="text-sm text-gray-300">
                            {vip.description}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        className="bg-gray-300"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingVip(vip.id);
                          setVipForm({
                            ...vip,
                            logoDir: vip.logoDir ?? "",
                            description: vip.description ?? "",
                            dailyTask:
                              vip.dailyTask !== undefined ? vip.dailyTask : 0, // Add this line
                          });
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteVip(vip.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {vips.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No VIP levels configured yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
