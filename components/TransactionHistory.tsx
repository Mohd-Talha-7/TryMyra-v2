import { useState } from 'react';
import { useWallet } from '../context/WalletContext';

type HistoryTab = 'payment' | 'usage';

const TransactionHistory = () => {
    const { transactions } = useWallet();
    const [activeTab, setActiveTab] = useState<HistoryTab>('payment');

    const paymentTransactions = transactions.filter(tx => tx.type === 'credit');
    const usageTransactions = transactions.filter(tx => tx.type === 'debit');

    return (
        <section className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-1 border-b border-white/5">
                    <button
                        onClick={() => setActiveTab('payment')}
                        className={`px-4 py-3 text-sm font-semibold transition-all relative ${activeTab === 'payment'
                            ? 'text-primary'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Payment History
                        {activeTab === 'payment' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(110,68,255,0.5)]"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('usage')}
                        className={`px-4 py-3 text-sm font-semibold transition-all relative ${activeTab === 'usage'
                            ? 'text-primary'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Usage History
                        {activeTab === 'usage' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(110,68,255,0.5)]"></div>
                        )}
                    </button>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Export CSV
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                        {activeTab === 'payment' ? 'payments' : 'auto_awesome'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {activeTab === 'payment' ? 'Wallet Top-ups' : 'AI Generation Usage'}
                    </h3>
                </div>

                <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="p-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Date</th>
                                    <th className="p-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        {activeTab === 'payment' ? 'Details' : 'Ad Generation'}
                                    </th>
                                    <th className="p-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        {activeTab === 'payment' ? 'Amount (₹)' : 'Type'}
                                    </th>
                                    <th className="p-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                                        Credits
                                    </th>
                                    <th className="p-4 text-[10px] font-black tracking-widest text-gray-400 uppercase text-right">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {(activeTab === 'payment' ? paymentTransactions : usageTransactions).map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 text-gray-400 whitespace-nowrap">{tx.date}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${tx.type === 'debit' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-400'}`}>
                                                    <span className="material-symbols-outlined text-[18px]">
                                                        {tx.type === 'debit' ? 'auto_awesome' : 'add_card'}
                                                    </span>
                                                </div>
                                                <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px] md:max-w-xs" title={tx.description}>
                                                    {tx.description}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {activeTab === 'payment' ? (
                                                <span className="text-green-400 font-bold">₹{tx.amountINR?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded bg-surface-dark/60 text-[10px] font-black text-primary border border-primary/20 uppercase tracking-wider whitespace-nowrap">
                                                    {tx.category || 'GEN'}
                                                </span>
                                            )}
                                        </td>
                                        <td className={`p-4 font-medium ${activeTab === 'usage' ? (tx.amount < 0 ? 'text-white' : 'text-green-400') : 'text-green-400'}`}>
                                            <span className="flex items-center gap-1 font-bold">
                                                {tx.amount > 0 ? `+ ${tx.amount.toLocaleString()}` : `${tx.amount.toLocaleString()}`}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <StatusBadge status={tx.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {(activeTab === 'payment' ? paymentTransactions : usageTransactions).length === 0 && (
                            <div className="p-12 text-center">
                                <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">history</span>
                                <p className="text-gray-500">No {activeTab} history found</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between p-4 border-t border-white/5 bg-white/[0.02]">
                        <span className="text-xs text-gray-500">
                            Showing {(activeTab === 'payment' ? paymentTransactions : usageTransactions).length} activities
                        </span>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10 disabled:opacity-50">
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            <button className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/10">
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const getStyles = () => {
        switch (status) {
            case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            default: return 'bg-red-500/10 text-red-400 border-red-500/20';
        }
    };

    const getDotStyles = () => {
        switch (status) {
            case 'Completed': return 'bg-green-400';
            case 'Pending': return 'bg-yellow-400 animate-pulse';
            default: return 'bg-red-400';
        }
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStyles()}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${getDotStyles()}`}></span>
            {status}
        </span>
    );
};

export default TransactionHistory;
