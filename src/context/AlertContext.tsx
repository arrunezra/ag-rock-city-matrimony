import React, { createContext, useContext, useState, ReactNode } from 'react';
import GlobalAlert from '../screens/common/GlobalAlert';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertOptions {
    title: string;
    message: string;
    type: AlertType;
    confirmText?: string;
    onConfirm?: () => void;
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<AlertOptions>({
        title: '',
        message: '',
        type: 'info',
    });

    const showAlert = (options: AlertOptions) => {
        setConfig(options);
        setIsOpen(true);
    };

    const hideAlert = () => setIsOpen(false);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <GlobalAlert
                isOpen={isOpen}
                onClose={hideAlert}
                type={config.type}
                title={config.title}
                message={config.message}
                confirmText={config.confirmText}
                onConfirm={config.onConfirm}
            />
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) throw new Error('useAlert must be used within AlertProvider');
    return context;
};