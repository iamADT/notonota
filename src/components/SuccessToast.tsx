import { useEffect } from "react";

type SuccessToastProps = {
  message: string;
  onDismiss: () => void;
};

export function SuccessToast({ message, onDismiss }: SuccessToastProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onDismiss, 2400);
    return () => window.clearTimeout(timeoutId);
  }, [message, onDismiss]);

  return (
    <div className="toast" role="status" aria-live="polite">
      {message}
    </div>
  );
}

