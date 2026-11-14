import React, { useState } from 'react';
import { Plant, ObservationRecord, ActiveView } from '../types';
import { ImageComparisonViewer } from './ImageComparisonViewer';
import { Calendar, ChevronRight, Sprout, ArrowRight } from 'lucide-react';

interface GrowthStoryScreenProps {
  plant: Plant;
  observations: ObservationRecord[];
  onStartObservation: () => void;
  setActiveView: (view: ActiveView) => void;
  onSelectObservationForDetail: (obs: ObservationRecord) => void;
}

export const GrowthStoryScreen: React.FC<GrowthStoryScreenProps> = ({
  plant,
  observations,
  onStartObservation,
  setActiveView,
  onSelectObservationForDetail,
}) => {
  if (!plant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="py-20 px-6 border border-dashed border-[#DDD7CC] rounded-3xl bg-[#FAF8F5]">
          <Sprout className="w-12 h-12 text-[#76877A] mx-auto mb-3" />
          <h2 className="font-serif text-3xl text-[#16281D] font-normal">Every story starts with one observation.</h2>
          <p className="font-serif italic text-base text-[#4E6153] mt-2 max-w-sm mx-auto">
            Add a plant companion and record observations to explore its Growth Story timeline.
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

  const plantObservations = observations
    .filter((o) => o.plantId === plant.id)
    .sort((a, b) => a.dayNumber - b.dayNumber);

  // Compare Two Dates state
  const [compareFirstId, setCompareFirstId] = useState<string>(
    plantObservations[0]?.id || ''
  );
  const [compareSecondId, setCompareSecondId] = useState<string>(
    plantObservations[plantObservations.length - 1]?.id || ''
  );

  const firstObs = plantObservations.find((o) => o.id === compareFirstId) || plantObservations[0];
  const secondObs =
    plantObservations.find((o) => o.id === compareSecondId) ||
    plantObservations[plantObservations.length - 1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E7E2D7]">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-[#203D2A]" />
            <span>Story 1 · Botanical Chronology</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight mt-1.5">
            Growth Story
          </h1>
          <p className="font-serif italic text-base sm:text-xl text-[#4E6153] mt-1.5 font-light">
            “{plant.daysTogether} days, one growing story with {plant.name}.”
          </p>
        </div>

        <button
          onClick={onStartObservation}
          className="flex items-center gap-2 px-5 py-3 text-xs font-sans font-medium text-[#FAF8F5] bg-[#16281D] hover:bg-[#233F2E] rounded-xl transition-all shadow-xs cursor-pointer self-start md:self-auto"
        >
          <span>Add New Observation</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Date Milestones Sequence Ribbon */}
      <div className="mb-12 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 min-w-max text-xs font-sans text-[#76877A]">
          {plantObservations.map((obs, i) => (
            <React.Fragment key={obs.id}>
              <button
                onClick={() => onSelectObservationForDetail(obs)}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  obs.id === compareSecondId
                    ? 'border-[#16281D] bg-[#EDE8DE] text-[#16281D] font-semibold'
                    : 'border-[#E7E2D7] bg-white text-[#566B5C] hover:border-[#16281D]/40'
                }`}
              >
                <span>{obs.date.toUpperCase().split(',')[0]}</span>
                <span className="text-[10px] opacity-70 block font-normal">Day {obs.dayNumber}</span>
              </button>
              {i < plantObservations.length - 1 && (
                <span className="text-[#B8AF9F] font-serif text-sm">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Interactive Two-Date Comparison Split Slider */}
      {firstObs && secondObs && firstObs.id !== secondObs.id && (
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
                Milestone Comparison
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal mt-0.5">
                Compare Any Two Dates
              </h2>
            </div>

            {/* Date Dropdown Selectors */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-sans text-[#76877A]">Older:</span>
                <select
                  value={compareFirstId}
                  onChange={(e) => setCompareFirstId(e.target.value)}
                  className="text-xs font-sans px-3 py-2 rounded-xl border border-[#DDD7CC] bg-white text-[#16281D] cursor-pointer outline-none focus:border-[#16281D]"
                >
                  {plantObservations.map((o) => (
                    <option key={o.id} value={o.id}>
                      Day {o.dayNumber} ({o.date})
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-[#B8AF9F] font-serif">◀▶</span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-sans text-[#76877A]">Newer:</span>
                <select
                  value={compareSecondId}
                  onChange={(e) => setCompareSecondId(e.target.value)}
                  className="text-xs font-sans px-3 py-2 rounded-xl border border-[#DDD7CC] bg-white text-[#16281D] cursor-pointer outline-none focus:border-[#16281D]"
                >
                  {plantObservations.map((o) => (
                    <option key={o.id} value={o.id}>
                      Day {o.dayNumber} ({o.date})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Interactive Split Slider Viewer */}
          <ImageComparisonViewer
            beforeImage={firstObs.image}
            afterImage={secondObs.image}
            beforeLabel={`Day ${firstObs.dayNumber} · ${firstObs.date}`}
            afterLabel={`Day ${secondObs.dayNumber} · ${secondObs.date}`}
          />
        </section>
      )}

      {/* Visual Chronological Timeline */}
      <section>
        <div className="mb-8 pb-4 border-b border-[#E7E2D7]">
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            Chronological Archive
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal mt-0.5">
            Every Moment with {plant.name}
          </h2>
        </div>

        <div className="relative border-l border-[#E0D8CB] ml-4 sm:ml-6 pl-6 sm:pl-10 space-y-12">
          {plantObservations.map((obs) => (
            <div key={obs.id} className="relative group">
              {/* Timeline Node Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-2 w-3.5 h-3.5 rounded-full bg-[#FAF8F5] border-2 border-[#16281D] group-hover:bg-[#16281D] transition-colors" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center pb-8 border-b border-[#EAE5DC]/60">
                {/* Large Photo Thumbnail */}
                <div
                  onClick={() => onSelectObservationForDetail(obs)}
                  className="md:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] bg-[#EAE5DC] cursor-pointer group/img shadow-xs"
                >
                  <img
                    src={obs.image}
                    alt={`Observation Day ${obs.dayNumber}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover/img:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                </div>

                {/* Narrative Details */}
                <div className="md:col-span-7 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-sans text-[#76877A] mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#16281D]">Day {obs.dayNumber}</span>
                        <span>·</span>
                        <span>{obs.date}</span>
                      </div>

                      {obs.bothCategories?.length > 0 && (
                        <span className="text-[#203D2A] font-medium flex items-center gap-1">
                          <span>🤝</span>
                          <span>{obs.bothCategories.length} shared observations</span>
                        </span>
                      )}
                    </div>

                    {/* Human Note */}
                    <p className="font-serif text-lg text-[#16281D] mt-1 font-normal leading-relaxed">
                      “{obs.humanNote || 'Observation recorded with quiet focus.'}”
                    </p>

                    {/* Categories Listed Cleanly */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {obs.humanCategories?.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs font-sans text-[#4A5E50] bg-[#EFECE5] px-3 py-1 rounded-lg"
                        >
                          👁 {cat.replace(/_/g, ' ')}
                        </span>
                      ))}
                      {obs.aiChanges?.map((c, i) => {
                        if (obs.humanCategories?.includes(c.category)) return null;
                        return (
                          <span
                            key={`ai-${i}`}
                            className="text-xs font-sans text-[#203D2A] bg-[#EEF3EE] px-3 py-1 rounded-lg"
                          >
                            🍃 {c.category.replace(/_/g, ' ')}
                          </span>
                        );
                      })}
                    </div>

                    {obs.aiReflectiveSummary && (
                      <p className="text-xs font-sans text-[#5A6F5F] mt-3.5 leading-relaxed">
                        LeafStory reflection: <span className="italic">“{obs.aiReflectiveSummary}”</span>
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E7E2D7] flex items-center justify-between">
                    <button
                      onClick={() => onSelectObservationForDetail(obs)}
                      className="text-xs font-sans font-medium text-[#16281D] hover:text-[#2E543B] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Revisit observation record</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        setCompareSecondId(obs.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-sans text-[#76877A] hover:text-[#16281D] cursor-pointer"
                    >
                      Compare with this
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
