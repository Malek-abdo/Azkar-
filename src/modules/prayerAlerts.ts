/**
 * نظام التنبيهات والأذان لمواقيت الصلاة
 * يتيح التنبيه بصوت الأذان أو التكبيرات عند دخول الوقت وقبله،
 * مع إمكانية تفعيل أو تعطيل التنبيهات لكل صلاة على حدة.
 */

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerAlertConfig {
  enabled: boolean;
  sound: string;
  preReminderMinutes: number; // 0 = off, 5, 10, 15, 30
  volume: number; // 0 to 1
}

export interface PrayerAlertsSettings {
  masterEnabled: boolean;
  defaultPreReminderMinutes: number;
  globalSound: string;
  prayers: Record<PrayerKey, PrayerAlertConfig>;
}

export interface MuadhinOption {
  id: string;
  name: string;
  description: string;
  url: string;
}

export interface AlertTriggerInfo {
  prayerKey: PrayerKey;
  prayerNameArabic: string;
  timeFormatted: string;
  isPreAlert: boolean;
  preAlertMinutes?: number;
  soundName: string;
}

export const MUADHIN_OPTIONS: MuadhinOption[] = [
  {
    id: 'qatami_hq',
    name: 'أذان الشيخ ناصر القطامي (عالي الدقة HQ)',
    description: 'أذان خاشع ومؤثر بصوت الشيخ ناصر القطامي',
    url: 'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Nasser_Al_Qatami_-_HQ_(%D9%86%D8%A7%D8%B5%D8%B1_%D8%A7%D9%84%D9%82%D8%B7%D8%A7%D9%85%D9%8A).mp3'
  },
  {
    id: 'qatami_sa',
    name: 'أذان الشيخ ناصر القطامي (المملكة العربية السعودية)',
    description: 'أذان ناصر القطامي - تسجيل المملكة العربية السعودية',
    url: 'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Nasser_Al_Qatami_1_-_Saudi_Arabia_(%D9%86%D8%A7%D8%B5%D8%B1_%D8%A7%D9%84%D9%82%D8%B7%D8%A7%D9%85%D9%8A_-_%D8%A7%D9%84%D9%85%D9%85%D9%84%D9%83%D8%A9_%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9_%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9).mp3'
  },
  {
    id: 'dosari',
    name: 'أذان الشيخ ياسر الدوسري',
    description: 'أذان الشيخ ياسر الدوسري (إمام الحرم المكي الشريف)',
    url: 'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Yasser_Al-Dosari_-_Saudi_Arabia_(%D9%8A%D8%A7%D8%B3%D8%B1_%D8%A7%D9%84%D8%AF%D9%88%D8%B3%D8%B1%D9%8A_-_%D8%A7%D9%84%D9%85%D9%85%D9%84%D9%83%D8%A9_%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9_%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9).mp3'
  },
  {
    id: 'alafasy',
    name: 'أذان الشيخ مشاري راشد العفاسي',
    description: 'أذان الكويت الشهير بصوت الشيخ مشاري العفاسي',
    url: 'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Mishary_Rashid_Alafasy_1_-_Kuwait_(%D9%85%D8%B4%D8%A7%D8%B1%D9%8A_%D8%B1%D8%A7%D8%B4%D8%AF_%D8%A7%D9%84%D8%B9%D9%81%D8%A7%D8%B3%D9%8A_-_%D8%A7%D9%84%D9%83%D9%88%D9%8A%D8%AA).mp3'
  },
  {
    id: 'abdulbasit',
    name: 'أذان الشيخ عبد الباسط عبد الصمد',
    description: 'الأذان التراثي الخالد بصوت صوت مكة الشيخ عبد الباسط (مصر)',
    url: 'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Abdulbasit_Abdusamad_1_-_Egypt_(%D8%B9%D8%A8%D8%AF_%D8%A7%D9%84%D8%A8%D8%A7%D8%B3%D8%B7_%D8%B9%D8%A8%D8%AF_%D8%A7%D9%84%D8%B5%D9%85%D8%AF_-_%D9%85%D8%B5%D8%B1).mp3'
  },
  {
    id: 'minshawi',
    name: 'أذان الشيخ محمد صديق المنشاوي',
    description: 'الأذان الخاشع الباكي للشيخ محمد صديق المنشاوي (مصر)',
    url: 'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Mohamed_Siddiq_El-Minshawi_-_Egypt_1_(%D9%85%D8%AD%D9%85%D8%AF_%D8%B5%D8%AF%D9%8A%D9%82_%D8%A7%D9%84%D9%85%D9%86%D8%B4%D8%A7%D9%88%D9%8A_-_%D9%85%D8%B5%D8%B1).mp3'
  },
  {
    id: 'hussary',
    name: 'أذان الشيخ محمود خليل الحصري',
    description: 'أذان القاهرة التراثي الجميل بصوت الشيخ الحصري',
    url: 'https://cdn.jsdelivr.net/gh/Kiwifu/adhan-mp3@main/Mahmoud_Khalil_Al_Hussary_-_Cairo_(%D9%85%D8%AD%D9%85%D9%88%D8%AF_%D8%AE%D9%84%D9%8A%D9%84_%D8%A7%D9%84%D8%AD%D8%B5%D8%B1%D9%8A_-_%D8%A7%D9%84%D9%82%D8%A7%D9%87%D8%B1%D8%A9).mp3'
  },
  {
    id: 'makkah',
    name: 'أذان الحرم المكي الشريف',
    description: 'صوت الشيخ علي أحمد ملا (مؤذن الحرم المكي)',
    url: 'https://cdn.islamic.network/audio/adhan/makkah.mp3'
  },
  {
    id: 'madinah',
    name: 'أذان المسجد النبوي الشريف',
    description: 'أذان المدينة المنورة العذب والمؤثر',
    url: 'https://cdn.islamic.network/audio/adhan/madina.mp3'
  },
  {
    id: 'takbeer',
    name: 'تكبيرات إسلامية خاشعة',
    description: 'الله أكبر الله أكبر ولله الحمد',
    url: 'https://cdn.islamic.network/audio/adhan/takbeer.mp3'
  },
  {
    id: 'chime',
    name: 'نغمة هادئة لطيفة',
    description: 'رنين هادئ وخفيف للتنبيه',
    url: ''
  },
  {
    id: 'silent',
    name: 'صامت (إشعار واهتزاز فقط)',
    description: 'بدون صوت أذان',
    url: ''
  }
];

