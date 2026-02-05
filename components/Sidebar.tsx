import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
        { name: 'Campaigns', icon: 'campaign', path: '/campaigns' },
        { name: 'Wallet & Billing', icon: 'account_balance_wallet', path: '/wallet' },
        { name: 'Analytics', icon: 'bar_chart', path: '/analytics' },
        { name: 'Settings', icon: 'settings', path: '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 mobile-overlay lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed lg:sticky top-0 left-0 z-50 flex flex-col w-[85vw] max-w-xs lg:w-72 h-screen border-r border-glass-border glass-sidebar transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl size-10 shadow-lg shadow-primary/20"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDRUtB_EbHMvAPD6rwMWZlEkixUuGtNEYGupHhKQJOOHNZZmudmNT43nYYqiKkFSf5fOojy1QNtaa5ooF-yLdo3GdbFNhVjKlchwngMmtpz70SzIAx6XCLOp3QRyFaqT3yTe0CFgX8A8bfvoCbGPTHJVKZdrf79ADXiifMGaFA_zAol6dvGfvQZZctu8qhtM0Q2EpqYW-WCd9x6BX6dtIG3lYvmtUeLw3Y9ldpfJQIsz1NeujP6WdpIS8HVOlbMbTotdYL5ShivIq0")' }}
                        ></div>
                        <h1 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">TryMyra</h1>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="lg:hidden text-gray-400 p-2 hover:text-white transition-colors">
                            <span className="material-symbols-outlined font-light">close</span>
                        </button>
                    )}
                </div>

                <nav className="flex-1 flex flex-col gap-2 px-4 py-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${isActive
                                    ? 'bg-primary/10 text-slate-900 dark:text-white border border-primary/20 shadow-[0_0_15px_rgba(55,19,236,0.15)] dark:shadow-none'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[24px] transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'
                                    }`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto">
                    <div className="glass-card-gradient rounded-2xl p-4 flex items-center gap-3">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-white/10"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAviQCQnwf3cdmoy0aae5U_yRYUF5efgrZwj95Q-09KMZm2eXokrmbo4Lg08VlxpD83bIB4KDNdSzHA8u71giAnKQwSGIiYNcuKvb6ucz6fn99RWcDDmmDjhSAnd8lbO6Gq1QIv43_dk0fVi5JkCH1jZ7Qx0YdPNd6MJSwlxgxvWCwfwCKEIVSDwq4UX6BwbHUO_CnUgOiivcZXhRQx3QPKfggorUz8ADb_RWldFnj9xjh4r33PDwuOfMWDj0tqdM7D78nd-LVKErs")' }}
                        ></div>
                        <div className="flex flex-col overflow-hidden">
                            <p className="text-sm font-bold truncate text-slate-900 dark:text-white">Alex Morgan</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Pro Plan</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;

