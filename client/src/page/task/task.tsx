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
  // Zap,
  Gift,
  Play,
  Lock,
  // Sparkles,
  RotateCw,
  // Target,
  Star,
  // Flame,
  Hand,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToUSDT } from "@/components/Exchange";
import { motion, AnimatePresence } from "framer-motion";
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

  const handleMouseDown = (taskId: number) => {
    // Only handle mouse events on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
      startHold(taskId);
    }
  };

  const handleMouseUp = () => {
    if (window.matchMedia("(pointer: fine)").matches && isHolding) {
      cancelHold();
    }
  };

  const handleMouseLeave = () => {
    if (window.matchMedia("(pointer: fine)").matches && isHolding) {
      cancelHold();
    }
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
    <div className="min-h-screen  py-6 px-3 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl animate-pulse delay-1000 -z-10"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-lg shadow-amber-200 flex items-center justify-center animate-float">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-serif text-amber-800 mb-1">
            Daily Task
          </h1>
          <p className="text-sm text-amber-500">
            Complete the task to earn rewards
          </p>
        </motion.div>

        {/* VIP Status Card - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 p-4 mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-amber-600 text-xs">VIP Level</p>
                <p className="text-xl font-bold text-amber-900">
                  VIP {vipLevels}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-amber-600 text-xs">Reward</p>
              <p className="text-lg font-bold text-emerald-600">
                {taskIncome} ETB
              </p>
              <p className="text-[10px] text-amber-500">
                {ToUSDT(taskIncome)} USDT
              </p>
            </div>
          </div>
        </motion.div>

        <TaskStatusChecker onTimeIsUp={handleTimeIsUp} />

        {hasTasks && mainTask ? (
          <>
            {/* Main Task Card - Mobile Optimized */}
            <motion.div
              key={mainTask.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative"
            >
              {/* Main Card */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-amber-200 overflow-hidden">
                {/* Top Gradient Bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"></div>

                <div className="p-5">
                  {/* Task Header */}
                  <div className="text-center mb-6">
                    <div className="inline-block px-3 py-1 bg-amber-100 rounded-full border border-amber-200 mb-2">
                      <span className="text-[10px] font-medium text-amber-700 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        VIP {vipLevels} Exclusive
                      </span>
                    </div>
                    <p className="text-amber-500 text-xs flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" />
                      Complete daily to earn rewards
                    </p>
                  </div>

                  {/* Interactive Circle - Mobile Optimized */}
                  <div className="flex flex-col items-center justify-center mb-6">
                    <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                      {/* Outer Rotating Ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-3 border-amber-200"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />

                      {/* Progress Ring */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                          cx={window.innerWidth < 640 ? "80" : "96"}
                          cy={window.innerWidth < 640 ? "80" : "96"}
                          r={window.innerWidth < 640 ? "74" : "90"}
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="4"
                          strokeDasharray={
                            2 * Math.PI * (window.innerWidth < 640 ? 74 : 90)
                          }
                          strokeDashoffset={
                            2 *
                            Math.PI *
                            (window.innerWidth < 640 ? 74 : 90) *
                            (1 - holdProgress / 100)
                          }
                          className="transition-all duration-100"
                          style={{
                            transition: "stroke-dashoffset 0.1s linear",
                          }}
                        />
                      </svg>

                      {/* Inner Circle with Icon */}
                      <motion.div
                        className={`absolute inset-2 rounded-full flex items-center justify-center touch-none select-none
                          ${
                            getTaskStatus(mainTask.id)
                              ? "bg-emerald-100"
                              : isTaskProcessing(mainTask.id)
                                ? "bg-amber-100"
                                : activeTaskId === mainTask.id
                                  ? "bg-gradient-to-br from-amber-400 to-orange-400 scale-95"
                                  : "bg-gradient-to-br from-amber-400 to-orange-400"
                          }`}
                        onTouchStart={(e) => handleTouchStart(mainTask.id, e)}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchCancel}
                        onMouseDown={() => handleMouseDown(mainTask.id)}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        style={{ touchAction: "none", userSelect: "none" }}
                      >
                        <AnimatePresence mode="wait">
                          {getTaskStatus(mainTask.id) ? (
                            <motion.div
                              key="completed"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500" />
                            </motion.div>
                          ) : isTaskProcessing(mainTask.id) ? (
                            <motion.div
                              key="processing"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <RotateCw className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500" />
                            </motion.div>
                          ) : activeTaskId === mainTask.id ? (
                            <motion.div
                              key="holding"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Hand className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="ready"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              whileHover={{ rotate: 10 }}
                            >
                              <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-1" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Hold Progress Text */}
                      <AnimatePresence>
                        {activeTaskId === mainTask.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                          >
                            <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-medium border border-amber-200">
                              {Math.round(holdProgress)}%
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Instruction Text */}
                    <div className="mt-8 text-center">
                      <p className="text-amber-600 text-xs flex items-center justify-center gap-1">
                        <Hand className="w-3 h-3" />
                        Touch and hold the circle for 5 seconds
                      </p>
                    </div>

                    {/* Reward Badge */}
                    <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200">
                      <Gift className="w-3 h-3 text-amber-500" />
                      <span className="text-xs font-medium text-amber-700">
                        Earn {taskIncome} ETB
                      </span>
                    </div>
                  </div>

                  {/* Task Status Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-amber-100">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          getTaskStatus(mainTask.id)
                            ? "bg-emerald-500"
                            : isTaskProcessing(mainTask.id) ||
                                activeTaskId === mainTask.id
                              ? "bg-amber-500 animate-pulse"
                              : "bg-amber-500"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
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
                              ? `Holding... ${Math.round(holdProgress)}%`
                              : "Ready"}
                      </span>
                    </div>

                    {getTaskStatus(mainTask.id) && (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-[10px]">Claimed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200 p-6 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center border-2 border-amber-200">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-lg font-serif text-amber-800 mb-2">
              No Tasks Available
            </h3>
            <p className="text-amber-600 text-sm mb-4">
              Deposit and upgrade your VIP level to unlock tasks
            </p>
            <button
              onClick={() => navigate("/deposit")}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-sm font-medium shadow-md"
            >
              Deposit Now
            </button>
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}
