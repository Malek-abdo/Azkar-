/**
 * خدمة صفحات المصحف الشريف - مصحف المدينة النبوية (604 صفحة)
 * يوفر نظام القراءة كصفحات متصلة تحاكي المصحف الورقي الشريف
 * المصدر المعتمد: مصحف المدينة برواية حفص عن عاصم عبر Tanzil ومجمع الملك فهد
 */

import { SURAH_LIST } from '../data/quranData.ts';

export interface MushafAyah {
  numberInQuran: number;
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
  surahNumber: number;
  surahName: string;
}

export interface MushafPageSurahHeader {
  number: number;
  name: string;
  revelationTypeArabic: string;
  numberOfAyahs: number;
  startAyahNumber: number;
}

export interface MushafPageData {
  pageNumber: number;
  juzNumber: number;
  hizbQuarter?: number;
  surahsInPage: MushafPageSurahHeader[];
  ayahs: MushafAyah[];
}

export const SURAH_START_PAGE: Record<number, number> = {
  1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 10: 208,
  11: 221, 12: 235, 13: 249, 14: 255, 15: 262, 16: 267, 17: 282, 18: 293, 19: 305, 20: 312,
  21: 322, 22: 332, 23: 342, 24: 350, 25: 359, 26: 367, 27: 377, 28: 385, 29: 396, 30: 404,
  31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 446, 38: 453, 39: 458, 40: 467,
  41: 477, 42: 483, 43: 489, 44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518,
  51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 59: 545, 60: 549,
  61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 66: 560, 67: 562, 68: 564, 69: 566, 70: 568,
  71: 570, 72: 572, 73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 80: 585,
  81: 586, 82: 587, 83: 587, 84: 589, 85: 590, 86: 591, 87: 591, 88: 592, 89: 593, 90: 594,
  91: 595, 92: 595, 93: 596, 94: 596, 95: 597, 96: 597, 97: 598, 98: 598, 99: 599, 100: 599,
  101: 600, 102: 600, 103: 601, 104: 601, 105: 601, 106: 602, 107: 602, 108: 602, 109: 603,
  110: 603, 111: 603, 112: 604, 113: 604, 114: 604
};

export const JUZ_NAMES: Record<number, string> = {
  1: "الجزء الأول", 2: "الجزء الثاني", 3: "الجزء الثالث", 4: "الجزء الرابع",
  5: "الجزء الخامس", 6: "الجزء السادس", 7: "الجزء السابع", 8: "الجزء الثامن",
  9: "الجزء التاسع", 10: "الجزء العاشر", 11: "الجزء الحادي عشر", 12: "الجزء الثاني عشر",
  13: "الجزء الثالث عشر", 14: "الجزء الرابع عشر", 15: "الجزء الخامس عشر", 16: "الجزء السادس عشر",
  17: "الجزء السابع عشر", 18: "الجزء الثامن عشر", 19: "الجزء التاسع عشر", 20: "الجزء العشرون",
  21: "الجزء الحادي والعشرون", 22: "الجزء الثاني والعشرون", 23: "الجزء الثالث والعشرون",
  24: "الجزء الرابع والعشرون", 25: "الجزء الخامس والعشرون", 26: "الجزء السادس والعشرون",
  27: "الجزء السابع والعشرون", 28: "الجزء الثامن والعشرون", 29: "الجزء التاسع والعشرون (تبارك)",
  30: "الجزء الثلاثون (عمّ)"
};

/** تحويل الأرقام إلى الأرقام المشرقية العربية المستخدمة في المصحف الشريف */
export function toArabicNumerals(num: number | string): string {
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, d => digits[parseInt(d, 10)]);
}

