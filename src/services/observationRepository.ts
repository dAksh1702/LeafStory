/**
 * Observation Repository.
 *
 * Implements clean IObservationRepository interface separating data access from UI components.
 * Scopes records by user ID so Account A never sees Account B's observations.
 */

import { ObservationRecord } from '../types';
import { DEMO_OBSERVATIONS } from '../data/demoObservations';
import { ImageStorage } from './imageStorage';
import { TESTING_ACCOUNT_ID } from './authRepository';

export interface IObservationRepository {
  getObservations(userId?: string): Promise<ObservationRecord[]>;
  getObservationsByPlantId(plantId: string, userId?: string): Promise<ObservationRecord[]>;
  getObservationById(id: string, userId?: string): Promise<ObservationRecord | undefined>;
  saveObservations(observations: ObservationRecord[], userId?: string): Promise<void>;
  upsertObservation(observation: ObservationRecord, userId?: string): Promise<ObservationRecord>;
  getDemoObservations(): ObservationRecord[];
  resetToDemo(): void;
}

export class LocalObservationRepository implements IObservationRepository {
  private getUserStorageKey(userId?: string): string {
    return userId ? `leafstory_observations_${userId}` : 'leafstory_observations_demo_v3';
  }

  /**
   * Load all observations from storage for a given user.
   * If userId is provided, a fresh account starts with 0 observations.
   */
  async getObservations(userId?: string): Promise<ObservationRecord[]> {
    if (!userId) {
      // Demo Sanctuary mode
      return DEMO_OBSERVATIONS;
    }

    try {
      const key = this.getUserStorageKey(userId);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Re-hydrate any IndexedDB stored images
          const hydrated = await Promise.all(
            parsed.map(async (obs: ObservationRecord) => {
              let updatedObs = obs;
              if (obs.image && obs.image.startsWith('idb:')) {
                const imgKey = obs.image.replace('idb:', '');
                const fullImage = await ImageStorage.getImage(imgKey);
                if (fullImage) {
                  updatedObs = { ...updatedObs, image: fullImage };
                }
              }
              if (obs.ghostReferenceImage && obs.ghostReferenceImage.startsWith('idb:')) {
                const ghostKey = obs.ghostReferenceImage.replace('idb:', '');
                const fullGhost = await ImageStorage.getImage(ghostKey);
                if (fullGhost) {
                  updatedObs = { ...updatedObs, ghostReferenceImage: fullGhost };
                }
              }
              return updatedObs;
            })
          );
          return hydrated;
        }
      }
    } catch (e) {
      console.warn('[ObservationRepository] Failed to read observations:', e);
    }

    // Seed >100-day observation stories for the dedicated testing profile
    if (userId === TESTING_ACCOUNT_ID) {
      const extraTestingObs: ObservationRecord[] = [
        {
          id: 'obs_milo_108',
          plantId: 'plant_milo',
          date: 'November 11, 2026',
          dayNumber: 108,
          image: '/src/assets/images/milo_monstera_full_1792440447034.jpg',
          humanCategories: ['new_growth', 'leaf_position_change'],
          humanNote: 'Over 100 days together! The newest fenestrated leaf has fully hardened off and tilted toward the east window.',
          humanPins: [{ xPercent: 54, yPercent: 32, label: 'Day 108 mature fenestration' }],
          aiChanges: [
            {
              category: 'new_growth',
              confidence: 0.96,
              description: 'Full canopy expansion with deep secondary fenestrations and sturdy petiole posture.',
              suggestedCue: 'Compare the petiole angle against your Day 15 entry.',
              approximateLocation: { xPercent: 54, yPercent: 32 },
              humanEvaluation: 'see_it',
            },
          ],
          bothCategories: ['new_growth'],
          humanOnlyCategories: ['leaf_position_change'],
          aiOnlyCategories: [],
          lookAgainResolved: true,
          aiMode: 'independent',
          observeWithoutAi: false,
          aiRevealed: true,
          context: { light: 'bright', wateredRecently: false },
          reflectionAnswer: {
            question: 'How has your way of noticing changed over 100 days?',
            answer: 'I notice subtle petiole tilts before checking the soil.',
          },
        },
        {
          id: 'obs_sol_104',
          plantId: 'plant_sol',
          date: 'November 10, 2026',
          dayNumber: 104,
          image: '/src/assets/images/sol_ficus_early_1794009507803.jpg',
          humanCategories: ['color_change', 'orientation_change'],
          humanNote: 'Day 104: Uppermost leaves have deepened to a rich forest green after rotating the pot last week.',
          humanPins: [{ xPercent: 48, yPercent: 28, label: 'Deepened canopy tone' }],
          aiChanges: [],
          bothCategories: [],
          humanOnlyCategories: ['color_change', 'orientation_change'],
          aiOnlyCategories: [],
          lookAgainResolved: true,
          aiMode: 'independent',
          observeWithoutAi: true,
          aiRevealed: false,
          context: { light: 'bright', wateredRecently: true },
        },
        {
          id: 'obs_fern_1',
          plantId: 'plant_fern',
          date: 'August 01, 2026',
          dayNumber: 1,
          image: '/src/assets/images/cleo_pothos_mid_1794009519642.jpg',
          humanCategories: ['new_growth'],
          humanNote: 'First day placing Fern on the bathroom ledge. Tightly coiled fiddleheads visible near the crown.',
          humanPins: [{ xPercent: 50, yPercent: 60, label: 'Crown fiddleheads' }],
          aiChanges: [],
          bothCategories: [],
          humanOnlyCategories: ['new_growth'],
          aiOnlyCategories: [],
          lookAgainResolved: true,
          aiMode: 'guided',
          observeWithoutAi: false,
          aiRevealed: false,
          context: { light: 'medium', wateredRecently: true },
        },
        {
          id: 'obs_fern_102',
          plantId: 'plant_fern',
          date: 'November 11, 2026',
          dayNumber: 102,
          image: '/src/assets/images/cleo_pothos_mid_1794009519642.jpg',
          humanCategories: ['new_growth', 'leaf_position_change'],
          humanNote: 'Day 102: Fronds have arched gracefully outward and feel noticeably softer after consistent morning misting.',
          humanPins: [{ xPercent: 62, yPercent: 44, label: 'Arching outer fronds' }],
          aiChanges: [],
          bothCategories: [],
          humanOnlyCategories: ['new_growth', 'leaf_position_change'],
          aiOnlyCategories: [],
          lookAgainResolved: true,
          aiMode: 'independent',
          observeWithoutAi: true,
          aiRevealed: false,
          context: { light: 'medium', wateredRecently: true },
        },
      ];
      const seeded = [...DEMO_OBSERVATIONS, ...extraTestingObs];
      await this.saveObservations(seeded, userId);
      return seeded;
    }

    return [];
  }

  /**
   * Fast synchronous snapshot
   */
  getObservationsSync(userId?: string): ObservationRecord[] {
    if (!userId) return DEMO_OBSERVATIONS;

    try {
      const key = this.getUserStorageKey(userId);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[ObservationRepository] getObservationsSync error:', e);
    }
    return [];
  }

  /**
   * Get all observations for a specific plant, sorted chronologically.
   */
  async getObservationsByPlantId(plantId: string, userId?: string): Promise<ObservationRecord[]> {
    const all = await this.getObservations(userId);
    return all
      .filter((o) => o.plantId === plantId)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  }

  /**
   * Get a single observation by ID.
   */
  async getObservationById(id: string, userId?: string): Promise<ObservationRecord | undefined> {
    const all = await this.getObservations(userId);
    return all.find((o) => o.id === id);
  }

  /**
   * Persist full list of observations for a user.
   */
  async saveObservations(observations: ObservationRecord[], userId?: string): Promise<void> {
    try {
      const key = this.getUserStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(observations));
    } catch (e) {
      console.warn('[ObservationRepository] Failed to save observations:', e);
    }
  }

  /**
   * Add or update an observation.
   * Large camera capture images are stored in IndexedDB to avoid exhausting localStorage.
   */
  async upsertObservation(
    observation: ObservationRecord,
    userId?: string
  ): Promise<ObservationRecord> {
    let persistedObs = { ...observation };

    // Offload high-res photo capture to IndexedDB if large base64
    if (observation.image && observation.image.startsWith('data:image/') && observation.image.length > 50000) {
      try {
        const imageKey = `obs_${observation.id}_photo`;
        await ImageStorage.saveImage(imageKey, observation.image);
      } catch (e) {
        console.warn('[ObservationRepository] IndexedDB image save fallback:', e);
      }
    }

    const current = await this.getObservations(userId);
    const index = current.findIndex((o) => o.id === persistedObs.id);
    let updated: ObservationRecord[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = persistedObs;
    } else {
      updated = [...current, persistedObs];
    }
    await this.saveObservations(updated, userId);
    return persistedObs;
  }

  /**
   * Returns demo observations for exploration
   */
  getDemoObservations(): ObservationRecord[] {
    return DEMO_OBSERVATIONS;
  }

  /**
   * Reset demo observations
   */
  resetToDemo(): void {
    try {
      localStorage.setItem('leafstory_observations_demo_v3', JSON.stringify(DEMO_OBSERVATIONS));
    } catch (e) {}
  }
}

// Export singleton repository
export const ObservationRepository: LocalObservationRepository = new LocalObservationRepository();
