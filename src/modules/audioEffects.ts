/**
 * نظام المؤثرات الصوتية الفاخرة وانتقالات Apple - زاد المسلم
 * مبني بتقنية Web Audio API عالية الدقة لتوفير صوتيات سلسة فورية بدون أي تأخير، وتعمل 100% بدون إنترنت.
 */

const STORAGE_SFX_KEY = 'zad_sound_effects_enabled';

class AudioManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    const saved = localStorage.getItem(STORAGE_SFX_KEY);
    this.isEnabled = saved !== 'false'; // default is true
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public isSoundEnabled(): boolean {
    return this.isEnabled;
  }

  public setSoundEnabled(val: boolean): void {
    this.isEnabled = val;
    localStorage.setItem(STORAGE_SFX_KEY, String(val));
  }

  public toggleSound(): boolean {
    this.setSoundEnabled(!this.isEnabled);
    if (this.isEnabled) {
      this.playAppleTap();
    }
    return this.isEnabled;
  }

  /**
   * صوت نقرة Apple التفاعلية الخفيفة (للانتقالات والتنقل بين الصفحات والتبويبات)
   */
  public playAppleTransition(): void {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.036);
    } catch {}
  }

  /**
   * صوت نقرة زر Apple الخفيف السلس
   */
  public playAppleTap(): void {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.025);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.026);
    } catch {}
  }

  /**
   * صوت نقرة الذكر والتسبيح الفاخر (حبة مسبحة خشبية مصقولة ودافئة)
   */
  public playDhikrTap(): void {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Fundamental warm wooden body
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(340, now);
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.045);

      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      // 2. Crisp ceramic/wood contact overtone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(980, now);
      osc2.frequency.exponentialRampToValueAtTime(420, now + 0.02);

      gain2.gain.setValueAtTime(0.08, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.046);
      osc2.start(now);
      osc2.stop(now + 0.021);
    } catch {}
  }

  /**
   * صوت إتمام الذكر المبارك (نغمة بلورية دافئة وهادئة عند اكتمال العداد)
   */
  public playDhikrComplete(): void {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Harmonious Major Triad (C5 -> E5 -> G5 -> C6)
      const chord = [523.25, 659.25, 783.99, 1046.5];

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.06;
        const duration = 0.55 - idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.14 / (idx + 1), startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.01);
      });
    } catch {}
  }

  /**
   * صوت فتح نوافذ Apple المنبثقة (iOS Sheet Slide Up)
   */
  public playAppleSheetOpen(): void {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.061);
    } catch {}
  }

  /**
   * صوت إغلاق نوافذ Apple
   */
  public playAppleSheetClose(): void {
    if (!this.isEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.05);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.051);
    } catch {}
  }
}

export const audioFx = new AudioManager();
