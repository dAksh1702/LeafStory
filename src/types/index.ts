export type ObservationCategory =
  | 'new_growth'
  | 'color_change'
  | 'orientation_change'
  | 'structural_change'
  | 'leaf_position_change'
  | 'no_visible_change'
  | 'other';

export interface CategoryMeta {
  id: ObservationCategory;
  label: string;
  icon: string;
  description: string;
}

export const CATEGORY_DEFINITIONS: CategoryMeta[] = [
  { id: 'new_growth', label: 'New growth / new leaf', icon: '🌱', description: 'Fresh shoots, new leaf tips, emerging fenestrations' },
  { id: 'color_change', label: 'Leaf color change', icon: '🍃', description: 'Tender lime hue, deepening dark green, or variegation shift' },
  { id: 'orientation_change', label: 'Direction / orientation change', icon: '↗', description: 'Stems or foliage leaning toward window light' },
  { id: 'structural_change', label: 'Size / structural change', icon: '◯', description: 'Canopy expansion, leaf height, overall fullness' },
  { id: 'leaf_position_change', label: 'Leaf position / shape change', icon: '🌿', description: 'Leaves perking up, tilting, or curling' },
  { id: 'no_visible_change', label: 'No visible change', icon: '👀', description: 'Steady posture with subtle, imperceptible movement' },
  { id: 'other', label: 'Something else', icon: '✨', description: 'Pot, soil surface, or other visual nuance' },
];

export interface PinMarker {
  xPercent: number; // 0-100%
  yPercent: number; // 0-100%
  label?: string;
  category?: ObservationCategory;
}

export type HumanEvaluation = 'see_it' | 'not_sure' | 'differently';

export interface ObservationChange {
  category: ObservationCategory;
  confidence: number;
  description: string;
  suggestedCue: string;
  approximateLocation?: {
    xPercent: number;
    yPercent: number;
  };
  humanEvaluation?: HumanEvaluation;
  humanEvaluationNote?: string;
}

export type AdaptiveAiMode = 'independent' | 'challenge' | 'guided';

export interface PlantContext {
  light?: 'low' | 'medium' | 'bright';
  wateredRecently?: boolean;
  locationChanged?: boolean;
  contextNote?: string;
}

export interface ObservationRecord {
  id: string;
  plantId: string;
  date: string; // e.g. "October 19, 2026"
  dayNumber: number; // e.g. Day 84
  image: string; // photo path or data URL
  ghostReferenceImage?: string; // ghost alignment overlay
  humanCategories: ObservationCategory[];
  humanNote?: string;
  humanPins?: PinMarker[];
  aiChanges: ObservationChange[];
  aiReflectiveSummary?: string;
  // Computed match groupings
  bothCategories: ObservationCategory[];
  humanOnlyCategories: ObservationCategory[];
  aiOnlyCategories: ObservationCategory[];
  lookAgainResolved?: boolean;
  // Build 3 Expansions
  aiMode: AdaptiveAiMode;
  observeWithoutAi?: boolean;
  aiRevealed?: boolean;
  context?: PlantContext;
  reflectionAnswer?: {
    question: string;
    answer: string;
  };
}

export interface Plant {
  id: string;
  userId?: string;
  name: string;
  species: string;
  daysTogether: number;
  coverImage: string;
  firstObservationDate: string;
  latestObservationDate: string;
  locationNotes?: string;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  memberSince: string;
  observationStyle: 'independent' | 'balanced' | 'guided';
  aiRevealPreference: 'only_after' | 'on_request';
  reducedMotion: boolean;
  emailNotifications: boolean;
  weeklyDigest: boolean;
  hasCompletedOnboarding?: boolean;
}

export type ActiveView =
  | 'marketing'
  | 'home'
  | 'garden'
  | 'plant_profile'
  | 'add_observation'
  | 'growth_story'
  | 'observation_journey'
  | 'care_planner'
  | 'discoveries'
  | 'profile';

export type ReminderType =
  | 'watering'
  | 'fertilizing'
  | 'pruning'
  | 'repotting'
  | 'observation'
  | 'custom';

export type ReminderRepeat = 'never' | 'weekly' | 'biweekly' | 'monthly' | 'custom';

export interface PlantReminder {
  id: string;
  plantId: string;
  plantName: string;
  type: ReminderType;
  title: string;
  dueDate: string; // e.g. "2026-11-08" or "Tomorrow"
  repeat: ReminderRepeat;
  note?: string;
  completed: boolean;
  createdAt: string;
}

export interface CareSuggestion {
  id: string;
  plantId: string;
  plantName: string;
  title: string;
  text: string;
  category: 'light' | 'water' | 'environment' | 'support';
  suggestedAction?: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  icon: string;
  shortTagline: string;
  description: string;
  educationalTip: string;
  suggestedForSpecies?: string[];
  sampleItems: {
    name: string;
    description: string;
    suitability: string;
  }[];
}

