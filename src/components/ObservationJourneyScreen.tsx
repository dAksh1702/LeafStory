import React from 'react';
import { Plant, ObservationRecord, ActiveView, CATEGORY_DEFINITIONS } from '../types';
import { computeObservationJourney } from '../utils/storage';
import { Eye, ArrowRight } from 'lucide-react';

interface ObservationJourneyScreenProps {
  plant: Plant;
  observations: ObservationRecord[];
  setActiveView: (view: ActiveView) => void;
  onStartObservation: () => void;
}

export const ObservationJourneyScreen: React.FC<ObservationJourneyScreenProps> = ({
  plant,
  observations,
  setActiveView,
  onStartObservation,
}) => {
  if (!plant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="py-20 px-6 border border-dashed border-[#DDD7CC] rounded-3xl bg-[#FAF8F5]">
          <Eye className="w-12 h-12 text-[#76877A] mx-auto mb-3" />
          <h2 className="font-serif text-3xl text-[#16281D] font-normal">Every story starts with one observation.</h2>
          <p className="font-serif italic text-base text-[#4E6153] mt-2 max-w-sm mx-auto">
            Choose a plant companion to begin developing your attentiveness.
          </p>
          <button
            onClick={() => setActiveView('garden')}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#16281D] text-[#FAF8F5] text-xs font-sans font-medium cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Go to My Garden</span>
          </button>
        </div>
      </div>
    );
  }

  const plantObservations = observations.filter((o) => o.plantId === plant.id);
  const journey = computeObservationJourney(plantObservations);

  const renderDots = (count: number, maxCount: number = 6) => {
    const dots = [];
    const filled = Math.min(count, maxCount);
    for (let i = 0; i < filled; i++) {
      dots.push(
        <span key={i} className="inline-block w-2.5 h-2.5 rounded-full bg-[#16281D] mx-0.5" />
      );
    }
    if (filled === 0) {
      dots.push(<span key="empty" className="text-xs text-[#9E9587] italic">—</span>);
    }
    return <span className="inline-flex items-center">{dots}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium flex items-center justify-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#203D2A]" />
          <span>Story 2 · Flagship Reflection</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight mt-1.5">
          Your Observation Journey
        </h1>
        <p className="font-serif italic text-base sm:text-xl text-[#4E6153] mt-2 font-light">
          “How is the way you notice your plant changing?”
        </p>
      </div>

      {/* Reflective Monograph / Field Notes */}
      <div className="border border-[#E7E2D7] bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 mb-14 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
              Naturalist Reflection
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal mt-1">
              Your eye is changing.
            </h2>
            <p className="text-xs sm:text-sm text-[#4E6153] font-sans leading-relaxed mt-3">
              When humans first bring a plant home, we look for dramatic markers: a giant unfurled leaf or rapid vertical growth.
            </p>
            <p className="text-xs sm:text-sm text-[#4E6153] font-sans leading-relaxed mt-2.5">
              With patient observation, our perception begins to quiet down. We start to catch how petioles rotate subtly toward the morning pane, how leaf blades perk up after watering, and how the texture of new fenestrations hardens over weeks.
            </p>
          </div>

          <div className="md:col-span-5 bg-[#F3EFE7] rounded-2xl p-6 border border-[#E2DAD0] space-y-4">
            <div className="flex items-center justify-between text-xs font-sans pb-3 border-b border-[#DCD3C5]">
              <span className="text-[#687C6E]">Observations Recorded</span>
              <span className="font-semibold text-[#16281D]">{journey.totalObservations} moments</span>
            </div>
            <div className="flex items-center justify-between text-xs font-sans pb-3 border-b border-[#DCD3C5]">
              <span className="text-[#687C6E]">Shared Noticing Rate</span>
              <span className="font-semibold text-[#16281D]">{journey.sharedObservationRate}% with LeafStory</span>
            </div>
            <div className="flex items-center justify-between text-xs font-sans">
              <span className="text-[#687C6E]">Nuances Caught First by You</span>
              <span className="font-semibold text-[#16281D]">{journey.humanDiscoveredFirstCount} human discoveries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attention Distribution: When You Started vs Recently */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            Visual Distribution
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal mt-0.5">
            What Your Attention Catches
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Column 1: When you started */}
          <div className="border border-[#E7E2D7] bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E7E2D7]">
              <div>
                <h3 className="font-serif text-xl text-[#16281D] font-normal">When you started</h3>
                <span className="text-xs text-[#76877A] font-sans">Early observation sessions</span>
              </div>
              <span className="text-2xl">🌱</span>
            </div>

            <div className="space-y-4">
              {journey.categoryBreakdown.map((item) => {
                const meta = CATEGORY_DEFINITIONS.find((c) => c.id === item.category);
                return (
                  <div key={item.category} className="flex items-center justify-between text-xs sm:text-sm font-sans">
                    <span className="text-[#364A3B] flex items-center gap-2.5">
                      <span className="text-base">{meta?.icon}</span>
                      <span>{meta?.label.split('/')[0].trim()}</span>
                    </span>
                    <div>{renderDots(item.earlyCount)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Recently */}
          <div className="border border-[#16281D]/40 bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E7E2D7]">
              <div>
                <h3 className="font-serif text-xl text-[#16281D] font-normal">Recently</h3>
                <span className="text-xs text-[#76877A] font-sans">Later observation sessions</span>
              </div>
              <span className="text-2xl">👁</span>
            </div>

            <div className="space-y-4">
              {journey.categoryBreakdown.map((item) => {
                const meta = CATEGORY_DEFINITIONS.find((c) => c.id === item.category);
                return (
                  <div key={item.category} className="flex items-center justify-between text-xs sm:text-sm font-sans">
                    <span className="text-[#364A3B] flex items-center gap-2.5">
                      <span className="text-base">{meta?.icon}</span>
                      <span>{meta?.label.split('/')[0].trim()}</span>
                    </span>
                    <div>{renderDots(item.recentCount)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Mindful Reflective Field Observations */}
      <section className="border border-[#E7E2D7] bg-[#FAF8F5] rounded-3xl p-6 sm:p-10 mb-14 shadow-xs">
        <div className="text-center mb-8">
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            Field Insights
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal mt-0.5">
            Reflections on Your Observational Habits
          </h2>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          {journey.reflectiveNarratives.map((narrative, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#F3EFE7] border border-[#E2DAD0] flex items-start gap-4"
            >
              <div className="w-2 h-2 rounded-full bg-[#16281D] mt-2 shrink-0" />
              <p className="font-serif italic text-base text-[#1E3224] leading-relaxed">
                “{narrative}”
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Practice Action */}
      <div className="text-center space-y-4">
        <button
          onClick={onStartObservation}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-sans font-medium bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] transition-all shadow-sm cursor-pointer"
        >
          <span>Practice Attentive Observation Today</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div>
          <button
            onClick={() => setActiveView('growth_story')}
            className="text-xs font-sans text-[#76877A] hover:text-[#16281D] underline cursor-pointer"
          >
            Switch to Growth Story timeline
          </button>
        </div>
      </div>
    </div>
  );
};
