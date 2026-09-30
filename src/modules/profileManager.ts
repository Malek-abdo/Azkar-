/**
 * Profile Management Module
 * Allows users to upload a custom profile image or choose from a gallery of curated Islamic presets.
 * Integrates with Firebase Auth, Local Storage, and per-account memory.
 */

import { CustomAppUser } from '../services/firebase.ts';

export interface AvatarPreset {
  id: string;
  name: string;
  category: 'islamic' | 'geometric' | 'minimal';
  svgDataUri: string;
}

// Curated Crisp Islamic & Minimalist Vector Avatars
export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'preset_crescent_gold',
    name: 'هلال الذهب الملكي',
    category: 'islamic',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23064E3B"/><stop offset="100%" stop-color="%23022c22"/></linearGradient><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23FFF3D6"/><stop offset="50%" stop-color="%23D4AF37"/><stop offset="100%" stop-color="%239A7B4F"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(%23g1)"/><circle cx="50" cy="50" r="46" fill="none" stroke="url(%23gold)" stroke-width="1.5" opacity="0.4"/><path d="M54 26C40 26 29 37 29 51C29 65 40 76 54 76C61 76 67 73 72 68C61 68 52 59 52 48C52 38 59 30 69 28C64 26 59 26 54 26Z" fill="url(%23gold)"/><polygon points="68,34 70,38 74,38 71,41 72,45 68,42 64,45 65,41 62,38 66,38" fill="url(%23gold)"/></svg>`
  },
  {
    id: 'preset_rub_el_hizb',
    name: 'نجمة الربع الحزب ۞',
    category: 'islamic',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23043224"/><stop offset="100%" stop-color="%230a4d3c"/></linearGradient><linearGradient id="gold2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23FDF8E8"/><stop offset="50%" stop-color="%23D4AF37"/><stop offset="100%" stop-color="%23B45309"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(%23g2)"/><g transform="translate(50,50)"><rect x="-22" y="-22" width="44" height="44" rx="4" fill="none" stroke="url(%23gold2)" stroke-width="3"/><rect x="-22" y="-22" width="44" height="44" rx="4" transform="rotate(45)" fill="none" stroke="url(%23gold2)" stroke-width="3"/><circle cx="0" cy="0" r="8" fill="url(%23gold2)"/><circle cx="0" cy="0" r="4" fill="%23043224"/></g></svg>`
  },
  {
    id: 'preset_minaret_dawn',
    name: 'مئذنة وقبة المسجد',
    category: 'islamic',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%230f172a"/><stop offset="100%" stop-color="%23064E3B"/></linearGradient><linearGradient id="gold3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23fef08a"/><stop offset="100%" stop-color="%23ca8a04"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(%23sky)"/><circle cx="50" cy="50" r="46" fill="none" stroke="url(%23gold3)" stroke-width="1.5" opacity="0.3"/><path d="M34 75V55C34 45 42 40 50 32C58 40 66 45 66 55V75" fill="none" stroke="url(%23gold3)" stroke-width="2.5"/><path d="M42 75V58C42 54 45 50 50 48C55 50 58 54 58 58V75" fill="url(%23gold3)" fill-opacity="0.35"/><circle cx="50" cy="27" r="2.5" fill="url(%23gold3)"/></svg>`
  },
  {
    id: 'preset_tasbeeh_amber',
    name: 'حبات المسبحة والذكر',
    category: 'islamic',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="bgTas" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></linearGradient><linearGradient id="emeraldGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%2334d399"/><stop offset="100%" stop-color="%23D4AF37"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(%23bgTas)"/><circle cx="50" cy="50" r="28" fill="none" stroke="url(%23emeraldGold)" stroke-width="3" stroke-dasharray="3 7" stroke-linecap="round"/><circle cx="50" cy="22" r="5" fill="%23D4AF37"/><circle cx="50" cy="14" r="2.5" fill="%2334d399"/><path d="M50 78V88M47 88H53" stroke="%23D4AF37" stroke-width="2" stroke-linecap="round"/></svg>`
  },
  {
    id: 'preset_mihrab_serene',
    name: 'قوس المحراب الزمردي',
    category: 'geometric',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="gMih" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23064E3B"/><stop offset="100%" stop-color="%23022c22"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(%23gMih)"/><path d="M30 80V45C30 32 38 20 50 16C62 20 70 32 70 45V80" fill="none" stroke="%23D4AF37" stroke-width="3"/><path d="M38 80V48C38 38 43 30 50 26C57 30 62 38 62 48V80" fill="%23D4AF37" fill-opacity="0.2"/><circle cx="50" cy="46" r="4" fill="%23D4AF37"/></svg>`
  },
  {
    id: 'preset_classic_silhouette',
    name: 'المظهر الكلاسيكي المحايد',
    category: 'minimal',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="gUser" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23334155"/><stop offset="100%" stop-color="%231e293b"/></linearGradient></defs><rect width="100" height="100" rx="50" fill="url(%23gUser)"/><circle cx="50" cy="40" r="16" fill="%2394a3b8"/><path d="M22 84C22 68 34 58 50 58C66 58 78 68 78 84" fill="%2394a3b8"/></svg>`
  }
];

// Compress and crop avatar into lightweight standard Base64 image (<60KB)
export function compressProfileImage(file: File, maxDimension = 256, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('يرجى اختيار ملف صورة صالح (JPG أو PNG أو WebP)'));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context not available'));

          // Square center-crop calculation
          const minSide = Math.min(img.width, img.height);
          const startX = (img.width - minSide) / 2;
          const startY = (img.height - minSide) / 2;

          const targetSize = Math.min(minSide, maxDimension);
          canvas.width = targetSize;
          canvas.height = targetSize;

          ctx.drawImage(
            img,
            startX, startY, minSide, minSide,
            0, 0, targetSize, targetSize
          );

          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('فشل قراءة الصورة المحددة'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('خطأ أثناء تحميل الملف'));
    reader.readAsDataURL(file);
  });
}