/** البيانات الاحتياطية لصفحات أساسية في حال عدم توفر اتصال بالإنترنت */
const BUNDLED_PAGES: Record<number, MushafPageData> = {
  // صفحة 1: الفاتحة
  1: {
    pageNumber: 1,
    juzNumber: 1,
    surahsInPage: [
      { number: 1, name: "الفاتحة", revelationTypeArabic: "مكية", numberOfAyahs: 7, startAyahNumber: 1 }
    ],
    ayahs: [
      { numberInQuran: 1, numberInSurah: 1, text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", juz: 1, page: 1, surahNumber: 1, surahName: "الفاتحة" },
      { numberInQuran: 2, numberInSurah: 2, text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", juz: 1, page: 1, surahNumber: 1, surahName: "الفاتحة" },
      { numberInQuran: 3, numberInSurah: 3, text: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", juz: 1, page: 1, surahNumber: 1, surahName: "الفاتحة" },
      { numberInQuran: 4, numberInSurah: 4, text: "مَٰلِكِ يَوْمِ ٱلدِّينِ", juz: 1, page: 1, surahNumber: 1, surahName: "الفاتحة" },
      { numberInQuran: 5, numberInSurah: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", juz: 1, page: 1, surahNumber: 1, surahName: "الفاتحة" },
      { numberInQuran: 6, numberInSurah: 6, text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", juz: 1, page: 1, surahNumber: 1, surahName: "الفاتحة" },
      { numberInQuran: 7, numberInSurah: 7, text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", juz: 1, page: 1, surahNumber: 1, surahName: "الفاتحة" }
    ]
  },
  // صفحة 2: أول البقرة
  2: {
    pageNumber: 2,
    juzNumber: 1,
    surahsInPage: [
      { number: 2, name: "البقرة", revelationTypeArabic: "مدنية", numberOfAyahs: 286, startAyahNumber: 1 }
    ],
    ayahs: [
      { numberInQuran: 8, numberInSurah: 1, text: "الٓمٓ", juz: 1, page: 2, surahNumber: 2, surahName: "البقرة" },
      { numberInQuran: 9, numberInSurah: 2, text: "ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", juz: 1, page: 2, surahNumber: 2, surahName: "البقرة" },
      { numberInQuran: 10, numberInSurah: 3, text: "ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَٰهُمْ يُنفِقُونَ", juz: 1, page: 2, surahNumber: 2, surahName: "البقرة" },
      { numberInQuran: 11, numberInSurah: 4, text: "وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْـَٔاخِرَةِ هُمْ يُوقِنُونَ", juz: 1, page: 2, surahNumber: 2, surahName: "البقرة" },
      { numberInQuran: 12, numberInSurah: 5, text: "أُو۟لَٰٓئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُو۟لَٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ", juz: 1, page: 2, surahNumber: 2, surahName: "البقرة" }
    ]
  },
  // صفحة 604: الإخلاص، الفلق، الناس
  604: {
    pageNumber: 604,
    juzNumber: 30,
    surahsInPage: [
      { number: 112, name: "الإخلاص", revelationTypeArabic: "مكية", numberOfAyahs: 4, startAyahNumber: 1 },
      { number: 113, name: "الفلق", revelationTypeArabic: "مكية", numberOfAyahs: 5, startAyahNumber: 1 },
      { number: 114, name: "الناس", revelationTypeArabic: "مكية", numberOfAyahs: 6, startAyahNumber: 1 }
    ],
    ayahs: [
      // الإخلاص
      { numberInQuran: 6222, numberInSurah: 1, text: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", juz: 30, page: 604, surahNumber: 112, surahName: "الإخلاص" },
      { numberInQuran: 6223, numberInSurah: 2, text: "ٱللَّهُ ٱلصَّمَدُ", juz: 30, page: 604, surahNumber: 112, surahName: "الإخلاص" },
      { numberInQuran: 6224, numberInSurah: 3, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", juz: 30, page: 604, surahNumber: 112, surahName: "الإخلاص" },
      { numberInQuran: 6225, numberInSurah: 4, text: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ", juz: 30, page: 604, surahNumber: 112, surahName: "الإخلاص" },
      // الفلق
      { numberInQuran: 6226, numberInSurah: 1, text: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ", juz: 30, page: 604, surahNumber: 113, surahName: "الفلق" },
      { numberInQuran: 6227, numberInSurah: 2, text: "مِن شَرِّ مَا خَلَقَ", juz: 30, page: 604, surahNumber: 113, surahName: "الفلق" },
      { numberInQuran: 6228, numberInSurah: 3, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", juz: 30, page: 604, surahNumber: 113, surahName: "الفلق" },
      { numberInQuran: 6229, numberInSurah: 4, text: "وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلْعُقَدِ", juz: 30, page: 604, surahNumber: 113, surahName: "الفلق" },
      { numberInQuran: 6230, numberInSurah: 5, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", juz: 30, page: 604, surahNumber: 113, surahName: "الفلق" },
      // الناس
      { numberInQuran: 6231, numberInSurah: 1, text: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", juz: 30, page: 604, surahNumber: 114, surahName: "الناس" },
      { numberInQuran: 6232, numberInSurah: 2, text: "مَلِكِ ٱلنَّاسِ", juz: 30, page: 604, surahNumber: 114, surahName: "الناس" },
      { numberInQuran: 6233, numberInSurah: 3, text: "إِلَٰهِ ٱلنَّاسِ", juz: 30, page: 604, surahNumber: 114, surahName: "الناس" },
      { numberInQuran: 6234, numberInSurah: 4, text: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ", juz: 30, page: 604, surahNumber: 114, surahName: "الناس" },
      { numberInQuran: 6235, numberInSurah: 5, text: "ٱلَّذِي يُوَسْوِسُ فِي صُدُورِ ٱلنَّاسِ", juz: 30, page: 604, surahNumber: 114, surahName: "الناس" },
      { numberInQuran: 6236, numberInSurah: 6, text: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", juz: 30, page: 604, surahNumber: 114, surahName: "الناس" }
    ]
  }
};

/**
 * تحميل صفحة كاملة من مصحف المدينة الشريف (1 - 604)
 * مع تخزين محلي دائم في المتصفح لتعمل أوفلاين
 */
export async function loadMushafPage(pageNumber: number): Promise<MushafPageData> {
  const page = Math.max(1, Math.min(604, pageNumber));
  const cacheKey = `zad_mushaf_page_v2_${page}`;

  // 1. فحص التخزين المحلي السريع
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  // 2. استخدام الصفحات المحفوظة مسبقاً إذا كانت متوفرة
  if (BUNDLED_PAGES[page]) {
    return BUNDLED_PAGES[page];
  }

  // 3. جلب بيانات الصفحة من السحابة القرآنية المعتمدة
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/page/${page}/quran-uthmani`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && Array.isArray(data.data.ayahs)) {
        const rawAyahs = data.data.ayahs;
        const juzNumber = rawAyahs[0]?.juz || 1;

        // استخراج السور الموجودة في هذه الصفحة وتحديد أي منها يبدأ في هذه الصفحة
        const surahsMap = new Map<number, MushafPageSurahHeader>();
        
        const ayahs: MushafAyah[] = rawAyahs.map((a: any) => {
          const surahNum = a.surah?.number || 1;
          const meta = SURAH_LIST.find(s => s.number === surahNum);
          const cleanSurahName = meta ? meta.name : (a.surah?.name?.replace('سُورَةُ ', '') || '');

          if (!surahsMap.has(surahNum)) {
            surahsMap.set(surahNum, {
              number: surahNum,
              name: cleanSurahName,
              revelationTypeArabic: meta?.revelationTypeArabic || "مكية",
              numberOfAyahs: meta?.numberOfAyahs || a.surah?.numberOfAyahs || 0,
              startAyahNumber: a.numberInSurah
            });
          }

          // تنظيف البسملة الزائدة من بداية الآية الأولى لغير الفاتحة لتظهر في ترويسة السورة المستقلة
          let verseText = a.text || '';
          if (a.numberInSurah === 1 && surahNum !== 1 && surahNum !== 9) {
            verseText = verseText.replace(/^﻿?بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '').trim();
          }

          return {
            numberInQuran: a.number,
            numberInSurah: a.numberInSurah,
            text: verseText,
            juz: a.juz,
            page: page,
            surahNumber: surahNum,
            surahName: cleanSurahName
          };
        });

        const pageData: MushafPageData = {
          pageNumber: page,
          juzNumber,
          surahsInPage: Array.from(surahsMap.values()),
          ayahs
        };

        // حفظ في التخزين المحلي للاستخدام الدائم بدون إنترنت
        try {
          localStorage.setItem(cacheKey, JSON.stringify(pageData));
        } catch {
          // localStorage might be full
        }

        // جلب استباقي للصفحة التالية والسابقة في الخلفية
        preloadAdjacentPages(page);

        return pageData;
      }
    }
  } catch (err) {
    console.warn(`Could not load page ${page} online:`, err);
  }

  // في حال انقطاع النت وعدم وجود كاش: إرجاع بيانات احتياطية تحافظ على تجربة المستخدم
  return generateFallbackPage(page);
}

/** الجلب الاستباقي في الخلفية لتحسين سرعة تقليب الصفحات */
function preloadAdjacentPages(currentPage: number) {
  setTimeout(() => {
    if (currentPage < 604) {
      const nextKey = `zad_mushaf_page_v2_${currentPage + 1}`;
      if (!localStorage.getItem(nextKey)) {
        fetch(`https://api.alquran.cloud/v1/page/${currentPage + 1}/quran-uthmani`)
          .then(r => r.json())
          .then(d => {
            if (d && d.data) {
              const ayahs = d.data.ayahs.map((a: any) => ({
                numberInQuran: a.number,
                numberInSurah: a.numberInSurah,
                text: (a.numberInSurah === 1 && a.surah.number !== 1 && a.surah.number !== 9)
                  ? a.text.replace(/^﻿?بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, '').trim()
                  : a.text,
                juz: a.juz,
                page: currentPage + 1,
                surahNumber: a.surah.number,
                surahName: a.surah.name?.replace('سُورَةُ ', '')
              }));
              const pageData: MushafPageData = {
                pageNumber: currentPage + 1,
                juzNumber: d.data.ayahs[0]?.juz || 1,
                surahsInPage: [],
                ayahs
              };
              localStorage.setItem(nextKey, JSON.stringify(pageData));
            }
          })
          .catch(() => {});
      }
    }
  }, 800);
}

function generateFallbackPage(pageNumber: number): MushafPageData {
  return {
    pageNumber,
    juzNumber: Math.min(30, Math.ceil(pageNumber / 20)),
    surahsInPage: [{ number: 1, name: "القرآن الكريم", revelationTypeArabic: "مكية", numberOfAyahs: 0, startAyahNumber: 1 }],
    ayahs: [
      {
        numberInQuran: 0,
        numberInSurah: 1,
        text: `صفحة رقم ${pageNumber} من المصحف الشريف. يرجى الاتصال بالإنترنت مرة واحدة لتحميلها وحفظها للعمل بدون إنترنت دائماً.`,
        juz: Math.min(30, Math.ceil(pageNumber / 20)),
        page: pageNumber,
        surahNumber: 1,
        surahName: "القرآن الكريم"
      }
    ]
  };
}
