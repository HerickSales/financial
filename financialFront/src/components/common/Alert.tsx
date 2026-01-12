import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import type { AlertType } from '../../types/alert';

interface AlertProps {
  id: string;
  type: AlertType;
  message: string;
  onClose: (id: string) => void;
  duration?: number;
}

const Alert: React.FC<AlertProps> = ({ id, type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const styles = {
    success: {
      container: 'bg-green-50 border-green-200',
      icon: 'text-green-600',
      text: 'text-green-800',
      Icon: CheckCircle
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      text: 'text-red-800',
      Icon: XCircle
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      text: 'text-yellow-800',
      Icon: AlertCircle
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-800',
      Icon: Info
    }
  };

  const style = styles[type];
  const IconComponent = style.Icon;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        ${style.container}
        animate-slide-in-right
        min-w-[300px] max-w-[500px]
      `}
    >
      <IconComponent className={`${style.icon} flex-shrink-0 mt-0.5`} size={20} />
      <p className={`flex-1 text-sm font-medium ${style.text}`}>{message}</p>
      <button
        onClick={() => onClose(id)}
        className={`${style.icon} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Alert;
