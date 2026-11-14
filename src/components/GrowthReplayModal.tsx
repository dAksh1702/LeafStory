import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ObservationRecord, Plant, CATEGORY_DEFINITIONS } from '../types';
import { X, Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Sprout, Eye } from 'lucide-react';

interface GrowthReplayModalProps {
  isOpen: boolean;
  plant: Plant;
  observations: ObservationRecord[];
  onClose: () => void;
}

export const GrowthReplayModal: React.FC<GrowthReplayModalProps> = ({
  isOpen,
  plant,
  observations,
  onClose,
}) => {
  const sorted = [...observations]
    .filter((o) => o.plantId === plant.id)
    .sort((a, b) => a.dayNumber - b.dayNumber);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const timerRef = useRef<any>(null);
  const touchStartXRef = useRef<number | null>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < sorted.length - 1 ? prev + 1 : 0));
  }, [sorted.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : sorted.length - 1));
  }, [sorted.length]);

  // Autoplay loop
  useEffect(() => {
    if (!isOpen || sorted.length === 0) {
      setIsPlaying(false);
      setCurrentIndex(0);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (isPlaying) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 3500); // 3.5s per milestone
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPlaying, sorted.length, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handlePrev();
      else handleNext();
    }
    touchStartXRef.current = null;
  };

  if (!isOpen || sorted.length === 0) return null;

  const currentObs = sorted[currentIndex];

  // Helper to format category tags
  const getCategoryLabel = (id: string) => {
    const found = CATEGORY_DEFINITIONS.find((c) => c.id === id);
    return found ? found.label.split('/')[0].trim() : id;
  };

  const bothNoticedTags = (currentObs.bothCategories || []).map(getCategoryLabel);
  const humanOnlyTags = (currentObs.humanOnlyCategories || []).map(getCategoryLabel);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`${plant.name} Growth Story Replay`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="bg-[#FAF8F5] border border-[#E7E2D7] rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl relative my-auto text-[#1E2923] flex flex-col"
      >
        {/* Top Header Bar */}
        <div className="px-5 sm:px-8 py-4 border-b border-[#EAE5DC] flex items-center justify-between bg-white/70 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3D5A45] animate-pulse" />
            <div>
              <span className="font-serif text-lg sm:text-xl font-normal text-[#1E2923] block leading-none">
                {plant.name} · Growth Story Replay
              </span>
              <span className="text-[11px] font-sans text-[#536159] mt-0.5 block">
                {plant.species} · Milestone {currentIndex + 1} of {sorted.length}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#536159] hover:text-[#1E2923] hover:bg-[#EFECE5] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close replay modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Side-by-Side on Desktop (lg:grid-cols-12), Stacked on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 items-stretch">
          {/* 1. PLANT IMAGE (Unobstructed Hero) */}
          <div className="lg:col-span-7 bg-[#EAE5DC] relative overflow-hidden flex items-center justify-center aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[460px]">
            <img
              key={currentObs.id}
              src={currentObs.image}
              alt={`Milestone Day ${currentObs.dayNumber}`}
              className="w-full h-full object-cover transition-opacity duration-500 ease-in-out"
            />

            {/* Subtle light botanical day tag pinned at top-left of image */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
              }}
              className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-sans font-medium text-[#1E2923] shadow-xs flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#3D5A45]" />
              <span>Day {currentObs.dayNumber} · {currentObs.date}</span>
            </div>
          </div>

          {/* 2. STORY CONTENT PANEL (Light Botanical Glassmorphism) */}
          <div
            style={{
              background: 'rgba(247, 244, 236, 0.88)',
              backdropFilter: 'blur(16px)',
              borderLeft: '1px solid rgba(231, 226, 215, 0.7)',
            }}
            className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6"
          >
            {/* Story Text Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-sans text-[#536159] pb-3 border-b border-[#E2DAD0]">
                <span className="uppercase tracking-widest font-semibold text-[#3D5A45]">
                  MILESTONE {currentIndex + 1} OF {sorted.length}
                </span>
                <span className="font-serif italic">
                  {currentObs.observeWithoutAi ? 'Observed independently' : 'Shared observation'}
                </span>
              </div>

              {/* Main Observation Quote (Readable serif font, zero clutter) */}
              <blockquote className="font-serif text-base sm:text-lg text-[#1E2923] font-normal leading-relaxed">
                “{currentObs.humanNote || 'Observation committed with patient attention.'}”
              </blockquote>

              {/* Observation Tags: Both Noticed & Human First */}
              <div className="pt-2 space-y-2.5 font-sans">
                {bothNoticedTags.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#3D5A45] flex items-center gap-1.5">
                      <span>🤝</span> You both noticed
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {bothNoticedTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-[#DDD7CC] text-xs font-medium text-[#1E2923] shadow-2xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {humanOnlyTags.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#5B4832] flex items-center gap-1.5">
                      <span>👁</span> Human intuition first
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {humanOnlyTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF0E6] border border-[#E8DACB] text-xs font-medium text-[#5B4832]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Progress & Playback Controls */}
            <div className="pt-4 border-t border-[#E2DAD0] space-y-4">
              {/* Progress indicator dots */}
              <div className="flex items-center justify-center gap-2">
                {sorted.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'w-6 bg-[#1E2923]'
                        : 'w-2 bg-[#DDD7CC] hover:bg-[#8E9B91]'
                    }`}
                    aria-label={`Jump to milestone ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Accessible Controls: Previous, Play/Pause, Next */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#DDD7CC] bg-white hover:bg-[#EFECE5] text-xs font-sans font-medium text-[#1E2923] transition-all cursor-pointer min-h-[44px]"
                  aria-label="Previous milestone"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setIsPlaying((p) => !p)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E2923] text-[#FAF8F5] hover:bg-[#2C3E33] text-xs font-sans font-semibold transition-all shadow-xs cursor-pointer min-h-[44px]"
                  aria-label={isPlaying ? 'Pause replay' : 'Play replay'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Play Replay</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#DDD7CC] bg-white hover:bg-[#EFECE5] text-xs font-sans font-medium text-[#1E2923] transition-all cursor-pointer min-h-[44px]"
                  aria-label="Next milestone"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