export const PRAYER_DISPLAY_NAMES: Record<PrayerKey, string> = {
  fajr: 'صلاة الفجر',
  sunrise: 'شروق الشمس',
  dhuhr: 'صلاة الظهر',
  asr: 'صلاة العصر',
  maghrib: 'صلاة المغرب',
  isha: 'صلاة العشاء'
};

const STORAGE_KEY = 'zad_prayer_alerts_settings_v3';
const LAST_ALERT_LOG_KEY = 'zad_last_fired_prayer_alerts';

export const DEFAULT_ALERTS_SETTINGS: PrayerAlertsSettings = {
  masterEnabled: true,
  defaultPreReminderMinutes: 10,
  globalSound: 'qatami_hq',
  prayers: {
    fajr: { enabled: true, sound: 'qatami_hq', preReminderMinutes: 15, volume: 1 },
    sunrise: { enabled: false, sound: 'chime', preReminderMinutes: 0, volume: 0.8 },
    dhuhr: { enabled: true, sound: 'qatami_hq', preReminderMinutes: 10, volume: 1 },
    asr: { enabled: true, sound: 'qatami_hq', preReminderMinutes: 10, volume: 1 },
    maghrib: { enabled: true, sound: 'qatami_hq', preReminderMinutes: 10, volume: 1 },
    isha: { enabled: true, sound: 'qatami_hq', preReminderMinutes: 10, volume: 1 }
  }
};

