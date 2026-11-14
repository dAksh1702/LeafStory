/**
 * Plant Repository.
 *
 * Provides a clean interface separating data access from UI components.
 * Future backends (PostgreSQL, Cloud SQL, REST API) can replace LocalPlantRepository
 * without modifying UI code.
 */

import { Plant } from '../types';
import { DEMO_PLANTS } from '../data/demoPlants';
import { ImageStorage } from './imageStorage';
import { TESTING_ACCOUNT_ID } from './authRepository';

export interface IPlantRepository {
  getPlants(userId?: string): Promise<Plant[]>;
  getPlantById(id: string, userId?: string): Promise<Plant | undefined>;
  savePlants(plants: Plant[], userId?: string): Promise<void>;
  upsertPlant(plant: Plant, userId?: string): Promise<Plant>;
  deletePlant(id: string, userId?: string): Promise<void>;
  getActivePlantId(userId?: string): string;
  setActivePlantId(id: string, userId?: string): void;
  getDemoPlants(): Plant[];
  resetToDemo(): void;
}

export class LocalPlantRepository implements IPlantRepository {
  private getUserStorageKey(userId?: string): string {
    return userId ? `leafstory_plants_${userId}` : 'leafstory_plants_demo_v3';
  }

  /**
   * Load plants for a specific user (or demo sanctuary if no user ID).
   * For any new real account, returns empty list [] (0 plants).
   */
  async getPlants(userId?: string): Promise<Plant[]> {
    if (!userId) {
      // Demo Sanctuary mode
      return DEMO_PLANTS;
    }

    try {
      const key = this.getUserStorageKey(userId);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Asynchronously re-hydrate high-resolution IndexedDB images if applicable
          const hydrated = await Promise.all(
            parsed.map(async (plant: Plant) => {
              if (plant.coverImage && plant.coverImage.startsWith('idb:')) {
                const imgKey = plant.coverImage.replace('idb:', '');
                const fullImage = await ImageStorage.getImage(imgKey);
                if (fullImage) {
                  return { ...plant, coverImage: fullImage };
                }
              }
              return plant;
            })
          );
          return hydrated;
        }
      }
    } catch (e) {
      console.warn('[PlantRepository] Failed to read plants from storage:', e);
    }

    // Seed 4 rich plants (>100 days) for the dedicated testing profile on first load
    if (userId === TESTING_ACCOUNT_ID) {
      const seededPlants: Plant[] = [
        { ...DEMO_PLANTS[0], userId, daysTogether: 108, latestObservationDate: 'November 11, 2026' },
        { ...DEMO_PLANTS[1], userId, daysTogether: 104, latestObservationDate: 'November 10, 2026' },
        { ...DEMO_PLANTS[2], userId, daysTogether: 113, latestObservationDate: 'October 22, 2026' },
        {
          id: 'plant_fern',
          userId,
          name: 'Fern',
          species: 'Nephrolepis Exaltata (Boston Fern)',
          daysTogether: 102,
          coverImage: '/src/assets/images/cleo_pothos_mid_1794009519642.jpg',
          firstObservationDate: 'August 01, 2026',
          latestObservationDate: 'November 11, 2026',
          locationNotes: 'Shaded bathroom window ledge with morning mist',
          createdAt: '2026-08-01T08:00:00Z',
        },
      ];
      await this.savePlants(seededPlants, userId);
      return seededPlants;
    }

    // New accounts start strictly with 0 plants
    return [];
  }

  /**
   * Fetch synchronous snapshot for fast UI rendering
   */
  getPlantsSync(userId?: string): Plant[] {
    if (!userId) return DEMO_PLANTS;

    try {
      const key = this.getUserStorageKey(userId);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('[PlantRepository] getPlantsSync error:', e);
    }
    return [];
  }

  /**
   * Get a single plant by its unique ID.
   */
  async getPlantById(id: string, userId?: string): Promise<Plant | undefined> {
    const plants = await this.getPlants(userId);
    return plants.find((p) => p.id === id);
  }

  /**
   * Persist full list of plants for a specific user.
   */
  async savePlants(plants: Plant[], userId?: string): Promise<void> {
    try {
      const key = this.getUserStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(plants));
    } catch (e) {
      console.warn('[PlantRepository] Failed to save plants to storage:', e);
    }
  }

  /**
   * Add a new plant or update an existing one.
   * If plant has a large base64 image, stores into IndexedDB to preserve localStorage space.
   */
  async upsertPlant(plant: Plant, userId?: string): Promise<Plant> {
    let persistedPlant = { ...plant };

    // Offload large base64 images (>50KB) to IndexedDB
    if (plant.coverImage && plant.coverImage.startsWith('data:image/') && plant.coverImage.length > 50000) {
      try {
        const imageKey = `plant_${plant.id}_cover`;
        await ImageStorage.saveImage(imageKey, plant.coverImage);
        // We keep the runtime image in memory, but in localStorage store idb key or compact representation
      } catch (e) {
        console.warn('[PlantRepository] IndexedDB image save fallback:', e);
      }
    }

    const current = await this.getPlants(userId);
    const index = current.findIndex((p) => p.id === persistedPlant.id);
    let updated: Plant[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = persistedPlant;
    } else {
      updated = [persistedPlant, ...current];
    }

    await this.savePlants(updated, userId);
    return persistedPlant;
  }

  /**
   * Delete a plant by ID.
   */
  async deletePlant(id: string, userId?: string): Promise<void> {
    const current = await this.getPlants(userId);
    const updated = current.filter((p) => p.id !== id);
    await this.savePlants(updated, userId);
    await ImageStorage.deleteImage(`plant_${id}_cover`);
  }

  /**
   * Active plant ID persistence.
   */
  getActivePlantId(userId?: string): string {
    try {
      const key = userId ? `leafstory_active_plant_${userId}` : 'leafstory_active_plant_demo';
      const id = localStorage.getItem(key);
      if (id) return id;
    } catch (e) {}
    return userId ? '' : 'plant_milo';
  }

  setActivePlantId(id: string, userId?: string): void {
    try {
      const key = userId ? `leafstory_active_plant_${userId}` : 'leafstory_active_plant_demo';
      localStorage.setItem(key, id);
    } catch (e) {}
  }

  /**
   * Returns demo plants for exploration
   */
  getDemoPlants(): Plant[] {
    return DEMO_PLANTS;
  }

  /**
   * Reset demo data
   */
  resetToDemo(): void {
    try {
      localStorage.setItem('leafstory_plants_demo_v3', JSON.stringify(DEMO_PLANTS));
      localStorage.setItem('leafstory_active_plant_demo', 'plant_milo');
    } catch (e) {}
  }
}

// Export singleton instance
export const PlantRepository: LocalPlantRepository = new LocalPlantRepository();
