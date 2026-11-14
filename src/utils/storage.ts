import { Plant, ObservationRecord, ObservationCategory, UserProfile, AdaptiveAiMode } from '../types';
import { PlantRepository } from '../services/plantRepository';
import { ObservationRepository } from '../services/observationRepository';

export const DEFAULT_USER: UserProfile = {
  id: 'guest_observer',
  name: 'Leaf Observer',
  email: 'observer@leafstory.me',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  memberSince: 'November 2026',
  observationStyle: 'balanced',
  aiRevealPreference: 'only_after',
  reducedMotion: false,
  emailNotifications: true,
  weeklyDigest: true,
};

// Plant & Observation Delegations to Repositories with User-Scope
export function loadPlants(userId?: string): Plant[] {
  return PlantRepository.getPlantsSync(userId);
}

export function savePlants(plants: Plant[], userId?: string): void {
  PlantRepository.savePlants(plants, userId);
}

export function loadObservations(userId?: string): ObservationRecord[] {
  return ObservationRepository.getObservationsSync(userId);
}

export function saveObservations(obs: ObservationRecord[], userId?: string): void {
  ObservationRepository.saveObservations(obs, userId);
}

export function getActivePlantId(userId?: string): string {
  return PlantRepository.getActivePlantId(userId);
}

export function setActivePlantId(id: string, userId?: string): void {
  PlantRepository.setActivePlantId(id, userId);
}

/**
 * Dynamically computes plant statistics based on actual observation records.
 */
export function enrichPlantWithObservations(plant: Plant, observations: ObservationRecord[]): Plant {
  const pObs = observations
    .filter((o) => o.plantId === plant.id)
    .sort((a, b) => a.dayNumber - b.dayNumber);

  if (pObs.length === 0) return plant;

  const first = pObs[0];
  const latest = pObs[pObs.length - 1];

  return {
    ...plant,
    daysTogether: latest.dayNumber,
    firstObservationDate: first.date,
    latestObservationDate: latest.date,
    coverImage: latest.image || plant.coverImage,
  };
}

// Adaptive AI Coach Recommendation
export interface AdaptiveCoachGuidance {
  recommendedMode: AdaptiveAiMode;
  guidanceTitle: string;
  guidanceText: string;
  focusCategoryPrompt?: string;
}

export function determineAdaptiveMode(
  observations: ObservationRecord[],
  userStyle: 'independent' | 'balanced' | 'guided' = 'balanced'
): AdaptiveCoachGuidance {
  if (userStyle === 'independent') {
    return {
      recommendedMode: 'independent',
      guidanceTitle: 'Observe Independently',
      guidanceText: 'LeafStory will remain completely silent. The observation is entirely yours.',
    };
  }

  if (observations.length === 0) {
    return {
      recommendedMode: 'guided',
      guidanceTitle: 'First Observation',
      guidanceText: 'Take your time looking at the entire silhouette. LeafStory will compare with you after you commit.',
    };
  }

  // Count observed categories across recent sessions
  const recent = observations.slice(-4);
  const counts: Record<string, number> = {};
  recent.forEach((obs) => {
    obs.humanCategories?.forEach((cat) => {
      counts[cat] = (counts[cat] || 0) + 1;
    });
  });

  const noticesOrientation = (counts['orientation_change'] || 0) > 0;
  const noticesStructure = (counts['structural_change'] || 0) > 0;

  // If the user is an experienced observer (> 3 observations) and has already explored multiple categories:
  if (observations.length >= 4 && observations.length % 3 === 0) {
    return {
      recommendedMode: 'independent',
      guidanceTitle: 'Today Is Yours',
      guidanceText: 'LeafStory will stay quiet during this observation so you can trust your own trained eye.',
    };
  }

  // If user rarely tags orientation or structure, offer a challenge clue without giving away answers
  if (!noticesOrientation || !noticesStructure) {
    return {
      recommendedMode: 'challenge',
      guidanceTitle: 'Observation Challenge',
      guidanceText: 'Before continuing, notice how the leaves relate to each other and toward the window light.',
      focusCategoryPrompt: 'Notice posture, leaf tilts, and stem angles.',
    };
  }

  return {
    recommendedMode: 'guided',
    guidanceTitle: 'Subtle Perspective',
    guidanceText: 'Observe what you see first. LeafStory will offer a gentle second perspective when you finish.',
  };
}

