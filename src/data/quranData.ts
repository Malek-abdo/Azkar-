/**
 * بيانات سور القرآن الكريم الـ 114 المعتمدة
 * مصدر النص القرآني المعتمد: تنزيل Tanzil.net ومصحف المدينة النبوية برواية حفص عن عاصم
 * https://tanzil.net/
 */

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
  revelationTypeArabic: "مكية" | "مدنية";
  juz: number;
  startPage?: number;
}

export interface AyahItem {
  numberInSurah: number;
  numberInQuran: number;
  text: string;
  juz: number;
}

export const SURAH_LIST: SurahMeta[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", numberOfAyahs: 7, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 1 },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", numberOfAyahs: 286, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 1 },
  { number: 3, name: "آل عمران", englishName: "Aal-E-Imran", numberOfAyahs: 200, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 3 },
  { number: 4, name: "النساء", englishName: "An-Nisa", numberOfAyahs: 176, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 4 },
  { number: 5, name: "المائدة", englishName: "Al-Ma'idah", numberOfAyahs: 120, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 6 },
  { number: 6, name: "الأنعام", englishName: "Al-An'am", numberOfAyahs: 165, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 7 },
  { number: 7, name: "الأعراف", englishName: "Al-A'raf", numberOfAyahs: 206, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 8 },
  { number: 8, name: "الأنفال", englishName: "Al-Anfal", numberOfAyahs: 75, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 9 },
  { number: 9, name: "التوبة", englishName: "At-Tawbah", numberOfAyahs: 129, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 10 },
  { number: 10, name: "يونس", englishName: "Yunus", numberOfAyahs: 109, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 11 },
  { number: 11, name: "هود", englishName: "Hud", numberOfAyahs: 123, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 11 },
  { number: 12, name: "يوسف", englishName: "Yusuf", numberOfAyahs: 111, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 12 },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", numberOfAyahs: 43, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 13 },
  { number: 14, name: "إبراهيم", englishName: "Ibrahim", numberOfAyahs: 52, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 13 },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", numberOfAyahs: 99, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 14 },
  { number: 16, name: "النحل", englishName: "An-Nahl", numberOfAyahs: 128, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 14 },
  { number: 17, name: "الإسراء", englishName: "Al-Isra", numberOfAyahs: 111, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 15 },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", numberOfAyahs: 110, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 15 },
  { number: 19, name: "مريم", englishName: "Maryam", numberOfAyahs: 98, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 16 },
  { number: 20, name: "طه", englishName: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 16 },
  { number: 21, name: "الأنبياء", englishName: "Al-Anbiya", numberOfAyahs: 112, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 17 },
  { number: 22, name: "الحج", englishName: "Al-Hajj", numberOfAyahs: 78, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 17 },
  { number: 23, name: "المؤمنون", englishName: "Al-Mu'minoon", numberOfAyahs: 118, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 18 },
  { number: 24, name: "النور", englishName: "An-Noor", numberOfAyahs: 64, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 18 },
  { number: 25, name: "الفرقان", englishName: "Al-Furqan", numberOfAyahs: 77, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 18 },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", numberOfAyahs: 227, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 19 },
  { number: 27, name: "النمل", englishName: "An-Naml", numberOfAyahs: 93, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 19 },
  { number: 28, name: "القصص", englishName: "Al-Qasas", numberOfAyahs: 88, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 20 },
  { number: 29, name: "العنكبوت", englishName: "Al-Ankaboot", numberOfAyahs: 69, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 20 },
  { number: 30, name: "الروم", englishName: "Ar-Room", numberOfAyahs: 60, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 21 },
  { number: 31, name: "لقمان", englishName: "Luqman", numberOfAyahs: 34, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 21 },
  { number: 32, name: "السجدة", englishName: "As-Sajdah", numberOfAyahs: 30, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 21 },
  { number: 33, name: "الأحزاب", englishName: "Al-Ahzab", numberOfAyahs: 73, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 21 },
  { number: 34, name: "سبأ", englishName: "Saba", numberOfAyahs: 54, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 22 },
  { number: 35, name: "فاطر", englishName: "Fatir", numberOfAyahs: 45, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 22 },
  { number: 36, name: "يس", englishName: "Ya-Seen", numberOfAyahs: 83, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 22 },
  { number: 37, name: "الصافات", englishName: "As-Saaffat", numberOfAyahs: 182, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 23 },
  { number: 38, name: "ص", englishName: "Saad", numberOfAyahs: 88, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 23 },
  { number: 39, name: "الزمر", englishName: "Az-Zumar", numberOfAyahs: 75, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 23 },
  { number: 40, name: "غافر", englishName: "Ghafir", numberOfAyahs: 85, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 24 },
  { number: 41, name: "فصلت", englishName: "Fussilat", numberOfAyahs: 54, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 24 },
  { number: 42, name: "الشورى", englishName: "Ash-Shura", numberOfAyahs: 53, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 25 },
  { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", numberOfAyahs: 89, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 25 },
  { number: 44, name: "الدخان", englishName: "Ad-Dukhan", numberOfAyahs: 59, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 25 },
  { number: 45, name: "الجاثية", englishName: "Al-Jathiyah", numberOfAyahs: 37, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 25 },
  { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", numberOfAyahs: 35, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 26 },
  { number: 47, name: "محمد", englishName: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 26 },
  { number: 48, name: "الفتح", englishName: "Al-Fath", numberOfAyahs: 29, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 26 },
  { number: 49, name: "الحجرات", englishName: "Al-Hujurat", numberOfAyahs: 18, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 26 },
  { number: 50, name: "ق", englishName: "Qaf", numberOfAyahs: 45, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 26 },
  { number: 51, name: "الذاريات", englishName: "Adh-Dhariyat", numberOfAyahs: 60, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 26 },
  { number: 52, name: "الطور", englishName: "At-Toor", numberOfAyahs: 49, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 27 },
  { number: 53, name: "النجم", englishName: "An-Najm", numberOfAyahs: 62, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 27 },
  { number: 54, name: "القمر", englishName: "Al-Qamar", numberOfAyahs: 55, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 27 },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", numberOfAyahs: 78, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 27 },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", numberOfAyahs: 96, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 27 },
  { number: 57, name: "الحديد", englishName: "Al-Hadid", numberOfAyahs: 29, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 27 },
  { number: 58, name: "المجادلة", englishName: "Al-Mujadila", numberOfAyahs: 22, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 28 },
  { number: 59, name: "الحشر", englishName: "Al-Hashr", numberOfAyahs: 24, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 28 },
  { number: 60, name: "الممتحنة", englishName: "Al-Mumtahanah", numberOfAyahs: 13, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 28 },
  { number: 61, name: "الصف", englishName: "As-Saff", numberOfAyahs: 14, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 28 },
  { number: 62, name: "الجمعة", englishName: "Al-Jumu'ah", numberOfAyahs: 11, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 28 },
  { number: 63, name: "المنافقون", englishName: "Al-Munafiqoon", numberOfAyahs: 11, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 28 },
  { number: 64, name: "التغابن", englishName: "At-Taghabun", numberOfAyahs: 18, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 28 },
  { number: 65, name: "الطلاق", englishName: "At-Talaq", numberOfAyahs: 12, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 28 },
  { number: 66, name: "التحريم", englishName: "At-Tahrim", numberOfAyahs: 12, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 28 },
  { number: 67, name: "الملك", englishName: "Al-Mulk", numberOfAyahs: 30, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 29 },
  { number: 68, name: "القلم", englishName: "Al-Qalam", numberOfAyahs: 52, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 29 },
  { number: 69, name: "الحاقة", englishName: "Al-Haaqqah", numberOfAyahs: 52, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 29 },
  { number: 70, name: "المعارج", englishName: "Al-Ma'arij", numberOfAyahs: 44, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 29 },
  { number: 71, name: "نوح", englishName: "Nooh", numberOfAyahs: 28, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 29 },
  { number: 72, name: "الجن", englishName: "Al-Jinn", numberOfAyahs: 28, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 29 },
  { number: 73, name: "المزمل", englishName: "Al-Muzzammil", numberOfAyahs: 20, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 29 },
  { number: 74, name: "المدثر", englishName: "Al-Muddaththir", numberOfAyahs: 56, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 29 },
  { number: 75, name: "القيامة", englishName: "Al-Qiyamah", numberOfAyahs: 40, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 29 },
  { number: 76, name: "الإنسان", englishName: "Al-Insan", numberOfAyahs: 31, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 29 },
  { number: 77, name: "المرسلات", englishName: "Al-Mursalat", numberOfAyahs: 50, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 29 },
  { number: 78, name: "النبأ", englishName: "An-Naba", numberOfAyahs: 40, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 79, name: "النازعات", englishName: "An-Nazi'at", numberOfAyahs: 46, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 80, name: "عبس", englishName: "Abasa", numberOfAyahs: 42, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 81, name: "التكوير", englishName: "At-Takwir", numberOfAyahs: 29, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 82, name: "الانفطار", englishName: "Al-Infitar", numberOfAyahs: 19, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", numberOfAyahs: 36, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 84, name: "الانشقاق", englishName: "Al-Inshiqaq", numberOfAyahs: 25, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 85, name: "البروج", englishName: "Al-Burooj", numberOfAyahs: 22, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 86, name: "الطارق", englishName: "At-Tariq", numberOfAyahs: 17, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 87, name: "الأعلى", englishName: "Al-A'la", numberOfAyahs: 19, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 88, name: "الغاشية", englishName: "Al-Ghashiyah", numberOfAyahs: 26, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 89, name: "الفجر", englishName: "Al-Fajr", numberOfAyahs: 30, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 90, name: "البلد", englishName: "Al-Balad", numberOfAyahs: 20, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 91, name: "الشمس", englishName: "Ash-Shams", numberOfAyahs: 15, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 92, name: "الليل", englishName: "Al-Layl", numberOfAyahs: 21, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 93, name: "الضحى", englishName: "Ad-Duha", numberOfAyahs: 11, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", numberOfAyahs: 8, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 95, name: "التين", englishName: "At-Tin", numberOfAyahs: 8, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 96, name: "العلق", englishName: "Al-Alaq", numberOfAyahs: 19, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 97, name: "القدر", englishName: "Al-Qadr", numberOfAyahs: 5, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 98, name: "البينة", englishName: "Al-Bayyinah", numberOfAyahs: 8, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 30 },
  { number: 99, name: "الزلزلة", englishName: "Az-Zalzalah", numberOfAyahs: 8, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 30 },
  { number: 100, name: "العاديات", englishName: "Al-Adiyat", numberOfAyahs: 11, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 101, name: "القارعة", englishName: "Al-Qari'ah", numberOfAyahs: 11, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 102, name: "التكاثر", englishName: "At-Takathur", numberOfAyahs: 8, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 103, name: "العصر", englishName: "Al-Asr", numberOfAyahs: 3, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 104, name: "الهمزة", englishName: "Al-Humazah", numberOfAyahs: 9, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 105, name: "الفيل", englishName: "Al-Feel", numberOfAyahs: 5, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 106, name: "قريش", englishName: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 107, name: "الماعون", englishName: "Al-Ma'oon", numberOfAyahs: 7, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", numberOfAyahs: 3, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 109, name: "الكافرون", englishName: "Al-Kafiroon", numberOfAyahs: 6, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 110, name: "النصر", englishName: "An-Nasr", numberOfAyahs: 3, revelationType: "Medinan", revelationTypeArabic: "مدنية", juz: 30 },
  { number: 111, name: "المسد", englishName: "Al-Masad", numberOfAyahs: 5, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", numberOfAyahs: 4, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", numberOfAyahs: 5, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 },
  { number: 114, name: "الناس", englishName: "An-Nas", numberOfAyahs: 6, revelationType: "Meccan", revelationTypeArabic: "مكية", juz: 30 }
];

// Authentic Uthmani Verses for primary and daily Surahs (from Tanzil.net)
export const BUNDLED_SURAHS: Record<number, AyahItem[]> = {
  // الفاتحة
  1: [
    { numberInSurah: 1, numberInQuran: 1, text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", juz: 1 },
    { numberInSurah: 2, numberInQuran: 2, text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", juz: 1 },
    { numberInSurah: 3, numberInQuran: 3, text: "الرَّحْمَٰنِ الرَّحِيمِ", juz: 1 },
    { numberInSurah: 4, numberInQuran: 4, text: "مَالِكِ يَوْمِ الدِّينِ", juz: 1 },
    { numberInSurah: 5, numberInQuran: 5, text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", juz: 1 },
    { numberInSurah: 6, numberInQuran: 6, text: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", juz: 1 },
    { numberInSurah: 7, numberInQuran: 7, text: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", juz: 1 }
  ],
  // الإخلاص
  112: [
    { numberInSurah: 1, numberInQuran: 6222, text: "قُلْ هُوَ اللَّهُ أَحَدٌ", juz: 30 },
    { numberInSurah: 2, numberInQuran: 6223, text: "اللَّهُ الصَّمَدُ", juz: 30 },
    { numberInSurah: 3, numberInQuran: 6224, text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", juz: 30 },
    { numberInSurah: 4, numberInQuran: 6225, text: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", juz: 30 }
  ],
  // الفلق
  113: [
    { numberInSurah: 1, numberInQuran: 6226, text: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", juz: 30 },
    { numberInSurah: 2, numberInQuran: 6227, text: "مِن شَرِّ مَا خَلَقَ", juz: 30 },
    { numberInSurah: 3, numberInQuran: 6228, text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", juz: 30 },
    { numberInSurah: 4, numberInQuran: 6229, text: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", juz: 30 },
    { numberInSurah: 5, numberInQuran: 6230, text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", juz: 30 }
  ],
  // الناس
  114: [
    { numberInSurah: 1, numberInQuran: 6231, text: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", juz: 30 },
    { numberInSurah: 2, numberInQuran: 6232, text: "مَلِكِ النَّاسِ", juz: 30 },
    { numberInSurah: 3, numberInQuran: 6233, text: "إِلَٰهِ النَّاسِ", juz: 30 },
    { numberInSurah: 4, numberInQuran: 6234, text: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", juz: 30 },
    { numberInSurah: 5, numberInQuran: 6235, text: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", juz: 30 },
    { numberInSurah: 6, numberInQuran: 6236, text: "مِنَ الْجِنَّةِ وَالنَّاسِ", juz: 30 }
  ],
  // الكوثر
  108: [
    { numberInSurah: 1, numberInQuran: 6205, text: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", juz: 30 },
    { numberInSurah: 2, numberInQuran: 6206, text: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", juz: 30 },
    { numberInSurah: 3, numberInQuran: 6207, text: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", juz: 30 }
  ],
  // العصر
  103: [
    { numberInSurah: 1, numberInQuran: 6177, text: "وَالْعَصْرِ", juz: 30 },
    { numberInSurah: 2, numberInQuran: 6178, text: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", juz: 30 },
    { numberInSurah: 3, numberInQuran: 6179, text: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", juz: 30 }
  ],
  // النصر
  110: [
    { numberInSurah: 1, numberInQuran: 6214, text: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", juz: 30 },
    { numberInSurah: 2, numberInQuran: 6215, text: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", juz: 30 },
    { numberInSurah: 3, numberInQuran: 6216, text: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا", juz: 30 }
  ],
  // الكافرون
  109: [
    { numberInSurah: 1, numberInQuran: 6208, text: "قُلْ يَا أَيُّهَا الْكَافِرُونَ", juz: 30 },
    { numberInSurah: 2, numberInQuran: 6209, text: "لَا أَعْبُدُ مَا تَعْبُدُونَ", juz: 30 },
    { numberInSurah: 3, numberInQuran: 6210, text: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", juz: 30 },
    { numberInSurah: 4, numberInQuran: 6211, text: "وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ", juz: 30 },
    { numberInSurah: 5, numberInQuran: 6212, text: "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ", juz: 30 },
    { numberInSurah: 6, numberInQuran: 6213, text: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ", juz: 30 }
  ],
  // الملك
  67: [
    { numberInSurah: 1, numberInQuran: 5242, text: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ", juz: 29 },
    { numberInSurah: 2, numberInQuran: 5243, text: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ", juz: 29 },
    { numberInSurah: 3, numberInQuran: 5244, text: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ", juz: 29 },
    { numberInSurah: 4, numberInQuran: 5245, text: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ", juz: 29 },
    { numberInSurah: 5, numberInQuran: 5246, text: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ", juz: 29 }
  ]
};

// Fetch full surah from verified Quran Cloud (Tanzil text based) and cache locally
export async function loadSurahAyahs(surahNumber: number): Promise<AyahItem[]> {
  // 1. Check local storage cache
  const cacheKey = `zad_quran_surah_${surahNumber}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  // 2. Check bundled
  if (BUNDLED_SURAHS[surahNumber]) {
    return BUNDLED_SURAHS[surahNumber];
  }

  // 3. Fetch from API (Tanzil Uthmani text)
  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/quran-uthmani`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.data && data.data.ayahs) {
        const ayahs: AyahItem[] = data.data.ayahs.map((a: { numberInSurah: number; number: number; text: string; juz: number }) => ({
          numberInSurah: a.numberInSurah,
          numberInQuran: a.number,
          text: a.text,
          juz: a.juz
        }));
        // Cache in localStorage for permanent offline access
        localStorage.setItem(cacheKey, JSON.stringify(ayahs));
        return ayahs;
      }
    }
  } catch (err) {
    console.warn("Could not fetch remote surah, fallback to bundled if present:", err);
  }

  // Fallback placeholder message if completely offline and not bundled
  return [
    {
      numberInSurah: 1,
      numberInQuran: 1,
      text: "سورة مباركة من كتاب الله عز وجل. يرجى الاتصال بالإنترنت مرة واحدة لتحميل نص السورة بالكامل وحفظه للعمل بدون إنترنت دائماً.",
      juz: 1
    }
  ];
}
