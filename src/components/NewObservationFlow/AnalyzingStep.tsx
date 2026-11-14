import React from 'react';
import { Sprout } from 'lucide-react';

export const AnalyzingStep: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-32 text-center">
      <div className="w-16 h-16 rounded-full bg-[#EFECE5] text-[#203D2A] flex items-center justify-center mx-auto mb-6 shadow-xs animate-soft-pulse">
        <Sprout className="w-8 h-8" />
      </div>

      <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
        Second Perspective
      </span>

      <h2 className="font-serif text-3xl text-[#16281D] font-normal tracking-tight mt-2">
        LeafStory is observing quietly...
      </h2>

      <p className="font-serif italic text-base text-[#4E6153] mt-3 font-light leading-relaxed">
        “Comparing leaf forms, light alignment, and physical changes without rushing.”
      </p>

      <div className="mt-8 flex justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#76877A] animate-ping" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#76877A] animate-pulse" />
        <span className="w-1.5 h-1.5 rounded-full bg-[#76877A]" />
      </div>
    </div>
  );
};
