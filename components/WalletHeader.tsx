import { useWallet } from '../context/WalletContext';
import { razorpayService } from '../services/razorpayService';

interface WalletHeaderProps {
    onMenuClick?: () => void;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ onMenuClick }) => {
    const { balance, addCredits, triggerSuccess } = useWallet();

    return (
        <header className="flex items-center justify-between px-6 py-4 lg:px-10 border-b border-glass-border bg-white dark:bg-[#0f0e13]/60 backdrop-blur-md sticky top-0 z-20 transition-colors duration-300">
            <div className="flex items-center gap-4 lg:hidden">
                <button onClick={onMenuClick} className="text-slate-900 dark:text-white p-2 -ml-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold">Wallet</h2>
            </div>

            <div className="hidden lg:flex items-center gap-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Wallet Overview</h2>
            </div>

            <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
                <div className="hidden sm:flex items-center gap-2 rounded-full border border-glass-border bg-black/5 dark:bg-white/5 px-4 py-2">
                    <span className="material-symbols-outlined text-green-400 text-[20px] animate-pulse">payments</span>
                    <span className="font-bold text-slate-900 dark:text-white">{balance.toLocaleString()}</span>
                </div>

                <div className="relative group/recharge">
                    <button
                        className="group flex items-center gap-2 rounded-full bg-primary px-3 py-2 md:px-5 md:py-2.5 font-semibold text-white shadow-glow transition-all hover:bg-primary-glow active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-500">add</span>
                        <span className="hidden sm:inline text-sm whitespace-nowrap">Recharge Wallet</span>
                    </button>

                    {/* Dropdown Options */}
                    <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-[#1a1921] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover/recharge:opacity-100 group-hover/recharge:visible transition-all z-50">
                        {[500, 1000, 2000, 5000].map((amt) => (
                            <button
                                key={amt}
                                onClick={() => {
                                    const amountInINR = amt * 0.36;
                                    razorpayService.openCheckout(amountInINR, () => {
                                        addCredits(amt, 'Razorpay Online Payment', amountInINR);
                                        triggerSuccess(amt, amountInINR);
                                    });
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-between"
                            >
                                <span>{amt.toLocaleString()} Credits</span>
                                <span className="text-[10px] text-gray-500">₹{(amt * 0.36).toFixed(0)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-6 w-px bg-white/10 hidden md:block"></div>

                <div className="flex gap-2">
                    <button className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-surface-dark/50 hover:bg-white/10 transition-colors border border-white/5">
                        <span className="material-symbols-outlined text-[20px] text-gray-300">notifications</span>
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#131022]"></span>
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-dark/50 hover:bg-white/10 transition-colors border border-white/5">
                        <span className="material-symbols-outlined text-[20px] text-gray-300">help</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default WalletHeader;
