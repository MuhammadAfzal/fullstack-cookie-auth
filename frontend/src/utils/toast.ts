import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  duration?: number;
  sticky?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export function showToast(
  message: string,
  type: ToastType = "info",
  options: ToastOptions = {}
) {
  const { duration, sticky, actionLabel, onAction } = options;

  const config = {
    duration: sticky ? Infinity : duration ?? 3500,
    action: actionLabel
      ? {
          label: actionLabel,
          onClick: onAction ?? (() => toast.dismiss()),
        }
      : undefined,
  };

  switch (type) {
    case "success":
      toast.success(message, config);
      break;
    case "error":
      toast.error(message, config);
      break;
    case "warning":
      toast.warning?.(message, config); // fallback if not supported
      break;
    default:
      toast(message, config);
  }
}
