/**
 * Reminder & Care Consideration Repository.
 *
 * Implements local persistence scoped by user ID with clean repository pattern.
 */

import { PlantReminder, CareSuggestion, ObservationRecord } from '../types';
import { TESTING_ACCOUNT_ID } from './authRepository';

export const INITIAL_REMINDERS: PlantReminder[] = [
  {
    id: 'rem_1',
    plantId: 'plant_milo',
    plantName: 'Milo',
    type: 'watering',
    title: "Check Milo's soil",
    dueDate: 'Tomorrow',
    repeat: 'weekly',
    note: 'Check the top 2 inches of soil with your finger before watering.',
    completed: false,
    createdAt: '2026-11-06T10:00:00Z',
  },
  {
    id: 'rem_2',
    plantId: 'plant_cleo',
    plantName: 'Cleo',
    type: 'observation',
    title: 'Observe Cleo',
    dueDate: 'Nov 10',
    repeat: 'biweekly',
    note: 'Look at the trailing tip cascade along the shelf edge.',
    completed: false,
    createdAt: '2026-11-05T09:00:00Z',
  },
  {
    id: 'rem_3',
    plantId: 'plant_sol',
    plantName: 'Sol',
    type: 'fertilizing',
    title: 'Fertilizer reminder — Sol',
    dueDate: 'Nov 18',
    repeat: 'monthly',
    note: 'Gentle organic diluted feed if actively putting out new leaves.',
    completed: false,
    createdAt: '2026-11-04T12:00:00Z',
  },
];

export interface IReminderRepository {
  getReminders(userId?: string): PlantReminder[];
  getRemindersByPlantId(plantId: string, userId?: string): PlantReminder[];
  getUpcomingReminders(limit?: number, userId?: string): PlantReminder[];
  saveReminders(reminders: PlantReminder[], userId?: string): void;
  addReminder(reminder: PlantReminder, userId?: string): Promise<PlantReminder>;
  updateReminder(updated: PlantReminder, userId?: string): void;
  toggleReminderComplete(id: string, userId?: string): Promise<void>;
  deleteReminder(id: string, userId?: string): void;
  getCareSuggestionsForPlant(
    plantId: string,
    plantName: string,
    observations: ObservationRecord[]
  ): CareSuggestion[];
}

export class LocalReminderRepository implements IReminderRepository {
  private getUserStorageKey(userId?: string): string {
    return userId ? `leafstory_reminders_${userId}` : 'leafstory_reminders_demo_v3';
  }

  getReminders(userId?: string): PlantReminder[] {
    if (!userId) {
      return INITIAL_REMINDERS;
    }

    try {
      const key = this.getUserStorageKey(userId);
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[ReminderRepository] Error loading reminders:', e);
    }
    if (userId === TESTING_ACCOUNT_ID) {
      this.saveReminders(INITIAL_REMINDERS, userId);
      return INITIAL_REMINDERS;
    }

    return [];
  }

  getRemindersByPlantId(plantId: string, userId?: string): PlantReminder[] {
    return this.getReminders(userId).filter((r) => r.plantId === plantId);
  }

  getUpcomingReminders(limit: number = 3, userId?: string): PlantReminder[] {
    return this.getReminders(userId)
      .filter((r) => !r.completed)
      .slice(0, limit);
  }

  saveReminders(reminders: PlantReminder[], userId?: string): void {
    try {
      const key = this.getUserStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(reminders));
    } catch (e) {
      console.warn('[ReminderRepository] Error saving reminders:', e);
    }
  }

  async addReminder(reminder: PlantReminder, userId?: string): Promise<PlantReminder> {
    const list = this.getReminders(userId);
    this.saveReminders([reminder, ...list], userId);
    return reminder;
  }

  updateReminder(updated: PlantReminder, userId?: string): void {
    const list = this.getReminders(userId);
    const idx = list.findIndex((r) => r.id === updated.id);
    if (idx >= 0) {
      list[idx] = updated;
      this.saveReminders([...list], userId);
    }
  }

  async toggleReminderComplete(id: string, userId?: string): Promise<void> {
    const list = this.getReminders(userId);
    const updated = list.map((r) => {
      if (r.id === id) {
        return { ...r, completed: !r.completed };
      }
      return r;
    });
    this.saveReminders(updated, userId);
  }

  deleteReminder(id: string, userId?: string): void {
    const list = this.getReminders(userId);
    this.saveReminders(list.filter((r) => r.id !== id), userId);
  }

  /**
   * Generates reflective, non-prescriptive "Things to consider"
   * LeafStory philosophy: AI never diagnoses disease or commands treatment.
   */
  getCareSuggestionsForPlant(
    plantId: string,
    plantName: string,
    observations: ObservationRecord[]
  ): CareSuggestion[] {
    const plantObs = observations.filter((o) => o.plantId === plantId);
    const suggestions: CareSuggestion[] = [];

    const hasNewGrowth = plantObs.some((o) => o.humanCategories?.includes('new_growth'));
    const hasOrientationChange = plantObs.some((o) => o.humanCategories?.includes('orientation_change'));
    const hasColorChange = plantObs.some((o) => o.humanCategories?.includes('color_change'));

    if (hasNewGrowth) {
      suggestions.push({
        id: `sug_grow_${plantId}`,
        plantId,
        plantName,
        title: 'Active leaf production noticed',
        text: `${plantName} has produced new tissue recently. Active growers often appreciate steady, indirect light and gentle watering when dry.`,
        category: 'light',
        suggestedAction: 'Observe whether newest growth faces the window',
      });
    }

    if (hasOrientationChange) {
      suggestions.push({
        id: `sug_orient_${plantId}`,
        plantId,
        plantName,
        title: 'Phototropism / light response observed',
        text: `Leaves appear to be leaning or adjusting orientation. You might consider rotating the pot a quarter-turn if you desire balanced symmetry.`,
        category: 'light',
        suggestedAction: 'Quarter-turn pot',
      });
    }

    if (hasColorChange) {
      suggestions.push({
        id: `sug_color_${plantId}`,
        plantId,
        plantName,
        title: 'Shifts in pigment or leaf tone noticed',
        text: `Color variations can be seasonal, light-dependent, or a natural shedding of oldest bottom leaves.`,
        category: 'water',
        suggestedAction: 'Gently feel soil moisture depth',
      });
    }

    if (suggestions.length === 0) {
      suggestions.push({
        id: `sug_mindful_${plantId}`,
        plantId,
        plantName,
        title: 'Steady baseline state',
        text: `No drastic rapid shifts detected. Slow, steady quietude is healthy for established plants.`,
        category: 'support',
        suggestedAction: 'Pause and enjoy observing without urgency',
      });
    }

    return suggestions;
  }
}

// Export singleton instance
export const ReminderRepository: LocalReminderRepository = new LocalReminderRepository();
