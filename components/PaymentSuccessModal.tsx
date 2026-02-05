import React, { useEffect, useState } from 'react';

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    credits: number;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ isOpen, onClose, amount, credits }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className={`relative w-full max-w-sm glass-panel rounded-[2rem] p-8 text-center transition-all duration-500 transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>
                {/* Glow effect */}
                <div className="absolute -top-24 -left-24 size-48 bg-primary/30 rounded-full blur-[60px] pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-24 size-48 bg-green-500/20 rounded-full blur-[60px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center gap-6">
                    {/* Animated Checkmark */}
                    <div className="size-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
                        <span className="material-symbols-outlined text-green-400 text-5xl animate-bounce">check_circle</span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-white tracking-tight">Payment Successful!</h3>
                        <p className="text-gray-400 text-sm">Your credits have been added to your wallet.</p>
                    </div>

                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Transaction Status</span>
                            <span className="text-green-400 font-semibold px-2 py-0.5 rounded-md bg-green-400/10">Completed</span>
                        </div>
                        <div className="h-px w-full bg-white/10"></div>
                        <div className="flex justify-between items-center">
                            <div className="text-left">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Credits Added</p>
                                <p className="text-lg font-bold text-white">+{credits.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Amount</p>
                                <p className="text-lg font-bold text-white">₹{amount.toFixed(0)}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-glow text-white font-bold shadow-glow transition-all active:scale-95"
                    >
                        Great! Continue
                    </button>

                    <p className="text-[10px] text-gray-500">Transaction ID: {Math.random().toString(36).substr(2, 12).toUpperCase()}</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessModal;
