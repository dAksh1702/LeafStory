import React, { useState } from 'react';
import { Plant, ResourceCategory } from '../../types';
import { RECOMMENDED_RESOURCES } from '../../data/recommendedResources';
import { Sparkles, ArrowRight, BookOpen, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface RecommendedResourcesSectionProps {
  plant?: Plant;
}

export const RecommendedResourcesSection: React.FC<RecommendedResourcesSectionProps> = ({ plant }) => {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);

  // If a specific plant is provided, prioritize categories suggested for its species
  const relevantCategories = plant
    ? RECOMMENDED_RESOURCES.filter(
        (r) => !r.suggestedForSpecies || r.suggestedForSpecies.includes(plant.species)
      )
    : RECOMMENDED_RESOURCES;

  return (
    <div className="space-y-6 text-[#16281D]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-[#E7E2D7]">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#76877A] font-sans font-semibold block">
            Care & Environment Support
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal tracking-tight mt-0.5">
            Recommended Resources
          </h3>
          <p className="font-serif italic text-xs sm:text-sm text-[#4E6153] mt-1 font-light">
            {plant ? `Botanical resource guides tailored for ${plant.name} (${plant.species})` : 'Curated categories for thriving indoor specimens'}
          </p>
        </div>
      </div>

      {/* Grid of Resource Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relevantCategories.map((category) => {
          const isExpanded = selectedCategory?.id === category.id;

          return (
            <div
              key={category.id}
              className={`p-5 rounded-2xl border transition-all ${
                isExpanded
                  ? 'bg-white border-[#16281D] shadow-md ring-1 ring-[#16281D]'
                  : 'bg-white border-[#E5DFD4] hover:border-[#16281D]/40 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{category.icon}</span>
                <span className="text-[10px] uppercase tracking-wider text-[#76877A] font-sans font-medium bg-[#F4EFE6] px-2 py-0.5 rounded">
                  {category.shortTagline}
                </span>
              </div>

              <h4 className="font-serif text-lg text-[#16281D] font-medium mb-1">
                {category.name}
              </h4>
              <p className="text-xs text-[#566B5C] font-sans leading-relaxed mb-3">
                {category.description}
              </p>

              {/* Educational Tip Box */}
              <div className="p-3 rounded-xl bg-[#F7F4EC] border border-[#E7E2D7] text-[11px] text-[#243E2B] font-sans mb-3">
                <span className="font-semibold block mb-0.5">💡 Observation Insight:</span>
                <p className="text-[#4E6153] leading-relaxed">{category.educationalTip}</p>
              </div>

              {/* Sample Items Drawer Toggle */}
              <button
                type="button"
                onClick={() => setSelectedCategory(isExpanded ? null : category)}
                className="w-full pt-2 border-t border-[#F0EBE1] flex items-center justify-between text-xs font-sans text-[#16281D] font-medium hover:text-[#243E2B] cursor-pointer"
              >
                <span>{isExpanded ? 'Hide Options' : 'Explore Category Options'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* Expanded items list */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-[#F0EBE1] space-y-2.5 animate-fade-in text-xs font-sans">
                  {category.sampleItems.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#DDD7CC] space-y-1">
                      <span className="font-semibold text-[#16281D] block">{item.name}</span>
                      <p className="text-[#566B5C] text-[11px] leading-relaxed">{item.description}</p>
                      <span className="text-[10px] text-[#203D2A] font-medium block">
                        ✓ {item.suitability}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
