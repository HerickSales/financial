import React, { createContext, useContext, useState, useCallback } from 'react';
import Alert from '../components/common/Alert';
import type { AlertType } from '../types/alert';

interface AlertItem {
  id: string;
  type: AlertType;
  message: string;
  duration?: number;
}

interface AlertContextType {
  showAlert: (message: string, type?: AlertType, duration?: number) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = useCallback((message: string, type: AlertType = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setAlerts((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  const showSuccess = useCallback((message: string) => {
    showAlert(message, 'success');
  }, [showAlert]);

  const showError = useCallback((message: string) => {
    showAlert(message, 'error');
  }, [showAlert]);

  const showWarning = useCallback((message: string) => {
    showAlert(message, 'warning');
  }, [showAlert]);

  const showInfo = useCallback((message: string) => {
    showAlert(message, 'info');
  }, [showAlert]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, showSuccess, showError, showWarning, showInfo }}>
      {children}

      {/* Alert Container - Fixed no canto superior direito */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            id={alert.id}
            type={alert.type}
            message={alert.message}
            duration={alert.duration}
            onClose={removeAlert}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
