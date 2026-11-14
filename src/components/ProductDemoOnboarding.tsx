import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  X,
  RotateCcw,
  Sprout,
  Eye,
  Check,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  Sliders,
  Maximize2,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ProductDemoOnboardingProps {
  isOpen: boolean;
  userName?: string;
  onComplete: () => void;
  onAddFirstPlant: () => void;
}

interface DemoChapter {
  id: string;
  number: string;
  title: string;
  scenes: number[]; // scene indexes (0 to 11)
}

const CHAPTERS: DemoChapter[] = [
  { id: 'meet', number: '01', title: 'MEET', scenes: [0] },
  { id: 'observe', number: '02', title: 'OBSERVE', scenes: [1, 2, 3, 4] },
  { id: 'compare', number: '03', title: 'COMPARE', scenes: [5, 6, 7] },
  { id: 'reflect', number: '04', title: 'REFLECT', scenes: [8] },
  { id: 'grow', number: '05', title: 'GROW', scenes: [9, 10, 11] },
  { id: 'begin', number: '06', title: 'BEGIN', scenes: [12] },
];

const TOTAL_SCENES = 13; // 0 to 12
const SCENE_DURATION_MS = 3800; // ~3.8 seconds per scene

export const ProductDemoOnboarding: React.FC<ProductDemoOnboardingProps> = ({
  isOpen,
  userName = 'Gardener',
  onComplete,
  onAddFirstPlant,
}) => {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [interactiveSelectedEvaluation, setInteractiveSelectedEvaluation] = useState<'see_it' | 'differently' | null>(null);

  const timerRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const sceneStartTimeRef = useRef<number>(Date.now());

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleNext = useCallback(() => {
    setCurrentScene((prev) => {
      if (prev < TOTAL_SCENES - 1) {
        return prev + 1;
      }
      setIsPlaying(false);
      return prev;
    });
    setSceneProgress(0);
    sceneStartTimeRef.current = Date.now();
  }, []);

  const handleBack = useCallback(() => {
    setCurrentScene((prev) => Math.max(0, prev - 1));
    setSceneProgress(0);
    sceneStartTimeRef.current = Date.now();
  }, []);

  const handleJumpToScene = (sceneIndex: number) => {
    setCurrentScene(sceneIndex);
    setSceneProgress(0);
    sceneStartTimeRef.current = Date.now();
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
    sceneStartTimeRef.current = Date.now() - (sceneProgress / 100) * SCENE_DURATION_MS;
  };

  const handleRestart = () => {
    setCurrentScene(0);
    setSceneProgress(0);
    setIsPlaying(true);
    setInteractiveSelectedEvaluation(null);
    sceneStartTimeRef.current = Date.now();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handleBack();
      if (e.key === ' ') {
        e.preventDefault();
        handleTogglePlay();
      }
      if (e.key === 'Escape') onComplete();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleNext, handleBack, onComplete]);

  // Scene progression loop
  useEffect(() => {
    if (!isOpen || !isPlaying || currentScene >= TOTAL_SCENES - 1) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    sceneStartTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - sceneStartTimeRef.current;
      const progress = Math.min(100, (elapsed / SCENE_DURATION_MS) * 100);
      setSceneProgress(progress);

      if (elapsed >= SCENE_DURATION_MS) {
        handleNext();
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isPlaying, currentScene, handleNext]);

  if (!isOpen) return null;

  // Identify current chapter
  const currentChapter = CHAPTERS.find((ch) => ch.scenes.includes(currentScene)) || CHAPTERS[0];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-[#FAF8F5] text-[#16281D] overflow-hidden select-none font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="LeafStory interactive product demonstration"
    >
      {/* Background ambient texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#16281D_0.75px,transparent_0.75px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      {/* Top Header & Chapter Progress */}
      <header className="relative z-10 px-6 sm:px-12 py-5 flex items-center justify-between border-b border-[#EAE5DC] bg-[#FAF8F5]/90 backdrop-blur-md">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <BrandLogo variant="responsive" symbolClassName="w-7 h-7" />
          <span className="hidden lg:inline text-[10px] uppercase tracking-widest text-[#76877A] font-sans font-medium pl-2 border-l border-[#DDD7CC]">
            Coded Product Demo
          </span>
        </div>

        {/* 6 Chapter Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {CHAPTERS.map((ch) => {
            const isActive = ch.id === currentChapter.id;
            const isPassed = ch.scenes[ch.scenes.length - 1] < currentScene;
            return (
              <button
                key={ch.id}
                onClick={() => handleJumpToScene(ch.scenes[0])}
                className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#16281D] text-[#FAF8F5] font-semibold shadow-xs'
                    : isPassed
                    ? 'text-[#243E2B] hover:bg-[#EAE5DC]'
                    : 'text-[#8E9B91] hover:text-[#16281D]'
                }`}
              >
                <span className="text-[10px] opacity-70">{ch.number}</span>
                <span>{ch.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Action button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onComplete}
            className="text-xs font-sans text-[#566B5C] hover:text-[#16281D] px-3.5 py-1.5 rounded-lg border border-[#DDD7CC] hover:bg-[#EFECE5] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>Skip Intro</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Animated Theater Stage */}
      <main className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto min-h-[460px] sm:min-h-[520px] flex items-center justify-center">
          {/* ======================================================== */}
          {/* SCENE 0: Welcome & Core Question                         */}
          {/* ======================================================== */}
          {currentScene === 0 && (
            <div className="text-center max-w-2xl mx-auto space-y-6 animate-fade-in py-8">
              <div className="w-20 h-20 rounded-full bg-[#EAE5DC] text-[#16281D] flex items-center justify-center mx-auto shadow-sm ring-8 ring-[#FAF8F5]">
                <Sprout className="w-10 h-10 text-[#16281D] animate-soft-pulse" />
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest text-[#76877A] font-medium block">
                  A Human × AI Observation Project
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#16281D] font-normal tracking-tight">
                  Meet LeafStory.
                </h1>
                <p className="font-serif italic text-lg sm:text-2xl text-[#4E6153] font-light max-w-xl mx-auto">
                  “Your plant is always changing.”
                </p>
              </div>

              <div className="pt-4 border-t border-[#EAE5DC] max-w-md mx-auto">
                <span className="text-xs text-[#76877A] uppercase tracking-wider block mb-1">
                  The central question
                </span>
                <p className="font-serif text-2xl sm:text-3xl text-[#16281D] font-normal">
                  Are you noticing?
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCENE 1: Meet Your Plant Dashboard                       */}
          {/* ======================================================== */}
          {currentScene === 1 && (
            <div className="w-full max-w-xl mx-auto bg-white border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 shadow-xl animate-fade-in relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1] text-xs text-[#76877A]">
                <span className="font-medium">Garden Dashboard</span>
                <span>Day 84 Together</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 items-center">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#EAE5DC] border border-[#DDD7CC]">
                  <img
                    src="/src/assets/images/milo_monstera_full_1792440447034.jpg"
                    alt="Milo Monstera"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-xs text-[10px] text-white rounded-md font-sans">
                    Milo · Monstera Deliciosa
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#76877A] font-medium">Active Plant</span>
                    <h3 className="font-serif text-2xl text-[#16281D] font-normal">Milo</h3>
                    <p className="text-xs text-[#566B5C]">East-facing window sill · 8 observations</p>
                  </div>

                  <div className="pt-2">
                    {/* Simulated cursor clicking button */}
                    <div className="relative inline-block">
                      <div className="px-5 py-2.5 rounded-xl bg-[#16281D] text-[#FAF8F5] text-xs font-semibold shadow-md flex items-center gap-2 scale-98 ring-2 ring-[#4E6153]/30">
                        <Sprout className="w-3.5 h-3.5" />
                        <span>Add today’s observation</span>
                      </div>
                      {/* Animated hand/cursor pointer */}
                      <div className="absolute -bottom-3 -right-3 w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#16281D] shadow-lg flex items-center justify-center animate-bounce">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#16281D]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#F0EBE1] text-center text-xs font-serif italic text-[#4E6153]">
                “Something may have changed while you weren’t looking.”
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCENE 2: Ghost Capture Viewfinder Alignment              */}
          {/* ======================================================== */}
          {currentScene === 2 && (
            <div className="w-full max-w-xl mx-auto bg-[#1A261E] border border-[#2B3B2F] rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in text-white relative">
              <div className="flex items-center justify-between text-xs text-[#A8B6AB] mb-4">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Ghost Capture Lens
                </span>
                <span className="text-[11px] font-mono">30% Reference Overlay</span>
              </div>

              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-[#3C4E41] flex items-center justify-center">
                {/* Reference Ghost Image (30% opacity) */}
                <img
                  src="/src/assets/images/milo_monstera_mid_1792440432733.jpg"
                  alt="Ghost Reference"
                  className="absolute inset-0 w-full h-full object-cover opacity-35 filter contrast-125"
                />

                {/* Today's Live Image Snapping into alignment */}
                <img
                  src="/src/assets/images/milo_monstera_full_1792440447034.jpg"
                  alt="Today Capture"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 transition-all duration-1000 transform scale-100"
                />

                {/* Viewfinder crosshairs and alignment ring */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 border border-white/40 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
                  <div className="absolute w-12 h-12 border-2 border-emerald-400 rounded-lg animate-pulse" />
                  <div className="absolute text-[11px] font-sans font-medium bg-emerald-950/80 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/50 -bottom-8">
                    ✓ Angles Aligned
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="font-serif italic text-sm text-[#D1DDD3]">
                  “Match the angle of your previous photo so subtle shifts become visible.”
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCENE 3: Human Observes First (Pin & Category)           */}
          {/* ======================================================== */}
          {currentScene === 3 && (
            <div className="w-full max-w-2xl mx-auto bg-white border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 shadow-xl animate-fade-in space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-semibold">
                  Human Observation First
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#16281D]">
                  What do you notice first?
                </h3>
                <p className="text-xs text-[#566B5C]">
                  Look quietly at your plant before inviting LeafStory in.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo with active botanical pin marker */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#EAE5DC] border border-[#DDD7CC]">
                  <img
                    src="/src/assets/images/milo_monstera_full_1792440447034.jpg"
                    alt="Observing plant"
                    className="w-full h-full object-cover"
                  />
                  {/* Pin placed by user */}
                  <div className="absolute top-[34%] left-[58%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 animate-bounce">
                    <div className="w-5 h-5 rounded-full bg-[#16281D] border-2 border-white shadow-md flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#D8E6D8]" />
                    </div>
                    <span className="bg-[#16281D] text-[#FAF8F5] text-[10px] font-sans px-2 py-0.5 rounded shadow">
                      New leaf split
                    </span>
                  </div>
                </div>

                {/* Selected categories */}
                <div className="space-y-3 flex flex-col justify-center">
                  <div className="p-3 rounded-xl bg-[#16281D] text-white flex items-center justify-between text-xs font-medium shadow-xs">
                    <span className="flex items-center gap-2">
                      <span>🌱</span> New growth / new leaf
                    </span>
                    <Check className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2D7] text-[#16281D] flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-2">
                      <span>↗</span> Direction / light tilt
                    </span>
                    <span className="text-[10px] text-[#76877A]">Optional</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2D7] text-[#16281D] flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-2">
                      <span>◯</span> Structure / fullness
                    </span>
                    <span className="text-[10px] text-[#76877A]">Optional</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <div className="px-5 py-2.5 rounded-xl bg-[#16281D] text-white text-xs font-semibold flex items-center gap-2">
                  <span>I’m ready for LeafStory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCENE 4: AI Waits Quietly (Zero Pre-judgment)             */}
          {/* ======================================================== */}
          {currentScene === 4 && (
            <div className="w-full max-w-lg mx-auto bg-[#F7F4EC] border border-[#DDD7CC] rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-white border border-[#DDD7CC] text-[#4E6153] flex items-center justify-center mx-auto shadow-sm">
                <ShieldCheck className="w-8 h-8 text-[#243E2B]" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-semibold">
                  Zero Interruption Principle
                </span>
                <h3 className="font-serif text-3xl text-[#16281D] font-normal">
                  LeafStory waits for you.
                </h3>
                <p className="font-serif italic text-base text-[#4E6153]">
                  “LeafStory hasn’t looked yet. You always observe first.”
                </p>
              </div>

              <p className="text-xs text-[#566B5C] leading-relaxed max-w-sm mx-auto">
                No instant answers. No automated popups telling you what is wrong. Your own perception is anchored before any algorithmic perspective is invited.
              </p>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCENE 5: Look Again (Gentle Botanical Prompt)            */}
          {/* ======================================================== */}
          {currentScene === 5 && (
            <div className="w-full max-w-2xl mx-auto bg-white border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 shadow-xl animate-fade-in space-y-5">
              <div className="text-center space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-semibold">
                  Gentle Invitation
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#16281D]">
                  Look Once More.
                </h3>
                <p className="font-serif italic text-sm text-[#4E6153]">
                  “Look once more at how the upper leaves are positioned toward the light.”
                </p>
              </div>

              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#EAE5DC] border border-[#DDD7CC]">
                <img
                  src="/src/assets/images/milo_monstera_full_1792440447034.jpg"
                  alt="Look again visual guide"
                  className="w-full h-full object-cover"
                />
                {/* Organic botanical scanning focus ring */}
                <div className="absolute top-[28%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border-2 border-emerald-400 bg-emerald-500/10 backdrop-blur-[1px] animate-pulse flex items-center justify-center">
                  <span className="text-[10px] bg-[#16281D] text-white px-2 py-0.5 rounded-full font-sans shadow">
                    Notice angle & posture
                  </span>
                </div>
              </div>

              <div className="text-center pt-2">
                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#16281D] text-white text-xs font-semibold shadow-xs">
                  <Eye className="w-3.5 h-3.5" />
                  <span>I took another look</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCENE 6: Calm Botanical Scanning Wave                    */}
          {/* ======================================================== */}
          {currentScene === 6 && (
            <div className="w-full max-w-xl mx-auto bg-[#18261D] border border-[#2B3B2F] rounded-3xl p-8 shadow-2xl text-center text-white space-y-6 animate-fade-in">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-[#3A4B3F]">
                <img
                  src="/src/assets/images/milo_monstera_full_1792440447034.jpg"
                  alt="Scanning"
                  className="w-full h-full object-cover opacity-75"
                />
                {/* Organic serene scanning pulse */}
                <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent top-1/3 animate-[bounce_3s_ease-in-out_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-[#18261D]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-emerald-500/30 text-xs font-serif italic text-emerald-200">
                    LeafStory is observing quietly...
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-[#9CB0A2]">
                  No haste · No diagnostic noise
                </span>
                <p className="text-xs text-[#C5D5C9]">
                  Comparing visual contours, leaf planes, and subtle growth changes.
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCENE 7: Human + AI Reveal (3 Column Perspectives)       */}
          {/* ======================================================== */}
          {currentScene === 7 && (
            <div className="w-full max-w-3xl mx-auto bg-white border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 shadow-xl animate-fade-in space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-semibold">
                  A Second Perspective
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#16281D]">
                  Human + LeafStory Comparison
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. YOU NOTICED */}
                <div className="p-4 rounded-2xl bg-[#F7F4EC] border border-[#DDD7CC] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#16281D]">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#243E2B]" />
                      YOU NOTICED
                    </span>
                    <span className="text-[10px] text-[#76877A]">Human First</span>
                  </div>
                  <p className="text-xs text-[#243E2B] font-medium pt-1">
                    “New leaf unfurling upright with deep splits.”
                  </p>
                  <span className="inline-block text-[10px] text-[#76877A] font-sans">
                    🌱 New growth
                  </span>
                </div>

                {/* 2. BOTH NOTICED */}
                <div className="p-4 rounded-2xl bg-[#E8EFE9] border border-[#BFD5C3] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#16281D]">
                    <span className="flex items-center gap-1.5">
                      <Sprout className="w-3.5 h-3.5 text-[#243E2B]" />
                      BOTH NOTICED
                    </span>
                    <span className="text-[10px] text-emerald-800 font-semibold">Shared</span>
                  </div>
                  <p className="text-xs text-[#16281D] font-medium pt-1">
                    “Lighter lime green coloration along the new blade.”
                  </p>
                  <span className="inline-block text-[10px] text-[#243E2B] font-sans">
                    🍃 Color change
                  </span>
                </div>

                {/* 3. LEAFSTORY NOTICED */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D7] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#16281D]">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#4E6153]" />
                      LEAFSTORY NOTICED
                    </span>
                    <span className="text-[10px] text-[#76877A]">Second Lens</span>
                  </div>
                  <p className="text-xs text-[#4E6153] pt-1">
                    “Upper petiole appears tilted 6° toward the morning light.”
                  </p>
                  <span className="inline-block text-[10px] text-[#76877A] font-sans">
                    ↗ Direction
                  </span>
                </div>
              </div>

              <div className="text-center text-xs font-serif italic text-[#4E6153]">
                “AI isn’t the correct answer. It’s a quiet second pair of eyes.”
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCENE 8: Human Questions AI ("I see it differently")      */}
          {/* ======================================================== */}
          {currentScene === 8 && (
            <div className="w-full max-w-xl mx-auto bg-white border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 shadow-xl animate-fade-in space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-semibold">
                  Human Authority
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#16281D]">
                  You have the final say.
                </h3>
                <p className="text-xs text-[#566B5C]">
                  Evaluate what LeafStory noticed. Agree, stay open, or disagree.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DAD0] space-y-4">
                <div className="text-xs text-[#16281D] font-medium">
                  LeafStory suggests: <span className="font-serif italic text-[#4E6153]">“Petiole orientation turned toward window.”</span>
                </div>

                {/* Three response buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setInteractiveSelectedEvaluation('see_it')}
                    className={`py-2 px-3 rounded-xl border text-xs font-sans transition-all cursor-pointer ${
                      interactiveSelectedEvaluation === 'see_it'
                        ? 'bg-[#16281D] text-white border-[#16281D]'
                        : 'bg-white border-[#DDD7CC] text-[#4E6153] hover:bg-[#F0EBE1]'
                    }`}
                  >
                    ✓ I see it
                  </button>
                  <button
                    className="py-2 px-3 rounded-xl border bg-white border-[#DDD7CC] text-[#4E6153] hover:bg-[#F0EBE1] text-xs font-sans cursor-pointer"
                  >
                    ? Not sure
                  </button>
                  <button
                    onClick={() => setInteractiveSelectedEvaluation('differently')}
                    className={`py-2 px-3 rounded-xl border text-xs font-sans transition-all cursor-pointer ${
                      interactiveSelectedEvaluation === 'differently' || !interactiveSelectedEvaluation
                        ? 'bg-[#16281D] text-white border-[#16281D] shadow-xs'
                        : 'bg-white border-[#DDD7CC] text-[#4E6153]'
                    }`}
                  >
                    ✕ Differently
                  </button>
                </div>

                {/* Animated human explanation input */}
                <div className="p-3 rounded-xl bg-white border border-[#DDD7CC] text-xs font-sans space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#76877A]">Your perspective note</span>
                  <div className="text-[#16281D] font-medium flex items-center gap-1">
                    <span>“I rotated the pot 90 degrees yesterday.”</span>
                    <span className="w-1.5 h-3.5 bg-[#16281D] animate-pulse" />
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-[#566B5C] font-serif italic">
                “LeafStory learns how you look—and remembers your personal context.”
              </p>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCENE 9: Growth Story Timeline Scrubbing                 */}
          {/* ======================================================== */}
          {currentScene === 9 && (
            <div className="w-full max-w-2xl mx-auto bg-white border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 shadow-xl animate-fade-in space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#76877A] font-medium">Story 1</span>
                  <h3 className="font-serif text-2xl text-[#16281D]">Growth Story</h3>
                </div>
                <span className="text-xs font-mono text-[#4E6153]">Day 1 → Day 84</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1 text-center">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#EAE5DC] border border-[#DDD7CC]">
                    <img
                      src="/src/assets/images/milo_monstera_early_1792440419360.jpg"
                      alt="Day 1"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-sans text-[#76877A] block">July 27 · Day 1</span>
                </div>

                <div className="space-y-1 text-center">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#EAE5DC] border border-[#DDD7CC]">
                    <img
                      src="/src/assets/images/milo_monstera_mid_1792440432733.jpg"
                      alt="Day 36"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-sans text-[#76877A] block">Sept 01 · Day 36</span>
                </div>

                <div className="space-y-1 text-center">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#EAE5DC] border-2 border-[#16281D] shadow-sm">
                    <img
                      src="/src/assets/images/milo_monstera_full_1792440447034.jpg"
                      alt="Day 84"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] font-sans font-bold text-[#16281D] block">Oct 19 · Day 84</span>
                </div>
              </div>

              {/* Scrubbing scrubber preview */}
              <div className="space-y-2">
                <div className="w-full h-2 bg-[#EAE5DC] rounded-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 w-3/4 bg-[#16281D] rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] text-[#76877A] font-sans">
                  <span>First leaf</span>
                  <span className="text-[#16281D] font-medium">Fenestration growth</span>
                  <span>Full canopy</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCENE 10: Observation Journey (Attention Shift)          */}
          {/* ======================================================== */}
          {currentScene === 10 && (
            <div className="w-full max-w-xl mx-auto bg-white border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 shadow-xl animate-fade-in space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EBE1]">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#76877A] font-medium">Story 2</span>
                  <h3 className="font-serif text-2xl text-[#16281D]">Observation Journey</h3>
                </div>
                <span className="text-xs text-[#4E6153] font-serif italic">How you notice</span>
              </div>

              <div className="space-y-3 font-sans">
                <div className="p-3.5 rounded-2xl bg-[#F7F4EC] border border-[#DDD7CC] flex items-center justify-between">
                  <span className="text-xs text-[#566B5C]">When you started</span>
                  <span className="text-xs font-semibold text-[#16281D]">🌱 85% New leaves & shoots</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#E8EFE9] border border-[#BFD5C3] flex items-center justify-between shadow-xs">
                  <span className="text-xs text-[#243E2B]">Recently</span>
                  <span className="text-xs font-semibold text-[#16281D]">↗ Light tilt, posture & canopy structure</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="font-serif italic text-lg text-[#16281D]">
                  “You are seeing more than you did on day one.”
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCENE 11: Observe Without AI (Silence as a Feature)      */}
          {/* ======================================================== */}
          {currentScene === 11 && (
            <div className="w-full max-w-lg mx-auto bg-[#F7F4EC] border border-[#DDD7CC] rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-6 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-white border border-[#DDD7CC] flex items-center justify-center mx-auto shadow-xs text-[#16281D]">
                <Compass className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-semibold">
                  Adaptive Silence
                </span>
                <h3 className="font-serif text-3xl text-[#16281D] font-normal">
                  Today is yours.
                </h3>
                <p className="font-serif italic text-base text-[#4E6153]">
                  “LeafStory will stay quiet so you can trust your own eyes.”
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#DDD7CC] inline-flex items-center gap-3 shadow-xs">
                <span className="text-xs font-medium text-[#16281D]">Observe Without AI</span>
                <div className="w-11 h-6 bg-[#16281D] rounded-full p-0.5 flex items-center justify-end">
                  <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                </div>
              </div>

              <p className="text-xs text-[#566B5C] leading-relaxed max-w-sm mx-auto">
                Success doesn’t mean using AI every day. Success is when you look at a plant and notice what is unfolding all on your own.
              </p>
            </div>
          )}

          {/* ======================================================== */}
          {/* SCENE 12: Finale / Call to Action                        */}
          {/* ======================================================== */}
          {currentScene === 12 && (
            <div className="w-full max-w-2xl mx-auto text-center space-y-8 animate-fade-in py-6">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#16281D] text-[#FAF8F5] flex items-center justify-center mx-auto shadow-md">
                  <Sprout className="w-8 h-8 text-[#D8E6D8]" />
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight">
                  Watch your plant grow.
                </h2>
                <p className="font-serif italic text-xl sm:text-2xl text-[#4E6153] font-light">
                  “Notice how you grow with it.”
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    onComplete();
                    onAddFirstPlant();
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] font-sans text-sm font-semibold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sprout className="w-4 h-4 text-[#D8E6D8]" />
                  <span>Start My LeafStory</span>
                </button>

                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-[#DDD7CC] text-[#16281D] hover:bg-[#F3EFE7] font-sans text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-[#76877A]" />
                  <span>Replay Demo</span>
                </button>
              </div>

              <p className="text-xs text-[#76877A] font-sans pt-2">
                Available anytime in Profile → How LeafStory Works
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Timeline Control Bar */}
      <footer className="relative z-10 px-6 sm:px-12 py-4 border-t border-[#EAE5DC] bg-[#FAF8F5]/90 backdrop-blur-md">
        {/* Progress Bar with 12 segments */}
        <div className="flex items-center gap-1.5 mb-3">
          {Array.from({ length: TOTAL_SCENES }).map((_, idx) => {
            const isCompleted = idx < currentScene;
            const isCurrent = idx === currentScene;
            return (
              <button
                key={idx}
                onClick={() => handleJumpToScene(idx)}
                className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#DDD7CC] cursor-pointer hover:h-2 transition-all"
                aria-label={`Jump to scene ${idx + 1}`}
              >
                <div
                  className={`h-full transition-all ${
                    isCompleted
                      ? 'w-full bg-[#16281D]'
                      : isCurrent
                      ? 'bg-[#16281D]'
                      : 'w-0'
                  }`}
                  style={{
                    width: isCurrent ? `${sceneProgress}%` : isCompleted ? '100%' : '0%',
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* Playback Controls & Chapter Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="p-2 rounded-lg bg-[#16281D] text-white hover:bg-[#233F2E] transition-all cursor-pointer shadow-xs"
              aria-label={isPlaying ? 'Pause demo' : 'Play demo'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={handleBack}
              disabled={currentScene === 0}
              className="p-2 rounded-lg text-[#566B5C] hover:text-[#16281D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#EFECE5] cursor-pointer transition-all"
              aria-label="Previous scene"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentScene === TOTAL_SCENES - 1}
              className="p-2 rounded-lg text-[#566B5C] hover:text-[#16281D] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#EFECE5] cursor-pointer transition-all"
              aria-label="Next scene"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <span className="text-xs text-[#76877A] font-sans ml-2">
              Scene {currentScene + 1} of {TOTAL_SCENES}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-sans text-[#76877A] uppercase tracking-wider block">
              Chapter {currentChapter.number} · {currentChapter.title}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
