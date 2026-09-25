/**
 * حساب مواقيت الصلاة فلكياً بدقة وفق معيار الهيئة المصرية العامة للمساحة
 * Fajr Angle: 19.5°, Isha Angle: 17.5°
 * يعمل بدون إنترنت 100%، ويدعم التزامن مع Aladhan API عند توفر الشبكة
 */

export interface PrayerTimesResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  hijriDate: string;
  gregorianDate: string;
  nextPrayer: {
    name: string;
    arabicName: string;
    time: string;
    remainingMs: number;
    remainingFormatted: string;
    isTomorrow?: boolean;
  };
}

// Convert degrees to radians
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

// Convert radians to degrees
function radToDeg(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

// Fix angle to 0-360
function fixAngle(a: number): number {
  a = a - 360.0 * Math.floor(a / 360.0);
  return a < 0 ? a + 360.0 : a;
}

// Fix hour to 0-24
function fixHour(h: number): number {
  h = h - 24.0 * Math.floor(h / 24.0);
  return h < 0 ? h + 24.0 : h;
}

// Format fractional hours to HH:MM (12-hour or 24-hour)
export function formatTime24(hours: number): string {
  if (isNaN(hours)) return "--:--";
  hours = fixHour(hours + 0.5 / 60); // round minutes
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Format to Arabic 12-hour (e.g. ٠٤:٣٠ ص)
export function formatTime12Arabic(hours: number): string {
  if (isNaN(hours)) return "--:--";
  hours = fixHour(hours + 0.5 / 60);
  let h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  const isPm = h >= 12;
  h = h % 12;
  if (h === 0) h = 12;
  const suffix = isPm ? "م" : "ص";
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${suffix}`;
}

// Astronomical calculation based on solar position
export function calculateOfflinePrayers(lat: number, lng: number, date: Date = new Date()): PrayerTimesResult {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Julian date
  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + B - 1524.5;
  const d = JD - 2451545.0;

  // Mean anomaly and solar longitude
  const g = fixAngle(357.529 + 0.98560028 * d);
  const q = fixAngle(280.459 + 0.98564736 * d);
  const L = fixAngle(q + 1.915 * Math.sin(degToRad(g)) + 0.020 * Math.sin(degToRad(2 * g)));

  // Obliquity of ecliptic
  const e = 23.439 - 0.00000036 * d;
  const RA = radToDeg(Math.atan2(Math.cos(degToRad(e)) * Math.sin(degToRad(L)), Math.cos(degToRad(L)))) / 15.0;
  const declination = radToDeg(Math.asin(Math.sin(degToRad(e)) * Math.sin(degToRad(L))));

  // Equation of time (hours)
  const EqT = q / 15.0 - fixHour(RA);

  // Approximate timezone offset
  const timezoneOffset = -date.getTimezoneOffset() / 60.0;

  // Dhuhr time
  const dhuhrTime = fixHour(12 + timezoneOffset - lng / 15.0 - EqT);

  // Helper for angle times
  function sunAltitudeAngleTime(angle: number, direction: 'morning' | 'evening'): number {
    const latRad = degToRad(lat);
    const decRad = degToRad(declination);
    const angRad = degToRad(angle);

    const cosH = (Math.sin(angRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosH > 1 || cosH < -1) return NaN;

    const H = radToDeg(Math.acos(cosH)) / 15.0;
    return direction === 'morning' ? dhuhrTime - H : dhuhrTime + H;
  }

  // Egyptian General Authority: Fajr = -19.5, Isha = -17.5
  const fajrTime = sunAltitudeAngleTime(-19.5, 'morning');
  const sunriseTime = sunAltitudeAngleTime(-0.833, 'morning');
  const maghribTime = sunAltitudeAngleTime(-0.833, 'evening');
  const ishaTime = sunAltitudeAngleTime(-17.5, 'evening');

  // Asr (Shafi'i: shadow length = 1 + noon shadow)
  const latDecDiff = Math.abs(lat - declination);
  const noonShadow = Math.tan(degToRad(latDecDiff));
  const asrAngleRad = Math.atan(1 / (1 + noonShadow));
  const asrAngle = radToDeg(asrAngleRad);
  const asrTime = sunAltitudeAngleTime(asrAngle, 'evening');

  // Calculate Next Prayer
  const prayerList = [
    { key: "fajr", name: "الفجر", hours: fajrTime },
    { key: "sunrise", name: "الشروق", hours: sunriseTime },
    { key: "dhuhr", name: "الظهر", hours: dhuhrTime },
    { key: "asr", name: "العصر", hours: asrTime },
    { key: "maghrib", name: "المغرب", hours: maghribTime },
    { key: "isha", name: "العشاء", hours: ishaTime }
  ];

  const nowHours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  
  let next = prayerList.find(p => p.hours > nowHours);
  let remainingHours = 0;
  let isTomorrow = false;

  if (next) {
    remainingHours = next.hours - nowHours;
  } else {
    // Next is tomorrow's Fajr
    next = prayerList[0];
    remainingHours = (24 - nowHours) + fajrTime;
    isTomorrow = true;
  }

  const remainingMs = Math.max(0, Math.floor(remainingHours * 3600 * 1000));
  const remH = Math.floor(remainingMs / (1000 * 60 * 60));
  const remM = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const remS = Math.floor((remainingMs % (1000 * 60)) / 1000);
  const remainingFormatted = `${remH} س و ${remM} د و ${remS} ث`;

  // Gregorian date in Arabic
  const gregorianFormatter = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const gregorianDate = gregorianFormatter.format(date);

  // Hijri date in Arabic
  let hijriDate = "";
  try {
    const hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    hijriDate = hijriFormatter.format(date);
  } catch {
    hijriDate = "التقويم الهجري";
  }

  return {
    fajr: formatTime12Arabic(fajrTime),
    sunrise: formatTime12Arabic(sunriseTime),
    dhuhr: formatTime12Arabic(dhuhrTime),
    asr: formatTime12Arabic(asrTime),
    maghrib: formatTime12Arabic(maghribTime),
    isha: formatTime12Arabic(ishaTime),
    hijriDate,
    gregorianDate,
    nextPrayer: {
      name: next.key,
      arabicName: next.name,
      time: formatTime12Arabic(next.hours),
      remainingMs,
      remainingFormatted,
      isTomorrow
    }
  };
}