let currentAudio: HTMLAudioElement | null = null;
let currentSynthStopFn: (() => void) | null = null;
let isAudioPlaying = false;
let activeAlertState: AlertTriggerInfo | null = null;

// Load settings from storage
export function loadPrayerAlertsSettings(): PrayerAlertsSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ALERTS_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      masterEnabled: parsed.masterEnabled ?? DEFAULT_ALERTS_SETTINGS.masterEnabled,
      defaultPreReminderMinutes: parsed.defaultPreReminderMinutes ?? DEFAULT_ALERTS_SETTINGS.defaultPreReminderMinutes,
      globalSound: parsed.globalSound ?? DEFAULT_ALERTS_SETTINGS.globalSound,
      prayers: {
        fajr: { ...DEFAULT_ALERTS_SETTINGS.prayers.fajr, ...parsed.prayers?.fajr },
        sunrise: { ...DEFAULT_ALERTS_SETTINGS.prayers.sunrise, ...parsed.prayers?.sunrise },
        dhuhr: { ...DEFAULT_ALERTS_SETTINGS.prayers.dhuhr, ...parsed.prayers?.dhuhr },
        asr: { ...DEFAULT_ALERTS_SETTINGS.prayers.asr, ...parsed.prayers?.asr },
        maghrib: { ...DEFAULT_ALERTS_SETTINGS.prayers.maghrib, ...parsed.prayers?.maghrib },
        isha: { ...DEFAULT_ALERTS_SETTINGS.prayers.isha, ...parsed.prayers?.isha }
      }
    };
  } catch {
    return DEFAULT_ALERTS_SETTINGS;
  }
}

// Save settings to storage
export function savePrayerAlertsSettings(settings: PrayerAlertsSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save prayer alerts settings:', e);
  }
}

// Toggle alert for an individual prayer
export function toggleIndividualPrayerAlert(prayerKey: PrayerKey, explicitState?: boolean): PrayerAlertsSettings {
  const settings = loadPrayerAlertsSettings();
  const current = settings.prayers[prayerKey].enabled;
  settings.prayers[prayerKey].enabled = explicitState !== undefined ? explicitState : !current;
  savePrayerAlertsSettings(settings);
  return settings;
}

// Update specific prayer config
export function updatePrayerConfig(prayerKey: PrayerKey, update: Partial<PrayerAlertConfig>): PrayerAlertsSettings {
  const settings = loadPrayerAlertsSettings();
  settings.prayers[prayerKey] = {
    ...settings.prayers[prayerKey],
    ...update
  };
  savePrayerAlertsSettings(settings);
  return settings;
}

// Update master settings
export function updateMasterPrayerSettings(update: Partial<PrayerAlertsSettings>): PrayerAlertsSettings {
  const settings = loadPrayerAlertsSettings();
  const merged = { ...settings, ...update };
  savePrayerAlertsSettings(merged);
  return merged;
}

// Apply one sound to all prayers
export function applySoundToAllPrayers(sound: PrayerAlertConfig['sound']): PrayerAlertsSettings {
  const settings = loadPrayerAlertsSettings();
  settings.globalSound = sound === 'silent' || sound === 'chime' ? 'makkah' : sound;
  (Object.keys(settings.prayers) as PrayerKey[]).forEach(k => {
    if (k !== 'sunrise') {
      settings.prayers[k].sound = sound;
    }
  });
  savePrayerAlertsSettings(settings);
  return settings;
}

