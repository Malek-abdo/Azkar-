/**
 * Account Memory & State Persistence
 * Isolates and persists all user preferences, progress, counts, and history per account.
 */

import { LocationItem, DEFAULT_LOCATION } from '../data/locationsData.ts';
import { TasbeehState, DhikrDailyStats } from './tasbeeh.ts';
import { PrayerAlertsSettings, loadPrayerAlertsSettings } from './prayerAlerts.ts';

export interface UserAccountMemory {
  userKey: string;
  tasbeeh: TasbeehState;
  tasbeehStats: DhikrDailyStats;
  dhikrProgress: Record<string, number>;
  favorites: any[];
  selectedLocation: LocationItem;
  prayerAlertsSettings: PrayerAlertsSettings;
  mushafPageNumber: number;
  quranFontSize: number;
  theme: 'light' | 'dark';
  kidsMode: boolean;
  homeDhikrCardIndex: number;
  adhkarCardIndex: number;
  prayerGuideStepIndex: number;
  prayerAdhkarStepIndex: number;
  faithCardIndex: number;
  fearHopeCardIndex: number;
  lastUpdated: string;
}

const MEMORY_PREFIX = 'zad_user_memory_';

export function getUserStorageKey(user: { email?: string | null; uid?: string } | null): string {
  if (!user) return 'guest_default';
  const rawKey = user.email || user.uid || 'guest_default';
  return rawKey.toLowerCase().replace(/[^a-z0-9_@.-]/g, '_');
}

export function loadUserMemory(userKey: string): Partial<UserAccountMemory> | null {
  try {
    const raw = localStorage.getItem(`${MEMORY_PREFIX}${userKey}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading account memory:', e);
    return null;
  }
}

export function saveUserMemory(userKey: string, data: Partial<UserAccountMemory>): void {
  try {
    const existing = loadUserMemory(userKey) || {};
    const merged: UserAccountMemory = {
      userKey,
      tasbeeh: data.tasbeeh || existing.tasbeeh || {
        currentCount: 0,
        totalLifetimeCount: 0,
        target: 33,
        selectedDhikr: "سُبْحَانَ اللَّهِ",
        vibrateEnabled: true,
        soundEnabled: true
      },
      tasbeehStats: data.tasbeehStats || existing.tasbeehStats || {
        todayCount: 0,
        todayDate: new Date().toISOString().slice(0, 10),
        weeklyCount: 0,
        streakDays: 1,
        history: {}
      },
      dhikrProgress: data.dhikrProgress || existing.dhikrProgress || {},
      favorites: data.favorites || existing.favorites || [],
      selectedLocation: data.selectedLocation || existing.selectedLocation || DEFAULT_LOCATION,
      prayerAlertsSettings: data.prayerAlertsSettings || existing.prayerAlertsSettings || loadPrayerAlertsSettings(),
      mushafPageNumber: data.mushafPageNumber ?? existing.mushafPageNumber ?? 1,
      quranFontSize: data.quranFontSize ?? existing.quranFontSize ?? 24,
      theme: data.theme || existing.theme || 'light',
      kidsMode: data.kidsMode ?? existing.kidsMode ?? false,
      homeDhikrCardIndex: data.homeDhikrCardIndex ?? existing.homeDhikrCardIndex ?? 0,
      adhkarCardIndex: data.adhkarCardIndex ?? existing.adhkarCardIndex ?? 0,
      prayerGuideStepIndex: data.prayerGuideStepIndex ?? existing.prayerGuideStepIndex ?? 0,
      prayerAdhkarStepIndex: data.prayerAdhkarStepIndex ?? existing.prayerAdhkarStepIndex ?? 0,
      faithCardIndex: data.faithCardIndex ?? existing.faithCardIndex ?? 0,
      fearHopeCardIndex: data.fearHopeCardIndex ?? existing.fearHopeCardIndex ?? 0,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem(`${MEMORY_PREFIX}${userKey}`, JSON.stringify(merged));
  } catch (e) {
    console.error('Error saving account memory:', e);
  }
}
