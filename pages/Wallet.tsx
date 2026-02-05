import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import WalletHeader from '../components/WalletHeader';
import WalletBalanceCard from '../components/WalletBalanceCard';
import UsageChart from '../components/UsageChart';
import PaymentMethodCard from '../components/PaymentMethodCard';
import TransactionHistory from '../components/TransactionHistory';

const Wallet = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="relative z-10 flex min-h-screen w-full bg-[#f8fafc] dark:bg-background-dark text-slate-900 dark:text-white font-display transition-colors duration-300">
            {/* Ambient Background Animation */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <WalletHeader onMenuClick={() => setIsMobileMenuOpen(true)} />

                {/* Main Content Scroll Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scrollbar-hide">
                    <div className="max-w-[1200px] mx-auto flex flex-col gap-8">

                        {/* Page Heading */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">Wallet & Billing</h1>
                                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-lg">Manage your credits, payment methods, and view your complete billing history.</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-surface-dark/40 px-3 py-1.5 rounded-lg border border-white/5 shadow-sm dark:shadow-none">
                                <span>Last updated:</span>
                                <span className="text-slate-900 dark:text-white font-medium">Just now</span>
                            </div>
                        </div>

                        {/* Top Row: Balance & Usage */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <WalletBalanceCard />
                            <UsageChart />
                        </div>

                        {/* Payment Methods */}
                        <section className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Payment Methods</h3>
                                <button className="text-sm text-primary hover:text-primary-light font-medium transition-colors">Manage All</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <PaymentMethodCard type="visa" last4="4242" expiry="12/24" isDefault />
                                <PaymentMethodCard type="mastercard" last4="8899" expiry="09/25" />
                                <PaymentMethodCard type="add" />
                            </div>
                        </section>

                        {/* Transaction History */}
                        <TransactionHistory />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Wallet;
