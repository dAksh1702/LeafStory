import React from 'react';
import { Plant, ObservationRecord, ActiveView } from '../types';
import { Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface DiscoveriesScreenProps {
  plant: Plant;
  observations: ObservationRecord[];
  setActiveView: (view: ActiveView) => void;
  onSelectObservationForDetail: (obs: ObservationRecord) => void;
}

export const DiscoveriesScreen: React.FC<DiscoveriesScreenProps> = ({
  plant,
  observations,
  setActiveView,
  onSelectObservationForDetail,
}) => {
  const plantObservations = observations.filter((o) => o.plantId === plant.id);

  // Moments where human discovered first
  const humanFirstMoments = plantObservations.filter(
    (o) => o.humanOnlyCategories && o.humanOnlyCategories.length > 0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#203D2A]" />
          <span>Curated Milestones</span>
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight mt-1.5">
          Observational Discoveries
        </h1>
        <p className="font-serif italic text-base sm:text-xl text-[#4E6153] mt-2 font-light">
          “Moments where patient looking revealed what fast glancing missed.”
        </p>
      </div>

      {/* Human Discovery First Showcase */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">✨</span>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal">
            Moments You Noticed First
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#566B5C] font-sans mb-8">
          Instances where your intuitive eye identified physical nuances before or beyond computational detection.
        </p>

        {humanFirstMoments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {humanFirstMoments.map((obs) => (
              <div
                key={obs.id}
                onClick={() => onSelectObservationForDetail(obs)}
                className="group cursor-pointer rounded-3xl overflow-hidden border border-[#E7E2D7] bg-[#FAF8F5] p-6 shadow-xs hover:border-[#16281D]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-sans text-[#76877A] mb-3">
                    <span className="font-medium text-[#16281D]">Day {obs.dayNumber} · {obs.date}</span>
                    <span className="text-[#203D2A] uppercase tracking-wider text-[10px] font-semibold">
                      Human intuition
                    </span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-4 bg-[#EAE5DC]">
                    <img
                      src={obs.image}
                      alt={`Day ${obs.dayNumber}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />
                  </div>

                  <p className="font-serif italic text-base text-[#16281D] leading-relaxed">
                    “{obs.humanNote || 'Observation committed with personal focus.'}”
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {obs.humanOnlyCategories.map((c) => (
                      <span
                        key={c}
                        className="text-xs font-sans px-3 py-1 rounded-lg bg-[#EDE8DE] text-[#203D2A]"
                      >
                        👁 {c.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E7E2D7] flex items-center justify-between text-xs font-sans text-[#566B5C]">
                  <span>Explore full comparison</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 bg-[#FAF8F5] border border-[#E7E2D7] rounded-3xl text-center text-xs font-sans text-[#76877A]">
            As you continue observing, moments you catch first will be preserved here.
          </div>
        )}
      </section>

      {/* Observational Language Manifesto & Safety */}
      <section className="bg-[#FAF8F5] border border-[#E7E2D7] rounded-3xl p-6 sm:p-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-[#EFECE5] text-[#203D2A] flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal">
            The LeafStory Observational Principle
          </h2>
          <p className="font-serif italic text-sm sm:text-base text-[#4E6153] mt-1 font-light">
            “AI as a second perspective, not a plant doctor.”
          </p>
          <div className="mt-6 text-xs text-[#526557] font-sans text-left space-y-3 leading-relaxed bg-[#F3EFE7] p-5 rounded-2xl border border-[#E2DAD0]">
            <p>
              • <strong>Human Observation First:</strong> You always record what you see before any computational findings are revealed.
            </p>
            <p>
              • <strong>Humble Observational Language:</strong> We use observational terms like <em>appears</em>, <em>visible difference</em>, and <em>worth another look</em>.
            </p>
            <p>
              • <strong>Zero Prescriptions:</strong> LeafStory never claims why a change occurred or prescribes chemicals, water schedules, or diagnosis.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
