/**
 * Internationalization (i18n) Module for "أذكار ، Ankara"
 * Supports Arabic (Primary) and English with instant dynamic switching
 */

export type AppLanguage = 'ar' | 'en';

const STORAGE_LANG_KEY = 'zad_app_language';

export const TRANSLATIONS = {
  ar: {
    appName: 'أذكار ، Ankara',
    appSubtitle: 'رفيقك اليومي للقرآن والذكر والعبادة',
    
    // Bottom Nav Tabs
    tabHome: 'الرئيسية',
    tabQuran: 'المصحف',
    tabAdhkar: 'الأذكار',
    tabTasbeeh: 'المسبحة',
    tabMore: 'المزيد',

    // Prayer Names
    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    nextPrayer: 'الصلاة القادمة',
    timeRemaining: 'المتبقي',
    prayerTimes: 'مواقيت الصلاة',

    // Quran
    mushaf: 'المصحف الشريف',
    surahIndex: 'فهرس السور',
    mushafPages: 'صفحات المصحف',
    juz: 'الجزء',
    page: 'صفحة',
    ayah: 'آية',
    ayahs: 'آيات',
    meccan: 'مكية',
    medinan: 'مدنية',
    allSurahs: 'جميع السور',
    searchSurah: 'ابحث عن سورة أو رقم...',
    listenAyah: 'استماع للآية',
    listenSurah: 'استماع للسورة',
    tafseerMuyassar: 'التفسير الميسر',
    englishTranslation: 'الترجمة الإنجليزية',
    selectReciter: 'اختر القارئ',
    prevPage: 'الصفحة السابقة',
    nextPage: 'الصفحة التالية',
    bookmarkPage: 'حفظ الصفحة',
    pageBookmarked: 'تم حفظ الصفحة كعلامة مرجعية',
    openInMushaf: 'فتح في صفحة المصحف',
    jumpToPage: 'انتقال لصفحة',
    fontSize: 'حجم الخط',

    // Adhkar & Tasbeeh
    morningAdhkar: 'أذكار الصباح',
    eveningAdhkar: 'أذكار المساء',
    afterPrayerAdhkar: 'أذكار بعد الصلاة',
    sleepAdhkar: 'أذكار النوم',
    wakeAdhkar: 'أذكار الاستيقاظ',
    quranicDuas: 'أدعية قرآنية',
    propheticDuas: 'أدعية نبوية',
    dailyTarget: 'الهدف اليومي',
    completedToday: 'أنجزت اليوم',
    tapToCount: 'اضغط للعد',
    resetCounter: 'تصفير العداد',
    vibration: 'الاهتزاز التفاعلي',
    soundFx: 'المؤثرات الصوتية',
    shareCard: 'مشاركة كصورة فاخرة',
    shareCardDesc: 'توليد بطاقة مصممة بجودة عالية للمشاركة',
    copyText: 'نسخ النص',
    copiedSuccess: 'تم نسخ النص بنجاح',

    // Modes & Tools
    focusMode: 'وضع الخشوع',
    focusModeDesc: 'قراءة خالية من المشتتات والبطاقات',
    exitFocus: 'خروج من وضع الخشوع',
    kidsMode: 'وضع الأطفال والناشئة',
    kidsModeDesc: 'واجهة مبسطة مع بطاقات كبيرة وأذكار سهلة',
    dailyStats: 'إحصائيات الإنجاز',
    statsOverview: 'ملخص ذكرك وعبادتك',
    streakDays: 'أيام التتابع',
    totalDhikrCount: 'إجمالي التسبيحات',
    todayDhikrCount: 'تسبيحات اليوم',
    weekDhikrCount: 'تسبيحات هذا الأسبوع',

    // Settings
    settings: 'الإعدادات والتفضيلات',
    theme: 'المظهر',
    themeLight: 'فاتح',
    themeDark: 'داكن فاخر',
    themeEmerald: 'زمردي ليلي',
    muadhin: 'صوت الأذان',
    language: 'اللغة',
    langArabic: 'العربية',
    langEnglish: 'English',
    backup: 'النسخ الاحتياطي والمزامنة',
    aboutApp: 'عن التطبيق والمطورين',
    guestMode: 'حساب ضيف (أوفلاين بالكامل)',
    signInSync: 'تسجيل الدخول للمزامنة',
    searchAll: 'بحث شامل في التطبيق...',
    offlineReady: 'يعمل بالكامل بدون إنترنت'
  },
  en: {
    appName: 'Adhkar , Ankara',
    appSubtitle: 'Your Daily Spiritual Companion for Quran & Dhikr',

    // Bottom Nav Tabs
    tabHome: 'Home',
    tabQuran: 'Quran',
    tabAdhkar: 'Adhkar',
    tabTasbeeh: 'Tasbeeh',
    tabMore: 'More',

    // Prayer Names
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    nextPrayer: 'Next Prayer',
    timeRemaining: 'Remaining',
    prayerTimes: 'Prayer Times',

    // Quran
    mushaf: 'Holy Quran',
    surahIndex: 'Surah Index',
    mushafPages: 'Mushaf Pages',
    juz: 'Juz',
    page: 'Page',
    ayah: 'Ayah',
    ayahs: 'Verses',
    meccan: 'Meccan',
    medinan: 'Medinan',
    allSurahs: 'All Surahs',
    searchSurah: 'Search surah or number...',
    listenAyah: 'Listen to Ayah',
    listenSurah: 'Listen to Surah',
    tafseerMuyassar: 'Simplified Tafseer',
    englishTranslation: 'English Translation',
    selectReciter: 'Select Reciter',
    prevPage: 'Previous Page',
    nextPage: 'Next Page',
    bookmarkPage: 'Bookmark Page',
    pageBookmarked: 'Page saved to bookmarks',
    openInMushaf: 'Open in Mushaf',
    jumpToPage: 'Jump to Page',
    fontSize: 'Font Size',

    // Adhkar & Tasbeeh
    morningAdhkar: 'Morning Adhkar',
    eveningAdhkar: 'Evening Adhkar',
    afterPrayerAdhkar: 'After Prayer Adhkar',
    sleepAdhkar: 'Sleeping Adhkar',
    wakeAdhkar: 'Waking Up Adhkar',
    quranicDuas: 'Quranic Supplications',
    propheticDuas: 'Prophetic Duas',
    dailyTarget: 'Daily Target',
    completedToday: 'Completed Today',
    tapToCount: 'Tap to Count',
    resetCounter: 'Reset Counter',
    vibration: 'Haptic Feedback',
    soundFx: 'Sound Effects',
    shareCard: 'Share as Image Card',
    shareCardDesc: 'Generate a luxury high-res image card',
    copyText: 'Copy Text',
    copiedSuccess: 'Copied to clipboard',

    // Modes & Tools
    focusMode: 'Focus Mode',
    focusModeDesc: 'Distraction-free spiritual immersion',
    exitFocus: 'Exit Focus Mode',
    kidsMode: 'Kids & Simple Mode',
    kidsModeDesc: 'Large buttons & simple essential adhkar',
    dailyStats: 'Daily Statistics',
    statsOverview: 'Your Spiritual Growth Summary',
    streakDays: 'Day Streak',
    totalDhikrCount: 'Total Adhkar',
    todayDhikrCount: "Today's Adhkar",
    weekDhikrCount: 'This Week',

    // Settings
    settings: 'Settings & Preferences',
    theme: 'Appearance',
    themeLight: 'Light',
    themeDark: 'Luxury Dark',
    themeEmerald: 'Night Emerald',
    muadhin: 'Muadhin (Adhan Voice)',
    language: 'Language',
    langArabic: 'العربية',
    langEnglish: 'English',
    backup: 'Backup & Sync',
    aboutApp: 'About & Developers',
    guestMode: 'Guest Mode (100% Offline)',
    signInSync: 'Sign In to Sync',
    searchAll: 'Search across the app...',
    offlineReady: 'Fully operational offline'
  }
};

let currentLang: AppLanguage = (localStorage.getItem(STORAGE_LANG_KEY) as AppLanguage) || 'ar';

export function getLanguage(): AppLanguage {
  return currentLang;
}

export function setLanguage(lang: AppLanguage) {
  currentLang = lang;
  localStorage.setItem(STORAGE_LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

export function t(key: keyof typeof TRANSLATIONS['ar']): string {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS['ar'];
  return dict[key] || TRANSLATIONS['ar'][key] || key;
}
