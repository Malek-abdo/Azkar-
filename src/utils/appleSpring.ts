/**
 * Apple Fluid Interface & Spring Physics Engine
 * Implements WWDC "Designing Fluid Interfaces" & Emil Kowalski's Apple Design principles
 */

export interface SpringConfig {
  response: number;   // Duration in seconds (controls stiffness/period, e.g. 0.35s)
  dampingRatio: number; // 1.0 = critically damped (no overshoot), 0.8 = subtle bounce, <0.7 = bouncy
}

export const APPLE_SPRINGS: Record<string, SpringConfig> = {
  // Move / Reposition: Critically damped, snappy, zero overshoot
  move: { response: 0.38, dampingRatio: 1.0 },
  // Sheet / Drawer: Gentle settle with slight organic momentum
  sheet: { response: 0.32, dampingRatio: 0.82 },
  // Interactive Press / Tap: Fast, responsive feedback
  press: { response: 0.22, dampingRatio: 1.0 },
  // Tab / Switch: Crisp state transition
  tab: { response: 0.3, dampingRatio: 0.9 },
  // Bouncy Throw / Flick: Expressive momentum
  throw: { response: 0.42, dampingRatio: 0.78 }
};

/**
 * Exact iOS Rubber-Band formula (from WWDC & Apple UIScrollView)
 * f(x) = (x * c * d) / (d + c * x)
 * @param offset Current drag distance past limit
 * @param dimension Screen or container dimension (e.g. window.innerHeight)
 * @param constant Resistance coefficient (Apple standard ~0.55)
 */
export function appleRubberBand(offset: number, dimension = 800, constant = 0.55): number {
  const sign = Math.sign(offset);
  const abs = Math.abs(offset);
  return sign * ((abs * constant * dimension) / (dimension + constant * abs));
}

/**
 * Apple Momentum Projection using exponential deceleration
 * Projects where an object will land based on release velocity
 * @param initialPos Starting position
 * @param velocity Velocity in px/ms
 * @param decelerationRate Apple scroll deceleration rate (~0.996)
 */
export function projectMomentum(initialPos: number, velocity: number, decelerationRate = 0.996): number {
  // Integral of v(t) = v0 * d^t dt from 0 to infinity = v0 / (-ln(d))
  // With dt in milliseconds:
  const factor = 1 / (1 - decelerationRate);
  return initialPos + velocity * factor * 0.2;
}

/**
 * Analytical Spring Solver for 60/120fps fluid web animations
 * Completely interruptible at any frame with full velocity preservation
 */
export class SpringAnimation {
  private startPos: number;
  private currentPos: number;
  private targetPos: number;
  private currentVel: number; // px/s
  private config: SpringConfig;
  private startTime: number | null = null;
  private rafId: number | null = null;
  private onUpdate: (pos: number, vel: number) => void;
  private onComplete?: () => void;

  constructor(
    initialPos: number,
    initialVel: number,
    targetPos: number,
    config: SpringConfig,
    onUpdate: (pos: number, vel: number) => void,
    onComplete?: () => void
  ) {
    this.startPos = initialPos;
    this.currentPos = initialPos;
    this.currentVel = initialVel;
    this.targetPos = targetPos;
    this.config = config;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
  }

  public start(): this {
    this.stop();
    this.startTime = performance.now();
    
    // Natural angular frequency omega_0 and damping ratio zeta
    const omega0 = (2 * Math.PI) / Math.max(0.001, this.config.response);
    const zeta = Math.max(0, this.config.dampingRatio);
    const x0 = this.startPos - this.targetPos;
    const v0 = this.currentVel;

    const tick = (now: number) => {
      if (this.startTime === null) return;
      const t = (now - this.startTime) / 1000; // seconds

      let pos = this.targetPos;
      let vel = 0;

      if (Math.abs(zeta - 1.0) < 0.001) {
        // Critically damped (zeta = 1)
        const c1 = x0;
        const c2 = v0 + omega0 * x0;
        const e = Math.exp(-omega0 * t);
        pos = this.targetPos + (c1 + c2 * t) * e;
        vel = (c2 - omega0 * (c1 + c2 * t)) * e;
      } else if (zeta < 1.0) {
        // Underdamped (oscillatory with decay)
        const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
        const e = Math.exp(-zeta * omega0 * t);
        const c1 = x0;
        const c2 = (v0 + zeta * omega0 * x0) / omegaD;
        const cos = Math.cos(omegaD * t);
        const sin = Math.sin(omegaD * t);
        pos = this.targetPos + e * (c1 * cos + c2 * sin);
        vel = e * ((-zeta * omega0 * (c1 * cos + c2 * sin)) + (-c1 * omegaD * sin + c2 * omegaD * cos));
      } else {
        // Overdamped (zeta > 1)
        const alpha = Math.sqrt(zeta * zeta - 1);
        const r1 = -omega0 * (zeta - alpha);
        const r2 = -omega0 * (zeta + alpha);
        const c2 = (v0 - r1 * x0) / (r2 - r1);
        const c1 = x0 - c2;
        pos = this.targetPos + c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
        vel = c1 * r1 * Math.exp(r1 * t) + c2 * r2 * Math.exp(r2 * t);
      }

      this.currentPos = pos;
      this.currentVel = vel;
      this.onUpdate(pos, vel);

      // Check settling threshold
      const isSettled = Math.abs(pos - this.targetPos) < 0.25 && Math.abs(vel) < 5;
      if (isSettled || t > 2.0) {
        this.currentPos = this.targetPos;
        this.currentVel = 0;
        this.onUpdate(this.targetPos, 0);
        this.stop();
        if (this.onComplete) this.onComplete();
        return;
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
    return this;
  }

  public stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  public getCurrentPosition(): number {
    return this.currentPos;
  }

  public getCurrentVelocity(): number {
    return this.currentVel;
  }
}

/**
 * Velocity Tracker for Apple-grade Direct Manipulation
 * Computes a weighted moving average velocity over the last ~100ms
 */
export class VelocityTracker {
  private samples: Array<{ t: number; y: number }> = [];
  private maxSamples = 8;

  public reset(initialY: number): void {
    this.samples = [{ t: performance.now(), y: initialY }];
  }

  public addSample(y: number): void {
    const now = performance.now();
    this.samples.push({ t: now, y });
    // Keep only samples from last 100ms
    while (this.samples.length > 2 && now - this.samples[0].t > 120) {
      this.samples.shift();
    }
    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
  }

  public getVelocity(): number {
    if (this.samples.length < 2) return 0;
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = (last.t - first.t) / 1000; // in seconds
    if (dt <= 0.001) return 0;
    return (last.y - first.y) / dt; // px/sec
  }
}
