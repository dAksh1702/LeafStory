import React, { useState, useEffect } from 'react';
import { ArrowRight, Eye, Sprout, Sparkles, Shield, Compass, Sliders, ChevronDown, Menu, X, Play } from 'lucide-react';
import { SAMPLE_CAPTURE_PHOTOS } from '../data/demoData';
import { BrandLogo } from './BrandLogo';

interface PublicLandingPageProps {
  onStart: () => void;
  onSignIn: () => void;
  onExploreDemo: () => void;
}

export const PublicLandingPage: React.FC<PublicLandingPageProps> = ({
  onStart,
  onSignIn,
  onExploreDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="bg-[#FAF8F5] text-[#16281D] selection:bg-[#EAE5DC] selection:text-[#16281D] min-h-screen">
      {/* Editorial Responsive Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E2D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo Zone: Compact on Mobile (<768px), Full on Tablet/Desktop */}
          <div className="flex items-center">
            {/* Desktop & Tablet Full Logo */}
            <div className="hidden sm:block">
              <BrandLogo variant="full" symbolClassName="w-7 h-7" />
            </div>
            {/* Mobile Compact Logo */}
            <div className="sm:hidden flex items-center gap-2">
              <BrandLogo variant="compact" symbolClassName="w-8 h-8" />
              <span className="font-serif text-xl tracking-tight text-[#16281D]">LeafStory</span>
            </div>
          </div>

          {/* DESKTOP NAV (> 1024px) */}
          <nav
            className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-wider font-medium text-[#566B5C]"
            aria-label="Desktop Navigation"
          >
            <a href="#how-it-works" className="hover:text-[#16281D] transition-colors py-2">How It Works</a>
            <a href="#philosophy" className="hover:text-[#16281D] transition-colors py-2">Philosophy</a>
            <a href="#growth-story" className="hover:text-[#16281D] transition-colors py-2">Growth Story</a>
            <a href="#observation-journey" className="hover:text-[#16281D] transition-colors py-2">Observation Journey</a>
          </nav>

          {/* TABLET (768px–1024px) & DESKTOP CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onExploreDemo}
              className="px-3.5 py-2 text-xs font-sans font-medium text-[#4E6153] hover:text-[#16281D] hover:bg-[#EFECE5] rounded-xl transition-all cursor-pointer flex items-center gap-1.5 min-h-[44px]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>How It Works</span>
            </button>
            <button
              onClick={onSignIn}
              className="px-4 py-2 text-xs font-sans font-medium text-[#566B5C] hover:text-[#16281D] cursor-pointer min-h-[44px] flex items-center"
            >
              Sign In
            </button>
            <button
              onClick={onStart}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-medium text-[#FAF8F5] bg-[#16281D] hover:bg-[#233F2E] rounded-xl shadow-xs cursor-pointer transition-all active:scale-98 min-h-[44px]"
            >
              <span>Start LeafStory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* MOBILE & TABLET (< 1024px) HAMBURGER TOGGLE */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-[#16281D] hover:bg-[#EFECE5] rounded-xl transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16281D]"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE & TABLET SLIDE/FADE DRAWER MENU (< 1024px) - Outside header to avoid backdrop-filter containing block */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-[72px] z-50 bg-[#FAF8F5] border-t border-[#E7E2D7] overflow-y-auto animate-fade-in p-6 flex flex-col justify-between"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#EAE5DC]">
                <BrandLogo variant="full" />
                <p className="font-serif italic text-xs text-[#566B5C] mt-2">
                  “See how your plant grows. Notice how you grow with it.”
                </p>
              </div>

              {/* Navigation Links (>= 44px touch targets) */}
              <nav className="space-y-1">
                {[
                  { href: '#how-it-works', label: 'How It Works' },
                  { href: '#philosophy', label: 'Philosophy' },
                  { href: '#growth-story', label: 'Growth Story' },
                  { href: '#observation-journey', label: 'Observation Journey' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 px-3 rounded-xl text-sm font-sans font-medium text-[#16281D] hover:bg-[#EFECE5] transition-colors min-h-[44px]"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-[#76877A]" />
                  </a>
                ))}
              </nav>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onExploreDemo();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#DDD7CC] bg-white text-xs font-sans font-medium text-[#16281D] hover:bg-[#F3EFE7] min-h-[44px] cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Product Demo</span>
                </button>
              </div>
            </div>

            {/* Mobile Bottom Auth Buttons */}
            <div className="pt-6 border-t border-[#EAE5DC] space-y-3 pb-8">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignIn();
                }}
                className="w-full py-3.5 px-4 rounded-xl border border-[#DDD7CC] bg-white text-sm font-sans font-medium text-[#16281D] hover:bg-[#EFECE5] text-center min-h-[44px] cursor-pointer"
              >
                Sign In
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStart();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#16281D] text-[#FAF8F5] text-sm font-sans font-semibold hover:bg-[#233F2E] text-center shadow-md flex items-center justify-center gap-2 min-h-[44px] cursor-pointer active:scale-98"
              >
                <span>Start LeafStory</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      {/* Hero Section */}
      <section className="pt-12 pb-16 sm:pt-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block mb-3">
            Human × AI Mindful Observation Platform
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl font-normal tracking-tight text-[#16281D] leading-[1.12]">
            Notice what changes when you start looking closer.
          </h1>
          <p className="font-serif italic text-base sm:text-xl lg:text-2xl text-[#4A5E50] mt-5 font-light max-w-2xl mx-auto leading-relaxed">
            “LeafStory helps you observe how your plants grow—and how your own way of noticing grows with them.”
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] font-sans text-xs sm:text-sm font-semibold cursor-pointer transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Start your LeafStory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl bg-white border border-[#DDD7CC] hover:border-[#16281D] text-[#16281D] font-sans text-xs sm:text-sm font-medium cursor-pointer transition-all shadow-xs flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#4E6153]" />
              <span>See interactive demo</span>
            </button>
          </div>
        </div>

        {/* Large Plant Photography Hero Showcase */}
        <div className="relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[21/10] bg-[#EAE5DC] border border-[#DCD6C9] shadow-md max-w-6xl mx-auto">
          <img
            src="/src/assets/images/milo_monstera_full_1792440447034.jpg"
            alt="Milo Monstera Deliciosa by sunny window"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5 sm:p-12 text-white">
            <div>
              <span className="text-[11px] sm:text-xs uppercase tracking-widest opacity-80 font-sans block mb-1">
                Monstera Deliciosa · Day 84
              </span>
              <p className="font-serif text-xl sm:text-3xl font-light">
                “Every leaf unfurls with patience. So does your eye.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-24 border-t border-[#E7E2D7] bg-[#F7F4EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block mb-2">
              The Ritual
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#16281D] font-normal tracking-tight">
              Slow down. Look first.
            </h2>
            <p className="font-serif italic text-base text-[#4E6153] mt-2 font-light">
              “AI is not the teacher. It is a quiet companion lens.”
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E7E2D7] shadow-xs space-y-4">
              <span className="text-3xl block">👁</span>
              <h3 className="font-serif text-xl text-[#16281D] font-normal">
                1. You Observe First
              </h3>
              <p className="text-xs sm:text-sm text-[#566B5C] font-sans leading-relaxed">
                Take a ghost-aligned photo. Before AI speaks, place markers on what you notice: a new unfurling leaf, a tilt toward morning light, or leaf volume.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E7E2D7] shadow-xs space-y-4">
              <span className="text-3xl block">🤝</span>
              <h3 className="font-serif text-xl text-[#16281D] font-normal">
                2. A Second Perspective
              </h3>
              <p className="text-xs sm:text-sm text-[#566B5C] font-sans leading-relaxed">
                LeafStory compares observations side-by-side. Celebrate when you notice nuances AI missed, and consider gentle cues you might have overlooked.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E7E2D7] shadow-xs space-y-4">
              <span className="text-3xl block">🌿</span>
              <h3 className="font-serif text-xl text-[#16281D] font-normal">
                3. Two Stories Unfold
              </h3>
              <p className="text-xs sm:text-sm text-[#566B5C] font-sans leading-relaxed">
                Track how your plant grows over months—and reflect on how your own attentiveness, patience, and botanical intuition expand alongside it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-16 sm:py-24 border-t border-[#E7E2D7] bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
            Core Philosophy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#16281D] font-normal tracking-tight">
            “AI should help humans become more attentive observers without immediately giving them the answer.”
          </h2>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-sans text-[#566B5C]">
            <span className="px-3 py-1.5 rounded-full bg-[#EFECE5]">Zero diagnostic panic</span>
            <span className="px-3 py-1.5 rounded-full bg-[#EFECE5]">Human observation first</span>
            <span className="px-3 py-1.5 rounded-full bg-[#EFECE5]">Silence as a feature</span>
          </div>
        </div>
      </section>

      {/* Growth Story Preview */}
      <section id="growth-story" className="py-16 sm:py-20 border-t border-[#E7E2D7] bg-[#F7F4EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
                Story 1 · Living Transformation
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#16281D] font-normal tracking-tight mt-1">
                The Growth Story
              </h2>
              <p className="font-serif italic text-base text-[#4E6153] mt-2 font-light">
                “How is my plant changing?”
              </p>
              <p className="text-xs sm:text-sm text-[#566B5C] font-sans mt-4 leading-relaxed">
                Watch how leaves unfurl, petioles rotate toward morning light, and volume develops across weeks. Use our interactive split slider and overlay blend to see physical transformations side-by-side.
              </p>
              <div className="mt-6">
                <button
                  onClick={onExploreDemo}
                  className="flex items-center gap-2 text-xs font-sans font-medium text-[#16281D] hover:text-[#284934] underline cursor-pointer min-h-[44px]"
                >
                  <span>Explore the Growth Story archive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-[#EAE5DC] border border-[#DCD6C9] shadow-sm">
              <img
                src="/src/assets/images/milo_monstera_mid_1792440432733.jpg"
                alt="Growth story split comparison view"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Observation Journey Preview */}
      <section id="observation-journey" className="py-16 sm:py-20 border-t border-[#E7E2D7] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-3xl overflow-hidden aspect-[4/3] bg-[#EAE5DC] border border-[#DCD6C9] shadow-sm">
              <img
                src="/src/assets/images/cleo_pothos_plant_1792440473868.jpg"
                alt="Golden Pothos living on shelf"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
                Story 2 · Flagship Reflection
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#16281D] font-normal tracking-tight mt-1">
                Your Observation Journey
              </h2>
              <p className="font-serif italic text-base text-[#4E6153] mt-2 font-light">
                “How is the way I notice changing?”
              </p>
              <p className="text-xs sm:text-sm text-[#566B5C] font-sans mt-4 leading-relaxed">
                LeafStory doesn’t grade you or assign artificial intelligence scores. Instead, it mirrors how your attention shifts from obvious new growth to subtle structural harmony, petiole angles, and light absorption.
              </p>
              <div className="mt-6">
                <button
                  onClick={onStart}
                  className="flex items-center gap-2 text-xs font-sans font-medium text-[#16281D] hover:text-[#284934] underline cursor-pointer min-h-[44px]"
                >
                  <span>See how your eye grows</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 sm:py-24 border-t border-[#E7E2D7] bg-[#F4EFE6] text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block mb-2">
            Begin The Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-[#16281D] font-normal tracking-tight">
            Start your mindful plant journal today.
          </h2>
          <p className="font-serif italic text-base sm:text-lg text-[#4E6153] mt-3 font-light">
            “See how your plant grows. Notice how you grow with it.”
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={onStart}
              className="px-8 py-4 rounded-xl bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] font-sans text-xs sm:text-sm font-semibold cursor-pointer transition-all shadow-sm active:scale-98 flex items-center gap-2 min-h-[44px]"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="border-t border-[#E7E2D7] bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8 text-center text-xs font-sans text-[#76877A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo variant="compact" symbolClassName="w-5 h-5" />
            <span className="font-serif text-base text-[#16281D]">LeafStory 3.0</span>
            <span>·</span>
            <span>Human Creativity × AI</span>
          </div>

          <div className="flex items-center gap-4 text-[#566B5C]">
            <a href="#how-it-works" className="hover:text-[#16281D]">How it works</a>
            <a href="#philosophy" className="hover:text-[#16281D]">Philosophy</a>
            <button onClick={onSignIn} className="hover:text-[#16281D] cursor-pointer">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
