import React, { useState, useEffect } from 'react';
import { ActiveView, UserProfile } from '../types';
import { Menu, X, Plus, User, LogOut, Play, Calendar, Sprout, ArrowRight } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  user: UserProfile;
  onAddPlant: () => void;
  onSignOut?: () => void;
  onOpenNotifications?: () => void;
  onOpenProductDemo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  user,
  onAddPlant,
  onSignOut,
  onOpenNotifications,
  onOpenProductDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setUserDropdownOpen(false);
      }
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

  const navItems: { id: ActiveView; label: string; icon?: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'garden', label: 'My Garden' },
    { id: 'add_observation', label: 'Observe' },
    { id: 'growth_story', label: 'Growth Story' },
    { id: 'observation_journey', label: 'Journey' },
    { id: 'care_planner', label: 'Care Planner' },
  ];

  return (
    <>
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2D7] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark & Mark */}
        <button
          onClick={() => {
            setActiveView('home');
            setMobileMenuOpen(false);
          }}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16281D] rounded-sm shrink-0 min-h-[44px] flex items-center"
          aria-label="LeafStory Home"
        >
          {/* Desktop/Tablet Full Logo */}
          <div className="hidden sm:block">
            <BrandLogo variant="full" symbolClassName="w-7 h-7" />
          </div>
          {/* Mobile Compact Logo (< 768px) */}
          <div className="sm:hidden flex items-center gap-2">
            <BrandLogo variant="compact" symbolClassName="w-7 h-7" />
            <span className="font-serif text-xl tracking-tight text-[#16281D]">LeafStory</span>
          </div>
        </button>

        {/* Zone 2: Desktop Navigation Links (>= 1024px) */}
        <nav
          className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs uppercase tracking-wider font-medium text-[#4D6052]"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`relative py-2 whitespace-nowrap shrink-0 transition-colors cursor-pointer min-h-[44px] flex items-center ${
                  isActive
                    ? 'text-[#16281D] font-semibold'
                    : 'text-[#687C6E] hover:text-[#16281D]'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 left-0 w-full h-[2px] bg-[#16281D] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Tablet (768px-1024px) & Desktop (>= 1024px) Right Controls */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button
            onClick={onAddPlant}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-sans font-medium text-[#FAF8F5] bg-[#16281D] hover:bg-[#233F2E] active:scale-[0.98] transition-all rounded-xl shadow-xs whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16281D] min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Plant</span>
          </button>

          {/* User Profile Avatar with dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-9 h-9 rounded-full overflow-hidden border border-[#D5CEC0] bg-[#EAE5DC] flex items-center justify-center text-xs font-sans font-medium text-[#16281D] cursor-pointer hover:border-[#16281D] transition-colors focus-visible:ring-2 focus-visible:ring-[#16281D]"
              title={user.name}
              aria-label="User profile menu"
              aria-expanded={userDropdownOpen}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-4 h-4 text-[#566B5C]" />
              )}
            </button>

            {userDropdownOpen && (
              <div
                onClick={() => setUserDropdownOpen(false)}
                className="absolute right-0 mt-2 w-56 bg-[#FAF8F5] border border-[#E7E2D7] rounded-2xl shadow-xl p-2 z-50 text-xs font-sans animate-fade-in"
              >
                <div className="px-3 py-2.5 border-b border-[#E7E2D7] mb-1">
                  <span className="font-semibold text-[#16281D] block">{user.name}</span>
                  <span className="text-[11px] text-[#76877A] block truncate">{user.email}</span>
                </div>

                <button
                  onClick={() => setActiveView('profile')}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#EFECE5] text-[#16281D] cursor-pointer flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-[#566B5C]" />
                  <span>Observer Profile</span>
                </button>

                <button
                  onClick={() => setActiveView('care_planner')}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#EFECE5] text-[#16281D] cursor-pointer flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-[#566B5C]" />
                  <span>Care Planner</span>
                </button>

                {onOpenProductDemo && (
                  <button
                    onClick={() => {
                      onOpenProductDemo();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#EFECE5] text-[#16281D] cursor-pointer flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 text-[#243E2B]" />
                    <span>How LeafStory Works</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveView('marketing')}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-[#EFECE5] text-[#566B5C] cursor-pointer flex items-center gap-2"
                >
                  <Sprout className="w-4 h-4 text-[#76877A]" />
                  <span>Public Website</span>
                </button>

                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#FAF0EE] text-[#8C342A] cursor-pointer flex items-center gap-2 border-t border-[#E7E2D7] mt-1 pt-2.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile & Tablet Hamburger (< 1024px) */}
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

      {/* MOBILE & TABLET SLIDE/FADE DRAWER MENU (< 1024px) - Rendered outside header to avoid backdrop-filter containing block */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-[72px] z-50 bg-[#FAF8F5] border-t border-[#E7E2D7] overflow-y-auto animate-fade-in p-6 flex flex-col justify-between"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Drawer"
        >
          <div className="space-y-6">
            {/* Observer Profile Preview */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E7E2D7] flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#EAE5DC] border border-[#D5CEC0] flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-[#566B5C]" />
                  )}
                </div>
                <div>
                  <span className="font-serif text-base text-[#16281D] block font-normal leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-[#76877A] font-sans block">{user.email}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveView('profile');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-[#203D2A] font-medium font-sans underline"
              >
                Profile
              </button>
            </div>

            {/* Nav Items List (>= 44px touch targets) */}
            <nav className="space-y-1 font-sans">
              {navItems.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between py-3.5 px-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] cursor-pointer ${
                      isActive
                        ? 'bg-[#16281D] text-[#FAF8F5]'
                        : 'text-[#16281D] hover:bg-[#EFECE5]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-[#76877A]'}`} />
                  </button>
                );
              })}
            </nav>

            {/* How It Works Button */}
            {onOpenProductDemo && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProductDemo();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-[#DDD7CC] bg-white text-xs font-sans font-medium text-[#16281D] hover:bg-[#F3EFE7] min-h-[44px] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#4E6153]" />
                <span>How LeafStory Works (Product Demo)</span>
              </button>
            )}
          </div>

          {/* Bottom Actions: + Add Plant & Sign Out */}
          <div className="pt-6 border-t border-[#EAE5DC] space-y-3 pb-8">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onAddPlant();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#16281D] text-[#FAF8F5] text-sm font-sans font-semibold hover:bg-[#233F2E] text-center shadow-md flex items-center justify-center gap-2 min-h-[44px] cursor-pointer active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Plant</span>
            </button>

            {onSignOut && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="w-full py-3 px-4 rounded-xl border border-[#DDD7CC] bg-white text-xs font-sans font-medium text-[#8C342A] hover:bg-[#FAF0EE] text-center min-h-[44px] cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
