/**
 * قائمة التقسيم الإداري والمواقع المعتمدة
 * المصدر الإداري الأساسي لمركز أبو كبير: بوابة محافظة الشرقية
 * https://www.sharkia.gov.eg/areas/abo_kbeer/default_t2sem.aspx
 */

export interface LocationItem {
  id: string;
  name: string;
  governorate: string;
  city: string;
  village?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const ABU_KABIR_VILLAGES: string[] = [
  "مدينة أبو كبير (المركز)",
  "بني عياض",
  "سنتريس",
  "جزيرة الشيخ",
  "الرياض",
  "كفر السواقي",
  "طوخ القراموص",
  "منشأة المناسترلي",
  "هربيط",
  "كفر النصيري",
  "الأحراز",
  "كفر هربيط",
  "أبو ياسين",
  "الحصوة",
  "نزلة العارين",
  "الغابة",
  "منزل ميمون",
  "أولاد موسى",
  "الرحمانية",
  "القراموص",
  "الفراشة",
  "الدهتمون",
  "منشأة رضوان",
  "منشأة صدقي",
  "نزلة خيال",
  "العزازية",
  "الحماديين",
  "المشاعلة"
];

// Abu Kabir approximate central coordinates (Lat: 30.7254, Lng: 31.6713)
export const DEFAULT_LOCATION: LocationItem = {
  id: "eg-sharkia-abukabir-center",
  name: "أبو كبير - الشرقية",
  governorate: "الشرقية",
  city: "مركز أبو كبير",
  village: "مدينة أبو كبير",
  latitude: 30.7254,
  longitude: 31.6713,
  timezone: "Africa/Cairo"
};

export const POPULAR_LOCATIONS: LocationItem[] = [
  DEFAULT_LOCATION,
  {
    id: "eg-sharkia-zagazig",
    name: "الزقازيق - الشرقية",
    governorate: "الشرقية",
    city: "الزقازيق",
    latitude: 30.5877,
    longitude: 31.5020,
    timezone: "Africa/Cairo"
  },
  {
    id: "eg-cairo",
    name: "القاهرة - مصر",
    governorate: "القاهرة",
    city: "القاهرة",
    latitude: 30.0444,
    longitude: 31.2357,
    timezone: "Africa/Cairo"
  },
  {
    id: "eg-alex",
    name: "الإسكندرية - مصر",
    governorate: "الإسكندرية",
    city: "الإسكندرية",
    latitude: 31.2001,
    longitude: 29.9187,
    timezone: "Africa/Cairo"
  },
  {
    id: "sa-makkah",
    name: "مكة المكرمة - السعودية",
    governorate: "مكة المكرمة",
    city: "مكة المكرمة",
    latitude: 21.4225,
    longitude: 39.8262,
    timezone: "Asia/Riyadh"
  },
  {
    id: "sa-madinah",
    name: "المدينة المنورة - السعودية",
    governorate: "المدينة المنورة",
    city: "المدينة المنورة",
    latitude: 24.5247,
    longitude: 39.5692,
    timezone: "Asia/Riyadh"
  },
  {
    id: "ps-jerusalem",
    name: "القدس الشريف - فلسطين",
    governorate: "القدس",
    city: "القدس",
    latitude: 31.7683,
    longitude: 35.2137,
    timezone: "Asia/Jerusalem"
  },
  {
    id: "tr-ankara",
    name: "أنقرة (Ankara) - تركيا",
    governorate: "Ankara",
    city: "أنقرة",
    latitude: 39.9334,
    longitude: 32.8597,
    timezone: "Europe/Istanbul"
  }
];

export const EGYPT_GOVERNORATES = [
  "الشرقية",
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "الغربية",
  "القليوبية",
  "المنوفية",
  "البحيرة",
  "كفر الشيخ",
  "دمياط",
  "بورسعيد",
  "الإسماعيلية",
  "السويس",
  "شمال سيناء",
  "جنوب سيناء",
  "بني سويف",
  "الفيوم",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "الوادي الجديد",
  "مطروح"
];
