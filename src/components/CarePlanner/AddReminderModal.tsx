import React, { useState } from 'react';
import { Plant, PlantReminder, ReminderType, ReminderRepeat } from '../../types';
import { ReminderRepository } from '../../services/reminderRepository';
import { X, Droplets, Sprout, Scissors, Sparkles, Eye, Box, Calendar } from 'lucide-react';

interface AddReminderModalProps {
  isOpen: boolean;
  plants: Plant[];
  defaultPlantId?: string;
  onClose: () => void;
  onSave: (reminder: PlantReminder) => void;
}

const TYPE_CONFIGS: {
  type: ReminderType;
  label: string;
  icon: string;
  defaultTitle: (plantName: string) => string;
  defaultNote: string;
}[] = [
  {
    type: 'watering',
    label: 'Watering / Check Soil',
    icon: '💧',
    defaultTitle: (name) => `Check ${name}'s soil`,
    defaultNote: 'Check the top 2 inches of soil with your finger before watering.',
  },
  {
    type: 'observation',
    label: 'Observation Session',
    icon: '📸',
    defaultTitle: (name) => `Observe ${name}`,
    defaultNote: 'Look for new leaf unfurling or petiole orientation toward light.',
  },
  {
    type: 'fertilizing',
    label: 'Fertilizing',
    icon: '🌱',
    defaultTitle: (name) => `Fertilizer reminder — ${name}`,
    defaultNote: 'Use gentle, half-strength organic liquid feed if actively growing.',
  },
  {
    type: 'pruning',
    label: 'Pruning / Trimming',
    icon: '✂️',
    defaultTitle: (name) => `Inspect & prune ${name}`,
    defaultNote: 'Snip yellowed lower leaves or spent sheath remnants with clean shears.',
  },
  {
    type: 'repotting',
    label: 'Repotting / Aeration',
    icon: '🪴',
    defaultTitle: (name) => `Check root space — ${name}`,
    defaultNote: 'Inspect drainage holes for protruding roots or compacted soil.',
  },
  {
    type: 'custom',
    label: 'Custom Routine',
    icon: '✨',
    defaultTitle: (name) => `Care check — ${name}`,
    defaultNote: 'Gentle leaf wipe with damp cloth.',
  },
];

export const AddReminderModal: React.FC<AddReminderModalProps> = ({
  isOpen,
  plants,
  defaultPlantId,
  onClose,
  onSave,
}) => {
  const [selectedPlantId, setSelectedPlantId] = useState<string>(
    defaultPlantId || (plants[0]?.id || '')
  );
  const [selectedType, setSelectedType] = useState<ReminderType>('watering');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [dueDateText, setDueDateText] = useState<string>('Tomorrow');
  const [repeat, setRepeat] = useState<ReminderRepeat>('weekly');
  const [note, setNote] = useState<string>('Check the top 2 inches of soil before watering.');

  if (!isOpen) return null;

  const currentPlant = plants.find((p) => p.id === selectedPlantId) || plants[0];
  const typeConfig = TYPE_CONFIGS.find((c) => c.type === selectedType) || TYPE_CONFIGS[0];

  const handleTypeSelect = (type: ReminderType) => {
    setSelectedType(type);
    const cfg = TYPE_CONFIGS.find((c) => c.type === type);
    if (cfg && currentPlant) {
      setCustomTitle(cfg.defaultTitle(currentPlant.name));
      setNote(cfg.defaultNote);
    }
  };

  const handlePlantSelect = (plantId: string) => {
    setSelectedPlantId(plantId);
    const p = plants.find((item) => item.id === plantId);
    if (p && typeConfig) {
      setCustomTitle(typeConfig.defaultTitle(p.name));
    }
  };

  const effectiveTitle = customTitle.trim() || (currentPlant ? typeConfig.defaultTitle(currentPlant.name) : 'Plant Care');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlant) return;

    const newReminder: PlantReminder = {
      id: `rem_${Date.now()}`,
      plantId: currentPlant.id,
      plantName: currentPlant.name,
      type: selectedType,
      title: effectiveTitle,
      dueDate: dueDateText,
      repeat,
      note: note.trim() || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    ReminderRepository.addReminder(newReminder);
    onSave(newReminder);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-reminder-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF8F5] border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-6 text-[#16281D]"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#76877A] hover:text-[#16281D] p-2 rounded-xl cursor-pointer hover:bg-[#EFECE5] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            Care Planner
          </span>
          <h2 id="add-reminder-title" className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal tracking-tight mt-1">
            Add Plant Reminder
          </h2>
          <p className="text-xs text-[#566B5C] font-sans mt-1">
            Routines are human-led. We prioritize observing soil and light before acting.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
          {/* Plant Selector */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-medium mb-1.5">
              Plant
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {plants.map((plant) => (
                <button
                  key={plant.id}
                  type="button"
                  onClick={() => handlePlantSelect(plant.id)}
                  className={`px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                    plant.id === selectedPlantId
                      ? 'border-[#16281D] bg-[#16281D] text-[#FAF8F5] shadow-xs'
                      : 'border-[#DDD7CC] bg-white text-[#16281D] hover:bg-[#EFECE5]'
                  }`}
                >
                  {plant.name}
                </button>
              ))}
            </div>
          </div>

          {/* Routine Type Grid */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-medium mb-1.5">
              Care Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TYPE_CONFIGS.map((cfg) => (
                <button
                  key={cfg.type}
                  type="button"
                  onClick={() => handleTypeSelect(cfg.type)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedType === cfg.type
                      ? 'border-[#16281D] bg-[#EFECE5] font-semibold text-[#16281D]'
                      : 'border-[#E2DAD0] bg-white text-[#566B5C] hover:border-[#16281D]/40'
                  }`}
                >
                  <span className="text-base block mb-0.5">{cfg.icon}</span>
                  <span className="block truncate text-[11px]">{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title input */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-medium mb-1.5">
              Reminder Label
            </label>
            <input
              type="text"
              value={customTitle}
              placeholder={currentPlant ? typeConfig.defaultTitle(currentPlant.name) : 'Reminder'}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-xs font-sans text-[#16281D] focus:border-[#16281D] outline-none"
            />
          </div>

          {/* Due Date & Repeat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-medium mb-1.5">
                When
              </label>
              <select
                value={dueDateText}
                onChange={(e) => setDueDateText(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-xs font-sans text-[#16281D] focus:border-[#16281D] outline-none cursor-pointer"
              >
                <option value="Tomorrow">Tomorrow</option>
                <option value="This Weekend">This Weekend</option>
                <option value="Nov 10">Nov 10</option>
                <option value="Nov 14">Nov 14</option>
                <option value="Nov 18">Nov 18</option>
                <option value="Nov 25">Nov 25</option>
                <option value="Dec 01">Dec 01</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-medium mb-1.5">
                Repeat
              </label>
              <select
                value={repeat}
                onChange={(e) => setRepeat(e.target.value as ReminderRepeat)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-xs font-sans text-[#16281D] focus:border-[#16281D] outline-none cursor-pointer"
              >
                <option value="never">Never (Once)</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Every 2 weeks</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-medium mb-1.5">
              Optional Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Check soil before watering."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-xs font-sans text-[#16281D] focus:border-[#16281D] outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#E7E2D7]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-[#76877A] hover:text-[#16281D] font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] font-semibold cursor-pointer transition-all shadow-xs"
            >
              Save Reminder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
