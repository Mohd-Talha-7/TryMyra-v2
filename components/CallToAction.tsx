import React from 'react';
import { Sparkles } from 'lucide-react';

export const CallToAction: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface to-background border-t border-white/5"></div>
      
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Stop Designing Ads Manually. <br />
          <span className="text-primary">Let AI Do It.</span>
        </h2>
        
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Join hundreds of growth teams generating high-performing creatives at scale.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#generate"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-primary rounded-full hover:bg-primaryDark shadow-lg shadow-primary/30"
          >
            Get Started Free
            <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
          </a>
          <button className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-surface border border-white/10 rounded-full hover:bg-white/5">
            Talk to Us
          </button>
        </div>
      </div>
    </section>
  );
};