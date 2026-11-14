/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Plant, ObservationRecord, ActiveView, UserProfile } from './types';
import {
  enrichPlantWithObservations,
  determineAdaptiveMode,
} from './utils/storage';
import { PlantRepository } from './services/plantRepository';
import { ObservationRepository } from './services/observationRepository';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { PlantProfileScreen } from './components/PlantProfileScreen';
import { GrowthStoryScreen } from './components/GrowthStoryScreen';
import { ObservationJourneyScreen } from './components/ObservationJourneyScreen';
import { DiscoveriesScreen } from './components/DiscoveriesScreen';
import { MyGardenScreen } from './components/MyGardenScreen';
import { UserProfileScreen } from './components/UserProfileScreen';
import { PublicLandingPage } from './components/PublicLandingPage';
import { AddObservationFlow } from './components/NewObservationFlow/AddObservationFlow';
import { NewPlantModal } from './components/NewPlantModal';
import { ObservationDetailModal } from './components/ObservationDetailModal';
import { GrowthReplayModal } from './components/GrowthReplayModal';
import { AuthModal } from './components/AuthModal';
import { ProductDemoOnboarding } from './components/ProductDemoOnboarding';
import { CarePlannerView } from './components/CarePlanner/CarePlannerView';

function LeafStoryApp() {
  const {
    user: authUser,
    loading: authLoading,
    signOut,
    completeOnboarding,
    updateProfile,
  } = useAuth();

  const [plants, setPlants] = useState<Plant[]>([]);
  const [activePlantId, setActivePlantIdState] = useState<string>('');
  const [observations, setObservations] = useState<ObservationRecord[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('marketing');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Modals & Flows
  const [selectedObsDetail, setSelectedObsDetail] = useState<ObservationRecord | null>(null);
  const [isNewPlantModalOpen, setIsNewPlantModalOpen] = useState<boolean>(false);
  const [isGrowthReplayOpen, setIsGrowthReplayOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  // Map Prototype Account to UserProfile
  const currentObserver: UserProfile = {
    id: authUser ? authUser.id : isDemoMode ? 'demo_botanist' : 'guest_observer',
    name: authUser ? authUser.name : isDemoMode ? 'Demo Botanist' : 'Guest Observer',
    email: authUser ? authUser.email : isDemoMode ? 'demo@leafstory.garden' : '',
    avatar: authUser?.avatarUrl || undefined,
    memberSince: authUser?.createdAt
      ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : 'October 2024',
    observationStyle: authUser?.observationStyle || 'balanced',
    aiRevealPreference: 'only_after',
    reducedMotion: false,
    emailNotifications: true,
    weeklyDigest: false,
    hasCompletedOnboarding: authUser?.onboardingCompleted ?? false,
  };

  // Load user-scoped data or demo sanctuary
  const loadUserData = useCallback(async () => {
    if (authUser) {
      const userId = authUser.id;
      try {
        const [userPlants, userObs] = await Promise.all([
          PlantRepository.getPlants(userId),
          ObservationRepository.getObservations(userId),
        ]);

        const enriched = userPlants.map((p) => enrichPlantWithObservations(p, userObs));
        setPlants(enriched);
        setObservations(userObs);

        const storedActiveId = PlantRepository.getActivePlantId(userId);
        if (enriched.some((p) => p.id === storedActiveId)) {
          setActivePlantIdState(storedActiveId);
        } else if (enriched.length > 0) {
          setActivePlantIdState(enriched[0].id);
        } else {
          setActivePlantIdState('');
        }
      } catch (e) {
        console.error('[LeafStory] Error loading user data:', e);
      }
    } else if (isDemoMode) {
      // Demo Sanctuary: Sol, Milo, Cleo
      const demoPlants = PlantRepository.getDemoPlants();
      const demoObs = ObservationRepository.getDemoObservations();
      const enriched = demoPlants.map((p) => enrichPlantWithObservations(p, demoObs));
      setPlants(enriched);
      setObservations(demoObs);
      setActivePlantIdState('plant_milo');
    } else {
      setPlants([]);
      setObservations([]);
      setActivePlantIdState('');
    }
  }, [authUser, isDemoMode]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Handle route protection & initial onboarding trigger
  useEffect(() => {
    if (authLoading) return;

    if (authUser) {
      // User is authenticated with prototype account
      if (activeView === 'marketing') {
        setActiveView('home');
      }

      // First-time onboarding: trigger automatically ONLY if onboardingCompleted is false
      if (authUser.onboardingCompleted === false) {
        setIsOnboardingOpen(true);
      }
    } else if (!isDemoMode) {
      // Unauthenticated: lock down internal views to marketing
      if (activeView !== 'marketing') {
        setActiveView('marketing');
      }
    }
  }, [authUser, authLoading, isDemoMode]);

  const activePlant = plants.find((p) => p.id === activePlantId) || plants[0] || null;

  const handleSelectPlant = (id: string) => {
    setActivePlantIdState(id);
    PlantRepository.setActivePlantId(id, authUser?.id);
  };

  const handleStartObservation = () => {
    if (!authUser && !isDemoMode) {
      setAuthInitialMode('signin');
      setIsAuthModalOpen(true);
      return;
    }
    setActiveView('add_observation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveObservation = async (newRecord: ObservationRecord) => {
    const updatedObservations = [...observations, newRecord];
    setObservations(updatedObservations);
    await ObservationRepository.upsertObservation(newRecord, authUser?.id);

    // Update active plant latest observation date, daysTogether, and cover image
    if (activePlant) {
      const updatedPlant: Plant = {
        ...activePlant,
        daysTogether: Math.max(activePlant.daysTogether, newRecord.dayNumber),
        latestObservationDate: newRecord.date,
        coverImage: newRecord.image,
      };

      await PlantRepository.upsertPlant(updatedPlant, authUser?.id);

      const updatedPlants = plants.map((p) => {
        if (p.id === activePlant.id) {
          return enrichPlantWithObservations(updatedPlant, updatedObservations);
        }
        return p;
      });

      setPlants(updatedPlants);
    }

    // Route to Growth Story
    setActiveView('growth_story');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveNewPlant = async (newPlant: Plant) => {
    const saved = await PlantRepository.upsertPlant(newPlant, authUser?.id);
    const updated = [saved, ...plants];
    setPlants(updated);
    handleSelectPlant(saved.id);
    setActiveView('plant_profile');
  };

  const handleSignOut = async () => {
    await signOut();
    setIsDemoMode(false);
    setPlants([]);
    setObservations([]);
    setActivePlantIdState('');
    setActiveView('marketing');
  };

  const handleCompleteOnboardingExperience = async (goToNewPlant: boolean = false) => {
    setIsOnboardingOpen(false);
    if (authUser) {
      await completeOnboarding();
    }
    if (goToNewPlant) {
      setIsNewPlantModalOpen(true);
    } else {
      setActiveView('home');
    }
  };

  const handleExploreDemoSanctuary = () => {
    setIsDemoMode(true);
    setActiveView('home');
  };

  const handleResetDemoData = () => {
    if (isDemoMode) {
      PlantRepository.resetToDemo();
      ObservationRepository.resetToDemo();
      const demoPlants = PlantRepository.getDemoPlants();
      const demoObs = ObservationRepository.getDemoObservations();
      const enriched = demoPlants.map((p) => enrichPlantWithObservations(p, demoObs));
      setPlants(enriched);
      setObservations(demoObs);
      setActivePlantIdState('plant_milo');
    }
  };

  // Serene loading spinner while determining session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#16281D]/20 border-t-[#16281D] animate-spin mb-4" />
        <p className="font-serif text-lg text-[#182E22]">Opening LeafStory sanctuary...</p>
      </div>
    );
  }

  const plantObs = activePlant ? observations.filter((o) => o.plantId === activePlant.id) : [];
  const previousObs = plantObs[plantObs.length - 1] || null;
  const adaptiveCoach = determineAdaptiveMode(plantObs, currentObserver.observationStyle);

  // If in Marketing View, render the public responsive website
  if (activeView === 'marketing' && !authUser && !isDemoMode) {
    return (
      <>
        <PublicLandingPage
          onStart={() => {
            setAuthInitialMode('signup');
            setIsAuthModalOpen(true);
          }}
          onSignIn={() => {
            setAuthInitialMode('signin');
            setIsAuthModalOpen(true);
          }}
          onExploreDemo={handleExploreDemoSanctuary}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authInitialMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            setIsAuthModalOpen(false);
          }}
        />

        <ProductDemoOnboarding
          isOpen={isOnboardingOpen}
          userName={currentObserver.name}
          onComplete={() => handleCompleteOnboardingExperience(false)}
          onAddFirstPlant={() => handleCompleteOnboardingExperience(true)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1F2823] selection:bg-[#EAE5DC] selection:text-[#182E22]">
      {/* Universal Top Bar */}
      <Header
        activeView={activeView}
        setActiveView={(view) => {
          if (!authUser && !isDemoMode && view !== 'marketing') {
            setAuthInitialMode('signin');
            setIsAuthModalOpen(true);
            return;
          }
          setActiveView(view);
        }}
        user={currentObserver}
        onAddPlant={() => setIsNewPlantModalOpen(true)}
        onSignOut={handleSignOut}
        onOpenProductDemo={() => setIsOnboardingOpen(true)}
      />

      {/* Demo Sanctuary Notice if in explore demo mode */}
      {isDemoMode && !authUser && (
        <aside
          aria-label="Demo notice"
          className="bg-[#243E2B] text-[#FAF8F5] px-4 py-2 text-xs font-sans text-center flex items-center justify-center gap-2"
        >
          <span>You are exploring the Demo Sanctuary (Sol, Milo, Cleo).</span>
          <button
            onClick={() => {
              setAuthInitialMode('signup');
              setIsAuthModalOpen(true);
            }}
            className="underline font-medium hover:text-emerald-200 cursor-pointer ml-1"
          >
            Create your account to start your own plant journey →
          </button>
        </aside>
      )}

      {/* Main Content Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <HomeScreen
            plants={plants}
            activePlant={activePlant!}
            onSelectPlant={handleSelectPlant}
            observations={observations}
            user={currentObserver}
            onStartObservation={handleStartObservation}
            setActiveView={setActiveView}
            onOpenNewPlantModal={() => setIsNewPlantModalOpen(true)}
            onSelectObservationForDetail={(obs) => setSelectedObsDetail(obs)}
            onStartGrowthReplay={() => setIsGrowthReplayOpen(true)}
          />
        )}

        {activeView === 'garden' && (
          <MyGardenScreen
            plants={plants}
            observations={observations}
            onSelectPlant={handleSelectPlant}
            onOpenNewPlantModal={() => setIsNewPlantModalOpen(true)}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'plant_profile' && (
          <PlantProfileScreen
            plant={activePlant!}
            plants={plants}
            onSelectPlant={handleSelectPlant}
            observations={observations}
            onStartObservation={handleStartObservation}
            setActiveView={setActiveView}
            onOpenNewPlantModal={() => setIsNewPlantModalOpen(true)}
            onSelectObservationForDetail={(obs) => setSelectedObsDetail(obs)}
            onStartGrowthReplay={() => setIsGrowthReplayOpen(true)}
          />
        )}

        {activeView === 'add_observation' && (
          <AddObservationFlow
            plant={activePlant!}
            previousObservation={previousObs}
            adaptiveMode={adaptiveCoach.recommendedMode}
            onSaveObservation={handleSaveObservation}
            onCancel={() => setActiveView('home')}
          />
        )}

        {activeView === 'growth_story' && (
          <GrowthStoryScreen
            plant={activePlant!}
            observations={observations}
            onStartObservation={handleStartObservation}
            setActiveView={setActiveView}
            onSelectObservationForDetail={(obs) => setSelectedObsDetail(obs)}
          />
        )}

        {activeView === 'observation_journey' && (
          <ObservationJourneyScreen
            plant={activePlant!}
            observations={observations}
            setActiveView={setActiveView}
            onStartObservation={handleStartObservation}
          />
        )}

        {activeView === 'care_planner' && (
          <CarePlannerView
            plants={plants}
            activePlant={activePlant!}
            observations={observations}
            onOpenNewPlantModal={() => setIsNewPlantModalOpen(true)}
            onNavigateToPlantProfile={(plantId) => {
              handleSelectPlant(plantId);
              setActiveView('plant_profile');
            }}
          />
        )}

        {activeView === 'discoveries' && (
          <DiscoveriesScreen
            plant={activePlant!}
            observations={observations}
            setActiveView={setActiveView}
            onSelectObservationForDetail={(obs) => setSelectedObsDetail(obs)}
          />
        )}

        {activeView === 'profile' && (
          <UserProfileScreen
            user={currentObserver}
            plantsCount={plants.length}
            observationsCount={observations.length}
            onSaveProfile={(updated) => {
              if (authUser) {
                updateProfile({
                  name: updated.name,
                  observationStyle: updated.observationStyle,
                });
              }
            }}
            onSignOut={handleSignOut}
            onReplayDemo={() => setIsOnboardingOpen(true)}
            onResetDemoData={isDemoMode ? handleResetDemoData : undefined}
          />
        )}
      </main>

      {/* Observation Detail Modal */}
      <ObservationDetailModal
        observation={selectedObsDetail}
        plant={activePlant!}
        previousObservation={
          selectedObsDetail
            ? plantObs.find((o) => o.dayNumber < selectedObsDetail.dayNumber) || null
            : null
        }
        onClose={() => setSelectedObsDetail(null)}
      />

      {/* New Plant Modal */}
      <NewPlantModal
        isOpen={isNewPlantModalOpen}
        onClose={() => setIsNewPlantModalOpen(false)}
        onSavePlant={handleSaveNewPlant}
      />

      {/* Growth Replay Modal */}
      <GrowthReplayModal
        isOpen={isGrowthReplayOpen}
        plant={activePlant!}
        observations={observations}
        onClose={() => setIsGrowthReplayOpen(false)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
        }}
      />

      {/* Cinematic Code-Based Product Demo & Onboarding */}
      <ProductDemoOnboarding
        isOpen={isOnboardingOpen}
        userName={currentObserver.name}
        onComplete={() => handleCompleteOnboardingExperience(false)}
        onAddFirstPlant={() => handleCompleteOnboardingExperience(true)}
      />

      {/* Quiet Botanical Footer */}
      <footer className="mt-20 border-t border-[#E7E2D7] bg-[#FAF8F5] py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <p className="font-serif text-xl text-[#16281D] font-normal tracking-tight">
            LeafStory 3.0
          </p>
          <p className="font-serif italic text-xs sm:text-sm text-[#4E6153]">
            “See how your plant grows. Notice how you grow with it.”
          </p>
          <div className="flex items-center justify-center gap-3 text-xs font-sans text-[#76877A] pt-3">
            <span>Human Observation First</span>
            <span aria-hidden="true">·</span>
            <span>Adaptive AI Silence</span>
            <span aria-hidden="true">·</span>
            <span>Zero Prescriptions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LeafStoryApp />
    </AuthProvider>
  );
}