// Synthesize pleasant Islamic chime / harmonic tone using Web Audio API (100% offline & instant)
function playSynthesizedIslamicChime(volume = 0.8): () => void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return () => {};
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Islamic Maqam Rast / Bayati spiritual chord notes (frequencies in Hz: D4, F4, G4, A4, C5, D5)
    const notes = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33];
    const oscillators: OscillatorNode[] = [];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      const startTime = ctx.currentTime + idx * 0.35;
      const duration = 2.5;

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.35, startTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
      oscillators.push(osc);
    });

    return () => {
      try {
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
        setTimeout(() => {
          ctx.close().catch(() => {});
        }, 150);
      } catch {
        // ignore
      }
    };
  } catch (e) {
    console.warn('Web Audio synth failed:', e);
    return () => {};
  }
}

// Request Browser Notifications Permission
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

// Send system notification
export function sendPrayerNotification(title: string, body: string): void {
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      const options: any = {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'prayer-alert',
        renotify: true,
        requireInteraction: true
      };
      new Notification(title, options);
    }
  } catch (e) {
    console.warn('Failed to dispatch notification:', e);
  }

  // Trigger device vibration if supported
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate([300, 200, 300, 200, 500]);
    } catch {
      // ignore
    }
  }
}

// Stop any active audio
export function stopAzanAudio(): void {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    } catch {
      // ignore
    }
  }
  if (currentSynthStopFn) {
    try {
      currentSynthStopFn();
      currentSynthStopFn = null;
    } catch {
      // ignore
    }
  }
  isAudioPlaying = false;
  activeAlertState = null;
  dispatchAlertEvent('stopped', null);
}

// Play Azan or Alert sound
export function playPrayerAudio(
  soundId: PrayerAlertConfig['sound'],
  volume = 1.0,
  onEnded?: () => void
): void {
  stopAzanAudio();
  if (soundId === 'silent') {
    return;
  }

  if (soundId === 'chime') {
    isAudioPlaying = true;
    currentSynthStopFn = playSynthesizedIslamicChime(volume);
    setTimeout(() => {
      isAudioPlaying = false;
      if (onEnded) onEnded();
    }, 4500);
    return;
  }

  const option = MUADHIN_OPTIONS.find(o => o.id === soundId) || MUADHIN_OPTIONS[0];
  if (!option.url) {
    isAudioPlaying = true;
    currentSynthStopFn = playSynthesizedIslamicChime(volume);
    setTimeout(() => {
      isAudioPlaying = false;
      if (onEnded) onEnded();
    }, 4500);
    return;
  }

  try {
    const audio = new Audio();
    audio.src = option.url;
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.preload = 'auto';

    audio.onended = () => {
      isAudioPlaying = false;
      activeAlertState = null;
      if (onEnded) onEnded();
      dispatchAlertEvent('ended', null);
    };

    audio.onerror = () => {
      console.warn('External audio URL failed, falling back to harmonic chime:', option.url);
      currentSynthStopFn = playSynthesizedIslamicChime(volume);
      setTimeout(() => {
        isAudioPlaying = false;
        if (onEnded) onEnded();
      }, 5000);
    };

    currentAudio = audio;
    isAudioPlaying = true;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio play restricted by browser policy:', err);
        // Fallback to synthesized audio
        currentSynthStopFn = playSynthesizedIslamicChime(volume);
      });
    }
  } catch (err) {
    console.error('Error playing prayer audio:', err);
    currentSynthStopFn = playSynthesizedIslamicChime(volume);
  }
}

// Dispatch custom event for UI updates
function dispatchAlertEvent(type: 'triggered' | 'stopped' | 'ended', alertInfo: AlertTriggerInfo | null) {
  if (typeof window !== 'undefined') {
    const evt = new CustomEvent('prayer-alert-event', {
      detail: { type, alertInfo, isPlaying: isAudioPlaying }
    });
    window.dispatchEvent(evt);
  }
}

export function getActiveAlertState(): AlertTriggerInfo | null {
  return activeAlertState;
}

export function getIsAzanPlaying(): boolean {
  return isAudioPlaying;
}

