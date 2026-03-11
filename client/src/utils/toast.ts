import { toast } from "sonner";

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        border: "1px solid rgba(16, 185, 129, 0.3)",
        background: "linear-gradient(to right, #f0fdf4, #ffffff)",
        color: "#065f46",
      },
      icon: "🎉",
    });
  },
  error: (message: string) => {
    toast.error(message, {
      style: {
        border: "1px solid rgba(244, 63, 94, 0.3)",
        background: "linear-gradient(to right, #fff1f2, #ffffff)",
        color: "#9f1239",
      },
      icon: "❌",
    });
  },
  warning: (message: string) => {
    toast.warning(message, {
      style: {
        border: "1px solid rgba(245, 158, 11, 0.3)",
        background: "linear-gradient(to right, #fffbeb, #ffffff)",
        color: "#b45309",
      },
      icon: "⚠️",
    });
  },
  info: (message: string) => {
    toast.info(message, {
      style: {
        border: "1px solid rgba(59, 130, 246, 0.3)",
        background: "linear-gradient(to right, #eff6ff, #ffffff)",
        color: "#1e40af",
      },
      icon: "ℹ️",
    });
  },
  default: (message: string) => {
    toast(message, {
      style: {
        border: "1px solid rgba(245, 158, 11, 0.2)",
        background: "rgba(255, 255, 255, 0.95)",
        color: "#92400e",
      },
    });
  },
};
