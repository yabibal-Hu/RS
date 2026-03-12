// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CountdownTimer from "./CountdownTimer";
import { UserService } from "@/services/userService";


export default function TaskStatusChecker({
  onTimeIsUp,
}: {
  onTimeIsUp: () => void;
}) {
  const [taskCompletedTime, setTaskCompletedTime] = useState<number | null>(
    null
  );
  // const [isTaskCompleted, setIsTaskCompleted] = useState(false);
  // const router = useRouter();
console.log("taskCompletedTime", taskCompletedTime);
  useEffect(() => {
    //  if (!token) {
    //    window.location.href = "/login";
    //    return;
    //  }
    
    const fetchTaskInfo = async () => {
      try {
        const response = await UserService.getTasks(false);

        // const user = await response.json;
        const tasks = Array.isArray(response.data.task)
          ? response.data.task
          : [response.data.task]; // normalize

        // check if all tasks are completed
        const allTasksCompleted = tasks.every(
          (task: { status: string }) => task.status === "1"
        );
        if (allTasksCompleted) {
          // setIsTaskCompleted(true);
          const completedTasks = tasks.filter(
            (task: { status: string; updatedAt: string }) => task.status === "1"
          );
          const latestCompletedTask = completedTasks.reduce(
            (prev: { updatedAt: string }, current: { updatedAt: string }) => {
              return prev.updatedAt > current.updatedAt ? prev : current;
            }
          );
          // Convert to timestamp in milliseconds
          const completedTime = new Date(
            latestCompletedTask.updatedAt
          ).getTime();
          setTaskCompletedTime(completedTime);
        }
      } catch (error) {
        console.error("Error fetching task info:", error);
      }
    };

    fetchTaskInfo();
  }, []);

  return (
    <div>
      {taskCompletedTime && (
        <CountdownTimer
          taskCompletedTime={taskCompletedTime}
          onTimeIsUp={onTimeIsUp}
        />
      )}
    </div>
  );
}
