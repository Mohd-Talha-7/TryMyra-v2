const UsageChart = () => {
    return (
        <div className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col items-center justify-center gap-6 relative">
            <h3 className="text-lg font-semibold text-white w-full text-left">Monthly Usage</h3>

            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* CSS Conic Gradient Chart */}
                <div
                    className="w-full h-full rounded-full"
                    style={{
                        background: 'conic-gradient(#3713ec 0% 65%, rgba(255,255,255,0.05) 65% 100%)',
                        maskImage: 'radial-gradient(transparent 60%, black 61%)',
                        WebkitMaskImage: 'radial-gradient(transparent 60%, black 61%)'
                    }}
                ></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-white">65%</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Used</span>
                </div>
            </div>

            <div className="text-center">
                <p className="text-white font-medium">1,500 <span className="text-gray-400">/ 2,000 Credits</span></p>
                <p className="text-xs text-gray-500 mt-1">Resets on Nov 1st</p>
            </div>
        </div>
    );
};

export default UsageChart;
