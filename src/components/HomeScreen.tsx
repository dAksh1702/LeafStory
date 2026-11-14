import React from 'react';
import { Plant, ObservationRecord, ActiveView, UserProfile } from '../types';
import { ParallelStoriesBanner } from './ParallelStoriesBanner';
import { Calendar, Plus, ChevronRight, ArrowRight, Sprout, Play, Sparkles, Droplets, Bell } from 'lucide-react';
import { determineAdaptiveMode } from '../utils/storage';
import { ReminderRepository } from '../services/reminderRepository';

interface HomeScreenProps {
  plants: Plant[];
  activePlant: Plant;
  onSelectPlant: (plantId: string) => void;
  observations: ObservationRecord[];
  user: UserProfile;
  onStartObservation: () => void;
  setActiveView: (view: ActiveView) => void;
  onOpenNewPlantModal: () => void;
  onSelectObservationForDetail: (obs: ObservationRecord) => void;
  onStartGrowthReplay: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  plants,
  activePlant,
  onSelectPlant,
  observations,
  user,
  onStartObservation,
  setActiveView,
  onOpenNewPlantModal,
  onSelectObservationForDetail,
  onStartGrowthReplay,
}) => {
  const firstName = user?.name ? user.name.split(' ')[0] : 'Observer';

  if (!activePlant || plants.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="py-20 px-6 sm:px-12 border border-dashed border-[#DDD7CC] rounded-3xl bg-[#FAF8F5] shadow-xs">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#EAE5DC] flex items-center justify-center text-[#203D2A]">
            <Sprout className="w-7 h-7" />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            Welcome to LeafStory, {firstName}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#16281D] font-normal tracking-tight mt-2">
            Every story starts with one observation.
          </h2>
          <p className="font-serif italic text-base sm:text-lg text-[#4E6153] mt-3 max-w-md mx-auto font-light">
            Bring your first plant companion into your living journal. As you notice slow changes over weeks and months, you’ll discover how you grow with it.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenNewPlantModal}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#16281D] text-[#FAF8F5] text-sm font-sans font-medium hover:bg-[#233F2E] transition-all shadow-xs cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add your first plant</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const plantObservations = observations.filter((o) => o.plantId === activePlant.id);
  const latestObs = plantObservations[plantObservations.length - 1];
  const upcomingReminders = ReminderRepository.getUpcomingReminders(3);
  const adaptiveCoach = determineAdaptiveMode(plantObservations, user?.observationStyle);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Personalized Greeting & Plant Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E7E2D7]">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            Living Journal · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight mt-1.5">
            Good morning, {firstName}.
          </h1>
          <p className="font-serif italic text-base sm:text-xl text-[#4A5E50] mt-1.5 font-light">
            “Something may have changed since you last looked.”
          </p>
        </div>

        {/* Plant Switcher Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EFECE5] rounded-xl overflow-x-auto shrink-0 max-w-full">
          {plants.map((plant) => (
            <button
              key={plant.id}
              onClick={() => onSelectPlant(plant.id)}
              className={`px-3.5 py-1.5 text-xs font-sans rounded-lg transition-all shrink-0 cursor-pointer ${
                plant.id === activePlant.id
                  ? 'bg-white text-[#16281D] shadow-xs font-semibold'
                  : 'text-[#56685B] hover:text-[#16281D]'
              }`}
            >
              {plant.name}
            </button>
          ))}
          <button
            onClick={onOpenNewPlantModal}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-sans text-[#56685B] hover:text-[#16281D] hover:bg-white/50 rounded-lg transition-all shrink-0 cursor-pointer"
            title="Create a new plant profile"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Plant</span>
          </button>
        </div>
      </div>

      {/* Adaptive Observation Coach Banner (Build 3 Expansion) */}
      <div className="mb-10 p-5 sm:p-6 rounded-3xl bg-[#F4EFE6] border border-[#DDD5C5] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#203D2A]" />
            <span className="text-[11px] uppercase tracking-widest text-[#203D2A] font-sans font-semibold">
              Adaptive Coach · {adaptiveCoach.guidanceTitle}
            </span>
          </div>
          <p className="font-serif italic text-sm sm:text-base text-[#16281D]">
            “{adaptiveCoach.guidanceText}”
          </p>
        </div>

        <button
          onClick={onStartObservation}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] text-xs font-sans font-medium whitespace-nowrap cursor-pointer transition-all shadow-xs"
        >
          Begin Observation →
        </button>
      </div>

      {/* Main Hero: Dominant Plant Photography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-16">
        {/* Dominant Photograph (7 columns on desktop) */}
        <div className="lg:col-span-7 relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[560px] bg-[#EAE5DC] shadow-sm group">
          <img
            src={activePlant.coverImage}
            alt={`${activePlant.name} - ${activePlant.species}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:hidden" />
          <div className="absolute bottom-6 left-6 lg:hidden text-white">
            <span className="text-xs uppercase tracking-widest opacity-80 font-sans">{activePlant.species}</span>
            <h2 className="font-serif text-3xl font-normal mt-0.5">{activePlant.name}</h2>
          </div>
        </div>

        {/* Editorial Specimen Details & Primary Actions (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between py-2">
          <div>
            <div className="hidden lg:block">
              <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
                Primary Companion
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#16281D] font-normal tracking-tight mt-1">
                {activePlant.name}
              </h2>
              <p className="font-serif italic text-lg text-[#526557] mt-1 font-light">
                {activePlant.species}
              </p>
            </div>

            {/* Specimen Metadata */}
            <div className="flex items-center gap-3 text-sm text-[#5B6F60] font-sans mt-4 pt-4 border-t border-[#E7E2D7]">
              <span className="font-medium text-[#16281D]">{activePlant.daysTogether} days together</span>
              <span aria-hidden="true" className="text-[#B6C2B9]">·</span>
              <span>{plantObservations.length} observations</span>
              <span aria-hidden="true" className="text-[#B6C2B9]">·</span>
              <span>Last observed {activePlant.latestObservationDate}</span>
            </div>

            {activePlant.locationNotes && (
              <p className="text-xs text-[#7B8B7E] font-sans mt-2.5 italic">
                Environment: {activePlant.locationNotes}
              </p>
            )}

            {/* Latest Recorded Observation Highlight */}
            {latestObs ? (
              <div className="mt-8 pt-6 border-t border-[#E7E2D7]">
                <div className="flex items-center gap-1.5 text-xs font-sans text-[#76877A] mb-2">
                  <Calendar className="w-3.5 h-3.5 text-[#5B6F60]" />
                  <span>Latest observation · {latestObs.date}</span>
                </div>
                <p className="font-serif italic text-base sm:text-lg text-[#203427] leading-relaxed">
                  “{latestObs.humanNote || 'Observation committed with shared attention.'}”
                </p>

                {latestObs.aiReflectiveSummary && (
                  <p className="text-xs font-sans text-[#5A6F5F] mt-3 leading-relaxed">
                    LeafStory perspective: <span className="italic">“{latestObs.aiReflectiveSummary}”</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-8 pt-6 border-t border-[#E7E2D7]">
                <p className="font-serif italic text-sm text-[#5B6F60]">
                  “Ready for your first quiet observation. Take a photo to start this growing story.”
                </p>
              </div>
            )}
          </div>

          {/* Action Ribbon */}
          <div className="pt-8 space-y-3">
            <button
              onClick={onStartObservation}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 text-sm font-sans font-medium text-[#FAF8F5] bg-[#16281D] hover:bg-[#233F2E] active:scale-[0.99] transition-all rounded-xl shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#16281D]"
            >
              <Plus className="w-4 h-4" />
              <span>Observe today →</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onStartGrowthReplay}
                className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-sans font-medium text-[#16281D] bg-[#EDE8DE] hover:bg-[#E4DED3] rounded-xl transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Growth Replay</span>
              </button>

              <button
                onClick={() => setActiveView('plant_profile')}
                className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-sans font-medium text-[#5B6F60] hover:text-[#16281D] bg-white border border-[#DDD7CC] hover:border-[#16281D]/40 rounded-xl transition-all cursor-pointer"
              >
                <span>Plant Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: YOUR GARDEN (Living Collection Cards) */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#E7E2D7]">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
              Living Collection
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal mt-1">
              Your Garden
            </h2>
          </div>
          <button
            onClick={() => setActiveView('garden')}
            className="text-xs font-sans font-medium text-[#16281D] hover:text-[#284934] flex items-center gap-1 cursor-pointer"
          >
            <span>View all plants ({plants.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plants.map((p) => {
            const pObs = observations.filter((o) => o.plantId === p.id);
            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPlant(p.id);
                  setActiveView('plant_profile');
                }}
                className={`group cursor-pointer rounded-3xl overflow-hidden border p-5 transition-all shadow-xs flex flex-col justify-between ${
                  p.id === activePlant.id
                    ? 'border-[#16281D] bg-[#FAF8F5]'
                    : 'border-[#E7E2D7] bg-white hover:border-[#16281D]/40'
                }`}
              >
                <div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#EAE5DC] mb-4">
                    <img
                      src={p.coverImage}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-[#16281D]/80 backdrop-blur-xs text-[#FAF8F5] text-[10px] font-sans px-2 py-0.5 rounded">
                      {p.daysTogether} days
                    </div>
                  </div>

                  <span className="text-[10px] uppercase tracking-wider text-[#76877A] font-sans block">
                    {p.species}
                  </span>
                  <h3 className="font-serif text-xl text-[#16281D] font-normal mt-0.5">
                    {p.name}
                  </h3>
                  <span className="text-xs text-[#566B5C] font-sans block mt-1">
                    {pObs.length} observations recorded
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E7E2D7] flex items-center justify-between text-xs font-sans text-[#16281D]">
                  <span>Open Story</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* UPCOMING CARE SECTION (Supporting Plant-Parent Routines) */}
      <section className="mb-16 p-6 sm:p-7 rounded-3xl bg-white border border-[#E7E2D7] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EBE1] mb-5">
          <div className="flex items-center gap-2">
            <span className="text-base">📅</span>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#76877A] font-sans font-semibold block">
                Supporting Routines
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-[#16281D] font-normal leading-tight">
                Upcoming Care Checks
              </h3>
            </div>
          </div>

          <button
            onClick={() => setActiveView('care_planner')}
            className="self-start sm:self-auto text-xs font-sans font-medium text-[#16281D] hover:text-[#284934] flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <span>View Care Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {upcomingReminders.map((rem) => {
            const icon =
              rem.type === 'watering'
                ? '💧'
                : rem.type === 'observation'
                ? '📸'
                : rem.type === 'fertilizing'
                ? '🌱'
                : rem.type === 'pruning'
                ? '✂️'
                : '✨';

            return (
              <div
                key={rem.id}
                onClick={() => setActiveView('care_planner')}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD7CC] hover:border-[#16281D]/30 transition-all cursor-pointer flex items-start gap-3"
              >
                <span className="text-xl shrink-0 mt-0.5">{icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] font-sans text-[#566B5C] font-semibold uppercase tracking-wider">
                    <span>{rem.dueDate}</span>
                    <span>·</span>
                    <span className="text-[#16281D]">{rem.plantName}</span>
                  </div>
                  <h4 className="font-serif text-sm font-normal text-[#16281D] truncate mt-0.5">
                    {rem.title}
                  </h4>
                  {rem.note && (
                    <p className="text-[11px] text-[#76877A] font-sans truncate mt-1">
                      “{rem.note}”
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two Parallel Stories Concept */}
      <ParallelStoriesBanner onSelectStory={(story) => setActiveView(story)} />

      {/* RECENT STORY: Meaningful Observation Events */}
      <section className="mt-16">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-[#E7E2D7]">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
              Recent Story
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal mt-1">
              Meaningful Moments with {activePlant.name}
            </h3>
          </div>
          <button
            onClick={() => setActiveView('growth_story')}
            className="text-xs font-sans font-medium text-[#16281D] hover:text-[#284934] flex items-center gap-1 cursor-pointer"
          >
            <span>Explore all {plantObservations.length} moments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {plantObservations.slice(-3).reverse().map((obs) => (
            <div
              key={obs.id}
              onClick={() => onSelectObservationForDetail(obs)}
              className="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#EAE5DC] mb-3.5 shadow-xs">
                  <img
                    src={obs.image}
                    alt={`Observation Day ${obs.dayNumber}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-[#16281D]/80 backdrop-blur-xs text-[#FAF8F5] text-[11px] font-sans px-2.5 py-1 rounded-md">
                    Day {obs.dayNumber}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#76877A] font-sans mb-1.5">
                  <span>{obs.date}</span>
                  {obs.bothCategories?.length > 0 && (
                    <span className="text-[#23412E] font-medium flex items-center gap-1">
                      <span>🤝</span> {obs.bothCategories.length} shared
                    </span>
                  )}
                </div>

                <p className="font-serif text-sm text-[#16281D] line-clamp-2 leading-relaxed">
                  “{obs.humanNote || 'Observation recorded with quiet attention.'}”
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E7E2D7] flex items-center justify-between text-xs font-sans text-[#566B5C]">
                <span>Explore comparison</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
