import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Wand2,
  UserX,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from 'lucide-react';

/* ---------------- VIDEO PLAYER ---------------- */

const VideoPlayer: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-full bg-black group/video">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Control Overlays */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
        <button
          onClick={toggleMute}
          className="p-2.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-primary transition-colors shadow-lg"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          onClick={togglePlay}
          className="p-2.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-primary transition-colors shadow-lg"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
      </div>

      {/* Center Play Button Overlay */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer bg-black/30"
        >
          <div className="p-5 bg-primary rounded-full shadow-2xl shadow-primary/40">
            <Play size={24} fill="white" className="text-white ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- MAIN SHOWCASE ---------------- */

export const Showcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'ugc' | 'vfx' | 'nohuman'>('ugc');

  const contentMap: Record<string, any[]> = {
    image: [
      {
        title: "Nature's Best Banner",
        product: 'High Fresh Rozana Mix',
        description:
          'We took a simple studio shot of a dry fruit jar and transformed it into a premium social media banner with professional lifestyle elements.',
        inputLabel: 'Product Photo',
        outputLabel: 'Final Banner',
        inputSrc: 'https://i.postimg.cc/85M6XmZH/dryfruit-input.jpg',
        outputSrc: 'https://i.postimg.cc/9f0S3K87/dryfruit-output.jpg',
        type: 'image',
      },
      {
        title: 'Dine in Golden Splendor',
        product: 'KitchAntique Gold Spoons',
        description:
          'A raw product photo of four spoons converted into a premium French-style lifestyle advertisement.',
        inputLabel: 'Raw Product',
        outputLabel: 'Lifestyle Ad',
        inputSrc: '/images/input_spoon.jpg',
        outputSrc: '/images/output_spoon.jpg',
        type: 'image',
      },
    ],

    ugc: [
      {
        title: 'Authentic Creator Ad',
        product: 'Aris Reborn Men',
        description:
          'Real creator style UGC video optimized for Reels and TikTok. Authentic testimony built from a single bottle photo.',
        inputLabel: 'Bottle Shot',
        outputLabel: 'UGC Video',
        inputSrc: 'https://i.postimg.cc/k4GkL8Tz/aris-input.jpg',
        outputSrc: '/videos/ugc_perfume.mp4',
        type: 'video',
      },
      {
        title: 'Festive Sweet Delight',
        product: "Haldiram's Soan Papdi",
        description:
          'Authentic creator-style UGC showcasing the rich, flaky texture of Haldiram\'s Soan Papdi. Perfect for seasonal campaigns and festive gifting reels.',
        inputLabel: 'Pack Shot',
        outputLabel: 'UGC Video',
        inputSrc: '/images/soan-papdi-input.jpg',
        outputSrc: '/videos/soan-papdi-output.mp4',
        type: 'video',
      },
    ],

    vfx: [
      {
        title: 'Premium Essence Reveal',
        product: 'Aris Reborn Men',
        description:
          'We transform a basic studio shot into a cinematic commercial using volumetric smoke, emerald energy swirls, and dynamic typography.',
        inputLabel: 'Studio Bottle',
        outputLabel: 'High-End VFX',
        inputSrc: 'https://i.postimg.cc/k4GkL8Tz/aris-input.jpg',
        outputSrc: '/videos/vfx_perfume.mp4',
        type: 'video',
      },
      {
        title: 'Cinematic VFX Magic',
        product: 'MIA Jewellery',
        description:
          'Experience luxury with golden dust particles and magical lighting transitions highlighting every diamond sparkle.',
        inputLabel: 'Flat Shot',
        outputLabel: 'Luxury VFX',
        inputSrc: '/images/input_jewellery.jpg',
        outputSrc: '/videos/vfx_jewellery.mp4',
        type: 'video',
      },
    ],

    nohuman: [
      {
        title: 'Savory Snack Showcase',
        product: 'Mahesh Chatpata-Matar',
        description:
          'A high-end "No-Human" studio ad for Mahesh Chatpata-Matar. Features dynamic lighting, macro snack textures, and premium table-top cinematography.',
        inputLabel: 'Packet Shot',
        outputLabel: 'Studio Video',
        inputSrc: '/images/mahesh-matar-input.jpg',
        outputSrc: '/videos/mahesh-matar-output.mp4',
        type: 'video',
      },
      {
        title: 'Minimal Studio Ad',
        product: 'Aris Reborn Men',
        description:
          'A sophisticated "No-Human" ad featuring moody backgrounds, rising smoke effects, and premium gold-accented motion graphics.',
        inputLabel: 'Bottle',
        outputLabel: 'Studio Video',
        inputSrc: 'https://i.postimg.cc/k4GkL8Tz/aris-input.jpg',
        outputSrc: '/videos/nohuman_perfume.mp4',
        type: 'video',
      },
    ],
  };

  const activeItems = contentMap[activeTab];

  return (
    <section className="py-24 bg-background border-t border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(47,107,255,0.03)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles size={14} className="text-primary fill-primary" />
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">9:16 Mobile Optimized</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Input Photo.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Viral Output.
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Raw product images transformed into high-performing vertical ads for Reels, TikTok, and Shorts.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-20">
          {[
            { id: 'image', label: 'Image Ads', icon: ImageIcon },
            { id: 'ugc', label: 'UGC Video', icon: Video },
            { id: 'vfx', label: 'VFX Cinematic', icon: Wand2 },
            { id: 'nohuman', label: 'No-Human', icon: UserX },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-primary text-white scale-105 shadow-[0_10px_40px_-10px_rgba(47,107,255,0.8)]'
                    : 'bg-white/5 border border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Items Grid */}
        <div className="space-y-32">
          {activeItems.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700"
            >
              {/* 1. INPUT SIDE (lg:3) */}
              <div className="lg:col-span-3 order-1 lg:order-1">
                <div className="relative aspect-[9/16] bg-slate-900/40 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden shadow-xl">
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">{item.inputLabel}</span>
                  </div>

                  <img
                    src={item.inputSrc}
                    alt="Input"
                    className="w-full h-full object-contain p-8 relative z-10 opacity-80"
                  />

                  {/* Soft blur background fill */}
                  <div className="absolute inset-0 blur-3xl opacity-10 scale-125">
                    <img
                      src={item.inputSrc}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="mt-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Raw Input Provided</p>
              </div>

              {/* 2. ARROW (lg:1) */}
              <div className="lg:col-span-1 flex justify-center order-2 lg:order-2">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse">
                  <ArrowRight size={24} className="rotate-90 lg:rotate-0" />
                </div>
              </div>

              {/* 3. OUTPUT SIDE (lg:4) */}
              <div className="lg:col-span-4 order-3 lg:order-3">
                <div className="relative aspect-[9/16] rounded-[32px] overflow-hidden border border-white/10 bg-black shadow-[0_0_80px_-20px_rgba(47,107,255,0.3)]">
                  <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-primary/90 backdrop-blur-md rounded-lg shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-white fill-white" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Final 9:16 Ad</span>
                    </div>
                  </div>

                  {item.type === 'video' ? (
                    <VideoPlayer src={item.outputSrc} />
                  ) : (
                    <img
                      src={item.outputSrc}
                      alt="Output"
                      className="w-full h-full object-cover relative z-10"
                    />
                  )}
                  
                  {/* Subtle edge glow */}
                  <div className="absolute inset-0 border border-white/5 pointer-events-none z-20 rounded-[32px]"></div>
                </div>
              </div>

              {/* 4. INFORMATION (lg:4) */}
              <div className="lg:col-span-4 order-4 lg:order-4 flex flex-col justify-center py-6 lg:pl-4">
                <div className="space-y-6">
                  <div>
                    <span className="text-primary text-[10px] font-black tracking-[0.4em] uppercase mb-3 block">
                      {item.product}
                    </span>
                    <h4 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
                      {item.title}
                    </h4>
                    <div className="h-1 w-12 bg-primary/50 rounded-full mb-6"></div>
                    <p className="text-slate-400 font-medium leading-relaxed text-lg">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Post Ready</span>
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">UHD Export</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Benefits Footer */}
        <div className="mt-32 pt-10 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
           <Benefit label="Mobile First (9:16)" icon={<Video size={18}/>} />
           <Benefit label="Direct Export" icon={<ImageIcon size={18}/>} />
           <Benefit label="Zero Space Waste" icon={<Sparkles size={18}/>} />
           <Benefit label="Pro Quality" icon={<UserX size={18}/>} />
        </div>

      </div>
    </section>
  );
};

const Benefit = ({ label, icon }: any) => (
  <div className="flex items-center gap-3 text-slate-500 font-bold uppercase text-[10px] tracking-widest">
     <div className="text-primary">{icon}</div>
     {label}
  </div>
);