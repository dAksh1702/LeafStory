import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ParallelStoriesBannerProps {
  onSelectStory: (story: 'growth_story' | 'observation_journey') => void;
}

export const ParallelStoriesBanner: React.FC<ParallelStoriesBannerProps> = ({ onSelectStory }) => {
  return (
    <section className="my-16 border-y border-[#E7E2D7] py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            The Two Parallel Stories of LeafStory
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal mt-1">
            Every observation holds two reflections.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Story 1: Growth Story */}
          <div
            onClick={() => onSelectStory('growth_story')}
            className="group cursor-pointer rounded-3xl p-6 sm:p-8 border border-[#E7E2D7] bg-[#FAF8F5] hover:border-[#16281D]/40 transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl" role="img" aria-label="Seedling">🌱</span>
                <span className="text-[11px] tracking-wider text-[#76877A] uppercase font-sans font-medium">Story 1</span>
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#16281D] group-hover:text-[#284934] transition-colors">
                Growth Story
              </h3>
              <p className="font-serif italic text-sm text-[#4E6153] mt-1">
                “How is my plant changing?”
              </p>
              <p className="text-xs text-[#6B7E70] font-sans leading-relaxed mt-3">
                A visual timeline capturing leaf splits, orientation shifts, and physical expansion over days and seasons.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E7E2D7] flex items-center justify-between text-xs font-sans font-medium text-[#16281D]">
              <span>Explore timeline & split slider</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Story 2: Observation Journey */}
          <div
            onClick={() => onSelectStory('observation_journey')}
            className="group cursor-pointer rounded-3xl p-6 sm:p-8 border border-[#E7E2D7] bg-[#FAF8F5] hover:border-[#16281D]/40 transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl" role="img" aria-label="Eye">👁</span>
                <span className="text-[11px] tracking-wider text-[#76877A] uppercase font-sans font-medium">Story 2 · Flagship</span>
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#16281D] group-hover:text-[#284934] transition-colors">
                Observation Journey
              </h3>
              <p className="font-serif italic text-sm text-[#4E6153] mt-1">
                “How is the way I notice changing?”
              </p>
              <p className="text-xs text-[#6B7E70] font-sans leading-relaxed mt-3">
                A mindful reflection on your evolving attention—from obvious new leaves to delicate tilts, shadows, and light alignment.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E7E2D7] flex items-center justify-between text-xs font-sans font-medium text-[#16281D]">
              <span>See how your eye grows</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
