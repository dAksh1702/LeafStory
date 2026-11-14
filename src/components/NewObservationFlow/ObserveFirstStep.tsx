import React, { useState } from 'react';
import { Plant, ObservationRecord, ObservationCategory, CATEGORY_DEFINITIONS, PinMarker, PlantContext } from '../../types';
import { ArrowRight, ArrowLeft, X, MapPin, Sun, Droplets, MoveHorizontal } from 'lucide-react';

interface ObserveFirstStepProps {
  plant: Plant;
  previousObservation: ObservationRecord | null;
  currentPhotoUrl: string;
  onCommitObservation: (
    selectedCategories: ObservationCategory[],
    note: string,
    pins: PinMarker[],
    context?: PlantContext
  ) => void;
  onBack: () => void;
  isSilentMode?: boolean;
}

export const ObserveFirstStep: React.FC<ObserveFirstStepProps> = ({
  plant,
  previousObservation,
  currentPhotoUrl,
  onCommitObservation,
  onBack,
  isSilentMode = false,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<ObservationCategory[]>([]);
  const [userNote, setUserNote] = useState<string>('');
  const [pins, setPins] = useState<PinMarker[]>([]);
  const [pinPrompt, setPinPrompt] = useState<boolean>(true);

  // Optional Context Journal
  const [showContext, setShowContext] = useState<boolean>(false);
  const [light, setLight] = useState<'low' | 'medium' | 'bright'>('medium');
  const [wateredRecently, setWateredRecently] = useState<boolean>(false);
  const [locationChanged, setLocationChanged] = useState<boolean>(false);

  const previousImageUrl = previousObservation?.image || plant.coverImage;

  const toggleCategory = (catId: ObservationCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const handlePhotoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPin: PinMarker = {
      xPercent: Math.round(x),
      yPercent: Math.round(y),
      label: `Point ${pins.length + 1}`,
    };

    setPins((prev) => [...prev, newPin]);
    setPinPrompt(false);
  };

  const removePin = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPins((prev) => prev.filter((_, i) => i !== index));
  };

  const canProceed = selectedCategories.length > 0 || userNote.trim().length > 0 || pins.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
          {isSilentMode ? 'Observe Without AI' : 'Human Observation First'}
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight mt-1.5">
          {isSilentMode ? 'Take your time. Today is yours.' : 'What do you notice?'}
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-[#4E6153] mt-2 font-light">
          {isSilentMode
            ? '“LeafStory will stay quiet during this observation. Trust your own trained eye.”'
            : '“Before LeafStory provides a second perspective, record your own authentic discoveries.”'}
        </p>
      </div>

      {/* Side-by-Side Large Comparison Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
        {/* Previous Observation Photo */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-sans text-[#76877A] px-1">
            <span className="uppercase tracking-wider font-medium">Previous Reference</span>
            <span>{previousObservation?.date || plant.firstObservationDate}</span>
          </div>

          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#EAE5DC] shadow-sm border border-[#DCD6C9]">
            <img
              src={previousImageUrl}
              alt="Previous observation"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-[#FAF8F5] text-[11px] font-sans px-3 py-1 rounded-md">
              Day {previousObservation?.dayNumber || 1}
            </div>
          </div>
        </div>

        {/* Today's Observation Photo with Interactive Click-to-Pin Marker */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-sans px-1">
            <span className="uppercase tracking-wider font-semibold text-[#16281D]">Today’s Photo</span>
            <span className="text-[#203D2A] font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Tap photo to mark change ({pins.length})</span>
            </span>
          </div>

          <div
            onClick={handlePhotoClick}
            className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#EAE5DC] shadow-sm border-2 border-[#16281D]/80 cursor-crosshair group select-none"
            title="Click anywhere on the photo to mark what you notice"
          >
            <img
              src={currentPhotoUrl}
              alt="Today's observation"
              className="w-full h-full object-cover"
            />

            {/* Click pins placed by user */}
            {pins.map((pin, i) => (
              <div
                key={i}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 animate-pin-pop"
                style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
              >
                <div className="relative group/pin">
                  <div className="w-8 h-8 rounded-full bg-[#16281D] text-[#FAF8F5] border-2 border-white shadow-md flex items-center justify-center text-xs font-sans font-bold">
                    {i + 1}
                  </div>
                  <button
                    onClick={(e) => removePin(i, e)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white text-[#8C342A] rounded-full shadow-md flex items-center justify-center hover:bg-[#FAF0EE] cursor-pointer"
                    title="Remove marker"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Subtle Guidance Floating Chip */}
            {pinPrompt && pins.length === 0 && (
              <div className="absolute bottom-4 inset-x-4 bg-black/65 backdrop-blur-xs text-[#FAF8F5] text-xs font-sans py-2 px-4 rounded-xl text-center pointer-events-none">
                Tap anywhere on the photo to place a marker where you see movement or new growth
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Observation Categories Selection */}
      <div className="max-w-3xl mx-auto mb-10">
        <h3 className="font-serif text-2xl text-[#16281D] font-normal mb-1">
          Select what you notice:
        </h3>
        <p className="text-xs text-[#76877A] font-sans mb-6">
          Choose one or more categories that align with your eye today.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {CATEGORY_DEFINITIONS.map((cat) => {
            const isSelected = selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'border-[#16281D] bg-[#EDE8DE] shadow-xs'
                    : 'border-[#DDD7CC] bg-white hover:border-[#16281D]/40'
                }`}
              >
                <span className="text-2xl shrink-0 mt-0.5">{cat.icon}</span>
                <div className="flex-1">
                  <span className="font-sans text-sm font-semibold text-[#16281D] block">
                    {cat.label}
                  </span>
                  <span className="text-xs text-[#6B7E70] font-sans block mt-0.5 leading-snug">
                    {cat.description}
                  </span>
                </div>
                <div
                  className={`w-4 h-4 rounded-md border mt-1 flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-[#16281D] border-[#16281D]' : 'border-[#B8AF9F]'
                  }`}
                >
                  {isSelected && <span className="text-[10px] text-white">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Written Observation Note */}
        <div className="pt-6 border-t border-[#E7E2D7] mb-6">
          <label
            htmlFor="observation-note"
            className="block text-[11px] uppercase tracking-wider text-[#76877A] font-sans font-medium mb-2"
          >
            Personal observation note (optional):
          </label>
          <textarea
            id="observation-note"
            rows={2}
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="e.g. The upper leaf seems to be leaning more toward the window."
            className="w-full p-4 rounded-2xl border border-[#DDD7CC] bg-white text-sm font-sans text-[#16281D] placeholder:text-[#9B9386] focus:border-[#16281D] focus:ring-1 focus:ring-[#16281D] outline-none transition-all resize-none"
          />
        </div>

        {/* Optional Environmental Context Journal */}
        <div className="pt-4 border-t border-[#E7E2D7]">
          <button
            type="button"
            onClick={() => setShowContext(!showContext)}
            className="flex items-center gap-2 text-xs font-sans text-[#566B5C] hover:text-[#16281D] cursor-pointer"
          >
            <span>{showContext ? '− Hide environmental context' : '+ Add environmental context (light, water)'}</span>
          </button>

          {showContext && (
            <div className="mt-4 p-5 rounded-2xl bg-[#F3EFE7] border border-[#E2DAD0] space-y-4 text-xs font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[#16281D] font-medium flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#76877A]" />
                  <span>Light conditions</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {(['low', 'medium', 'bright'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLight(l)}
                      className={`px-3 py-1 rounded-lg capitalize cursor-pointer ${
                        light === l ? 'bg-[#16281D] text-white font-medium' : 'bg-white border border-[#DDD7CC] text-[#566B5C]'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E2DAD0]">
                <span className="text-[#16281D] font-medium flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#76877A]" />
                  <span>Watered recently</span>
                </span>
                <input
                  type="checkbox"
                  checked={wateredRecently}
                  onChange={(e) => setWateredRecently(e.target.checked)}
                  className="w-4 h-4 accent-[#16281D] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#E2DAD0]">
                <span className="text-[#16281D] font-medium flex items-center gap-1.5">
                  <MoveHorizontal className="w-3.5 h-3.5 text-[#76877A]" />
                  <span>Location / pot angle changed</span>
                </span>
                <input
                  type="checkbox"
                  checked={locationChanged}
                  onChange={(e) => setLocationChanged(e.target.checked)}
                  className="w-4 h-4 accent-[#16281D] cursor-pointer"
                />
              </div>

              <p className="text-[11px] text-[#76877A] italic pt-1">
                Note: Environmental entries are kept strictly as personal context without claiming direct causes.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Commit Action Footer */}
      <div className="flex items-center justify-between max-w-3xl mx-auto pt-4 border-t border-[#E7E2D7]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans text-[#566B5C] hover:text-[#16281D] cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Adjust framing</span>
        </button>

        <button
          onClick={() => {
            if (canProceed) {
              onCommitObservation(selectedCategories, userNote, pins, {
                light,
                wateredRecently,
                locationChanged,
              });
            }
          }}
          disabled={!canProceed}
          className={`flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-xs sm:text-sm font-sans font-medium transition-all shadow-xs ${
            canProceed
              ? 'bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] cursor-pointer active:scale-98'
              : 'bg-[#D6CFC3] text-[#867E72] cursor-not-allowed'
          }`}
        >
          <span>{isSilentMode ? 'Save My Observation' : 'I’m ready to compare'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
