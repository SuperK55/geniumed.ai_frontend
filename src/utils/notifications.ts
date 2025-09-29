import { toast } from "sonner";

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Show a success notification
 */
export const showSuccess = (message: string, options?: NotificationOptions) => {
  toast.success(message, {
    description: options?.description,
    duration: options?.duration || 4000,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
  });
};

/**
 * Show an error notification
 */
export const showError = (message: string, options?: NotificationOptions) => {
  toast.error(message, {
    description: options?.description,
    duration: options?.duration || 6000,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
  });
};

/**
 * Show a warning notification
 */
export const showWarning = (message: string, options?: NotificationOptions) => {
  toast.warning(message, {
    description: options?.description,
    duration: options?.duration || 5000,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
  });
};

/**
 * Show an info notification
 */
export const showInfo = (message: string, options?: NotificationOptions) => {
  toast.info(message, {
    description: options?.description,
    duration: options?.duration || 4000,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
  });
};

/**
 * Show a loading notification
 */
export const showLoading = (message: string) => {
  return toast.loading(message);
};

/**
 * Update a loading notification
 */
export const updateLoading = (id: string | number, message: string, type: NotificationType = 'success') => {
  toast.dismiss(id);
  
  switch (type) {
    case 'success':
      toast.success(message);
      break;
    case 'error':
      toast.error(message);
      break;
    case 'warning':
      toast.warning(message);
      break;
    case 'info':
      toast.info(message);
      break;
  }
};

/**
 * Dismiss all notifications
 */
export const dismissAll = () => {
  toast.dismiss();
};

/**
 * Dismiss a specific notification
 */
export const dismiss = (id: string | number) => {
  toast.dismiss(id);
};

// Convenience function for common patterns
export const notify = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  loading: showLoading,
  update: updateLoading,
  dismiss: dismiss,
  dismissAll: dismissAll,
};
