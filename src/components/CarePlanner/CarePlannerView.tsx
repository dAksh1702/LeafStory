import React, { useState } from 'react';
import { Plant, PlantReminder, CareSuggestion, ObservationRecord } from '../../types';
import { ReminderRepository } from '../../services/reminderRepository';
import { Plus, Check, Trash2, Calendar, Sparkles, Droplets, Sprout, ShieldAlert, ArrowRight } from 'lucide-react';
import { AddReminderModal } from './AddReminderModal';

interface CarePlannerViewProps {
  plants: Plant[];
  activePlant?: Plant;
  observations: ObservationRecord[];
  onOpenNewPlantModal?: () => void;
  onNavigateToPlantProfile?: (plantId: string) => void;
}

export const CarePlannerView: React.FC<CarePlannerViewProps> = ({
  plants,
  activePlant,
  observations,
  onNavigateToPlantProfile,
}) => {
  const [reminders, setReminders] = useState<PlantReminder[]>(() => ReminderRepository.getReminders());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);
  const [reviewedSuggestions, setReviewedSuggestions] = useState<string[]>([]);

  const handleToggleComplete = (id: string) => {
    ReminderRepository.toggleReminderComplete(id);
    setReminders(ReminderRepository.getReminders());
  };

  const handleDelete = (id: string) => {
    ReminderRepository.deleteReminder(id);
    setReminders(ReminderRepository.getReminders());
  };

  const handleReminderSaved = () => {
    setReminders(ReminderRepository.getReminders());
  };

  // Compile AI Care Considerations for active or all plants
  const suggestions: CareSuggestion[] = plants.flatMap((p) =>
    ReminderRepository.getCareSuggestionsForPlant(p.id, p.name, observations)
  ).filter((s) => !dismissedSuggestions.includes(s.id));

  const filteredReminders = reminders.filter((r) => {
    if (selectedFilter === 'pending') return !r.completed;
    if (selectedFilter === 'completed') return r.completed;
    return true;
  });

  const getReminderIcon = (type: string) => {
    switch (type) {
      case 'watering':
        return '💧';
      case 'observation':
        return '📸';
      case 'fertilizing':
        return '🌱';
      case 'pruning':
        return '✂️';
      case 'repotting':
        return '🪴';
      default:
        return '✨';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-[#16281D]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E7E2D7]">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            Supporting Companion Routines
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight mt-1.5">
            Care Planner
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-[#4E6153] mt-1 font-light">
            “Routines are human-created. Look first, test soil, and observe conditions before acting.”
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] font-sans text-xs font-semibold cursor-pointer transition-all shadow-xs shrink-0 self-start sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Philosophy Callout Card */}
      <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-[#F7F4EC] border border-[#DDD7CC] text-xs font-sans text-[#4E6153] leading-relaxed flex items-start gap-3">
        <span className="text-xl shrink-0">🌿</span>
        <div>
          <strong className="text-[#16281D] font-semibold block mb-0.5">
            LeafStory Care Principle: Observation Precedes Action
          </strong>
          We never prescribe rigid schedules like “water every 7 days” because temperature, light, and pot permeability shift continuously. Use reminders to prompt a soil check, not mindless watering.
        </div>
      </div>

      {/* Main Grid: Reminders List & AI Considerations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Reminders (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Filter segment tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 bg-[#EFECE5] rounded-xl text-xs font-sans">
              <button
                onClick={() => setSelectedFilter('pending')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${
                  selectedFilter === 'pending'
                    ? 'bg-white text-[#16281D] shadow-xs'
                    : 'text-[#687C6E] hover:text-[#16281D]'
                }`}
              >
                Upcoming ({reminders.filter((r) => !r.completed).length})
              </button>
              <button
                onClick={() => setSelectedFilter('completed')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${
                  selectedFilter === 'completed'
                    ? 'bg-white text-[#16281D] shadow-xs'
                    : 'text-[#687C6E] hover:text-[#16281D]'
                }`}
              >
                Completed ({reminders.filter((r) => r.completed).length})
              </button>
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-white text-[#16281D] shadow-xs'
                    : 'text-[#687C6E] hover:text-[#16281D]'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {/* Reminders List (Stacked Cards for flawless mobile experience) */}
          {filteredReminders.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white border border-[#E7E2D7] text-center space-y-3">
              <span className="text-3xl">🌱</span>
              <p className="font-serif text-lg text-[#16281D]">No reminders in this view</p>
              <p className="text-xs text-[#76877A] font-sans">
                Create a gentle reminder to check soil, wipe leaves, or plan your next observation.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#DDD7CC] text-xs font-medium text-[#16281D] hover:bg-[#F3EFE7] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add first reminder</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                    rem.completed
                      ? 'bg-[#FAF8F5]/60 border-[#E7E2D7] opacity-60'
                      : 'bg-white border-[#E0D9CD] shadow-xs hover:border-[#16281D]/30'
                  }`}
                >
                  {/* Complete checkbox button */}
                  <button
                    onClick={() => handleToggleComplete(rem.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-all min-h-[32px] min-w-[32px] ${
                      rem.completed
                        ? 'bg-[#16281D] border-[#16281D] text-white'
                        : 'border-[#DDD7CC] bg-white hover:border-[#16281D]'
                    }`}
                    aria-label={rem.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {rem.completed && <Check className="w-4 h-4 text-[#FAF8F5]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm">{getReminderIcon(rem.type)}</span>
                      <span className="text-[11px] font-sans font-bold text-[#16281D] uppercase tracking-wider">
                        {rem.plantName}
                      </span>
                      <span className="text-[#DDD7CC]">·</span>
                      <span className="text-[11px] font-sans text-[#4E6153] font-medium bg-[#EFECE5] px-2 py-0.5 rounded-md">
                        {rem.dueDate}
                      </span>
                      {rem.repeat !== 'never' && (
                        <span className="text-[10px] text-[#76877A] font-sans">
                          (repeats {rem.repeat})
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-sm sm:text-base font-serif font-normal ${
                        rem.completed ? 'line-through text-[#76877A]' : 'text-[#16281D]'
                      }`}
                    >
                      {rem.title}
                    </h3>

                    {rem.note && (
                      <p className="text-xs text-[#566B5C] font-sans mt-1 leading-relaxed">
                        “{rem.note}”
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(rem.id)}
                    className="p-2 text-[#9EAAA0] hover:text-[#8C342A] rounded-lg hover:bg-[#FAF0EE] cursor-pointer transition-colors shrink-0"
                    title="Delete reminder"
                    aria-label="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: AI Suggestions — "Things to consider" (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#203D2A]" />
            <h2 className="font-serif text-xl sm:text-2xl text-[#16281D] font-normal">
              Things to Consider
            </h2>
          </div>
          <p className="text-xs text-[#566B5C] font-sans">
            Observation-informed contextual reflections. LeafStory never diagnoses or commands.
          </p>

          <div className="space-y-4">
            {suggestions.map((sug) => {
              const isReviewed = reviewedSuggestions.includes(sug.id);

              return (
                <div
                  key={sug.id}
                  className="p-5 rounded-3xl bg-white border border-[#E7E2D7] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-[10px] font-sans uppercase tracking-widest text-[#76877A]">
                    <span>{sug.plantName} · Contextual Note</span>
                    <span className="text-emerald-800 font-semibold">{sug.category}</span>
                  </div>

                  <h3 className="font-serif text-base text-[#16281D] font-medium">
                    {sug.title}
                  </h3>

                  <p className="text-xs text-[#566B5C] font-sans leading-relaxed">
                    “{sug.text}”
                  </p>

                  {sug.suggestedAction && (
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2D7] text-[11px] text-[#243E2B] font-sans flex items-center gap-1.5">
                      <span className="font-medium">Idea:</span>
                      <span>{sug.suggestedAction}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0EBE1]">
                    <button
                      onClick={() => setDismissedSuggestions((prev) => [...prev, sug.id])}
                      className="px-3 py-1.5 rounded-lg text-xs font-sans text-[#76877A] hover:text-[#16281D] hover:bg-[#EFECE5] cursor-pointer"
                    >
                      Not now
                    </button>
                    <button
                      onClick={() => {
                        setReviewedSuggestions((prev) => [...prev, sug.id]);
                        setIsAddModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[#EFECE5] hover:bg-[#16281D] hover:text-white text-xs font-sans font-medium text-[#16281D] transition-colors cursor-pointer"
                    >
                      {isReviewed ? 'Care Plan Reviewed' : 'Review Care Plan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AddReminderModal
        isOpen={isAddModalOpen}
        plants={plants}
        defaultPlantId={activePlant?.id}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleReminderSaved}
      />
    </div>
  );
};
