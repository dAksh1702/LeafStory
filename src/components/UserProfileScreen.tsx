import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Shield, Sliders, Bell, Check, ArrowRight, Play, RotateCcw, Sprout } from 'lucide-react';
import { PlantRepository } from '../services/plantRepository';
import { ObservationRepository } from '../services/observationRepository';

interface UserProfileScreenProps {
  user: UserProfile;
  plantsCount: number;
  observationsCount: number;
  onSaveProfile: (updated: UserProfile) => void;
  onSignOut: () => void;
  onReplayDemo?: () => void;
  onResetDemoData?: () => void;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({
  user,
  plantsCount,
  observationsCount,
  onSaveProfile,
  onSignOut,
  onReplayDemo,
  onResetDemoData,
}) => {
  const [profile, setProfile] = useState<UserProfile>(user);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleUpdate = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    onSaveProfile(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-[#E7E2D7]">
        <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
          Observer Profile
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight mt-1">
          {profile.name}
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-[#4E6153] mt-1 font-light">
          Member since {profile.memberSince} · {plantsCount} companion plants · {observationsCount} observation sessions
        </p>
      </div>

      {savedNotice && (
        <div className="mb-6 p-3 rounded-xl bg-[#EEF3EE] border border-[#D5E0D7] text-xs font-sans text-[#203D2A] flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Preferences updated peacefully.</span>
        </div>
      )}

      <div className="space-y-10">
        {/* Flagship: How LeafStory Works (Product Demo) */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#16281D] to-[#243E2B] text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#A8BFAA] font-sans font-semibold">
              Interactive Guide
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] font-normal">
              How LeafStory Works
            </h2>
            <p className="text-xs sm:text-sm text-[#D1DDD3] leading-relaxed">
              Watch the Apple-style coded demonstration of the 12 core observation micro-scenes: from Ghost Capture alignment to Human-First evaluation and adaptive AI silence.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onReplayDemo}
                className="px-5 py-2.5 rounded-xl bg-[#FAF8F5] text-[#16281D] hover:bg-white font-sans text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Replay Product Demo</span>
              </button>
            </div>
          </div>
          <div className="absolute right-6 -bottom-6 opacity-15 pointer-events-none">
            <Sprout className="w-56 h-56 text-white" />
          </div>
        </section>

        {/* Account Details */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#E7E2D7] shadow-xs">
          <h2 className="font-serif text-2xl text-[#16281D] font-normal mb-6">
            Observer Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-sans font-medium mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleUpdate({ name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-sm font-sans text-[#16281D] focus:border-[#16281D] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#76877A] font-sans font-medium mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleUpdate({ email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#DDD7CC] bg-white text-sm font-sans text-[#16281D] focus:border-[#16281D] outline-none"
              />
            </div>
          </div>
        </section>

        {/* Observation Style (Independent <--> Guided) */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#E7E2D7] shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4 text-[#203D2A]" />
            <h2 className="font-serif text-2xl text-[#16281D] font-normal">
              Observation Style
            </h2>
          </div>
          <p className="text-xs text-[#566B5C] font-sans mb-6">
            Configure how frequently LeafStory offers hints versus stepping back completely.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'independent',
                label: 'Independent',
                desc: 'AI stays quiet by default. You observe completely on your own.',
              },
              {
                id: 'balanced',
                label: 'Balanced',
                desc: 'LeafStory adapts: offers subtle cues when helpful, steps aside when you have momentum.',
              },
              {
                id: 'guided',
                label: 'Guided',
                desc: 'LeafStory always offers non-spoiler attention challenges to help build observation skills.',
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleUpdate({ observationStyle: opt.id as any })}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  profile.observationStyle === opt.id
                    ? 'border-[#16281D] bg-[#EDE8DE] shadow-xs'
                    : 'border-[#DDD7CC] bg-white hover:border-[#16281D]/40'
                }`}
              >
                <span className="font-sans text-sm font-semibold text-[#16281D] block mb-1">
                  {opt.label}
                </span>
                <span className="text-xs text-[#6B7E70] font-sans block leading-relaxed">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* AI Reveal Preferences */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#E7E2D7] shadow-xs">
          <h2 className="font-serif text-2xl text-[#16281D] font-normal mb-2">
            AI Reveal Timing
          </h2>
          <p className="text-xs text-[#566B5C] font-sans mb-4">
            Under LeafStory philosophy, human observation always precedes AI perspective.
          </p>

          <div className="space-y-3 font-sans text-xs">
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#DDD7CC] bg-white cursor-pointer">
              <input
                type="radio"
                name="aiRevealPreference"
                checked={profile.aiRevealPreference === 'only_after'}
                onChange={() => handleUpdate({ aiRevealPreference: 'only_after' })}
                className="accent-[#16281D]"
              />
              <div>
                <span className="font-medium text-[#16281D] block">Only after I finish observing (Default)</span>
                <span className="text-[#76877A] block mt-0.5">You always commit what you see first.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#DDD7CC] bg-white cursor-pointer">
              <input
                type="radio"
                name="aiRevealPreference"
                checked={profile.aiRevealPreference === 'on_request'}
                onChange={() => handleUpdate({ aiRevealPreference: 'on_request' })}
                className="accent-[#16281D]"
              />
              <div>
                <span className="font-medium text-[#16281D] block">On explicit request only</span>
                <span className="text-[#76877A] block mt-0.5">Keep observations strictly yours unless you tap “Reveal LeafStory”.</span>
              </div>
            </label>
          </div>
        </section>

        {/* Accessibility & Data Management */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#FAF8F5] border border-[#E7E2D7] shadow-xs">
          <h2 className="font-serif text-2xl text-[#16281D] font-normal mb-4">
            Garden Data & Testing
          </h2>

          <div className="space-y-4 font-sans text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl border border-[#DDD7CC] bg-white cursor-pointer">
              <div>
                <span className="font-medium text-[#16281D] block">Reduced Motion</span>
                <span className="text-[#76877A] block mt-0.5">Minimize subtle pulse and image comparison animations.</span>
              </div>
              <input
                type="checkbox"
                checked={profile.reducedMotion}
                onChange={(e) => handleUpdate({ reducedMotion: e.target.checked })}
                className="w-4 h-4 accent-[#16281D] cursor-pointer"
              />
            </label>

            <div className="p-4 rounded-xl border border-[#DDD7CC] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="font-medium text-[#16281D] block">Reset to Full Demo Plants (Sol, Milo, Cleo)</span>
                <span className="text-[#76877A] block mt-0.5">
                  Reloads authentic observation timelines with 23 historical entries.
                </span>
              </div>
              <button
                type="button"
                onClick={onResetDemoData}
                className="px-3.5 py-1.5 rounded-lg border border-[#DDD7CC] text-[#16281D] hover:bg-[#F0EBE1] text-xs font-medium cursor-pointer transition-colors shrink-0 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#76877A]" />
                <span>Reload Seed Plants</span>
              </button>
            </div>
          </div>
        </section>

        {/* Sign Out Action */}
        <div className="pt-4 flex justify-between items-center text-xs font-sans">
          <span className="text-[#76877A]">LeafStory Version 3.0 · Research Build</span>
          <button
            onClick={onSignOut}
            className="px-4 py-2 text-[#8C342A] hover:bg-[#FAF0EE] rounded-lg transition-colors cursor-pointer"
          >
            Sign out of this session
          </button>
        </div>
      </div>
    </div>
  );
};
