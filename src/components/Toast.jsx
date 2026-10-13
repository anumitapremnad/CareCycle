import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isWarning = toast.type === 'warning';
  const isInfo = toast.type === 'info';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`care-toast care-toast--${toast.type || 'success'}`}
    >
      <div className="care-toast__icon">
        {isSuccess && <CheckCircle2 size={20} />}
        {isWarning && <AlertCircle size={20} />}
        {isInfo && <Info size={20} />}
      </div>
      <div className="care-toast__content">
        <p className="care-toast__title">{toast.title}</p>
        {toast.message && <p className="care-toast__message">{toast.message}</p>}
      </div>
      <button
        type="button"
        className="care-toast__close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}
