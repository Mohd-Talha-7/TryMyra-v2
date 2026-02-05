import React from 'react';
import { ArrowRight, Upload, BrainCircuit, Sparkles, LayoutPanelTop } from 'lucide-react';

export const WorkflowVisualizer: React.FC = () => {
  return (
    <section id="workflow" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-surface/50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm">How it works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">From Product Image to Ad — In 4 Steps</h2>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-8 relative max-w-5xl mx-auto">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center w-full md:w-1/4 text-center z-10">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-white/10 flex items-center justify-center mb-4 shadow-xl group hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-white font-semibold mb-2">1. Submit Product</h4>
            <p className="text-sm text-text-muted">Upload product image and choose your desired ad type.</p>
          </div>

          <ArrowRight className="text-white/20 w-8 h-8 hidden md:block" />
          <div className="w-0.5 h-12 bg-white/10 md:hidden mx-auto"></div>

          {/* Step 2 */}
          <div className="flex flex-col items-center w-full md:w-1/4 text-center z-10">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-white/10 flex items-center justify-center mb-4 shadow-xl group hover:border-primary/50 transition-colors">
              <BrainCircuit className="w-8 h-8 text-secondary" />
            </div>
            <h4 className="text-white font-semibold mb-2">2. AI Analysis</h4>
            <p className="text-sm text-text-muted">AI extracts brand details, detects style, and analyzes product features.</p>
          </div>

          <ArrowRight className="text-white/20 w-8 h-8 hidden md:block" />
          <div className="w-0.5 h-12 bg-white/10 md:hidden mx-auto"></div>

          {/* Step 3 */}
          <div className="flex flex-col items-center w-full md:w-1/4 text-center z-10">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-white/10 flex items-center justify-center mb-4 shadow-xl group hover:border-primary/50 transition-colors">
              <Sparkles className="w-8 h-8 text-pink-500" />
            </div>
            <h4 className="text-white font-semibold mb-2">3. Multi-Agent Gen</h4>
            <p className="text-sm text-text-muted">Specialized agents (VFX, Image, Video) generate and validate quality.</p>
          </div>

          <ArrowRight className="text-white/20 w-8 h-8 hidden md:block" />
          <div className="w-0.5 h-12 bg-white/10 md:hidden mx-auto"></div>

          {/* Step 4 */}
          <div className="flex flex-col items-center w-full md:w-1/4 text-center z-10">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-white/10 flex items-center justify-center mb-4 shadow-xl group hover:border-primary/50 transition-colors">
              <LayoutPanelTop className="w-8 h-8 text-green-500" />
            </div>
            <h4 className="text-white font-semibold mb-2">4. Delivery</h4>
            <p className="text-sm text-text-muted">Final ads are rendered and displayed instantly on your screen.</p>
          </div>

        </div>
      </div>
    </section>
  );
};