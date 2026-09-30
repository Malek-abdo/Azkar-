/**
 * Profile Management Module
 * Allows users to upload a custom profile image or reset to default, and update their display name.
 * Integrates with Firebase Auth, Local Storage, and per-account memory.
 */

import { CustomAppUser } from '../services/firebase.ts';

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

// Render Profile Management Modal Markup (Clean: Photo Upload + Name Edit only)
export function renderProfileManagementModal(user: CustomAppUser | null, tempPhoto: string | null = null): string {
  const currentPhoto = tempPhoto !== null ? (tempPhoto === '' ? null : tempPhoto) : (user?.photoURL || null);
  const displayName = user?.displayName || 'مستخدم كريم';
  const email = user?.email || 'حساب بدون بريد';

  return `
    <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in select-none" id="profile-management-modal-overlay">
      <div class="bg-surface text-body w-full max-w-md rounded-2xl border border-subtle shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onclick="event.stopPropagation()">
        
        <!-- Header -->
        <div class="px-5 py-4 border-b border-subtle bg-surface-subtle/50 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-sm sm:text-base text-primary">إدارة الملف الشخصي والصورة</h3>
            <p class="text-[11px] text-muted">تخصيص صورتك الشخصية واسم الحساب</p>
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
          
          <!-- Current Avatar Showcase with Direct Upload Button -->
          <div class="flex flex-col items-center justify-center text-center space-y-3 py-2">
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

              <!-- Upload Button Badge Overlay -->
              <label for="profile-avatar-file-input" class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white border-2 border-surface flex items-center justify-center shadow-lg hover:bg-primary-dark transition-transform active:scale-95 cursor-pointer" title="اختيار صورة">
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

          <!-- Upload and Remove Photo Controls -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-secondary">الصورة الشخصية:</label>
            <div class="flex items-center gap-2">
              <label for="profile-avatar-file-input" class="flex-1 py-2.5 px-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
                <svg class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>اختيار صورة من المعرض أو الكاميرا</span>
              </label>
              ${currentPhoto ? `
                <button id="btn-remove-profile-photo" class="px-3 py-2.5 rounded-xl border border-subtle bg-surface-subtle hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 text-xs font-bold transition-colors cursor-pointer shrink-0" title="إزالة الصورة والعودة للافتراضي">
                  إزالة الصورة
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Name Editing Input -->
          <div class="space-y-1.5 pt-1">
            <label for="input-profile-display-name" class="block text-xs font-bold text-secondary">اسم الحساب الظاهر:</label>
            <input 
              type="text" 
              id="input-profile-display-name" 
              value="${displayName}"
              placeholder="اكتب اسمك أو كنيتك المفضلة..." 
              class="w-full bg-surface-subtle border border-subtle rounded-xl px-3.5 py-2.5 text-xs text-primary font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

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
