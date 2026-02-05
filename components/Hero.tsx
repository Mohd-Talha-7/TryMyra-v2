import React from 'react';
import { Play, Image as ImageIcon, Wand2, UserX, Video } from 'lucide-react';

export const Hero: React.FC = () => {
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
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden bg-background">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(47,107,255,0.03)_0%,transparent_70%)]"></div>
        <div className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
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
              Upload a product image. Our AI agents generate Image Ads, UGC Videos, VFX Cinematic Ads, and No-Human Videos — delivered instantly to your screen.
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
              <p className="text-xs font-bold text-slate-500 mb-8 uppercase tracking-[0.2em]">Trusted by creators, brands & growth teams</p>
              <div className="flex flex-wrap items-center gap-x-12 gap-y-6 opacity-30 grayscale transition-all hover:grayscale-0 hover:opacity-100 duration-700">
                <span className="text-xl font-black text-white">Google</span>
                <span className="text-xl font-black text-white">Airbnb</span>
                <span className="text-xl font-black text-white">Shopify</span>
                <span className="text-xl font-black text-white">Amazon</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative h-[650px] perspective-1000 hidden lg:block">
             <div className="absolute inset-0 flex items-center justify-center preserve-3d">
                <div className="relative w-80 h-80 flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                  <div className="relative w-64 h-64 rounded-full bg-[#080B15] border border-white/5 flex flex-col items-center justify-center shadow-2xl z-20">
                    <div className="text-center">
                       <div className="text-4xl font-black text-white tracking-widest mb-1">AI</div>
                       <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-purple-400 tracking-widest uppercase">Ads</div>
                    </div>
                  </div>
                </div>

                <FloatingPanel 
                  pos="-top-5 -left-12" label="Image Ad" color="blue" 
                  icon={<ImageIcon size={14}/>} sub="Studio Composition" rot="rotateY(25deg) rotateX(10deg)" 
                />
                <FloatingPanel 
                  pos="top-24 -right-24" label="UGC Video" color="pink" 
                  icon={<Video size={14}/>} sub="Viral Creator" rot="rotateY(-20deg) rotateX(5deg)" 
                />
                <FloatingPanel 
                  pos="bottom-10 -left-16" label="VFX Cinematic" color="purple" 
                  icon={<Wand2 size={14}/>} sub="Gold & Magic" rot="rotateY(15deg) rotateX(-5deg)" 
                />
                <FloatingPanel 
                  pos="bottom-10 -right-8" label="No-Human" color="green" 
                  icon={<UserX size={14}/>} sub="Minimalist" rot="rotateY(-20deg) rotateX(-5deg)" 
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FloatingPanel = ({ pos, label, color, icon, sub, rot }: any) => (
  <div 
    className={`absolute ${pos} w-48 glass p-5 rounded-2xl animate-float shadow-2xl border-white/10 z-30 transition-all duration-500 hover:scale-110 hover:-translate-y-4 cursor-pointer group`}
    style={{ transform: rot }}
  >
     <div className="flex items-center gap-3 mb-4">
        <div className={`w-2 h-2 rounded-full bg-${color}-500 shadow-[0_0_8px_rgba(59,130,246,1)]`}></div>
        <span className="text-[10px] font-bold text-white uppercase tracking-widest">{label}</span>
     </div>
     <div className="flex items-center gap-3 text-slate-400">
        {icon}
        <span className="text-[10px] font-medium">{sub}</span>
     </div>
  </div>
);