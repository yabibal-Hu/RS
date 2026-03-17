import { useEffect, useState, useRef } from "react";
import TaskStatusChecker from "@/components/Countdown/TaskStatusChecker";
import { Loader } from "@/components/Loading";
import { SettingService } from "@/services/settingService";
import { UserService } from "@/services/userService";
import {
  Crown,
  CheckCircle,
  Clock,
  Award,
  Gift,
  Play,
  Lock,
  RotateCw,
  Star,
  Hand,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToUSDT } from "@/components/Exchange";
import { showToast } from "@/utils/toast";

interface TaskItem {
  id: number;
  taskInfoId: number;
  status: string;
  updatedAt: string;
  userId: string;
}

interface SystemTaskInfo {
  id: number;
  taskName: string;
  incomePerTask: number;
  logoDir: string;
  taskId: string;
}

export default function TaskPage() {
  const [taskInfo, setTaskInfo] = useState<SystemTaskInfo[]>([]);
  const [userTasks, setUserTasks] = useState<TaskItem[]>([]);
  const [taskIncome, setTaskIncome] = useState(0);
  const [vipLevels, setVipLevels] = useState("0");
  const [fetchData, setFetchData] = useState(false);
  const [timeIsUp, setTimeIsUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const [processingTasks, setProcessingTasks] = useState<Set<number>>(
    new Set(),
  );

  const navigate = useNavigate();

  // Fetch system task info
  useEffect(() => {
    const systemTaskInfo = async () => {
      try {
        const response = await SettingService.taskInfo();
        setTaskInfo(response);
      } catch (error) {
        console.error("Error fetching task info:", error);
      }
    };
    systemTaskInfo();
  }, []);

  const handleTimeIsUp = () => {
    setTimeIsUp(true);
    setFetchData((prev) => !prev);
  };

  // Fetch user tasks and update state
  useEffect(() => {
    const fetchTaskInfo = async () => {
      try {
        setLoading(true);
        const response = await UserService.getTasks(timeIsUp);
        const userData = response.data;

        if (userData && userData.profile && userData.profile.vip) {
          const userTasks = Array.isArray(userData.task) ? userData.task : [];
          setUserTasks(userTasks);
          setTaskIncome(userData.profile.vip.incomePerTask);
          setVipLevels(userData.profile.vip.name);
        }
      } catch (error: any) {
        showToast.error(error.message);
        console.error("Fetch task error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskInfo();
  }, [fetchData, timeIsUp]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, []);

  const startHold = (taskId: number) => {
    // Don't start if task is completed or processing
    if (getTaskStatus(taskId) || isTaskProcessing(taskId)) return;

    // Don't start if already holding
    if (isHolding) return;

    console.log("Hold started for task:", taskId);

    setActiveTaskId(taskId);
    setIsHolding(true);
    setHoldProgress(0);

    // Start progress animation - updates every 50ms
    let progress = 0;
    progressIntervalRef.current = setInterval(() => {
      progress += 1; // 1% every 50ms = 5 seconds for 100%
      if (progress <= 100) {
        setHoldProgress(progress);
      }
    }, 50); // 50ms * 100 = 5000ms (5 seconds)

    // Set timer for task completion
    holdTimerRef.current = setTimeout(() => {
      console.log("Hold complete for task:", taskId);
      completeHold(taskId);
    }, 5000);
  };

  const completeHold = (taskId: number) => {
    // Clear all timers
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    // Reset hold state
    setActiveTaskId(null);
    setIsHolding(false);
    setHoldProgress(0);

    // Execute task
    handleToggleTask(taskId);
  };

  const cancelHold = () => {
    console.log("Hold cancelled");

    // Clear all timers
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    // Reset hold state
    setActiveTaskId(null);
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleTouchStart = (taskId: number, e: React.TouchEvent) => {
    e.preventDefault(); // Prevent page scroll
    startHold(taskId);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isHolding) {
      cancelHold();
    }
  };

  const handleTouchCancel = (e: React.TouchEvent) => {
    e.preventDefault();
    cancelHold();
  };

  const handleToggleTask = async (taskId: number) => {
    const task = userTasks.find((t) => t.taskInfoId === taskId);

    if (task?.status === "1") return;
    if (processingTasks.has(taskId)) return;

    setProcessingTasks((prev) => new Set(prev).add(taskId));

    try {
      const response = await UserService.makeTask(taskId);

      if (response.success) {
        showToast.success(`🎉 Task completed! You earned ${taskIncome} ETB`);

        setUserTasks((prev) =>
          prev.map((taskItem) =>
            taskItem.taskInfoId === taskId
              ? { ...taskItem, status: "1" }
              : taskItem,
          ),
        );

        setFetchData((prev) => !prev);
      } else {
        showToast.error(response.error || "Failed to complete task");
      }
    } catch (error: any) {
      showToast.error(error.message || "An error occurred");
      console.error("Task completion error:", error);
    } finally {
      setProcessingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const getTaskStatus = (taskInfoId: number) => {
    const task = userTasks.find((t) => t.taskInfoId === taskInfoId);
    return task?.status === "1";
  };

  const isTaskProcessing = (taskId: number) => {
    return processingTasks.has(taskId);
  };

  const hasTasks = taskInfo.length > 0 && taskIncome > 0;
  const mainTask = taskInfo[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 px-3 relative">
      {/* Single static background element */}
      <div className="fixed top-20 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/5 to-orange-400/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header - Static */}
        <div className="mb-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-md flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-xl font-serif text-amber-800 mb-0.5">
            Daily Task
          </h1>
          <p className="text-xs text-amber-500">
            Complete the task to earn rewards
          </p>
        </div>

        {/* VIP Status Card - Static */}
        <div className="bg-white/95 rounded-lg shadow border border-amber-200 p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-amber-600 text-[10px]">VIP Level</p>
                <p className="text-lg font-bold text-amber-900">
                  VIP {vipLevels}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-amber-600 text-[10px]">Reward</p>
              <p className="text-base font-bold text-emerald-600">
                {taskIncome} ETB
              </p>
              <p className="text-[8px] text-amber-500">
                {ToUSDT(taskIncome)} USDT
              </p>
            </div>
          </div>
        </div>

        <TaskStatusChecker onTimeIsUp={handleTimeIsUp} />

        {hasTasks && mainTask ? (
          <>
            {/* Main Task Card - Static */}
            <div className="relative">
              {/* Main Card */}
              <div className="relative bg-white/95 rounded-lg shadow border-2 border-amber-200 overflow-hidden">
                {/* Top Gradient Bar */}
                <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>

                <div className="p-4">
                  {/* Task Header */}
                  <div className="text-center mb-4">
                    <div className="inline-block px-2 py-0.5 bg-amber-100 rounded-full border border-amber-200 mb-1.5">
                      <span className="text-[8px] font-medium text-amber-700 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5" />
                        VIP {vipLevels} Exclusive
                      </span>
                    </div>
                    <p className="text-amber-500 text-[10px] flex items-center justify-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      Complete daily to earn rewards
                    </p>
                  </div>

                  {/* Interactive Circle - Mobile Optimized */}
                  <div className="flex flex-col items-center justify-center mb-4">
                    <div className="relative w-36 h-36">
                      {/* Simple static ring */}
                      <div className="absolute inset-0 rounded-full border-3 border-amber-200"></div>

                      {/* Progress Ring */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                          cx="72"
                          cy="72"
                          r="68"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="4"
                          strokeDasharray={2 * Math.PI * 68}
                          strokeDashoffset={
                            2 * Math.PI * 68 * (1 - holdProgress / 100)
                          }
                          className="transition-all duration-100"
                          style={{
                            transition: "stroke-dashoffset 0.1s linear",
                          }}
                        />
                      </svg>

                      {/* Inner Circle with Icon */}
                      <div
                        className={`absolute inset-2 rounded-full flex items-center justify-center touch-none select-none cursor-pointer
                          ${
                            getTaskStatus(mainTask.id)
                              ? "bg-emerald-100"
                              : isTaskProcessing(mainTask.id)
                                ? "bg-amber-100"
                                : activeTaskId === mainTask.id
                                  ? "bg-gradient-to-br from-amber-500 to-orange-500 scale-95"
                                  : "bg-gradient-to-br from-amber-400 to-orange-400"
                          }`}
                        onTouchStart={(e) => handleTouchStart(mainTask.id, e)}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchCancel}
                        style={{ touchAction: "none", userSelect: "none" }}
                      >
                        {getTaskStatus(mainTask.id) ? (
                          <CheckCircle className="w-9 h-9 text-emerald-500" />
                        ) : isTaskProcessing(mainTask.id) ? (
                          <RotateCw className="w-9 h-9 text-amber-500 animate-spin" />
                        ) : activeTaskId === mainTask.id ? (
                          <Hand className="w-9 h-9 text-white" />
                        ) : (
                          <Play className="w-9 h-9 text-white ml-1" />
                        )}
                      </div>

                      {/* Hold Progress Text */}
                      {activeTaskId === mainTask.id && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[8px] font-medium border border-amber-200">
                            {Math.round(holdProgress)}%
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Instruction Text */}
                    <div className="mt-5 text-center">
                      <p className="text-amber-600 text-[10px] flex items-center justify-center gap-0.5">
                        <Hand className="w-2.5 h-2.5" />
                        Touch and hold for 5 seconds
                      </p>
                    </div>

                    {/* Reward Badge */}
                    <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200">
                      <Gift className="w-2.5 h-2.5 text-amber-500" />
                      <span className="text-[10px] font-medium text-amber-700">
                        Earn {taskIncome} ETB
                      </span>
                    </div>
                  </div>

                  {/* Task Status Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-amber-100">
                    <div className="flex items-center gap-1">
                      <div
                        className={`w-1 h-1 rounded-full ${
                          getTaskStatus(mainTask.id)
                            ? "bg-emerald-500"
                            : isTaskProcessing(mainTask.id) ||
                                activeTaskId === mainTask.id
                              ? "bg-amber-500"
                              : "bg-amber-500"
                        }`}
                      />
                      <span
                        className={`text-[10px] font-medium ${
                          getTaskStatus(mainTask.id)
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {getTaskStatus(mainTask.id)
                          ? "Completed"
                          : isTaskProcessing(mainTask.id)
                            ? "Processing..."
                            : activeTaskId === mainTask.id
                              ? `Holding ${Math.round(holdProgress)}%`
                              : "Ready"}
                      </span>
                    </div>

                    {getTaskStatus(mainTask.id) && (
                      <div className="flex items-center gap-0.5 text-emerald-600">
                        <CheckCircle className="w-2.5 h-2.5" />
                        <span className="text-[8px]">Claimed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white/95 rounded-lg shadow border border-amber-200 p-5 text-center">
            <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center border-2 border-amber-200">
              <Lock className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-base font-serif text-amber-800 mb-1">
              No Tasks Available
            </h3>
            <p className="text-amber-600 text-xs mb-3">
              Deposit and upgrade your VIP level to unlock tasks
            </p>
            <button
              onClick={() => navigate("/deposit")}
              className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 active:from-amber-500 active:to-orange-500 text-white rounded-lg text-xs font-medium shadow-sm"
            >
              Deposit Now
            </button>
          </div>
        )}
      </div>

      <style>{`
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}
