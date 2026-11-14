import React from 'react';
import { ObservationRecord, Plant, CATEGORY_DEFINITIONS } from '../types';
import { X, Calendar } from 'lucide-react';
import { ImageComparisonViewer } from './ImageComparisonViewer';

interface ObservationDetailModalProps {
  observation: ObservationRecord | null;
  plant: Plant;
  previousObservation: ObservationRecord | null;
  onClose: () => void;
}

export const ObservationDetailModal: React.FC<ObservationDetailModalProps> = ({
  observation,
  plant,
  previousObservation,
  onClose,
}) => {
  if (!observation) return null;

  const previousImageUrl = previousObservation?.image || plant.coverImage;

  const getCategoryMeta = (catId: string) => {
    return CATEGORY_DEFINITIONS.find((c) => c.id === catId) || {
      id: catId,
      label: catId,
      icon: '🌿',
      description: '',
    };
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F5] border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#76877A] hover:text-[#16281D] p-2 rounded-xl cursor-pointer bg-[#FAF8F5]/90 hover:bg-[#EFECE5]"
          aria-label="Close detail modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium">
            <span>{plant.name} · {plant.species}</span>
            <span>·</span>
            <span>Milestone Record</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#16281D] font-normal tracking-tight mt-1">
            Observation Day {observation.dayNumber}
          </h2>
          <p className="text-xs font-sans text-[#566B5C] mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{observation.date}</span>
          </p>
        </div>

        {/* Before / After Comparison */}
        <div className="mb-8">
          <ImageComparisonViewer
            beforeImage={previousImageUrl}
            afterImage={observation.image}
            beforeLabel={`Previous · Day ${previousObservation ? previousObservation.dayNumber : 1}`}
            afterLabel={`Observed · Day ${observation.dayNumber}`}
          />
        </div>

        {/* Written Notes */}
        {observation.humanNote && (
          <div className="p-4 rounded-2xl bg-[#F3EFE7] border border-[#E2DAD0] mb-6">
            <span className="text-[10px] uppercase tracking-wider text-[#76877A] font-sans font-medium block">
              Human Observation Note:
            </span>
            <p className="font-serif italic text-base text-[#1E3224] mt-1">
              “{observation.humanNote}”
            </p>
          </div>
        )}

        {/* Three Finding Groups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Both Noticed */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D7]">
            <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#16281D] mb-3 pb-2 border-b border-[#E7E2D7]">
              <span>🤝</span>
              <span>Both Noticed ({observation.bothCategories?.length || 0})</span>
            </div>
            {observation.bothCategories?.length > 0 ? (
              <div className="space-y-1.5">
                {observation.bothCategories.map((c) => (
                  <div key={c} className="text-xs font-sans text-[#203D2A] bg-[#EDE8DE] px-2.5 py-1.5 rounded-lg">
                    {getCategoryMeta(c).icon} {getCategoryMeta(c).label}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-[#76877A] italic">No shared tags</span>
            )}
          </div>

          {/* You Noticed */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D7]">
            <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#16281D] mb-3 pb-2 border-b border-[#E7E2D7]">
              <span>👁</span>
              <span>You Noticed ({observation.humanCategories?.length || 0})</span>
            </div>
            {observation.humanCategories?.length > 0 ? (
              <div className="space-y-1.5">
                {observation.humanCategories.map((c) => (
                  <div key={c} className="text-xs font-sans text-[#16281D] bg-[#EDE8DE] px-2.5 py-1.5 rounded-lg">
                    {getCategoryMeta(c).icon} {getCategoryMeta(c).label}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-[#76877A] italic">None selected</span>
            )}
          </div>

          {/* LeafStory Noticed */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D7]">
            <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#16281D] mb-3 pb-2 border-b border-[#E7E2D7]">
              <span>🍃</span>
              <span>LeafStory Noticed ({observation.aiChanges?.length || 0})</span>
            </div>
            {observation.aiChanges?.length > 0 ? (
              <div className="space-y-1.5">
                {observation.aiChanges.map((change, i) => (
                  <div key={i} className="text-xs font-sans text-[#304B37] bg-[#EEF3EE] px-2.5 py-1.5 rounded-lg">
                    {getCategoryMeta(change.category).icon} {change.description}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-[#76877A] italic">Aligned with human</span>
            )}
          </div>
        </div>

        {/* LeafStory Reflection */}
        {observation.aiReflectiveSummary && (
          <div className="text-center p-4 bg-[#F3EFE7] border border-[#E2DAD0] rounded-2xl text-xs font-serif italic text-[#304735]">
            LeafStory Reflection: “{observation.aiReflectiveSummary}”
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#E7E2D7] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#16281D] text-white text-xs font-sans font-medium hover:bg-[#233F2E] cursor-pointer"
          >
            Close Observation
          </button>
        </div>
      </div>
    </div>
  );
};
