import React, { useState } from 'react';
import {
  Plant,
  ObservationRecord,
  ObservationCategory,
  ObservationChange,
  CATEGORY_DEFINITIONS,
  PinMarker,
  HumanEvaluation,
} from '../../types';
import { ArrowRight, Check, HelpCircle, X, MessageSquare } from 'lucide-react';

interface ComparisonRevealStepProps {
  plant: Plant;
  previousObservation: ObservationRecord | null;
  currentPhotoUrl: string;
  humanCategories: ObservationCategory[];
  humanNote: string;
  humanPins: PinMarker[];
  aiChanges: ObservationChange[];
  aiReflectiveSummary?: string;
  isSilentMode?: boolean;
  onUpdateAiEvaluation: (index: number, evalType: HumanEvaluation, note?: string) => void;
  onProceedToReflection: () => void;
}

export const ComparisonRevealStep: React.FC<ComparisonRevealStepProps> = ({
  plant,
  previousObservation,
  currentPhotoUrl,
  humanCategories,
  humanNote,
  humanPins,
  aiChanges,
  aiReflectiveSummary,
  isSilentMode = false,
  onUpdateAiEvaluation,
  onProceedToReflection,
}) => {
  const [evalNotes, setEvalNotes] = useState<Record<number, string>>({});
  const [activeNoteInput, setActiveNoteInput] = useState<number | null>(null);

  const previousImageUrl = previousObservation?.image || plant.coverImage;

  const aiCategories = Array.from(new Set(aiChanges.map((c) => c.category)));

  // 🤝 BOTH NOTICED
  const bothNoticed = humanCategories.filter((cat) => aiCategories.includes(cat));

  // 👁 YOU NOTICED ONLY
  const youNoticedOnly = humanCategories.filter((cat) => !aiCategories.includes(cat));

  // 🍃 LEAFSTORY NOTICED ONLY
  const leafstoryNoticedOnly = aiChanges.filter((change) => !humanCategories.includes(change.category));

  const getCategoryMeta = (catId: ObservationCategory) => {
    return CATEGORY_DEFINITIONS.find((c) => c.id === catId) || {
      id: catId,
      label: catId,
      icon: '🌿',
      description: '',
    };
  };

  const handleEvaluationClick = (index: number, evalType: HumanEvaluation) => {
    onUpdateAiEvaluation(index, evalType, evalNotes[index]);
    if (evalType === 'differently') {
      setActiveNoteInput(index);
    } else {
      setActiveNoteInput(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
          Human + AI Perspective
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight mt-1.5">
          Shared Observation
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-[#4E6153] mt-2 font-light">
          “Two perspectives observing the same growing life.”
        </p>
      </div>

      {/* Side-by-Side Large Comparison Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
        {/* Previous Reference Photo */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-sans text-[#76877A] px-1">
            <span className="uppercase tracking-wider font-medium">Previous Milestone</span>
            <span>{previousObservation?.date || plant.firstObservationDate}</span>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#EAE5DC] shadow-sm border border-[#DCD6C9]">
            <img
              src={previousImageUrl}
              alt="Previous observation"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Current Observation Photo with Placed Markers */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-sans px-1">
            <span className="uppercase tracking-wider font-semibold text-[#16281D]">Today’s Observation</span>
            <span className="text-[#203D2A] font-medium">Recorded with shared attention</span>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#EAE5DC] shadow-sm border-2 border-[#16281D]">
            <img
              src={currentPhotoUrl}
              alt="Today's observation"
              className="w-full h-full object-cover"
            />

            {/* Human pins */}
            {humanPins.map((pin, i) => (
              <div
                key={`human-pin-${i}`}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                title={`You pinned: Point ${i + 1}`}
              >
                <div className="w-8 h-8 rounded-full bg-[#16281D] text-white border-2 border-white shadow-md flex items-center justify-center text-xs font-sans font-bold">
                  👁
                </div>
              </div>
            ))}

            {/* AI pins */}
            {aiChanges.map((change, i) => {
              if (!change.approximateLocation) return null;
              return (
                <div
                  key={`ai-pin-${i}`}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${change.approximateLocation.xPercent}%`,
                    top: `${change.approximateLocation.yPercent}%`,
                  }}
                  title={`LeafStory noticed: ${change.description}`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#345741] text-white border-2 border-white shadow-md flex items-center justify-center text-xs font-sans">
                    🍃
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Celebration Banner: You Noticed It First */}
      {youNoticedOnly.length > 0 && (
        <div className="mb-10 p-6 bg-[#F3EFE7] border border-[#E0D8CA] rounded-3xl flex items-start gap-4 shadow-xs">
          <span className="text-2xl mt-0.5">✨</span>
          <div>
            <h3 className="font-serif text-xl text-[#16281D] font-normal">
              You noticed it first.
            </h3>
            <p className="text-xs sm:text-sm text-[#4E6153] font-sans mt-1 leading-relaxed">
              You recorded a change LeafStory didn’t confidently identify. Human sensitivity to your own living companion remains the true center of this journal.
            </p>
          </div>
        </div>
      )}

      {/* Three Groups of Findings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* GROUP 1: 🤝 BOTH NOTICED */}
        <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E7E2D7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#E7E2D7] mb-4">
              <span className="text-xl">🤝</span>
              <div>
                <h3 className="font-serif text-lg text-[#16281D] font-medium">Both Noticed</h3>
                <span className="text-[11px] text-[#76877A] font-sans block">Shared independent discovery</span>
              </div>
            </div>

            {bothNoticed.length > 0 ? (
              <div className="space-y-3">
                {bothNoticed.map((catId) => {
                  const meta = getCategoryMeta(catId);
                  const matchingAi = aiChanges.find((c) => c.category === catId);
                  return (
                    <div key={catId} className="p-3.5 bg-[#EDE8DE] rounded-xl border border-[#DFD8CC]">
                      <div className="flex items-center gap-2 font-sans text-xs font-semibold text-[#16281D]">
                        <span>{meta.icon}</span>
                        <span>{meta.label}</span>
                      </div>
                      {matchingAi && (
                        <p className="text-xs text-[#526557] font-sans mt-1.5 leading-relaxed">
                          {matchingAi.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs font-sans text-[#76877A] italic py-4">
                No overlapping tags this session — each eye caught a unique aspect.
              </p>
            )}
          </div>
        </div>

        {/* GROUP 2: 👁 YOU NOTICED */}
        <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E7E2D7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#E7E2D7] mb-4">
              <span className="text-xl">👁</span>
              <div>
                <h3 className="font-serif text-lg text-[#16281D] font-medium">You Noticed</h3>
                <span className="text-[11px] text-[#76877A] font-sans block">Human intuition & attention</span>
              </div>
            </div>

            {humanCategories.length > 0 ? (
              <div className="space-y-3">
                {humanCategories.map((catId) => {
                  const meta = getCategoryMeta(catId);
                  const isUniqueToUser = youNoticedOnly.includes(catId);
                  return (
                    <div
                      key={catId}
                      className={`p-3.5 rounded-xl border ${
                        isUniqueToUser
                          ? 'bg-[#F4EFE6] border-[#DCD3C3]'
                          : 'bg-[#EDE8DE]/60 border-[#DFD8CC]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-sans text-xs font-semibold text-[#16281D]">
                          <span>{meta.icon}</span>
                          <span>{meta.label}</span>
                        </span>
                        {isUniqueToUser && (
                          <span className="text-[10px] uppercase tracking-wider text-[#203D2A] font-semibold">
                            Human first
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {humanNote && (
                  <div className="mt-4 p-3.5 bg-white rounded-xl border border-[#E7E2D7]">
                    <span className="text-[10px] uppercase tracking-wider text-[#76877A] font-sans block">
                      Your note:
                    </span>
                    <p className="font-serif italic text-xs text-[#203427] mt-1 leading-relaxed">
                      “{humanNote}”
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs font-sans text-[#76877A] italic py-4">
                No human categories were recorded.
              </p>
            )}
          </div>
        </div>

        {/* GROUP 3: 🍃 LEAFSTORY NOTICED (With Mandatory Human Evaluation) */}
        <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#E7E2D7] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3.5 border-b border-[#E7E2D7] mb-4">
              <span className="text-xl">🍃</span>
              <div>
                <h3 className="font-serif text-lg text-[#16281D] font-medium">LeafStory Noticed</h3>
                <span className="text-[11px] text-[#76877A] font-sans block">Second perspective</span>
              </div>
            </div>

            {leafstoryNoticedOnly.length > 0 ? (
              <div className="space-y-4">
                {leafstoryNoticedOnly.map((change, i) => {
                  const meta = getCategoryMeta(change.category);
                  const evalState = change.humanEvaluation;

                  return (
                    <div key={i} className="p-3.5 bg-[#EEF3EE] rounded-2xl border border-[#D5E0D7] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-sans text-xs font-semibold text-[#16281D]">
                          <span>{meta.icon}</span>
                          <span>{meta.label}</span>
                        </span>
                      </div>
                      <p className="text-xs text-[#3E5544] font-sans leading-relaxed">
                        {change.description}
                      </p>

                      {/* Human Evaluates AI Findings */}
                      <div className="pt-2 border-t border-[#D5E0D7]/60">
                        <span className="text-[10px] uppercase tracking-wider text-[#76877A] font-sans block mb-1.5">
                          Does this perspective resonate?
                        </span>
                        <div className="grid grid-cols-3 gap-1.5 text-[11px] font-sans">
                          <button
                            type="button"
                            onClick={() => handleEvaluationClick(i, 'see_it')}
                            className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                              evalState === 'see_it'
                                ? 'bg-[#16281D] text-white border-[#16281D] font-medium'
                                : 'bg-white border-[#DDD7CC] text-[#3E5544] hover:border-[#16281D]'
                            }`}
                          >
                            ✓ I see it
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEvaluationClick(i, 'not_sure')}
                            className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                              evalState === 'not_sure'
                                ? 'bg-[#4E6153] text-white border-[#4E6153] font-medium'
                                : 'bg-white border-[#DDD7CC] text-[#566B5C] hover:border-[#16281D]'
                            }`}
                          >
                            ? Not sure
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEvaluationClick(i, 'differently')}
                            className={`p-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                              evalState === 'differently'
                                ? 'bg-[#8C342A] text-white border-[#8C342A] font-medium'
                                : 'bg-white border-[#DDD7CC] text-[#8C342A] hover:border-[#8C342A]'
                            }`}
                          >
                            ✕ Differently
                          </button>
                        </div>

                        {activeNoteInput === i && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={evalNotes[i] || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEvalNotes((prev) => ({ ...prev, [i]: val }));
                                onUpdateAiEvaluation(i, 'differently', val);
                              }}
                              placeholder="Briefly explain what your eyes see instead..."
                              className="w-full p-2 text-xs font-sans rounded-lg border border-[#DDD7CC] bg-white text-[#16281D] focus:border-[#16281D] outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-[#EDE8DE]/40 rounded-xl text-xs font-sans text-[#526557] leading-relaxed">
                LeafStory observed in harmonious alignment with your recorded observations.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reflective Synthesis */}
      {aiReflectiveSummary && (
        <div className="text-center p-6 bg-[#F3EFE7] border border-[#E4DDD0] rounded-3xl max-w-2xl mx-auto mb-10 shadow-xs">
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans block mb-1">
            Reflective Synthesis
          </span>
          <p className="font-serif italic text-base sm:text-lg text-[#16281D]">
            “{aiReflectiveSummary}”
          </p>
        </div>
      )}

      {/* Primary Action to Proceed to Reflection */}
      <div className="text-center">
        <button
          onClick={onProceedToReflection}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-sans font-medium bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] active:scale-[0.99] transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16281D]"
        >
          <span>Continue to Final Reflection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