// Track fired alerts per day to avoid spamming
function getFiredAlerts(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LAST_ALERT_LOG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function markAlertFired(key: string): void {
  try {
    const fired = getFiredAlerts();
    fired[key] = true;
    localStorage.setItem(LAST_ALERT_LOG_KEY, JSON.stringify(fired));
  } catch {
    // ignore
  }
}

// Check every second whether an alert should be triggered
export function checkAndTriggerPrayerAlerts(
  prayerTimes: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    nextPrayer: {
      name: string;
      arabicName: string;
      time: string;
      remainingMs: number;
    };
  },
  onTrigger?: (info: AlertTriggerInfo) => void
): void {
  const settings = loadPrayerAlertsSettings();
  if (!settings.masterEnabled) return;

  const next = prayerTimes.nextPrayer;
  if (!next || !next.name) return;

  const prayerKey = next.name as PrayerKey;
  const config = settings.prayers[prayerKey];
  if (!config || !config.enabled) return;

  const todayStr = new Date().toISOString().slice(0, 10);
  const remainingSec = Math.floor(next.remainingMs / 1000);

  // 1. Exact Prayer Time Alert (remaining seconds <= 2 and >= 0)
  const exactKey = `${todayStr}_${prayerKey}_exact`;
  const firedAlerts = getFiredAlerts();

  if (remainingSec <= 2 && remainingSec >= 0 && !firedAlerts[exactKey]) {
    markAlertFired(exactKey);

    const alertInfo: AlertTriggerInfo = {
      prayerKey,
      prayerNameArabic: PRAYER_DISPLAY_NAMES[prayerKey] || next.arabicName,
      timeFormatted: next.time,
      isPreAlert: false,
      soundName: MUADHIN_OPTIONS.find(o => o.id === config.sound)?.name || 'أذان الحرم المكي'
    };

    activeAlertState = alertInfo;

    // Send system notification
    const notifTitle = `حان الآن موعد ${alertInfo.prayerNameArabic}`;
    const notifBody = `الله أكبر الله أكبر.. حان الآن موعد ${alertInfo.prayerNameArabic} بتوقيت موقعك الحالي (${next.time}).`;
    sendPrayerNotification(notifTitle, notifBody);

    // Play Audio
    playPrayerAudio(config.sound, config.volume, () => {
      activeAlertState = null;
    });

    dispatchAlertEvent('triggered', alertInfo);
    if (onTrigger) onTrigger(alertInfo);
    return;
  }

  // 2. Pre-prayer alert (e.g. 5, 10, 15, 30 minutes before)
  if (config.preReminderMinutes > 0) {
    const preAlertSec = config.preReminderMinutes * 60;
    const preAlertKey = `${todayStr}_${prayerKey}_pre_${config.preReminderMinutes}`;

    if (
      remainingSec <= preAlertSec &&
      remainingSec >= preAlertSec - 2 &&
      !firedAlerts[preAlertKey]
    ) {
      markAlertFired(preAlertKey);

      const alertInfo: AlertTriggerInfo = {
        prayerKey,
        prayerNameArabic: PRAYER_DISPLAY_NAMES[prayerKey] || next.arabicName,
        timeFormatted: next.time,
        isPreAlert: true,
        preAlertMinutes: config.preReminderMinutes,
        soundName: 'نغمة اقتراب الصلاة'
      };

      activeAlertState = alertInfo;

      const notifTitle = `اقترب موعد ${alertInfo.prayerNameArabic} (باقي ${config.preReminderMinutes} دقيقة)`;
      const notifBody = `استعد للصلاة والوضوء.. باقي ${config.preReminderMinutes} دقيقة على موعد أذان ${alertInfo.prayerNameArabic}.`;
      sendPrayerNotification(notifTitle, notifBody);

      // Play chime or softer takbeer for pre-alert
      playPrayerAudio('chime', config.volume * 0.8, () => {
        activeAlertState = null;
      });

      dispatchAlertEvent('triggered', alertInfo);
      if (onTrigger) onTrigger(alertInfo);
    }
  }
}
