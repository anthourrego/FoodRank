import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface NotificationProps {
  notification: { type: "success" | "error"; message: string } | null;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ notification, onClose }) => {
  if (!notification) return null;

  const isSuccess = notification.type === "success";

  return (
    <div
      className={`mb-6 p-4 rounded-md flex items-center animate-fade-in ${
        isSuccess
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-red-50 text-red-800 border border-red-200"
      }`}
    >
      {isSuccess ? (
        <CheckCircle size={20} className="mr-2 flex-shrink-0" />
      ) : (
        <AlertCircle size={20} className="mr-2 flex-shrink-0" />
      )}
      <span className="flex-1">{notification.message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};