import React, { useState } from 'react';
import { Plant, ObservationChange, ObservationCategory, CATEGORY_DEFINITIONS } from '../../types';
import { Eye, Check, ArrowRight, HelpCircle } from 'lucide-react';

interface LookAgainStepProps {
  plant: Plant;
  currentPhotoUrl: string;
  unnoticedChanges: ObservationChange[];
  humanCategories: ObservationCategory[];
  onHumanDiscoveredMore: (newCategories: ObservationCategory[]) => void;
  onProceedToReveal: () => void;
}

export const LookAgainStep: React.FC<LookAgainStepProps> = ({
  plant,
  currentPhotoUrl,
  unnoticedChanges,
  humanCategories,
  onHumanDiscoveredMore,
  onProceedToReveal,
}) => {
  const [userState, setUserState] = useState<'prompt' | 'discovering'>('prompt');
  const [newlySelected, setNewlySelected] = useState<ObservationCategory[]>([]);

  const targetChange = unnoticedChanges[0];
  const subtleCue =
    targetChange?.suggestedCue ||
    'Take another look near the canopy margins. Do you notice anything subtle?';

  const handleToggleNewCategory = (catId: ObservationCategory) => {
    setNewlySelected((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handleConfirmDiscovered = () => {
    if (newlySelected.length > 0) {
      onHumanDiscoveredMore(newlySelected);
    }
    onProceedToReveal();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Editorial Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium flex items-center justify-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#203D2A]" />
          <span>Look Again</span>
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight mt-1.5">
          Take another look.
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-[#4E6153] mt-2 font-light">
          “LeafStory noticed another quiet detail. Before we reveal it, take a moment to see if your eye catches it too.”
        </p>
      </div>

      {/* Large Image with Soft Focus Circle */}
      <div className="relative rounded-3xl overflow-hidden aspect-[4/3] max-h-[500px] bg-[#EAE5DC] shadow-sm border border-[#DCD6C9] mx-auto mb-8">
        <img
          src={currentPhotoUrl}
          alt="Close observation area"
          className="w-full h-full object-cover"
        />

        {/* Gentle Natural Aperture / Cue Location */}
        {targetChange?.approximateLocation && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${targetChange.approximateLocation.xPercent}%`,
              top: `${targetChange.approximateLocation.yPercent}%`,
            }}
          >
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/90 shadow-sm animate-soft-pulse flex items-center justify-center">
              <span className="text-[10px] uppercase tracking-widest text-[#16281D] font-sans font-semibold bg-white/95 px-2.5 py-0.5 rounded shadow-xs">
                Look here
              </span>
            </div>
          </div>
        )}

        {/* Floating Subtle Cue Banner */}
        <div className="absolute bottom-5 inset-x-5 sm:inset-x-10 bg-[#16281D]/85 backdrop-blur-md text-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-white/10 text-center shadow-lg">
          <p className="font-serif italic text-sm sm:text-base leading-relaxed">
            “{subtleCue}”
          </p>
        </div>
      </div>

      {/* Interactive Selection or Proceed */}
      {userState === 'prompt' ? (
        <div className="text-center max-w-lg mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setUserState('discovering')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] font-sans text-xs sm:text-sm font-semibold cursor-pointer shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>I notice something!</span>
            </button>

            <button
              onClick={onProceedToReveal}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white border border-[#DDD7CC] hover:border-[#16281D] text-[#566B5C] hover:text-[#16281D] font-sans text-xs sm:text-sm font-medium cursor-pointer transition-all"
            >
              <span>Not sure</span>
            </button>

            <button
              onClick={onProceedToReveal}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#EDE8DE] hover:bg-[#E3DDCF] text-[#16281D] font-sans text-xs sm:text-sm font-medium cursor-pointer transition-all"
            >
              <span>Show me what LeafStory noticed</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#FAF8F5] border border-[#16281D]/60 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
          <h3 className="font-serif text-2xl text-[#16281D] font-normal mb-1">
            Wonderful. What caught your eye?
          </h3>
          <p className="text-xs text-[#76877A] font-sans mb-6">
            Tag the additional change you observed upon closer inspection:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
            {CATEGORY_DEFINITIONS.filter((c) => !humanCategories.includes(c.id)).map((cat) => {
              const isSelected = newlySelected.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleToggleNewCategory(cat.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between text-xs font-sans ${
                    isSelected
                      ? 'border-[#16281D] bg-[#EDE8DE] font-semibold text-[#16281D]'
                      : 'border-[#DDD7CC] bg-white text-[#4A5E50] hover:border-[#16281D]/40'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#16281D]" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E2D7]">
            <button
              onClick={onProceedToReveal}
              className="px-4 py-2 text-xs font-sans text-[#76877A] hover:text-[#16281D] cursor-pointer"
            >
              Skip
            </button>
            <button
              onClick={handleConfirmDiscovered}
              disabled={newlySelected.length === 0}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-sans font-medium transition-all ${
                newlySelected.length > 0
                  ? 'bg-[#16281D] text-white hover:bg-[#233F2E] cursor-pointer'
                  : 'bg-[#D6CFC3] text-[#867E72] cursor-not-allowed'
              }`}
            >
              <span>Add to my discoveries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
