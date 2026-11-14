import React, { useState } from 'react';
import {
  Plant,
  ObservationRecord,
  ObservationCategory,
  ObservationChange,
  PinMarker,
  AdaptiveAiMode,
  HumanEvaluation,
  PlantContext,
} from '../../types';
import { GhostCaptureStep } from './GhostCaptureStep';
import { ObserveFirstStep } from './ObserveFirstStep';
import { AnalyzingStep } from './AnalyzingStep';
import { LookAgainStep } from './LookAgainStep';
import { ComparisonRevealStep } from './ComparisonRevealStep';
import { LightweightReflectionStep } from './LightweightReflectionStep';
import { requestPlantAnalysis } from '../../services/aiService';
import { Eye, Shield, Sparkles } from 'lucide-react';

interface AddObservationFlowProps {
  plant: Plant;
  previousObservation: ObservationRecord | null;
  adaptiveMode: AdaptiveAiMode;
  onSaveObservation: (newObservation: ObservationRecord) => void;
  onCancel: () => void;
}

type FlowStep =
  | 'mode_selection'
  | 'ghost_capture'
  | 'observe_first'
  | 'analyzing'
  | 'look_again'
  | 'comparison_reveal'
  | 'reflection';

export const AddObservationFlow: React.FC<AddObservationFlowProps> = ({
  plant,
  previousObservation,
  adaptiveMode: initialAdaptiveMode,
  onSaveObservation,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('mode_selection');
  const [chosenMode, setChosenMode] = useState<AdaptiveAiMode>(initialAdaptiveMode);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string>('');

  // Human inputs
  const [humanCategories, setHumanCategories] = useState<ObservationCategory[]>([]);
  const [humanNote, setHumanNote] = useState<string>('');
  const [humanPins, setHumanPins] = useState<PinMarker[]>([]);
  const [plantContext, setPlantContext] = useState<PlantContext | undefined>(undefined);

  // AI results
  const [aiChanges, setAiChanges] = useState<ObservationChange[]>([]);
  const [aiReflectiveSummary, setAiReflectiveSummary] = useState<string>('');
  const [unnoticedByHuman, setUnnoticedByHuman] = useState<ObservationChange[]>([]);

  // Reflection answer
  const [reflectionAnswer, setReflectionAnswer] = useState<{ question: string; answer: string } | undefined>(undefined);

  // Step 1: Mode selected -> move to Ghost Capture
  const handleSelectModeAndProceed = (mode: AdaptiveAiMode) => {
    setChosenMode(mode);
    setCurrentStep('ghost_capture');
  };

  // Step 2: Photo captured
  const handlePhotoSelected = (photoUrl: string) => {
    setCapturedPhotoUrl(photoUrl);
    setCurrentStep('observe_first');
  };

  // Step 3: Human commits observation
  const handleCommitObservation = async (
    categories: ObservationCategory[],
    note: string,
    pins: PinMarker[],
    context?: PlantContext
  ) => {
    setHumanCategories(categories);
    setHumanNote(note);
    setHumanPins(pins);
    setPlantContext(context);

    // If observing strictly without AI
    if (chosenMode === 'independent') {
      setCurrentStep('reflection');
      return;
    }

    setCurrentStep('analyzing');

    try {
      const result = await requestPlantAnalysis({
        previousImage: previousObservation?.image || plant.coverImage,
        currentImage: capturedPhotoUrl,
        plantName: plant.name,
        plantSpecies: plant.species,
        humanCategories: categories,
        humanNote: note,
        aiMode: chosenMode,
      });

      setAiChanges(result.changes);
      setAiReflectiveSummary(result.reflectiveSummary);

      const unselected = result.changes.filter((c) => !categories.includes(c.category));
      setUnnoticedByHuman(unselected);

      // If there's an unnoticed change with a suggested cue, route to Look Again!
      if (unselected.length > 0 && unselected[0].suggestedCue) {
        setCurrentStep('look_again');
      } else {
        setCurrentStep('comparison_reveal');
      }
    } catch (err) {
      console.warn('AI analysis fallback:', err);
      setCurrentStep('comparison_reveal');
    }
  };

  // Step 4: Human discovered more in Look Again
  const handleHumanDiscoveredMore = (newCategories: ObservationCategory[]) => {
    setHumanCategories((prev) => Array.from(new Set([...prev, ...newCategories])));
  };

  // Step 5: Update AI finding evaluation (I see it, Not sure, Differently)
  const handleUpdateAiEvaluation = (index: number, evalType: HumanEvaluation, evalNote?: string) => {
    setAiChanges((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = {
          ...next[index],
          humanEvaluation: evalType,
          humanEvaluationNote: evalNote,
        };
      }
      return next;
    });
  };

  // Step 6: Proceed to reflection
  const handleProceedToReflection = () => {
    setCurrentStep('reflection');
  };

  // Final Step: Complete reflection and save to growth story
  const handleFinalSave = (q: string, a: string) => {
    const nextDay = (previousObservation?.dayNumber || plant.daysTogether || 1) + 7;
    const aiCategoryList = aiChanges.map((c) => c.category);

    const both = humanCategories.filter((c) => aiCategoryList.includes(c));
    const humanOnly = humanCategories.filter((c) => !aiCategoryList.includes(c));
    const aiOnly = aiCategoryList.filter((c) => !humanCategories.includes(c));

    const newRecord: ObservationRecord = {
      id: `obs_${Date.now()}`,
      plantId: plant.id,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      dayNumber: nextDay,
      image: capturedPhotoUrl,
      humanCategories,
      humanNote,
      humanPins,
      aiChanges,
      aiReflectiveSummary: chosenMode === 'independent' ? 'Observed independently with patient human focus.' : aiReflectiveSummary,
      bothCategories: both,
      humanOnlyCategories: humanOnly,
      aiOnlyCategories: Array.from(new Set(aiOnly)),
      lookAgainResolved: true,
      aiMode: chosenMode,
      observeWithoutAi: chosenMode === 'independent',
      aiRevealed: chosenMode !== 'independent',
      context: plantContext,
      reflectionAnswer: { question: q, answer: a },
    };

    onSaveObservation(newRecord);
  };

  return (
    <div className="min-h-[80vh] py-4">
      {/* MODE SELECTION SCREEN (Observe Without AI vs Adaptive Coach vs Guided) */}
      {currentStep === 'mode_selection' && (
        <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center animate-fade-in">
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            Observation Ritual · {plant.name}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight mt-1.5">
            Choose Today’s Ritual
          </h2>
          <p className="font-serif italic text-base sm:text-lg text-[#4E6153] mt-2 font-light">
            “AI should learn when to help, how to help, and when to stay quiet.”
          </p>

          <div className="grid grid-cols-1 gap-4 mt-10 text-left">
            {/* Mode 1: Observe Without AI */}
            <div
              onClick={() => handleSelectModeAndProceed('independent')}
              className="p-6 rounded-3xl border border-[#E7E2D7] bg-[#FAF8F5] hover:border-[#16281D]/60 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-xl text-[#16281D] group-hover:text-[#203D2A] transition-colors">
                  Observe Without AI
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#203D2A] bg-[#EDE8DE] px-2.5 py-1 rounded-md font-semibold">
                  Today is yours
                </span>
              </div>
              <p className="font-serif italic text-xs text-[#566B5C] mb-2">
                “LeafStory stays completely quiet during this observation.”
              </p>
              <p className="text-xs text-[#76877A] font-sans leading-relaxed">
                Take all the time you need to examine leaf forms, angles, and colors on your own terms. No computational suggestions will interrupt your gaze.
              </p>
            </div>

            {/* Mode 2: Adaptive Observation Challenge */}
            <div
              onClick={() => handleSelectModeAndProceed('challenge')}
              className="p-6 rounded-3xl border border-[#E7E2D7] bg-[#FAF8F5] hover:border-[#16281D]/60 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-xl text-[#16281D] group-hover:text-[#203D2A] transition-colors">
                  Observation Challenge
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#76877A] bg-[#EFECE5] px-2.5 py-1 rounded-md font-semibold">
                  Attention Clue
                </span>
              </div>
              <p className="font-serif italic text-xs text-[#566B5C] mb-2">
                “Before continuing, notice how the leaves relate to each other.”
              </p>
              <p className="text-xs text-[#76877A] font-sans leading-relaxed">
                LeafStory provides an attention direction without giving away answers, guiding you to explore new physical dimensions like posture and leaf tilt.
              </p>
            </div>

            {/* Mode 3: Guided Perspective */}
            <div
              onClick={() => handleSelectModeAndProceed('guided')}
              className="p-6 rounded-3xl border border-[#E7E2D7] bg-[#FAF8F5] hover:border-[#16281D]/60 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-xl text-[#16281D] group-hover:text-[#203D2A] transition-colors">
                  Guided Second Perspective
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#76877A] bg-[#EFECE5] px-2.5 py-1 rounded-md font-semibold">
                  Shared Seeing
                </span>
              </div>
              <p className="font-serif italic text-xs text-[#566B5C] mb-2">
                “Human observation first. AI second.”
              </p>
              <p className="text-xs text-[#76877A] font-sans leading-relaxed">
                Record your findings first, then compare with subtle AI cues and Look Again hints.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={onCancel}
              className="text-xs font-sans text-[#76877A] hover:text-[#16281D] cursor-pointer"
            >
              Cancel observation
            </button>
          </div>
        </div>
      )}

      {currentStep === 'ghost_capture' && (
        <GhostCaptureStep
          plant={plant}
          previousObservation={previousObservation}
          onPhotoSelected={handlePhotoSelected}
          onCancel={onCancel}
        />
      )}

      {currentStep === 'observe_first' && (
        <ObserveFirstStep
          plant={plant}
          previousObservation={previousObservation}
          currentPhotoUrl={capturedPhotoUrl}
          onCommitObservation={handleCommitObservation}
          onBack={() => setCurrentStep('ghost_capture')}
          isSilentMode={chosenMode === 'independent'}
        />
      )}

      {currentStep === 'analyzing' && <AnalyzingStep />}

      {currentStep === 'look_again' && (
        <LookAgainStep
          plant={plant}
          currentPhotoUrl={capturedPhotoUrl}
          unnoticedChanges={unnoticedByHuman}
          humanCategories={humanCategories}
          onHumanDiscoveredMore={handleHumanDiscoveredMore}
          onProceedToReveal={() => setCurrentStep('comparison_reveal')}
        />
      )}

      {currentStep === 'comparison_reveal' && (
        <ComparisonRevealStep
          plant={plant}
          previousObservation={previousObservation}
          currentPhotoUrl={capturedPhotoUrl}
          humanCategories={humanCategories}
          humanNote={humanNote}
          humanPins={humanPins}
          aiChanges={aiChanges}
          aiReflectiveSummary={aiReflectiveSummary}
          isSilentMode={chosenMode === 'independent'}
          onUpdateAiEvaluation={handleUpdateAiEvaluation}
          onProceedToReflection={handleProceedToReflection}
        />
      )}

      {currentStep === 'reflection' && (
        <LightweightReflectionStep
          onComplete={handleFinalSave}
        />
      )}
    </div>
  );
};
