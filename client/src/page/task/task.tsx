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
  Zap,
  Gift,
  Play,
  Lock,
  Sparkles,
  RotateCw,
  Target,
  Star,
  Flame,
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
  const [showHoldInstruction, setShowHoldInstruction] = useState(false);

  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartTimeRef = useRef<number | null>(null);
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

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        clearInterval(holdTimerRef.current);
      }
    };
  }, []);

  const startHold = (taskId: number) => {
    if (activeTaskId !== null) return;

    setActiveTaskId(taskId);
    setHoldProgress(0);
    setShowHoldInstruction(false);
    holdStartTimeRef.current = Date.now();

    holdTimerRef.current = setInterval(() => {
      if (holdStartTimeRef.current) {
        const elapsed = (Date.now() - holdStartTimeRef.current) / 1000; // in seconds
        const progress = Math.min((elapsed / 5) * 100, 100); // 5 seconds hold

        setHoldProgress(progress);

        if (progress >= 100) {
          // Hold complete - execute task
          if (holdTimerRef.current) {
            clearInterval(holdTimerRef.current);
          }
          setActiveTaskId(null);
          setHoldProgress(0);
          handleToggleTask(
            taskId,
            taskInfo.find((t) => t.id === taskId)?.taskName || "Task",
          );
        }
      }
    }, 50); // Update every 50ms for smooth animation
  };

  const cancelHold = () => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
    }
    setActiveTaskId(null);
    setHoldProgress(0);
    setShowHoldInstruction(false);
    holdStartTimeRef.current = null;
  };

  // const handleTaskInteraction = (
  //   taskId: number,
  //   isCompleted: boolean,
  //   isProcessing: boolean,
  // ) => {
  //   if (isCompleted || isProcessing) return;

  //   if (activeTaskId === taskId) {
  //     cancelHold();
  //   } else {
  //     setShowHoldInstruction(true);
  //     setTimeout(() => setShowHoldInstruction(false), 2000);
  //   }
  // };

  const handleToggleTask = async (taskId: number, taskName: string) => {
    const task = userTasks.find((t) => t.taskInfoId === taskId);

    // If already completed, do nothing
    if (task?.status === "1") return;

    // If already processing, do nothing
    if (processingTasks.has(taskId)) return;

    // Add to processing set
    setProcessingTasks((prev) => new Set(prev).add(taskId));

    try {
      const response = await UserService.makeTask(taskId);

      if (response.success) {
        // Show completion popup with confetti effect
        showToast.success(
          `🎉 Task "${taskName}" completed! You earned ${taskIncome} ETB (${ToUSDT(taskIncome)} USDT)`);

        // Update local state
        setUserTasks((prev) =>
          prev.map((taskItem) =>
            taskItem.taskInfoId === taskId
              ? { ...taskItem, status: "1" }
              : taskItem,
          ),
        );

        // Trigger refresh
        setFetchData((prev) => !prev);
      } else {
        showToast.error(response.error || "Failed to complete task");
      }
    } catch (error: any) {
      showToast.error(error.message || "An error occurred");
      console.error("Task completion error:", error);
    } finally {
      // Remove from processing set
      setProcessingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  // Get task status
  const getTaskStatus = (taskInfoId: number) => {
    const task = userTasks.find((t) => t.taskInfoId === taskInfoId);
    return task?.status === "1";
  };

  // Check if task is processing
  const isTaskProcessing = (taskId: number) => {
    return processingTasks.has(taskId);
  };

  // Check if user has any tasks available
  const hasTasks = taskInfo.length > 0 && taskIncome > 0;

  // const completedTasks = userTasks.filter((task) => task.status === "1").length;
  // const totalTasks = taskInfo.length;

  // Get the first task (since there's only one)
  const mainTask = taskInfo[0];

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen ">
          <Loader />;
        </div>
      );
    }

  return (
    <div className="min-h-screen  py-8 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl animate-pulse -z-10"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-3xl animate-pulse delay-1000 -z-10"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-5">
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
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* <TaskStatusChecker onTimeIsUp={handleTimeIsUp} /> */}

      <AnimatePresence>
        {timeIsUp && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.5 }}
            className="max-w-2xl mx-auto mb-4"
          >
            <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white p-4 rounded-xl text-center shadow-lg relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <Zap className="w-5 h-5 inline mr-2" />
              New tasks are available!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header with Sparkle Effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex justify-center mb-4 relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-24 h-24 border-2 border-amber-300/30 rounded-full"
            />
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full shadow-lg shadow-amber-200 flex items-center justify-center animate-float">
              <Award className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-serif text-amber-800 mb-2">
            Daily Task
          </h1>
          <p className="text-amber-500">Complete the task to earn rewards</p>
        </motion.div>

        {/* VIP Status Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6 mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-2xl"></div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-amber-600 text-sm">VIP Level</p>
                <p className="text-2xl font-bold text-amber-900">
                  VIP {vipLevels}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-amber-600 text-sm">Task Reward</p>
              <p
                className="text-xl font-bold text-emerald-600"
              >
                {taskIncome} ETB
              </p>
              <p className="text-xs text-amber-500">
                {ToUSDT(taskIncome)} USDT
              </p>
            </div>
          </div>
        </motion.div>

        <TaskStatusChecker onTimeIsUp={handleTimeIsUp} />

        {hasTasks && mainTask ? (
          <>
            {/* Main Task Card with Hold Circle */}
            <motion.div
              key={mainTask.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative mb-8"
            >
              {/* Glow Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-3xl blur-xl"></div>

              {/* Main Card */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-amber-200 overflow-hidden">
                {/* Animated Background Pattern */}
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

                {/* Top Gradient Bar */}
                <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 animate-gradient-x"></div>

                <div className="p-8">
                  {/* Task Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      className="inline-block px-4 py-1 bg-amber-100 rounded-full border border-amber-200 mb-3"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-xs font-medium text-amber-700 flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        VIP {vipLevels} Exclusive
                        <Sparkles className="w-3 h-3" />
                      </span>
                    </motion.div>

                    {/* <h2 className="text-2xl font-serif text-amber-900 mb-2">
                      {mainTask.taskName}
                    </h2> */}
                    <p className="text-amber-500 text-sm flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      Complete daily to earn rewards
                    </p>
                  </div>

                  {/* Interactive Circle */}
                  <div className="flex flex-col items-center justify-center mb-8">
                    <div className="relative w-48 h-48">
                      {/* Outer Rotating Ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-amber-200"
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
                          cx="96"
                          cy="96"
                          r="90"
                          fill="none"
                          stroke="#fcd34d"
                          strokeWidth="4"
                          strokeDasharray={2 * Math.PI * 90}
                          strokeDashoffset={
                            2 * Math.PI * 90 * (1 - holdProgress / 100)
                          }
                          className="transition-all duration-100"
                        />
                      </svg>

                      {/* Inner Circle with Icon */}
                      <motion.div
                        className={`absolute inset-2 rounded-full flex items-center justify-center cursor-pointer transition-all
                          ${
                            getTaskStatus(mainTask.id)
                              ? "bg-emerald-100"
                              : isTaskProcessing(mainTask.id)
                                ? "bg-amber-100"
                                : activeTaskId === mainTask.id
                                  ? "bg-gradient-to-br from-amber-400 to-orange-400 scale-95"
                                  : "bg-gradient-to-br from-amber-400 to-orange-400 hover:scale-105"
                          }`}
                        whileHover={{
                          scale: getTaskStatus(mainTask.id) ? 1 : 1.05,
                        }}
                        whileTap={{
                          scale: getTaskStatus(mainTask.id) ? 1 : 0.95,
                        }}
                        onMouseDown={() =>
                          !getTaskStatus(mainTask.id) &&
                          !isTaskProcessing(mainTask.id) &&
                          startHold(mainTask.id)
                        }
                        onMouseUp={cancelHold}
                        onMouseLeave={cancelHold}
                        onTouchStart={() =>
                          !getTaskStatus(mainTask.id) &&
                          !isTaskProcessing(mainTask.id) &&
                          startHold(mainTask.id)
                        }
                        onTouchEnd={cancelHold}
                        onTouchCancel={cancelHold}
                      >
                        <AnimatePresence mode="wait">
                          {getTaskStatus(mainTask.id) ? (
                            <motion.div
                              key="completed"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <CheckCircle className="w-12 h-12 text-emerald-500" />
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
                              <RotateCw className="w-12 h-12 text-amber-500" />
                            </motion.div>
                          ) : activeTaskId === mainTask.id ? (
                            <motion.div
                              key="holding"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                            >
                              <Target className="w-12 h-12 text-white" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="ready"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              whileHover={{ rotate: 10 }}
                            >
                              <Play className="w-12 h-12 text-white ml-1" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Hold Progress Text */}
                      <AnimatePresence>
                        {activeTaskId === mainTask.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                          >
                            <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium border border-amber-200">
                              Hold {Math.round(holdProgress)}% complete
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Instruction Text */}
                    <AnimatePresence>
                      {showHoldInstruction &&
                        !getTaskStatus(mainTask.id) &&
                        !isTaskProcessing(mainTask.id) && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-6 text-center"
                          >
                            <p className="text-amber-600 text-sm flex items-center justify-center gap-2">
                              <Flame className="w-4 h-4 text-orange-500" />
                              Hold the circle for 5 seconds to complete task
                            </p>
                          </motion.div>
                        )}
                    </AnimatePresence>
                    {/* hold instruction */}
                    <p className="text-amber-600 text-sm flex items-center justify-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      Hold the circle for 5 seconds to complete task
                    </p>

                    {/* Reward Badge */}
                    <div
                      className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200"
                     
                    >
                      <Gift className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-700">
                        Earn {taskIncome} ETB ({ToUSDT(taskIncome)} USDT)
                      </span>
                    </div>
                  </div>

                  {/* Task Status Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          getTaskStatus(mainTask.id)
                            ? "bg-emerald-500"
                            : isTaskProcessing(mainTask.id)
                              ? "bg-amber-500 animate-pulse"
                              : "bg-amber-500 animate-pulse"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          getTaskStatus(mainTask.id)
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {getTaskStatus(mainTask.id)
                          ? "Completed today"
                          : isTaskProcessing(mainTask.id)
                            ? "Processing..."
                            : "Ready to complete"}
                      </span>
                    </div>

                    {getTaskStatus(mainTask.id) && (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Reward claimed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {/* <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-6">
                <h2 className="text-xl font-serif text-amber-800 flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Today's Progress
                </h2>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-amber-700">Completion Rate</span>
                  <span className="text-amber-900 font-bold">
                    {completedTasks}/{totalTasks}
                  </span>
                </div>

                <div className="h-3 bg-amber-100 rounded-full overflow-hidden mb-3">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(completedTasks / totalTasks) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-amber-500">
                    {completedTasks === totalTasks
                      ? "All tasks completed! 🎉"
                      : `${totalTasks - completedTasks} task remaining`}
                  </span>
                  <span className="text-amber-600 font-medium">
                    {((completedTasks / totalTasks) * 100).toFixed(0)}%
                  </span>
                </div>
              </div> */}

              {/* Total Earnings with Animation */}
              {/* <motion.div
                className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-6 border border-amber-300 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-amber-700 text-sm mb-1 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      Total Earnings
                    </p>
                    <p className="text-3xl font-bold text-amber-900">
                      {ToUSDT(completedTasks * taskIncome)} USDT
                    </p>
                    <p className="text-amber-600 text-sm mt-1">
                      {completedTasks * taskIncome} ETB
                    </p>
                  </div>
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Gift className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
              </motion.div> */}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-orange-400/5"></div>

            <motion.div
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center border-2 border-amber-200"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Lock className="w-12 h-12 text-amber-400" />
            </motion.div>

            <h3 className="text-2xl font-serif text-amber-800 mb-3">
              {loading ? "Loading Tasks..." : "No Tasks Available"}
            </h3>

            <p className="text-amber-600 mb-6">
              {loading
                ? "Please wait while we load your tasks..."
                : "Deposit and upgrade your VIP level to unlock tasks and start earning."}
            </p>

            {!loading && (
              <motion.button
                onClick={() => navigate("/deposit")}
                className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Deposit Now</span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Quick Stats Footer */}
        {/* {hasTasks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 pt-4 border-t border-amber-200"
          >
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Tasks", value: totalTasks, icon: "📋" },
                { label: "Completed", value: completedTasks, icon: "✅" },
                { label: "USDT/Task", value: ToUSDT(taskIncome), icon: "💰" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="text-center"
                  whileHover={{ y: -5 }}
                >
                  <p className="text-2xl font-bold text-amber-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-amber-500 flex items-center justify-center gap-1">
                    <span>{stat.icon}</span>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )} */}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
