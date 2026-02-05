import React from 'react';
import { Image as ImageIcon, Video, Wand2, UserX, ScanEye, LayoutPanelTop } from 'lucide-react';

interface SolutionCardProps {
  title: string;
  description: string;
  items?: string[];
  icon: React.ElementType;
  iconColor: string;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ title, description, items, icon: Icon, iconColor }) => (
  <div className="group relative p-8 rounded-2xl bg-surface border border-white/5 hover:border-white/10 transition-all duration-300 hover:bg-surfaceHighlight h-full flex flex-col">
    <div className={`w-12 h-12 rounded-full ${iconColor} bg-opacity-10 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
      <Icon className={`w-6 h-6 ${iconColor.replace('bg-', 'text-').replace('/10', '')}`} />
    </div>
    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-text-muted text-sm leading-relaxed mb-4 flex-grow">{description}</p>
    
    {items && (
      <ul className="space-y-2 mt-auto">
        {items.map((item, i) => (
          <li key={i} className="flex items-center text-xs text-slate-400">
            <div className="w-1 h-1 rounded-full bg-primary/50 mr-2"></div>
            {item}
          </li>
        ))}
      </ul>
    )}

    {/* Glow Effect on Hover */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
  </div>
);

export const Features: React.FC = () => {
  const features = [
    {
      title: "Image Ads",
      description: "AI-Generated Product Images with studio-grade lighting and accurate branding.",
      items: ["Studio-grade lighting", "Accurate branding & text", "Social-media ready", "Multiple aspect ratios"],
      icon: ImageIcon,
      iconColor: "bg-blue-500 text-blue-500"
    },
    {
      title: "UGC Ads",
      description: "Human-Like UGC Videos with casual realism and natural dialogue.",
      items: ["Casual iPhone realism", "Natural dialogue", "Creator-style framing", "High engagement formats"],
      icon: Video,
      iconColor: "bg-pink-500 text-pink-500"
    },
    {
      title: "VFX Ads",
      description: "Cinematic VFX Commercials for premium brand storytelling.",
      items: ["Particles, glow, smoke", "Smooth camera motion", "Premium brand storytelling", "Movie-style visuals"],
      icon: Wand2,
      iconColor: "bg-purple-500 text-purple-500"
    },
    {
      title: "No-Human Ads",
      description: "Clean Product-Only Videos with elegant motion and minimal backgrounds.",
      items: ["No faces or hands", "Elegant motion", "Minimal premium backgrounds", "Perfect for global brands"],
      icon: UserX,
      iconColor: "bg-green-500 text-green-500"
    },
    {
      title: "Product Accuracy Engine",
      description: "AI that verifies every detail to ensure zero hallucinations.",
      items: ["AI checks shape & color", "Text consistency verification", "Zero hallucinated packaging", "Brand safe assurance"],
      icon: ScanEye,
      iconColor: "bg-orange-500 text-orange-500"
    },
    {
      title: "Instant UI Delivery",
      description: "Ads delivered directly to your dashboard. No wait, no friction.",
      items: ["Direct UI preview", "Instant download", "Mobile-first workflow", "High-speed rendering"],
      icon: LayoutPanelTop,
      iconColor: "bg-cyan-500 text-cyan-500"
    }
  ];

  return (
    <section id="features" className="py-24 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
            Powerful Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything You Need to Create Ads</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Powered by autonomous AI agents that understand your brand and product.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <SolutionCard 
              key={index} 
              title={feature.title} 
              description={feature.description} 
              items={feature.items}
              icon={feature.icon}
              iconColor={feature.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};