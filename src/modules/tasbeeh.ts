/**
 * المسبحة الإلكترونية المتطورة - زاد المسلم
 * عداد تفاعلي، استجابة للمس، اهتزاز هابتك، مؤثر صوتي لطيف، وأهداف تسبيح متعددة
 */

export interface TasbeehState {
  currentCount: number;
  totalLifetimeCount: number;
  target: number;
  selectedDhikr: string;
  vibrateEnabled: boolean;
  soundEnabled: boolean;
}

export interface DhikrDailyStats {
  todayCount: number;
  todayDate: string;
  weeklyCount: number;
  streakDays: number;
  history: Record<string, number>; // date "YYYY-MM-DD" -> count
}

export const TASBEEH_PRESETS = [
  "سُبْحَانَ اللَّهِ",
  "الْحَمْدُ لِلَّهِ",
  "اللَّهُ أَكْبَرُ",
  "لاَ إِلَهَ إِلاَّ اللَّهُ",
  "أَسْتَغْفِرُ اللَّهَ",
  "لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ",
  "اللَّهُمَّ صَلِّ عَلَى نَبِيِّنَا مُحَمَّدٍ",
  "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ"
];

export const TARGET_PRESETS = [33, 99, 100, 1000, 0]; // 0 means open/unlimited

const STORAGE_KEY = "zad_tasbeeh_state";
const STORAGE_STATS_KEY = "zad_tasbeeh_daily_stats";

export function loadTasbeehStats(): DhikrDailyStats {
  const today = new Date().toISOString().slice(0, 10);
  const defaultStats: DhikrDailyStats = {
    todayCount: 0,
    todayDate: today,
    weeklyCount: 0,
    streakDays: 1,
    history: {}
  };

  const saved = localStorage.getItem(STORAGE_STATS_KEY);
  if (!saved) return defaultStats;

  try {
    const parsed = JSON.parse(saved);
    if (parsed.todayDate !== today) {
      // New day: archive yesterday
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const hadYesterday = (parsed.history && parsed.history[yesterday]) || parsed.todayCount > 0;
      const newStreak = hadYesterday ? (parsed.streakDays || 1) + 1 : 1;
      
      parsed.history = parsed.history || {};
      parsed.history[parsed.todayDate] = parsed.todayCount;
      parsed.todayDate = today;
      parsed.todayCount = 0;
      parsed.streakDays = newStreak;
    }
    
    // Calculate weekly sum (last 7 days)
    let weekly = parsed.todayCount || 0;
    for (let i = 1; i <= 6; i++) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      weekly += (parsed.history && parsed.history[d]) || 0;
    }
    parsed.weeklyCount = weekly;

    return parsed;
  } catch {
    return defaultStats;
  }
}

export function recordTasbeehIncrement(): DhikrDailyStats {
  const stats = loadTasbeehStats();
  stats.todayCount += 1;
  stats.weeklyCount += 1;
  stats.history[stats.todayDate] = stats.todayCount;
  localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
  return stats;
}

export function loadTasbeehState(): TasbeehState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return {
    currentCount: 0,
    totalLifetimeCount: 0,
    target: 33,
    selectedDhikr: TASBEEH_PRESETS[0],
    vibrateEnabled: true,
    soundEnabled: true
  };
}

export function saveTasbeehState(state: TasbeehState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

import { audioFx } from './audioEffects.ts';

// Subtle wooden bead click sound via Web Audio API
export function playBeadSound(): void {
  audioFx.playDhikrTap();
}

export function triggerHapticFeedback(pattern: number | number[] = 25): void {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // ignore
    }
  }
}
