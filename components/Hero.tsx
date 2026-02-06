import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export const Hero: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">

      {/* 🎥 FULLSCREEN BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          key={isMobile ? 'mobile-video' : 'desktop-video'}
        >
          <source
            src={isMobile ? '/videos/hero-video-9x16.mp4' : '/videos/hero-video-16x9.mp4'}
            type="video/mp4"
          />
        </video>

        {/* Dark cinematic overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Soft radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,107,255,0.06)_0%,transparent_70%)]"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 pt-32 pb-16 lg:pt-48 lg:pb-24">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* LEFT TEXT */}
            <div className="lg:col-span-6 text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
                Create High–<br />
                Converting <br />
                Product Ads <br />
                Using AI — <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                  Automatically
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base md:text-lg text-slate-400 mb-10 leading-relaxed font-medium opacity-90">
                Upload a product image or link. Our AI agents generate Image Ads, UGC Videos, VFX Cinematic Ads, and No-Human Videos — ready for marketing in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <a
                  href="#generate"
                  onClick={(e) => handleSmoothScroll(e, 'generate')}
                  className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-white transition-all duration-300 bg-primary rounded-xl hover:bg-primaryDark hover:scale-[1.02] shadow-[0_4px_24px_rgba(47,107,255,0.4)]"
                >
                  Generate My Ad
                </a>

                <button
                  onClick={(e) => handleSmoothScroll(e, 'workflow')}
                  className="inline-flex items-center justify-center px-10 py-4 text-base font-bold text-white transition-all duration-300 bg-transparent border border-white/20 rounded-xl hover:bg-white/5 hover:border-white/40 group"
                >
                  <Play size={18} className="mr-3 fill-white" />
                  Watch Demo
                </button>
              </div>

              <div className="pt-10 border-t border-white/5">
                <p className="text-xs font-bold text-slate-500 mb-8 uppercase tracking-[0.2em]">
                  Trusted by creators, brands & growth teams
                </p>
                <div className="flex flex-wrap items-center gap-x-12 gap-y-6 opacity-30 grayscale transition-all hover:grayscale-0 hover:opacity-100 duration-700">
                  <span className="text-xl font-black text-white">Google</span>
                  <span className="text-xl font-black text-white">Airbnb</span>
                  <span className="text-xl font-black text-white">Shopify</span>
                  <span className="text-xl font-black text-white">Amazon</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE (empty on purpose, layout preserved) */}
            <div className="lg:col-span-6 hidden lg:block h-[650px]" />

          </div>
        </div>
      </div>
    </div>
  );
};
