import React, { useState, useEffect, useRef } from 'react';
import { useUser } from "@clerk/clerk-react";
import { useTheme } from '../context/ThemeContext';

type SettingsTab = 'account' | 'security' | 'preferences';

const SettingsScreen: React.FC = () => {
    const { user } = useUser();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState<SettingsTab>('account');
    const isScrollingRef = useRef(false);

    const scrollToSection = (id: SettingsTab) => {
        const element = document.getElementById(id);
        if (element) {
            isScrollingRef.current = true;
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveTab(id);

            // Allow scroll listener to resume after animation
            setTimeout(() => {
                isScrollingRef.current = false;
            }, 1000);
        }
    };

    useEffect(() => {
        const dashboardMain = document.querySelector('main');
        if (!dashboardMain) return;

        const handleScroll = () => {
            if (isScrollingRef.current) return;

            const sections: SettingsTab[] = ['account', 'security', 'preferences'];
            const scrollPosition = dashboardMain.scrollTop + 150;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveTab(section);
                        break;
                    }
                }
            }
        };

        dashboardMain.addEventListener('scroll', handleScroll);
        return () => dashboardMain.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="flex flex-col gap-8">
            {/* Page Heading */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">Settings</h1>
                <p className="text-gray-400 text-sm md:text-base max-w-lg">Manage your profile, security, and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 relative">
                {/* Vertical Tab Nav - Desktop Sticky */}
                <div className="lg:w-64 flex-shrink-0 lg:sticky lg:top-4 self-start z-10 transition-all">
                    <div className="glass-panel rounded-2xl p-2 flex flex-row lg:flex-col gap-1 overflow-x-auto scrollbar-hide lg:overflow-visible">
                        <button
                            onClick={() => scrollToSection('account')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap border ${activeTab === 'account'
                                ? 'bg-primary/20 text-white border-primary/20 shadow-glow-sm'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">person</span>
                            <span className="text-sm font-semibold">Account</span>
                        </button>
                        <button
                            onClick={() => scrollToSection('security')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap border ${activeTab === 'security'
                                ? 'bg-primary/20 text-white border-primary/20 shadow-glow-sm'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">security</span>
                            <span className="text-sm font-semibold">Security</span>
                        </button>
                        <button
                            onClick={() => scrollToSection('preferences')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap border ${activeTab === 'preferences'
                                ? 'bg-primary/20 text-white border-primary/20 shadow-glow-sm'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">tune</span>
                            <span className="text-sm font-semibold">Preferences</span>
                        </button>
                    </div>
                </div>

                {/* Sections Area */}
                <div className="flex-1 flex flex-col gap-12 pb-20">
                    <section id="account" className="glass-panel rounded-xl p-6 lg:p-8 animate-fade-in scroll-mt-24">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Public Profile</h3>
                                <p className="text-sm text-gray-400">This will be displayed on your public profile.</p>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                            <div className="relative group">
                                <div
                                    className="size-24 lg:size-28 rounded-full border-4 border-white/5 bg-cover bg-center bg-gray-800"
                                    style={{ backgroundImage: user?.imageUrl ? `url(${user.imageUrl})` : undefined }}
                                >
                                    {!user?.imageUrl && <div className="w-full h-full flex items-center justify-center text-gray-500"><span className="material-symbols-outlined text-4xl">person</span></div>}
                                </div>
                                <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white shadow-lg hover:bg-primary-glow transition-all transform hover:scale-105 border-2 border-[#121118]">
                                    <span className="material-symbols-outlined text-sm font-bold">edit</span>
                                </button>
                            </div>
                            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">First Name</label>
                                    <input
                                        className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                        type="text"
                                        defaultValue={user?.firstName || "Alex"}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Last Name</label>
                                    <input
                                        className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                        type="text"
                                        defaultValue={user?.lastName || "Designer"}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">mail</span>
                                        <input
                                            className="bg-white/5 border border-white/10 w-full rounded-full pl-12 pr-5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                            type="email"
                                            defaultValue={user?.primaryEmailAddress?.emailAddress || "alex@trymyra.ai"}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 ml-1">Bio</label>
                                    <textarea
                                        className="bg-white/5 border border-white/10 w-full rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                                        placeholder="Tell us a little about yourself..."
                                        rows={3}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-white/10 pt-6 flex justify-end">
                            <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                Save Changes
                            </button>
                        </div>
                    </section>

                    <section id="security" className="glass-panel rounded-xl p-6 lg:p-8 animate-fade-in scroll-mt-24">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Security & Authentication</h3>
                                <p className="text-sm text-gray-400">Manage your password and 2-step verification methods.</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500/10 rounded-full text-green-400">
                                        <span className="material-symbols-outlined">verified_user</span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">Two-Factor Authentication</h4>
                                        <p className="text-xs text-gray-400 mt-1">Add an extra layer of security to your account.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="p-5 rounded-xl border border-white/5 bg-transparent">
                                <h4 className="text-sm font-semibold text-white mb-4">Change Password</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="Current Password" type="password" />
                                    <input className="bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="New Password" type="password" />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button className="text-sm text-primary font-medium hover:text-primary-glow">Update Password</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="preferences" className="glass-panel rounded-xl p-6 lg:p-8 animate-fade-in scroll-mt-24">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Preferences</h3>
                        <div className="mb-8">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4 block">Interface Theme</label>
                            <div className="grid grid-cols-3 gap-4">
                                <label className="cursor-pointer relative group">
                                    <input
                                        className="peer sr-only"
                                        name="theme"
                                        type="radio"
                                        checked={theme === 'light'}
                                        onChange={() => setTheme('light')}
                                    />
                                    <div className="h-24 rounded-xl border-2 border-white/10 bg-[#e5e7eb] mb-2 overflow-hidden relative opacity-50 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute top-2 left-2 right-2 h-2 bg-white rounded-full"></div>
                                        <div className="absolute top-6 left-2 w-8 bottom-2 bg-white rounded-lg"></div>
                                    </div>
                                    <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 peer-checked:text-slate-900 dark:peer-checked:text-white">Light</div>
                                    <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none ring-4 ring-primary/20"></div>
                                </label>
                                <label className="cursor-pointer relative group">
                                    <input
                                        className="peer sr-only"
                                        name="theme"
                                        type="radio"
                                        checked={theme === 'dark'}
                                        onChange={() => setTheme('dark')}
                                    />
                                    <div className="h-24 rounded-xl border-2 border-white/10 bg-[#121118] mb-2 overflow-hidden relative">
                                        <div className="absolute top-2 left-2 right-2 h-2 bg-[#2b2839] rounded-full"></div>
                                        <div className="absolute top-6 left-2 w-8 bottom-2 bg-[#2b2839] rounded-lg"></div>
                                    </div>
                                    <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 peer-checked:text-slate-900 dark:peer-checked:text-white">Dark</div>
                                    <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none ring-4 ring-primary/20"></div>
                                </label>
                                <label className="cursor-pointer relative group">
                                    <input
                                        className="peer sr-only"
                                        name="theme"
                                        type="radio"
                                        checked={theme === 'system'}
                                        onChange={() => setTheme('system')}
                                    />
                                    <div className="h-24 rounded-xl border-2 border-white/10 bg-gradient-to-br from-[#121118] to-[#e5e7eb] mb-2 overflow-hidden relative opacity-50 group-hover:opacity-100 transition-opacity">
                                    </div>
                                    <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 peer-checked:text-slate-900 dark:peer-checked:text-white">System</div>
                                    <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none ring-4 ring-primary/20"></div>
                                </label>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 block">Notifications</label>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-white">Ad Generation Complete</p>
                                    <p className="text-xs text-gray-400">Receive an email when your batch generation is ready.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-white">Low Credit Alerts</p>
                                    <p className="text-xs text-gray-400">Get notified when your credit balance drops below 10%.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-white">Product Updates</p>
                                    <p className="text-xs text-gray-400">Occasional news about new features and improvements.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;
