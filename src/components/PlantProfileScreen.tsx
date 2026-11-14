import React, { useState } from 'react';
import { Plant, ObservationRecord, ActiveView, PlantReminder } from '../types';
import { computeObservationJourney } from '../utils/storage';
import { ReminderRepository } from '../services/reminderRepository';
import { RecommendedResourcesSection } from './Resources/RecommendedResourcesSection';
import { AddReminderModal } from './CarePlanner/AddReminderModal';
import { ArrowRight, Calendar, Sprout, Eye, Sliders, Info, Plus, Play, Check, Trash2, Sparkles, BookOpen } from 'lucide-react';

interface PlantProfileScreenProps {
  plant: Plant;
  plants: Plant[];
  onSelectPlant: (plantId: string) => void;
  observations: ObservationRecord[];
  onStartObservation: () => void;
  setActiveView: (view: ActiveView) => void;
  onOpenNewPlantModal: () => void;
  onSelectObservationForDetail: (obs: ObservationRecord) => void;
  onStartGrowthReplay: () => void;
}

export const PlantProfileScreen: React.FC<PlantProfileScreenProps> = ({
  plant,
  plants,
  onSelectPlant,
  observations,
  onStartObservation,
  setActiveView,
  onOpenNewPlantModal,
  onSelectObservationForDetail,
  onStartGrowthReplay,
}) => {
  const [activeTab, setActiveTab] = useState<'story' | 'observe' | 'journey' | 'care' | 'resources' | 'details'>('story');
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [reminders, setReminders] = useState<PlantReminder[]>(() =>
    plant ? ReminderRepository.getRemindersByPlantId(plant.id) : []
  );

  if (!plant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="py-20 px-6 border border-dashed border-[#DDD7CC] rounded-3xl bg-[#FAF8F5]">
          <Sprout className="w-12 h-12 text-[#76877A] mx-auto mb-3" />
          <h2 className="font-serif text-3xl text-[#16281D] font-normal">Every story starts with one observation.</h2>
          <p className="font-serif italic text-base text-[#4E6153] mt-2 max-w-sm mx-auto">
            Add a plant companion to view its journal profile and track its slow growth.
          </p>
          <button
            onClick={onOpenNewPlantModal}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#16281D] text-[#FAF8F5] text-xs font-sans font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add your first plant</span>
          </button>
        </div>
      </div>
    );
  }

  const plantObservations = observations
    .filter((o) => o.plantId === plant.id)
    .sort((a, b) => a.dayNumber - b.dayNumber);

  const journeyAnalytics = computeObservationJourney(plantObservations);
  const careSuggestions = ReminderRepository.getCareSuggestionsForPlant(plant.id, plant.name, observations);

  const handleToggleReminder = (id: string) => {
    ReminderRepository.toggleReminderComplete(id);
    setReminders(ReminderRepository.getRemindersByPlantId(plant.id));
  };

  const handleDeleteReminder = (id: string) => {
    ReminderRepository.deleteReminder(id);
    setReminders(ReminderRepository.getRemindersByPlantId(plant.id));
  };

  const handleReminderSaved = () => {
    setReminders(ReminderRepository.getRemindersByPlantId(plant.id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-[#16281D]">
      {/* Header & Plant Selector Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E7E2D7]">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            Specimen Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#16281D] font-normal tracking-tight mt-1">
            {plant.name}
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-[#526557] mt-0.5 font-light">
            {plant.species} · “{plant.daysTogether} days together.”
          </p>
        </div>

        {/* Plant Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EFECE5] rounded-xl overflow-x-auto shrink-0 max-w-full">
          {plants.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                onSelectPlant(p.id);
                setReminders(ReminderRepository.getRemindersByPlantId(p.id));
              }}
              className={`px-3.5 py-1.5 text-xs font-sans rounded-lg transition-all shrink-0 cursor-pointer min-h-[36px] ${
                p.id === plant.id
                  ? 'bg-white text-[#16281D] shadow-xs font-semibold'
                  : 'text-[#56685B] hover:text-[#16281D]'
              }`}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={onOpenNewPlantModal}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-sans text-[#56685B] hover:text-[#16281D] hover:bg-white/50 rounded-lg transition-all shrink-0 cursor-pointer min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Plant</span>
          </button>
        </div>
      </div>

      {/* Hero Marquee Image */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[21/9] bg-[#EAE5DC] shadow-sm mb-10 border border-[#DCD6C9]">
        <img
          src={plant.coverImage}
          alt={plant.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5 sm:p-10 text-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between w-full gap-4">
            <div>
              <span className="text-[11px] sm:text-xs uppercase tracking-widest opacity-80 font-sans block mb-1">
                {plant.species}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal">{plant.name}</h2>
              <p className="font-serif italic text-xs sm:text-sm text-white/80 mt-1">
                {plant.daysTogether} days observed · {plantObservations.length} milestones recorded
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onStartObservation}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#16281D] hover:bg-[#FAF8F5] text-xs font-sans font-semibold shadow-xs cursor-pointer transition-all active:scale-98 min-h-[44px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Observation</span>
              </button>

              <button
                onClick={onStartGrowthReplay}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/75 text-xs font-sans font-medium transition-all cursor-pointer min-h-[44px]"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Play Replay</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Tab Ribbon: Story, Observe, Journey, Care, Resources, Details */}
      <div className="flex items-center gap-2 border-b border-[#E7E2D7] mb-8 pb-2 text-xs uppercase tracking-wider font-sans font-medium overflow-x-auto">
        {[
          { id: 'story', label: 'Story (Timeline)' },
          { id: 'observe', label: 'Observe' },
          { id: 'journey', label: 'Journey' },
          { id: 'care', label: 'Care & Reminders' },
          { id: 'resources', label: 'Recommended Resources' },
          { id: 'details', label: 'Specimen Info' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'observe') {
                onStartObservation();
              } else {
                setActiveTab(tab.id as any);
              }
            }}
            className={`py-2 px-3.5 rounded-lg whitespace-nowrap cursor-pointer transition-all min-h-[40px] flex items-center ${
              activeTab === tab.id
                ? 'bg-[#16281D] text-[#FAF8F5] font-semibold'
                : 'text-[#687C6E] hover:text-[#16281D]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: STORY (Growth History Timeline) */}
      {activeTab === 'story' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-[#16281D] font-normal">
              Visual Growth Timeline
            </h3>
            <button
              onClick={onStartGrowthReplay}
              className="text-xs font-sans font-medium text-[#16281D] hover:text-[#284934] flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <span>Play cinematic replay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plantObservations.map((obs) => (
              <div
                key={obs.id}
                onClick={() => onSelectObservationForDetail(obs)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-[#E7E2D7] bg-[#FAF8F5] shadow-xs hover:border-[#16281D]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] bg-[#EAE5DC] overflow-hidden">
                    <img
                      src={obs.image}
                      alt={`Day ${obs.dayNumber}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-[#16281D]/80 backdrop-blur-xs text-[#FAF8F5] text-[11px] font-sans px-2.5 py-1 rounded-md">
                      Day {obs.dayNumber}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-[#76877A] font-sans mb-2">
                      <span>{obs.date}</span>
                      {obs.observeWithoutAi && (
                        <span className="text-[10px] uppercase tracking-wider text-[#4E6153] font-medium">
                          Silent observation
                        </span>
                      )}
                    </div>

                    <p className="font-serif text-sm text-[#16281D] line-clamp-2 leading-relaxed">
                      “{obs.humanNote || 'Observation recorded with quiet attention.'}”
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-[#E7E2D7] flex items-center justify-between text-xs font-sans text-[#566B5C]">
                  <span>Explore milestone</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: JOURNEY (Noticing Patterns) */}
      {activeTab === 'journey' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#E7E2D7] shadow-xs space-y-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
              Attention Insights
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal mt-1">
              How Your Eye Has Grown with {plant.name}
            </h3>
            <p className="font-serif italic text-base text-[#4E6153] mt-2 font-light">
              “Observation Journey reflects the quiet shift in what you notice over time.”
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E7E2D7] text-xs font-sans">
            <div className="p-4 rounded-xl bg-[#F3EFE7] border border-[#E2DAD0]">
              <span className="text-[#76877A] block">Observations</span>
              <span className="font-serif text-2xl text-[#16281D] mt-1 block font-normal">{plantObservations.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-[#F3EFE7] border border-[#E2DAD0]">
              <span className="text-[#76877A] block">Shared Noticing</span>
              <span className="font-serif text-2xl text-[#16281D] mt-1 block font-normal">{journeyAnalytics.sharedObservationRate}%</span>
            </div>
            <div className="p-4 rounded-xl bg-[#F3EFE7] border border-[#E2DAD0]">
              <span className="text-[#76877A] block">Caught First By You</span>
              <span className="font-serif text-2xl text-[#16281D] mt-1 block font-normal">{journeyAnalytics.humanDiscoveredFirstCount}</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setActiveView('observation_journey')}
              className="text-xs font-sans font-medium text-[#16281D] hover:text-[#284934] underline cursor-pointer min-h-[44px]"
            >
              View full multi-plant Observation Journey →
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CARE & REMINDERS */}
      {activeTab === 'care' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E2D7]">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#76877A] font-sans font-semibold block">
                Supporting Routines
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal mt-0.5">
                Care Checks for {plant.name}
              </h3>
              <p className="text-xs text-[#566B5C] font-sans mt-1">
                Reminders are created by you. Test soil moisture and look at foliage before acting.
              </p>
            </div>

            <button
              onClick={() => setIsAddReminderOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] text-xs font-sans font-semibold cursor-pointer transition-all shadow-xs min-h-[44px] self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Reminder</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reminders List (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {reminders.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D7] text-center space-y-2">
                  <p className="font-serif text-base text-[#16281D]">No care reminders yet for {plant.name}</p>
                  <p className="text-xs text-[#76877A] font-sans">
                    Set a routine to check soil moisture, inspect foliage, or wipe dust.
                  </p>
                  <button
                    onClick={() => setIsAddReminderOpen(true)}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DDD7CC] text-xs font-medium text-[#16281D] hover:bg-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Reminder</span>
                  </button>
                </div>
              ) : (
                reminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      rem.completed
                        ? 'bg-[#FAF8F5]/60 border-[#E7E2D7] opacity-60'
                        : 'bg-white border-[#E0D9CD] shadow-xs'
                    }`}
                  >
                    <button
                      onClick={() => handleToggleReminder(rem.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer min-h-[32px] min-w-[32px] ${
                        rem.completed
                          ? 'bg-[#16281D] border-[#16281D] text-white'
                          : 'border-[#DDD7CC] bg-white hover:border-[#16281D]'
                      }`}
                    >
                      {rem.completed && <Check className="w-4 h-4 text-white" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap text-[10px] font-sans text-[#76877A]">
                        <span className="font-semibold uppercase tracking-wider text-[#16281D] bg-[#EFECE5] px-2 py-0.5 rounded">
                          {rem.dueDate}
                        </span>
                        <span>(repeats {rem.repeat})</span>
                      </div>
                      <h4 className={`text-sm font-serif ${rem.completed ? 'line-through text-[#76877A]' : 'text-[#16281D]'}`}>
                        {rem.title}
                      </h4>
                      {rem.note && (
                        <p className="text-xs text-[#566B5C] font-sans mt-0.5">
                          “{rem.note}”
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteReminder(rem.id)}
                      className="p-2 text-[#9EAAA0] hover:text-[#8C342A] rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* AI Contextual Suggestions (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-[#76877A] font-sans font-semibold block">
                Things to Consider
              </span>
              {careSuggestions.map((sug) => (
                <div key={sug.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD7CC] text-xs font-sans space-y-2">
                  <span className="font-serif text-sm font-medium text-[#16281D] block">
                    {sug.title}
                  </span>
                  <p className="text-[#566B5C] leading-relaxed">
                    “{sug.text}”
                  </p>
                  {sug.suggestedAction && (
                    <div className="p-2 rounded-lg bg-white border border-[#E7E2D7] text-[11px] text-[#243E2B]">
                      Idea: {sug.suggestedAction}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RECOMMENDED RESOURCES */}
      {activeTab === 'resources' && (
        <RecommendedResourcesSection plant={plant} />
      )}

      {/* TAB 5: DETAILS (Environmental Context) */}
      {activeTab === 'details' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#E7E2D7] shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-2xl text-[#16281D] font-normal">
              Specimen Information & Context
            </h3>
            <p className="text-xs text-[#566B5C] font-sans mt-1">
              Environmental factors logged as context only (not causal claims).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E7E2D7] text-xs font-sans">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#76877A] block">Botanical Species</span>
              <span className="text-sm font-medium text-[#16281D] mt-1 block">{plant.species}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#76877A] block">First Observed</span>
              <span className="text-sm font-medium text-[#16281D] mt-1 block">{plant.firstObservationDate}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#76877A] block">Environment & Placement</span>
              <span className="text-sm font-medium text-[#16281D] mt-1 block">{plant.locationNotes || 'Living area window sill'}</span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#76877A] block">Latest Record</span>
              <span className="text-sm font-medium text-[#16281D] mt-1 block">{plant.latestObservationDate}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E7E2D7] flex items-center justify-between">
            <span className="text-xs text-[#76877A]">Looking to support {plant.name}'s environment?</span>
            <button
              onClick={() => setActiveTab('resources')}
              className="text-xs font-sans font-medium text-[#16281D] hover:text-[#284934] underline cursor-pointer"
            >
              Explore Recommended Resources →
            </button>
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      <AddReminderModal
        isOpen={isAddReminderOpen}
        plants={plants}
        defaultPlantId={plant.id}
        onClose={() => setIsAddReminderOpen(false)}
        onSave={handleReminderSaved}
      />
    </div>
  );
};
