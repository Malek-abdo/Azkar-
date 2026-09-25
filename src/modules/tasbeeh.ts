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
