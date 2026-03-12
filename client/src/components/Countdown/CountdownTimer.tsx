import { useEffect, useRef, useState } from "react";
// import Player, { type LottieRefCurrentProps } from "lottie-react";
// import animationData from "../../assets/lottie/1y4rD1Ad9l.json";
import { Hourglass, Sparkles } from "lucide-react";

interface CountdownTimerProps {
  taskCompletedTime: number;
  onTimeIsUp: () => void;
}

export default function CountdownTimer({
  taskCompletedTime,
  onTimeIsUp,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timeIsUp, setTimeIsUp] = useState(false);
  // const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!taskCompletedTime) return;

    const calculateTimeLeft = () => {
      const now = Date.now();
      const endTime = taskCompletedTime + 86400000; // 24 hours in ms
      const remaining = Math.floor((endTime - now) / 1000);

      if (remaining <= 0) {
        setTimeLeft(0);
        if (!timeIsUp) {
          setTimeIsUp(true);
          onTimeIsUp();
          // if (lottieRef.current) {
          //   lottieRef.current.stop();
          // }
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        return;
      }

      setTimeLeft(remaining);
    };

    calculateTimeLeft();

    if (!timeIsUp) {
      timerRef.current = setInterval(calculateTimeLeft, 1000);
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [onTimeIsUp, timeIsUp, taskCompletedTime]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number | null) => {
    const hours = Math.floor((seconds ?? 0) / 3600);
    const minutes = Math.floor(((seconds ?? 0) % 3600) / 60);
    const secs = (seconds ?? 0) % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
      total: [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        secs.toString().padStart(2, "0"),
      ].join(":"),
    };
  };

  const getTimeCategory = () => {
    if (!timeLeft) return "ready";
    if (timeLeft > 43200) return "plenty"; // > 12 hours
    if (timeLeft > 21600) return "medium"; // > 6 hours
    if (timeLeft > 3600) return "low"; // > 1 hour
    return "critical";
  };

  const timeCategory = getTimeCategory();
  const formatted = formatTime(timeLeft);

  if (timeLeft === null) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200 mb-6 overflow-hidden">
      {/* Option 1: Compact Horizontal Layout */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Lottie Animation - Smaller */}
          {/* <div className="relative">
            <Player
              lottieRef={lottieRef}
              autoplay={!timeIsUp}
              loop={!timeIsUp}
              animationData={animationData}
              style={{ height: "80px", width: "80px" }}
            />
            {timeIsUp && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  READY
                </div>
              </div>
            )}
          </div> */}

          {/* Timer Info */}
          <div className=" mx-auto">
            <div className="flex items-center gap-2 mb-1">
              {timeIsUp ? (
                <Sparkles className="w-4 h-4 text-emerald-500" />
              ) : (
                <Hourglass
                  className={`w-4 h-4 ${
                    timeCategory === "critical"
                      ? "text-rose-500"
                      : "text-amber-500"
                  }`}
                />
              )}
              <span className="text-sm font-medium text-amber-700">
                {timeIsUp ? "Tasks Available Now" : "Next Tasks"}
              </span>
            </div>

            {/* Digital Timer */}
            <div className="flex items-baseline gap-1">
              <span
                className={`font-mono text-3xl font-bold ${
                  timeIsUp
                    ? "text-emerald-600"
                    : timeCategory === "critical"
                      ? "text-rose-600"
                      : timeCategory === "low"
                        ? "text-amber-600"
                        : "text-amber-700"
                }`}
              >
                {formatted.hours}
              </span>
              <span className="text-amber-300 text-xl">:</span>
              <span
                className={`font-mono text-3xl font-bold ${
                  timeIsUp
                    ? "text-emerald-600"
                    : timeCategory === "critical"
                      ? "text-rose-600"
                      : "text-amber-700"
                }`}
              >
                {formatted.minutes}
              </span>
              <span className="text-amber-300 text-xl">:</span>
              <span
                className={`font-mono text-3xl font-bold ${
                  timeIsUp
                    ? "text-emerald-600"
                    : timeCategory === "critical"
                      ? "text-rose-600"
                      : "text-amber-700"
                }`}
              >
                {formatted.seconds}
              </span>
            </div>

            {/* Next Time */}
            <p className="text-xs text-amber-400 mt-1">
              {!timeIsUp &&
                `Ready at ${new Date(
                  taskCompletedTime + 86400000,
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`}
            </p>
          </div>

          {/* Action Button */}
          {timeIsUp && (
            <button
              onClick={() => {
                setTimeIsUp(false);
                onTimeIsUp();
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-sm font-medium shadow-lg transition-all whitespace-nowrap"
            >
              Get Tasks
            </button>
          )}
        </div>

        {/* Mini Progress Bar */}
        {!timeIsUp && (
          <div className="mt-3">
            <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  timeCategory === "critical"
                    ? "bg-gradient-to-r from-rose-400 to-rose-500"
                    : "bg-gradient-to-r from-amber-400 to-orange-400"
                }`}
                style={{ width: `${((86400 - timeLeft!) / 86400) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
