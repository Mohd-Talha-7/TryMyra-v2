import React from 'react';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, features, isPopular }) => (
  <div className={`relative p-8 rounded-3xl border flex flex-col h-full ${
    isPopular 
      ? 'bg-surface border-primary shadow-[0_0_40px_-10px_rgba(47,107,255,0.3)]' 
      : 'bg-surface/50 border-white/5 hover:border-white/10'
  }`}>
    {isPopular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
        Most Popular
      </div>
    )}
    
    <div className="mb-6">
      <h3 className="text-lg font-medium text-slate-300">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <span className="text-4xl font-bold text-white">{price}</span>
        {price !== 'Custom' && <span className="text-slate-500 ml-2">/month</span>}
      </div>
    </div>

    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start text-sm text-slate-300">
          <Check size={18} className="text-primary mr-3 flex-shrink-0" />
          {feature}
        </li>
      ))}
    </ul>

    <button className={`w-full py-3 rounded-xl font-bold transition-all ${
      isPopular 
        ? 'bg-primary hover:bg-primaryDark text-white' 
        : 'bg-surfaceHighlight hover:bg-white/10 text-white border border-white/10'
    }`}>
      {price === 'Custom' ? 'Contact Sales' : 'Get Started'}
    </button>
  </div>
);

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-background border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-text-muted max-w-2xl mx-auto">
            Choose the plan that fits your creative needs. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard 
            title="Starter" 
            price="$29" 
            features={[
              "10 Image Ads / month",
              "5 Video Ads / month",
              "WhatsApp delivery",
              "Standard processing speed",
              "Basic support"
            ]} 
          />
          <PricingCard 
            title="Pro" 
            price="$99" 
            isPopular={true}
            features={[
              "Unlimited Image Ads",
              "30 Video Ads / month",
              "All ad types (UGC, VFX)",
              "Priority processing",
              "WhatsApp & Email delivery",
              "Priority support"
            ]} 
          />
          <PricingCard 
            title="Business" 
            price="Custom" 
            features={[
              "Unlimited Everything",
              "Custom workflows",
              "API Access",
              "Dedicated account manager",
              "Custom branding",
              "SLA guarantees"
            ]} 
          />
        </div>
      </div>
    </section>
  );
};