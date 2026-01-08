import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, 300);
    };

    if (!isVisible) return null;

    const types = {
        success: {
            icon: CheckCircleIcon,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-400',
            iconColor: 'text-green-400',
            textColor: 'text-green-800',
        },
        error: {
            icon: XCircleIcon,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-400',
            iconColor: 'text-red-400',
            textColor: 'text-red-800',
        },
        warning: {
            icon: ExclamationTriangleIcon,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-400',
            iconColor: 'text-yellow-400',
            textColor: 'text-yellow-800',
        },
        info: {
            icon: InformationCircleIcon,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-400',
            iconColor: 'text-blue-400',
            textColor: 'text-blue-800',
        },
    };

    const config = types[type];
    const Icon = config.icon;

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 min-w-[320px] max-w-md p-4 rounded-lg border-l-4 shadow-lg transition-all duration-300 ${
                config.bgColor
            } ${config.borderColor} ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
        >
            <Icon className={`h-6 w-6 flex-shrink-0 ${config.iconColor}`} />
            <p className={`flex-1 text-sm font-medium ${config.textColor}`}>{message}</p>
            <button
                onClick={handleClose}
                className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
            >
                <XMarkIcon className="h-5 w-5" />
            </button>
        </div>
    );
}

// Toast Container Component
export function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-0 right-0 z-50 p-4 space-y-3">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}

// Custom hook for using toast notifications
export function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const toast = {
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        warning: (message, duration) => addToast(message, 'warning', duration),
        info: (message, duration) => addToast(message, 'info', duration),
    };

    return { toasts, removeToast, toast };
}
