import React, { useState } from 'react';

const SupportScreen: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            question: "How do credits work and do they expire?",
            answer: "Credits are used to generate ads. Each image generation costs 100 credits. Unused credits rollover to the next month for Pro plan users, but expire for Free tier users at the end of the billing cycle (if applicable)."
        },
        {
            question: "Can I export to different formats?",
            answer: "Yes! TryMyra supports export to JPG, PNG, and WebP for images. For video ads, you can export in MP4 or MOV formats with H.264 or ProRes encoding."
        },
        {
            question: "How do I integrate with Facebook Ads Manager?",
            answer: "Go to Settings > Integrations and click on 'Connect Facebook'. You'll be prompted to log in and grant permissions. Once connected, you can push generated ads directly to your campaigns."
        },
        {
            question: "Is there an API available for developers?",
            answer: "Absolutely. We offer a robust REST API for enterprise customers. You can generate assets, retrieve project data, and manage webhooks programmatically. Check out our Developer Docs for more info."
        }
    ];

    return (
        <div className="flex flex-col gap-10 pb-20 animate-fade-in">
            {/* Breadcrumb - Hidden on very small screens */}
            <div className="hidden md:flex items-center gap-2 text-gray-500 text-sm">
                <span>Home</span>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-white font-medium">Help Center</span>
            </div>

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center py-6 text-center gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Support Center Online
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight max-w-2xl">
                    How can we help you today?
                </h1>

                {/* Search Bar */}
                <div className="w-full max-w-2xl relative group mt-4">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-14 pr-6 py-4 md:py-5 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 backdrop-blur-xl transition-all shadow-lg"
                        placeholder="Search for help, tutorials, or FAQs..."
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                        <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-1 rounded border border-white/5 hidden sm:block">
                            CMD + K
                        </span>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Browse Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 group cursor-pointer hover:bg-white/5 border-white/5 hover:border-primary/50 transition-all">
                        <div className="size-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-blue-400">rocket_launch</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Getting Started</h3>
                            <p className="text-sm text-gray-400">Guides on creating your first ad campaign and setting up.</p>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 group cursor-pointer hover:bg-white/5 border-white/5 hover:border-primary/50 transition-all">
                        <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-green-400">account_balance_wallet</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Billing & Credits</h3>
                            <p className="text-sm text-gray-400">Manage subscriptions, payment methods and credit usage.</p>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 group cursor-pointer hover:bg-white/5 border-white/5 hover:border-primary/50 transition-all">
                        <div className="size-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-orange-400">handyman</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white mb-1">Technical Issues</h3>
                            <p className="text-sm text-gray-400">Troubleshooting, bug reporting and API documentation.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Direct Support Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Chat */}
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col gap-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full -mr-10 -mt-10"></div>
                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-3 overflow-hidden">
                                <div className="size-10 rounded-full border-2 border-[#0B0A10] bg-gray-700 bg-cover" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDkJtxOLLLGkUt-NFyqMK8Gk6I4wHFKNhYFNmdGllTTaB92mQUwDpoLZOO2BDouLLJik-Ohr715g_bKowJETI_LAyChMgi-jlKAex1V9fxrwD8cbzJtdnlvIk7zmwm7MGwwRBBjAKzqWQf6oXJAeq2HM4yzr0ZtWntXYfSUyPKTDEIh98lsVBgpec1VT8dcUzLvpB3R6Jz5-ZA2Ei0hKRtww8YriZOd5rph_0M4HVW5HXb3FUM8GzMVkpnrPajJRZpKOn1hvvyBzck)' }}></div>
                                <div className="size-10 rounded-full border-2 border-[#0B0A10] bg-gray-700 bg-cover" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDjmviTVKojGiYhfB6ZpWvlQiU1_JB07AFaOMk9gEvLOc4RRzNakiDbg7g8S9gZJFHzVii4cbrWWWPP8AjTdTTXQVG6Cm-xvPF_FxmY9u6DuY8003or2ql_6oFy3V1lb_N9JHkjQ_pRzv1fyWhkHn01xyKNpEITX_S9YzgJDsvcjD7GXb3zpyATyNvomFbRg2WlSXLz78nmdG50KQftTPKO7AvqPj4kBxJN1Pe4MEcND8EONHKhzrY7p7lvnwxUFFk6vmjONkYF-Kg)' }}></div>
                                <div className="size-10 rounded-full border-2 border-[#0B0A10] bg-white/10 flex items-center justify-center text-xs font-bold">+3</div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">Live Support</span>
                                <span className="text-green-400 text-xs font-medium flex items-center gap-1">
                                    <span className="size-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    Agents Online
                                </span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-white/20 text-4xl">forum</span>
                    </div>
                    <p className="text-gray-400 text-sm relative z-10 flex-1">
                        Need immediate answers? Chat with our AI specialists in real-time to resolve your issues quickly.
                    </p>
                    <button className="w-full py-3.5 px-6 rounded-full bg-primary hover:bg-primary-glow text-white font-bold text-sm transition-all shadow-glow flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                        Start Chat
                    </button>
                </div>

                {/* Create a Ticket */}
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col gap-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full -mr-10 -mt-10"></div>
                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                <span className="material-symbols-outlined text-white text-[20px]">mail</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">Create a Ticket</span>
                                <span className="text-gray-400 text-xs font-medium">Avg response: &lt; 2 hours</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-white/20 text-4xl">confirmation_number</span>
                    </div>
                    <p className="text-gray-400 text-sm relative z-10 flex-1">
                        For complex inquiries or technical bug reports. We'll follow up via email with a detailed solution.
                    </p>
                    <button className="w-full py-3.5 px-6 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">edit_note</span>
                        Submit Ticket
                    </button>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
                <div className="flex flex-col gap-3">
                    {faqs.map((faq, idx) => (
                        <details key={idx} className="group glass-panel rounded-2xl overflow-hidden border-white/5" open={idx === 0}>
                            <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                                <span className="text-white font-medium group-hover:text-primary transition-colors pr-4">{faq.question}</span>
                                <span className="material-symbols-outlined text-gray-400 transition-transform duration-300 group-open:rotate-180">expand_more</span>
                            </summary>
                            <div className="px-5 pb-5 pt-2 text-gray-400 text-sm leading-relaxed border-t border-white/5">
                                <p className="animate-fade-in">{faq.answer}</p>
                            </div>
                        </details>
                    ))}
                </div>
            </section>

            {/* Footer Content */}
            <footer className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-white/5 text-gray-500 text-xs gap-4">
                <p>© 2024 TryMyra. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Status</a>
                </div>
            </footer>
        </div>
    );
};

export default SupportScreen;
