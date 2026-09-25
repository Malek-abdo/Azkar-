/**
 * محرك البحث الشامل في زاد المسلم
 * مع تطبيع الحروف العربية (إزالة التشكيل وتوحيد الألف والياء والتاء المربوطة)
 */

import { SURAH_LIST } from "../data/quranData.ts";
import { ALL_ADHKAR } from "../data/adhkarData.ts";
import { ALL_KHUTBAHS } from "../data/khutbahData.ts";
import { PRAYER_GUIDE_STEPS } from "../data/prayerGuideData.ts";
import { FAITH_DATA } from "../data/faithData.ts";
import { FEAR_HOPE_CONTENT } from "../data/fearHopeData.ts";

export interface SearchResult {
  id: string;
  type: "quran" | "dhikr" | "khutbah" | "prayer_guide" | "faith" | "fear_hope";
  typeLabel: string;
  title: string;
  snippet: string;
  source?: string;
  actionId?: string;
}

// Arabic normalization helper
export function normalizeArabic(text: string): string {
  if (!text) return "";
  return text
    // remove diacritics / tashkeel
    .replace(/[\u064B-\u065F\u0670]/g, "")
    // normalize alifs
    .replace(/[إأآا]/g, "ا")
    // normalize yaa
    .replace(/[ىي]/g, "ي")
    // normalize taa marbuta
    .replace(/ة/g, "ه")
    .toLowerCase()
    .trim();
}

export function performGlobalSearch(query: string): SearchResult[] {
  const normQuery = normalizeArabic(query);
  if (!normQuery || normQuery.length < 2) return [];

  const results: SearchResult[] = [];

  // 1. Search Surahs
  for (const surah of SURAH_LIST) {
    const normName = normalizeArabic(surah.name);
    if (normName.includes(normQuery) || surah.number.toString() === query.trim()) {
      results.push({
        id: `surah_${surah.number}`,
        type: "quran",
        typeLabel: "القرآن الكريم",
        title: `سورة ${surah.name}`,
        snippet: `${surah.revelationTypeArabic} · ${surah.numberOfAyahs} آيات · الجزء ${surah.juz}`,
        source: "تنزيل Tanzil.net",
        actionId: surah.number.toString()
      });
    }
  }

  // 2. Search Adhkar
  for (const dhikr of ALL_ADHKAR) {
    const normText = normalizeArabic(dhikr.text);
    const normCat = normalizeArabic(dhikr.categoryName);
    if (normText.includes(normQuery) || normCat.includes(normQuery)) {
      results.push({
        id: dhikr.id,
        type: "dhikr",
        typeLabel: dhikr.categoryName,
        title: `${dhikr.categoryName} (${dhikr.count} مرات)`,
        snippet: dhikr.text.slice(0, 120) + (dhikr.text.length > 120 ? "..." : ""),
        source: dhikr.source,
        actionId: dhikr.category
      });
    }
  }

  // 3. Search Khutbahs
  for (const kh of ALL_KHUTBAHS) {
    const normTitle = normalizeArabic(kh.title);
    const normContent = normalizeArabic(kh.content);
    if (normTitle.includes(normQuery) || normContent.includes(normQuery)) {
      results.push({
        id: kh.id,
        type: "khutbah",
        typeLabel: "خطب الجمعة",
        title: kh.title,
        snippet: kh.summary || kh.content.slice(0, 120) + "...",
        source: kh.speaker,
        actionId: kh.id
      });
    }
  }

  // 4. Search Prayer Guide
  for (const step of PRAYER_GUIDE_STEPS) {
    const normTitle = normalizeArabic(step.title);
    const normDesc = normalizeArabic(step.description);
    if (normTitle.includes(normQuery) || normDesc.includes(normQuery)) {
      results.push({
        id: `step_${step.stepNumber}`,
        type: "prayer_guide",
        typeLabel: "تعلم الصلاة",
        title: `خطوة ${step.stepNumber}: ${step.title}`,
        snippet: step.description.slice(0, 120) + "...",
        source: step.ruling,
        actionId: step.stepNumber.toString()
      });
    }
  }

  // 5. Search Faith
  for (const pillar of FAITH_DATA.pillars) {
    const normTitle = normalizeArabic(pillar.title);
    const normDef = normalizeArabic(pillar.definition);
    if (normTitle.includes(normQuery) || normDef.includes(normQuery)) {
      results.push({
        id: pillar.id,
        type: "faith",
        typeLabel: "الإيمان بالله",
        title: pillar.title,
        snippet: pillar.definition.slice(0, 120) + "...",
        source: pillar.source,
        actionId: pillar.id
      });
    }
  }

  // 6. Search Fear and Hope
  for (const section of FEAR_HOPE_CONTENT) {
    const normTitle = normalizeArabic(section.title);
    const normContent = normalizeArabic(section.content.join(" "));
    if (normTitle.includes(normQuery) || normContent.includes(normQuery)) {
      results.push({
        id: section.id,
        type: "fear_hope",
        typeLabel: "الخوف والرجاء",
        title: section.title,
        snippet: section.content[0].slice(0, 120) + "...",
        source: section.source,
        actionId: section.id
      });
    }
  }

  return results.slice(0, 30);
}
