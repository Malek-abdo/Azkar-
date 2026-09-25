/**
 * إدارة المفضلة في تطبيق زاد المسلم
 * حفظ الآيات والأذكار والخطب والدروس في localStorage
 */

export interface FavoriteItem {
  id: string;
  type: "ayah" | "dhikr" | "khutbah" | "lesson";
  title: string;
  snippet: string;
  source?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

const STORAGE_KEY = "zad_favorites_list";

export function getFavorites(): FavoriteItem[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

export function isFavorite(id: string): boolean {
  const favs = getFavorites();
  return favs.some(f => f.id === id);
}

export function toggleFavorite(item: Omit<FavoriteItem, "timestamp">): boolean {
  const favs = getFavorites();
  const index = favs.findIndex(f => f.id === item.id);
  if (index >= 0) {
    favs.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    return false; // removed
  } else {
    favs.unshift({ ...item, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    return true; // added
  }
}
