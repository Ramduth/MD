import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, X, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const toastStyles = {
  success: 'border-success bg-success/10 text-success-foreground',
  error: 'border-destructive bg-destructive/10 text-destructive-foreground',
  info: 'border-primary bg-primary/10 text-primary-foreground',
  warning: 'border-warning bg-warning/10 text-warning-foreground',
};

export const Toast = ({ 
  id, 
  type, 
  title, 
  description, 
  duration = 5000, 
  onClose 
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = toastIcons[type];

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <Card className={cn(
      "p-4 w-80 shadow-elegant transition-all duration-300 transform",
      toastStyles[type],
      isVisible 
        ? "translate-x-0 opacity-100" 
        : "translate-x-full opacity-0"
    )}>
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{title}</p>
          {description && (
            <p className="text-xs mt-1 opacity-90">{description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};

// Toast Container
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
  }>;
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
        />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToasts = () => {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
  }>>([]);

  const addToast = (
    type: ToastType, 
    title: string, 
    description?: string, 
    duration?: number
  ) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, description, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess: (title: string, description?: string) => 
      addToast('success', title, description),
    showError: (title: string, description?: string) => 
      addToast('error', title, description),
    showInfo: (title: string, description?: string) => 
      addToast('info', title, description),
    showWarning: (title: string, description?: string) => 
      addToast('warning', title, description),
  };
};