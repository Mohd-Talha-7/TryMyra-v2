import React, { useEffect, useState } from 'react';

interface StylishConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'info';
}

const StylishConfirmModal: React.FC<StylishConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'danger'
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const isDanger = type === 'danger';

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className={`relative w-full max-w-sm glass-panel rounded-[2rem] p-8 text-center transition-all duration-500 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>
                {/* Glow effect */}
                <div className={`absolute -top-24 -left-24 size-48 ${isDanger ? 'bg-red-500/20' : 'bg-primary/30'} rounded-full blur-[60px] pointer-events-none`}></div>
                <div className="absolute -bottom-24 -right-24 size-48 bg-white/5 rounded-full blur-[60px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center gap-6">
                    {/* Icon */}
                    <div className={`size-20 rounded-full ${isDanger ? 'bg-red-500/10 border-red-500/20' : 'bg-primary/10 border-primary/20'} border flex items-center justify-center relative`}>
                        <div className={`absolute inset-0 rounded-full ${isDanger ? 'bg-red-500' : 'bg-primary'} animate-ping opacity-10`}></div>
                        <span className={`material-symbols-outlined ${isDanger ? 'text-red-400' : 'text-primary'} text-5xl`}>
                            {isDanger ? 'report' : 'help'}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
                    </div>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`w-full py-3.5 rounded-xl ${isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-glow'} text-white font-bold shadow-lg transition-all active:scale-95`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold border border-white/10 transition-all active:scale-95"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StylishConfirmModal;