// Compute Observation Journey analytics
export interface JourneyCategoryCount {
  category: ObservationCategory;
  earlyCount: number;
  recentCount: number;
  totalCount: number;
}

export interface ObservationJourneyAnalytics {
  totalObservations: number;
  categoryBreakdown: JourneyCategoryCount[];
  sharedObservationRate: number;
  humanDiscoveredFirstCount: number;
  reflectiveNarratives: string[];
}

export function computeObservationJourney(observations: ObservationRecord[]): ObservationJourneyAnalytics {
  if (!observations || observations.length === 0) {
    return {
      totalObservations: 0,
      categoryBreakdown: [],
      sharedObservationRate: 0,
      humanDiscoveredFirstCount: 0,
      reflectiveNarratives: [
        'Every plant journey begins with a first quiet look.',
        'Over time, you will start noticing subtle shifts in direction, texture, and light alignment.',
      ],
    };
  }

  const sorted = [...observations].sort((a, b) => a.dayNumber - b.dayNumber);
  const midpoint = Math.max(1, Math.floor(sorted.length / 2));
  const earlyObs = sorted.slice(0, midpoint);
  const recentObs = sorted.slice(midpoint);

  const categories: ObservationCategory[] = [
    'new_growth',
    'color_change',
    'orientation_change',
    'structural_change',
    'leaf_position_change',
    'no_visible_change',
    'other',
  ];

  const breakdown: JourneyCategoryCount[] = categories.map((cat) => {
    let earlyCount = 0;
    let recentCount = 0;

    earlyObs.forEach((o) => {
      if (o.humanCategories?.includes(cat)) earlyCount++;
    });
    recentObs.forEach((o) => {
      if (o.humanCategories?.includes(cat)) recentCount++;
    });

    return {
      category: cat,
      earlyCount,
      recentCount,
      totalCount: earlyCount + recentCount,
    };
  });

  let totalHumanPicks = 0;
  let sharedPicks = 0;
  let humanFirstCount = 0;

  sorted.forEach((o) => {
    totalHumanPicks += o.humanCategories?.length || 0;
    sharedPicks += (o.bothCategories || []).length;
    if (o.humanOnlyCategories && o.humanOnlyCategories.length > 0) {
      humanFirstCount += o.humanOnlyCategories.length;
    }
  });

  const sharedObservationRate = totalHumanPicks > 0 ? Math.round((sharedPicks / totalHumanPicks) * 100) : 0;

  const narratives: string[] = [];

  const earlyGrowthCount = breakdown.find((b) => b.category === 'new_growth')?.earlyCount || 0;
  const recentOrientationCount = breakdown.find((b) => b.category === 'orientation_change')?.recentCount || 0;
  const recentStructureCount = breakdown.find((b) => b.category === 'structural_change')?.recentCount || 0;

  if (earlyGrowthCount >= 1 && (recentOrientationCount > 0 || recentStructureCount > 0)) {
    narratives.push('When you started, most of your observations focused on new growth and unfurling leaves.');
  }

  if (recentOrientationCount >= 1 || recentStructureCount >= 1) {
    narratives.push('You’ve recently started noticing more subtle changes in posture, orientation, and canopy structure.');
  } else {
    narratives.push('Your eye is developing a calm, patient rhythm with each observation.');
  }

  if (sharedObservationRate >= 50) {
    narratives.push('You and LeafStory are noticing more of the same quiet details as time unfolds.');
  }

  if (humanFirstCount > 0) {
    narratives.push(`You have caught ${humanFirstCount} nuanced detail${humanFirstCount > 1 ? 's' : ''} that AI didn’t immediately detect — proving the unmatched intuition of human eyes.`);
  }

  narratives.push('Your recent observations include a wider variety of details than when you started.');

  return {
    totalObservations: sorted.length,
    categoryBreakdown: breakdown,
    sharedObservationRate,
    humanDiscoveredFirstCount: humanFirstCount,
    reflectiveNarratives: narratives,
  };
}
