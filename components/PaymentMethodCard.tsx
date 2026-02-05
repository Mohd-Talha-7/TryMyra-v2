import React from 'react';

interface PaymentMethodProps {
    type: 'visa' | 'mastercard' | 'add';
    last4?: string;
    expiry?: string;
    isDefault?: boolean;
}

const PaymentMethodCard: React.FC<PaymentMethodProps> = ({ type, last4, expiry, isDefault }) => {
    if (type === 'add') {
        return (
            <button className="h-48 rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group">
                <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border border-white/5">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">add</span>
                </div>
                <span className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">Add New Method</span>
            </button>
        );
    }

    const isVisa = type === 'visa';
    const logoUrl = isVisa
        ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAh0AdYQHtnrza0boI6Jz6S641ZMqz8dhkVzBhh3Zocexzs9m3MSfHdN_77VH4XNUiqhd4MyVMhr1QsmsC5EXVfGXn1WRuHyVX5fddDHOulkHLHeJLxPlEN3I5SEzMk7APd51EpNmfMu5gMxhsr7GcmZ6HylCILH4dBZq1_Ky8kvmZXUz-hHyQwkNVcqSvXxernqPFURu4tH5VIsOgfyN8XzhhB0m1cWIpHC6k_Fubyix6qqcuY9OqFVEsfvyy6rJRMwqr2XnKEsok"
        : "https://lh3.googleusercontent.com/aida-public/AB6AXuAtBPv4Nt2pDPIrwERUkGBEU7AEqpxb9gpDASlTZrnCrQVgkNBNIcXvrEqaiUjZuW0vp696Bg5_aZ-KJ2UieTfAVnfPeW-iIoahUcoAS5dcMs_7ChAzZwKKg0JRRnHlEOaQl6IAvbTH8nBET9YkzRscZ2-KztJM1v3IlpkVwBJW2MyYG540CKw03A4vf_-b3YL7FKXiOPjEXarzfGNxTfD9-aP6mXZrjUlc09J6bZq2z8MH5tfutTkG5zZ02F1mOXYlNGkoJv6KkBA";

    const bgGradient = isVisa
        ? "bg-gradient-to-br from-[#1e202e] to-[#0f0e15]"
        : "bg-gradient-to-br from-[#2b2b3b] to-[#1a1a24]";

    return (
        <div className={`group relative h-48 rounded-2xl p-6 flex flex-col justify-between transition-all hover:scale-[1.02] overflow-hidden border border-white/10 shadow-lg ${bgGradient}`}>
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl z-0"></div>

            <div className="relative z-10 flex justify-between items-start">
                <div className="text-white/80 font-mono text-sm tracking-widest">**** {last4}</div>
                <div
                    className="bg-contain bg-no-repeat bg-right h-8 w-12 opacity-80"
                    style={{ backgroundImage: `url("${logoUrl}")` }}
                ></div>
            </div>

            <div className="relative z-10">
                <div className="flex gap-4 mb-1">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Expires</span>
                        <span className="text-sm text-white font-medium">{expiry}</span>
                    </div>
                    {isVisa && (
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">CVC</span>
                            <span className="text-sm text-white font-medium">•••</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-end">
                    <p className="text-sm font-medium text-gray-300">Alex Morgan</p>
                    {isDefault && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-white border border-white/10">Default</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodCard;
