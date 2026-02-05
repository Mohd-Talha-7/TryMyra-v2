import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { razorpayService } from '../services/razorpayService';

const WalletBalanceCard = () => {
    const { balance, addCredits, triggerSuccess } = useWallet();
    const [topUpAmount, setTopUpAmount] = useState(1000);
    const inrValue = (balance * 0.36).toLocaleString(undefined, { maximumFractionDigits: 0 });

    const handleTopUp = () => {
        // Calculate INR based on credits (e.g. 1000 credits = ₹360)
        const amountInINR = (topUpAmount * 0.36);
        razorpayService.openCheckout(amountInINR, () => {
            addCredits(topUpAmount, 'Razorpay Online Payment', amountInINR);
            triggerSuccess(topUpAmount, amountInINR);
        });
    };

    return (
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden group">
            {/* Background glow effect */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/30 transition-colors duration-500"></div>

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 font-medium mb-1">Total Balance</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">₹{inrValue}</h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">INR</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-primary-light bg-primary/10 w-fit px-3 py-1 rounded-full border border-primary/20">
                            <span className="material-symbols-outlined text-[18px]">token</span>
                            <span className="font-bold text-xs md:text-sm">{balance.toLocaleString()} Credits Available</span>
                        </div>
                    </div>
                    <div className="bg-black/5 dark:bg-white/5 p-2 rounded-xl border border-white/10 hidden sm:block">
                        <span className="material-symbols-outlined text-3xl text-gray-600 dark:text-gray-300">account_balance_wallet</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {[500, 1000, 2000, 5000].map((amt) => (
                            <button
                                key={amt}
                                onClick={() => setTopUpAmount(amt)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap border ${topUpAmount === amt
                                    ? 'bg-primary text-white border-primary shadow-glow-sm'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                {amt.toLocaleString()} Credits
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto pt-4 border-t border-white/5">
                        <button
                            onClick={handleTopUp}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-light text-white font-semibold shadow-lg shadow-primary/25 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">add_card</span>
                            Top Up {topUpAmount.toLocaleString()} Credits
                        </button>

                        <div className="w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-surface-dark/50 border border-white/10 sm:ml-auto shadow-sm dark:shadow-none">
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">Auto-Recharge</span>
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">When below ₹500</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input className="sr-only peer" type="checkbox" />
                                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletBalanceCard;