// Render Profile Management Modal Markup
export function renderProfileManagementModal(user: CustomAppUser | null, tempPhoto: string | null = null): string {
  const currentPhoto = tempPhoto !== null ? tempPhoto : (user?.photoURL || null);
  const displayName = user?.displayName || 'مستخدم كريم';
  const email = user?.email || 'حساب بدون بريد';

  return `
    <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in select-none" id="profile-management-modal-overlay">
      <div class="bg-surface text-body w-full max-w-md rounded-2xl border border-gold/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onclick="event.stopPropagation()">
        
        <!-- Header -->
        <div class="px-5 py-4 border-b border-subtle bg-surface-subtle/50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-gold text-lg">۞</span>
            <div>
              <h3 class="font-bold text-sm sm:text-base text-primary">إدارة الملف الشخصي والصورة</h3>
              <p class="text-[11px] text-muted">تخصيص صورتك واسم الحساب الظاهر في التطبيق</p>
            </div>
          </div>
          <button 
            id="btn-close-profile-modal" 
            class="w-8 h-8 rounded-full bg-surface-subtle hover:bg-surface border border-subtle flex items-center justify-center text-muted hover:text-primary transition-colors cursor-pointer"
            title="إغلاق"
          >
            ✕
          </button>
        </div>

        <!-- Body Content -->
        <div class="p-5 space-y-5 overflow-y-auto">
          
          <!-- Current Avatar Showcase -->
          <div class="flex flex-col items-center justify-center text-center space-y-3">
            <div class="relative group">
              <div class="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-800 via-primary to-gold shadow-xl flex items-center justify-center overflow-hidden">
                ${currentPhoto ? `
                  <img src="${currentPhoto}" alt="Avatar Preview" id="profile-modal-avatar-preview" class="w-full h-full rounded-full object-cover bg-surface" />
                ` : `
                  <div id="profile-modal-avatar-preview-fallback" class="w-full h-full rounded-full bg-surface-subtle flex items-center justify-center text-muted">
                    <svg class="w-12 h-12 text-secondary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                `}
              </div>

              <!-- Upload Button Overlay -->
              <label for="profile-avatar-file-input" class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white border-2 border-surface flex items-center justify-center shadow-lg hover:bg-primary-dark transition-transform active:scale-95 cursor-pointer" title="رفع صورة من الجهاز">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </label>
              <input type="file" id="profile-avatar-file-input" accept="image/jpeg,image/png,image/webp" class="hidden" />
            </div>

            <div>
              <div class="font-bold text-sm text-primary flex items-center justify-center gap-1.5">
                <span>${displayName}</span>
              </div>
              <div class="text-xs text-muted font-mono">${email}</div>
            </div>
          </div>

          <!-- Option 1: Upload from Device -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-secondary">١. رفع صورة مخصصة من جهازك:</label>
            <div class="flex items-center gap-2">
              <label for="profile-avatar-file-input" class="flex-1 py-2.5 px-3 rounded-xl border border-dashed border-gold/50 bg-gold/5 hover:bg-gold/10 text-primary text-xs font-bold text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
                <svg class="w-4 h-4 text-gold-dark dark:text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>اختيار صورة من المعرض أو الكاميرا</span>
              </label>
              ${currentPhoto ? `
                <button id="btn-remove-profile-photo" class="px-3 py-2.5 rounded-xl border border-subtle bg-surface-subtle hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 text-xs font-bold transition-colors cursor-pointer shrink-0" title="إزالة الصورة والعودة للافتراضي">
                  إزالة
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Option 2: Curated Islamic Presets -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-secondary">٢. أو اختر صورة رمزية إسلامية جاهزة:</label>
            <div class="grid grid-cols-3 gap-2.5">
              ${AVATAR_PRESETS.map(preset => {
                const isSelected = currentPhoto === preset.svgDataUri;
                return `
                  <button 
                    type="button"
                    class="btn-select-avatar-preset p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${isSelected ? 'border-2 border-gold bg-gold/15 shadow-sm scale-102' : 'border-subtle bg-surface-subtle hover:border-gold/40'}"
                    data-preset-uri="${encodeURIComponent(preset.svgDataUri)}"
                    title="${preset.name}"
                  >
                    <div class="w-12 h-12 rounded-full overflow-hidden shadow-xs">
                      <img src="${preset.svgDataUri}" alt="${preset.name}" class="w-full h-full object-cover" />
                    </div>
                    <span class="text-[10px] font-bold text-primary truncate max-w-full">${preset.name}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Name Editing Input -->
          <div class="space-y-1.5">
            <label for="input-profile-display-name" class="block text-xs font-bold text-secondary">اسم الحساب الظاهر:</label>
            <input 
              type="text" 
              id="input-profile-display-name" 
              value="${displayName}"
              placeholder="اكتب اسمك أو كنيتك المفضلة..." 
              class="w-full bg-surface-subtle border border-subtle rounded-xl px-3.5 py-2.5 text-xs text-primary font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div id="profile-modal-status-msg" class="hidden text-xs text-center font-bold p-2 rounded-lg"></div>

        </div>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-subtle bg-surface-subtle/30 flex items-center justify-end gap-2">
          <button 
            id="btn-cancel-profile-modal" 
            class="px-4 py-2 rounded-xl border border-subtle text-xs font-bold text-secondary hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            إلغاء
          </button>
          <button 
            id="btn-save-profile-changes" 
            class="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>حفظ التعديلات</span>
          </button>
        </div>

      </div>
    </div>
  `;
}
