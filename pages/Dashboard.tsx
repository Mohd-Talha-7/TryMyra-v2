import { useState } from 'react';
import { SignedIn, SignedOut, RedirectToSignIn, UserButton, useUser } from "@clerk/clerk-react";
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../types/dashboard';
import { PLATFORMS } from '../constants/dashboard';
import WalletBalanceCard from '../components/WalletBalanceCard';
import UsageChart from '../components/UsageChart';
import PaymentMethodCard from '../components/PaymentMethodCard';
import TransactionHistory from '../components/TransactionHistory';
import { razorpayService } from '../services/razorpayService';
import SettingsScreen from '../components/SettingsScreen';
import SupportScreen from '../components/SupportScreen';
import { AdGeneratorForm } from '../components/AdGeneratorForm';
import { useGenerations } from '../context/GenerationsContext';
import StylishConfirmModal from '../components/StylishConfirmModal';
import { useClerk } from '@clerk/clerk-react';


export const Dashboard = () => {
    const { balance, addCredits, triggerSuccess } = useWallet();
    const { user } = useUser();
    const navigate = useNavigate();

    const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
    const { generations, deleteGeneration } = useGenerations();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { signOut } = useClerk();

    // Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type: 'danger' | 'info';
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'danger'
    });

    const handleDownload = async (url: string, title: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            const extension = url.split('.').pop()?.split('?')[0] || 'png';
            link.download = `${title.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error("Download failed", err);
            window.open(url, '_blank');
        }
    };

    const handleShare = async (url: string, title: string) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `TryMyra - ${title}`,
                    text: `Check out this ad I generated with TryMyra!`,
                    url: url
                });
            } catch (err) {
                console.error("Share failed", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                alert("Link copied to clipboard!");
            } catch (err) {
                console.error("Clipboard failed", err);
            }
        }
    };

    const handleDelete = (id: string, title: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Creation',
            message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
            onConfirm: () => deleteGeneration(id),
            type: 'danger'
        });
    };


    const NavItem = ({ id, icon, label }: { id: Screen, icon: string, label: string }) => (
        <button
            onClick={() => { setCurrentScreen(id); setIsMobileMenuOpen(false); }}
            className={`group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all w-full text-left ${currentScreen === id
                ? 'bg-primary/15 border border-primary-glow/30 shadow-glow-sm text-primary'
                : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                }`}
        >
            <span className="material-symbols-outlined text-[24px]">{icon}</span>
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
            <SignedIn>
                <div className="relative flex h-screen w-full overflow-hidden bg-[#f8fafc] text-slate-900 dark:bg-background-dark dark:text-white font-display transition-colors duration-300">
                    {/* Background Blobs */}
                    <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] animate-blob mix-blend-screen"></div>
                        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] animate-blob mix-blend-screen opacity-50"></div>
                        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[100px] animate-blob mix-blend-screen opacity-50"></div>
                    </div>

                    {/* Mobile Menu Overlay */}
                    {isMobileMenuOpen && (
                        <div
                            className="fixed inset-0 z-40 mobile-overlay md:hidden block transition-opacity duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                    )}

                    {/* Sidebar */}
                    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-xs md:w-72 flex-col glass-sidebar transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        } md:relative md:translate-x-0`}>
                        <div className="flex h-20 items-center justify-between px-6 md:px-8 border-b border-white/5">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-glow-sm">
                                    <span className="material-symbols-outlined text-white text-[24px]">auto_awesome</span>
                                </div>
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-md">TryMyra</h1>
                            </button>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 p-2">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <nav className="flex flex-1 flex-col gap-2 px-4 py-6 overflow-y-auto">
                            <NavItem id="dashboard" icon="dashboard" label="Dashboard" />
                            <NavItem id="generate-ad" icon="magic_button" label="Generate Ad" />
                            <NavItem id="my-creations" icon="folder_open" label="My Creations" />
                            <NavItem id="wallet" icon="account_balance_wallet" label="Wallet & Billing" />
                            <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                            <NavItem id="settings" icon="settings" label="Settings" />
                            <NavItem id="support" icon="help" label="Support" />
                        </nav>

                        <div className="p-4 mt-auto">
                            <div className="glass-panel rounded-2xl p-4 transition-transform hover:scale-[1.02] cursor-pointer bg-white/5 border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold ring-2 ring-white/20">
                                        {user?.firstName?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex flex-col overflow-hidden flex-1">
                                        <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user?.firstName || 'User'} {user?.lastName || ''}</span>
                                        <span className="truncate text-xs text-gray-500 dark:text-gray-400">Pro Plan</span>
                                    </div>
                                    <UserButton appearance={{
                                        elements: {
                                            userButtonPopoverFooter: "hidden",
                                            userButtonPopoverActionButton__signOut: "hidden"
                                        }
                                    }}>
                                        <UserButton.MenuItems>
                                            <UserButton.Action
                                                label="Sign out"
                                                labelIcon={<span className="material-symbols-outlined text-[18px]">logout</span>}
                                                onClick={() => setConfirmModal({
                                                    isOpen: true,
                                                    title: 'Sign Out',
                                                    message: 'Are you sure you want to log out of your account?',
                                                    onConfirm: () => signOut(),
                                                    type: 'danger'
                                                })}
                                            />
                                        </UserButton.MenuItems>
                                    </UserButton>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="relative z-10 flex h-full flex-1 flex-col overflow-y-auto overflow-x-hidden scrollbar-hide">
                        {/* Header */}
                        <header className="sticky top-0 z-30 flex h-16 md:h-20 items-center justify-between border-b border-glass-border bg-white/70 dark:bg-[#0a0a0f]/70 px-4 md:px-8 backdrop-blur-md transition-colors duration-300">
                            <div className="flex items-center gap-4 text-gray-400">
                                <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-400">
                                    <span className="material-symbols-outlined text-[32px]">menu</span>
                                </button>
                                <span className="hidden md:block text-sm">
                                    {currentScreen === 'wallet' ? 'Wallet Overview' : `Dashboard / ${currentScreen.charAt(0).toUpperCase() + currentScreen.slice(1).replace('-', ' ')}`}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4">
                                <div className="hidden sm:flex items-center gap-2 rounded-full border border-glass-border bg-white/5 px-4 py-2">
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
                                <button className="flex size-10 items-center justify-center rounded-full border border-glass-border bg-black/5 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white relative">
                                    <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full animate-ping"></span>
                                    <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full"></span>
                                    <span className="material-symbols-outlined">notifications</span>
                                </button>
                            </div>
                        </header>

                        {/* Content */}
                        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
                            {currentScreen === 'dashboard' && (
                                <>
                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-1">
                                            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                                                <span className="text-slate-900 dark:text-white">Welcome back, {user?.firstName || 'there'}</span>
                                                <span className="animate-bounce inline-block">👋</span>
                                            </h2>
                                            <p className="text-sm md:text-base text-gray-400">Ready to create your next viral ad campaign?</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                { title: 'Generate Image Ad', sub: 'Create stunning visuals instantly', icon: 'image', color: 'purple', id: 'generate-ad' },
                                                { title: 'Generate UGC Video', sub: 'AI actors & scripts', icon: 'videocam', color: 'blue', id: 'generate-ad' },
                                                { title: 'VFX Enhancer', sub: 'Add effects to clips', icon: 'auto_fix', color: 'orange', id: 'generate-ad' },
                                                { title: 'Script Writer', sub: 'Compelling copy', icon: 'edit_document', color: 'pink', id: 'generate-ad' }
                                            ].map((action, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setCurrentScreen(action.id as Screen)}
                                                    className="glass-panel group flex flex-col items-start gap-4 rounded-2xl p-5 text-left transition-all hover:-translate-y-1 hover:bg-white/10"
                                                >
                                                    <div className={`flex size-12 items-center justify-center rounded-xl bg-${action.color}-500/20 text-${action.color}-400 group-hover:bg-${action.color}-500 group-hover:text-white transition-colors`}>
                                                        <span className="material-symbols-outlined">{action.icon}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900 dark:text-white">{action.title}</h3>
                                                        <p className="text-xs text-gray-400 mt-1">{action.sub}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group border-primary/20 bg-primary/5">
                                            <div className="absolute right-[-20px] top-[-20px] size-32 rounded-full bg-primary/20 blur-[40px]"></div>
                                            <div className="relative z-10 flex flex-col justify-between h-full gap-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Available Credits</p>
                                                        <h3 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{balance.toLocaleString()}</h3>
                                                    </div>
                                                    <div className="rounded-full bg-white/10 p-2">
                                                        <span className="material-symbols-outlined">account_balance_wallet</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs font-medium">
                                                        <span className="text-gray-300">Monthly Usage</span>
                                                        <span className="text-white">65%</span>
                                                    </div>
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                                                        <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-primary to-primary-glow animate-pulse"></div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const amt = 1000;
                                                        const amountInINR = 360;
                                                        razorpayService.openCheckout(amountInINR, () => {
                                                            addCredits(amt, 'Wallet Top-up via Quick Action');
                                                            triggerSuccess(amt, amountInINR);
                                                        });
                                                    }}
                                                    className="mt-2 w-full rounded-xl bg-white/10 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                                                >
                                                    Top Up Credits
                                                </button>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {[
                                                { val: '98%', label: 'Success Rate', icon: 'check_circle', color: 'text-green-400', bg: 'bg-green-500/10' },
                                                { val: generations.length.toString(), label: 'Total Ads Generated', icon: 'bolt', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                                                { val: `${(10000 - balance).toLocaleString()}`, label: 'Credits Spent', icon: 'data_usage', color: 'text-purple-400', bg: 'bg-purple-500/10' }
                                            ].map((stat, i) => (
                                                <div key={i} className="glass-panel flex flex-col justify-center gap-2 rounded-2xl p-6 transition-transform hover:-translate-y-1">
                                                    <div className={`mb-2 flex size-10 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}>
                                                        <span className="material-symbols-outlined">{stat.icon}</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.val}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Generations</h3>
                                            <button onClick={() => setCurrentScreen('my-creations')} className="text-sm font-medium text-primary hover:text-primary-glow">View All</button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {generations.slice(0, 4).map((gen) => (
                                                <div key={gen.id} className="group flex flex-col gap-3 transition-transform hover:-translate-y-1">
                                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-800">
                                                        <img src={gen.imageUrl} alt={gen.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                        <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                                                            {gen.type}
                                                        </div>
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 gap-2">
                                                            <button
                                                                onClick={() => handleDownload(gen.imageUrl || '', gen.title)}
                                                                className="rounded-full bg-white p-2 text-black shadow-lg hover:scale-110 transition-transform"
                                                                title="Download"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">download</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(gen.id, gen.title)}
                                                                className="rounded-full bg-red-500 p-2 text-white shadow-lg hover:scale-110 transition-transform"
                                                                title="Delete"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-slate-900 dark:text-white truncate group-hover:text-primary-glow">{gen.title}</span>
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            <span className={`size-2 rounded-full shadow-lg ${gen.status === 'Ready' ? 'bg-green-500 shadow-green-500/50' :
                                                                gen.status === 'Processing' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                                                                }`}></span>
                                                            <span className="text-xs text-gray-400">{gen.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 pb-8">
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quick Start Templates</h3>
                                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                            {PLATFORMS.map((platform, i) => (
                                                <div key={i} className="min-w-[200px] cursor-pointer rounded-2xl bg-white/5 p-3 border border-transparent hover:border-glass-border hover:bg-white/10 transition-all">
                                                    <div className="mb-3 h-32 w-full rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/seed/${platform}/200/120)` }}></div>
                                                    <h4 className="font-medium text-slate-900 dark:text-white">{platform}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Viral optimized template</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {currentScreen === 'generate-ad' && (
                                <div className="flex-1 w-full max-w-6xl mx-auto">
                                    <AdGeneratorForm isDashboard={true} />
                                </div>
                            )}

                            {currentScreen === 'my-creations' && (
                                <div className="flex flex-col gap-6">
                                    <h2 className="text-2xl font-bold">My Creations</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {generations.map((gen) => (
                                            <div key={gen.id} className="glass-panel rounded-2xl overflow-hidden group">
                                                <div className="aspect-[4/3] w-full relative overflow-hidden">
                                                    <img src={gen.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={gen.title} />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleDownload(gen.imageUrl || '', gen.title)}
                                                            className="bg-white text-black p-2 rounded-full hover:scale-110"
                                                        >
                                                            <span className="material-symbols-outlined">download</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleShare(gen.imageUrl || '', gen.title)}
                                                            className="bg-white text-black p-2 rounded-full hover:scale-110"
                                                            title="Share"
                                                        >
                                                            <span className="material-symbols-outlined">share</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(gen.id, gen.title)}
                                                            className="bg-red-500 text-white p-2 rounded-full hover:scale-110"
                                                            title="Delete"
                                                        >
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-4 flex flex-col gap-2">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-semibold truncate pr-2">{gen.title}</h4>
                                                        <span className={`size-2 rounded-full ${gen.status === 'Ready' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                                        <span>{gen.type}</span>
                                                        <span>{new Date(gen.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentScreen === 'wallet' && (
                                <div className="flex flex-col gap-8">
                                    {/* Page Heading */}
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                        <div className="flex flex-col gap-1">
                                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white drop-shadow-sm">Wallet & Billing</h1>
                                            <p className="text-gray-400 text-sm md:text-base max-w-lg">Manage your credits, payment methods, and view your complete billing history.</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 bg-surface-dark/40 px-3 py-1.5 rounded-lg border border-white/5">
                                            <span>Last updated:</span>
                                            <span className="text-white font-medium">Just now</span>
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
                            )}

                            {currentScreen === 'settings' && (
                                <SettingsScreen />
                            )}

                            {currentScreen === 'support' && (
                                <SupportScreen />
                            )}
                        </div>
                    </main>

                </div>
            </SignedIn>

            <StylishConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
            />
        </>
    );
};
