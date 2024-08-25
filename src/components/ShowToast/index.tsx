import { toast, ToastContent, ToastOptions, Slide, Id } from "react-toastify";

export const defaultToastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Slide,
};

type ToastType = "success" | "error" | "info" | "warning" | "default";

export const showToast = (
  type: ToastType,
  content: ToastContent,
  options: Partial<ToastOptions> = {},
): Id => {
  const optionsToApply = { ...defaultToastOptions, ...options };

  const types = {
    success: () => toast.success(content, optionsToApply),
    error: () => toast.error(content, optionsToApply),
    info: () => toast.info(content, optionsToApply),
    warning: () => toast.warning(content, optionsToApply),
    default: () => toast(content, optionsToApply),
  }

  return types[type] ? types[type]() : types['default']();
};
