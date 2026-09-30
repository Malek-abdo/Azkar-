/**
 * تطبيق "زاد المسلم" - رفيقك اليومي للقرآن والذكر والعبادة
 * تم صنعه بواسطة: المبرمج مالك عبدالودود وأحمد رضا الشبراوي تحت إشراف الدكتور/الشيخ سعد محفوظ
 */

import './index.css';
import { SpringAnimation, VelocityTracker, appleRubberBand, projectMomentum, APPLE_SPRINGS } from './utils/appleSpring.ts';
import { ICONS } from './utils/icons.ts';
import { ABU_KABIR_VILLAGES, DEFAULT_LOCATION, LocationItem, POPULAR_LOCATIONS, EGYPT_GOVERNORATES } from './data/locationsData.ts';
import { calculateOfflinePrayers, PrayerTimesResult } from './modules/prayerCalculation.ts';
import { ALL_ADHKAR, ADHKAR_CATEGORIES, DhikrItem, getAdhkarCategoryIconSvg } from './data/adhkarData.ts';
import { PRAYER_ADHKAR_LIST } from './data/prayerAdhkarData.ts';
import { SURAH_LIST, loadSurahAyahs, AyahItem, SurahMeta } from './data/quranData.ts';
import { ALL_KHUTBAHS, KHUTBAH_CATEGORIES, KHUTBAH_OFFICIAL_SOURCES, KhutbahItem } from './data/khutbahData.ts';
import { PRAYER_GUIDE_STEPS, PrayerGuideStep } from './data/prayerGuideData.ts';
import { FAITH_DATA } from './data/faithData.ts';
import { FEAR_HOPE_CONTENT, MEDICAL_DISCLAIMER } from './data/fearHopeData.ts';
import { loadTasbeehState, saveTasbeehState, TASBEEH_PRESETS, TARGET_PRESETS, playBeadSound, triggerHapticFeedback, TasbeehState, loadTasbeehStats, recordTasbeehIncrement, DhikrDailyStats } from './modules/tasbeeh.ts';
import { 
  getSubscriptionStatus, 
  activateSubscription, 
  SubscriptionStatus, 
  resetToTrialForTesting, 
  expireTrialForTesting,
  INSTAPAY_NUMBER,
  INSTAPAY_LOCAL_NUMBER,
  INSTAPAY_IPA,
  VODAFONE_CASH_NUMBER,
  VODAFONE_CASH_LOCAL_NUMBER,
  ADMIN_EMAIL,
  SUBSCRIPTION_PRICE_EGP,
  isAdminUser,
  isUserBanned,
  banUser,
  unbanUser,
  grantUserSubscription,
  grantSubscriptionByAdmin,
  revokeUserSubscription,
  revokeSubscriptionByAdmin,
  getPaymentRequests,
  createPaymentRequest,
  submitPaymentRequest,
  approvePaymentRequest,
  rejectPaymentRequest,
  deletePaymentRequest,
  getManagedUsers,
  recordUserSession,
  generateWhatsAppPaymentUrl,
  PaymentRequest,
  ManagedUser
} from './modules/subscription.ts';
import { performGlobalSearch, SearchResult } from './modules/search.ts';
import { getFavorites, toggleFavorite, isFavorite } from './modules/favorites.ts';
import { 
  loadMushafPage, 
  MushafPageData, 
  MushafAyah, 
  SURAH_START_PAGE, 
  JUZ_NAMES, 
  JUZ_LIST,
  toArabicNumerals,
  QURAN_RECITERS,
  getAyahAudioUrl,
  getAyahTafseer,
  getAyahTranslation,
  type QuranReciter,
  type JuzMeta
} from './modules/mushafService.ts';
import { getLanguage, setLanguage, t, type AppLanguage } from './utils/i18n.ts';
import { generateIslamicCard } from './utils/cardGenerator.ts';
import { 
  loadUserMemory, 
  saveUserMemory, 
  getUserStorageKey, 
  type UserAccountMemory 
} from './modules/accountMemory.ts';
import { 
  loginWithGoogle, 
  loginWithEmailPassword,
  registerWithEmailPassword,
  resetUserPassword,
  logoutUser, 
  subscribeToAuth, 
  type CustomAppUser 
} from './services/firebase.ts';
import { 
  loadPrayerAlertsSettings, 
  savePrayerAlertsSettings, 
  toggleIndividualPrayerAlert, 
  updatePrayerConfig, 
  updateMasterPrayerSettings, 
  applySoundToAllPrayers, 
  MUADHIN_OPTIONS, 
  PRAYER_DISPLAY_NAMES, 
  requestNotificationPermission, 
  playPrayerAudio, 
  stopAzanAudio, 
  getIsAzanPlaying, 
  getActiveAlertState,
  checkAndTriggerPrayerAlerts, 
  type PrayerKey, 
  type PrayerAlertsSettings, 
  type AlertTriggerInfo 
} from './modules/prayerAlerts.ts';
import { audioFx } from './modules/audioEffects.ts';
import { uploadReceiptToImageKit } from './modules/imagekit.ts';
import { 
  renderProfileManagementModal, 
  compressProfileImage 
} from './modules/profileManager.ts';
import { unlockAudioEngine } from './modules/prayerAlerts.ts';
import appLogo from './assets/images/islamic_minimal_icon_1790783471439.jpg';

// Certified resilient App Logo URL (uses Vite-bundled asset with static public fallback)
const APP_LOGO_SRC: string = appLogo || '/images/app_logo.jpg';

// State Management
interface AppState {
  currentUser: CustomAppUser | null;
  isAuthLoading: boolean;
  isSigningIn: boolean;
  authTab: 'login' | 'register' | 'forgot';
  showPasswordToggle: boolean;
  authSuccessMessage: string | null;
  authError: string | null;
  authErrorCode: string | null;
  currentTab: 'home' | 'quran' | 'adhkar' | 'tasbeeh' | 'more';
  subView: string | null;
  activeSurah: { meta: SurahMeta; ayahs: AyahItem[] } | null;
  activeKhutbah: KhutbahItem | null;
  activeKhutbahCategory: string;
  activeAdhkarCategory: string;
  selectedLocation: LocationItem;
  theme: 'light' | 'dark';
  quranFontSize: number;
  quranMode: 'mushaf' | 'surahs' | 'juz' | 'embed';
  mushafPageNumber: number;
  mushafPageData: MushafPageData | null;
  isLoadingMushafPage: boolean;
  selectedAyah: MushafAyah | null;
  prayerTimes: PrayerTimesResult;
  prayerAlertsSettings: PrayerAlertsSettings;
  showPrayerAlertModal: boolean;
  showProfileModal: boolean;
  tempProfilePhoto: string | null;
  tempProfileName: string | null;
  activeAzanAlert: AlertTriggerInfo | null;
  testingMuadhinId: string | null;
  isAzanPlaying: boolean;
  tasbeeh: TasbeehState;
  dhikrProgress: Record<string, number>;
  searchQuery: string;
  searchResults: SearchResult[];
  showSearchModal: boolean;
  showLocationModal: boolean;
  showPaywallModal: boolean;
  receiptUploadPreview: string | null;
  viewingReceiptImage: string | null;
  adminUserSearch: string;
  paywallStep: number;
  isFocusMode: boolean;
  kidsMode: boolean;
  homeFilterTab: 'today' | 'adhkar_tasbeeh' | 'sciences' | 'all' | 'quran_dhikr';
  adhkarCardIndex: number;
  adhkarViewMode: 'cards' | 'list';
  prayerGuideStepIndex: number;
  prayerAdhkarStepIndex: number;
  faithCardIndex: number;
  fearHopeCardIndex: number;
  homeDhikrCardIndex: number;
  showStatsModal: boolean;
  surahSearchQuery: string;
  surahFilterType: 'all' | 'Meccan' | 'Medinan';
  language: AppLanguage;
  selectedReciterId: string;
  isAyahAudioPlaying: boolean;
  playingAyahNumber: number | null;
  selectedAyahTafseer: string | null;
  selectedAyahTranslation: string | null;
  activeAyahModalTab: 'audio' | 'tafseer' | 'translation';
  isLoadingAyahDetails: boolean;
  cardPreviewModal: { title: string; text: string; source?: string; imageUrl: string } | null;
}

const STORAGE_LOCATION_KEY = 'zad_user_location';
const STORAGE_THEME_KEY = 'zad_app_theme';
const STORAGE_FONT_SIZE_KEY = 'zad_quran_font_size';
const STORAGE_DHIKR_PROGRESS = 'zad_dhikr_progress';
const STORAGE_COMPASS_SOUND = 'zad_compass_sound';
const STORAGE_KIDS_MODE = 'zad_kids_mode';

function loadInitialLocation(): LocationItem {
  const saved = localStorage.getItem(STORAGE_LOCATION_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return DEFAULT_LOCATION;
}

function loadInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem(STORAGE_THEME_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const state: AppState = {
  currentUser: null,
  isAuthLoading: true,
  isSigningIn: false,
  authTab: 'login',
  showPasswordToggle: false,
  authSuccessMessage: null,
  authError: null,
  authErrorCode: null,
  currentTab: 'home',
  subView: null,
  activeSurah: null,
  activeKhutbah: null,
  activeKhutbahCategory: 'all',
  activeAdhkarCategory: 'morning',
  selectedLocation: loadInitialLocation(),
  theme: loadInitialTheme(),
  quranFontSize: parseInt(localStorage.getItem(STORAGE_FONT_SIZE_KEY) || '24', 10),
  quranMode: 'mushaf',
  mushafPageNumber: parseInt(localStorage.getItem('zad_last_mushaf_page') || '1', 10),
  mushafPageData: null,
  isLoadingMushafPage: false,
  selectedAyah: null,
  prayerTimes: calculateOfflinePrayers(loadInitialLocation().latitude, loadInitialLocation().longitude),
  prayerAlertsSettings: loadPrayerAlertsSettings(),
  showPrayerAlertModal: false,
  showProfileModal: false,
  tempProfilePhoto: null,
  tempProfileName: null,
  activeAzanAlert: null,
  testingMuadhinId: null,
  isAzanPlaying: false,
  tasbeeh: loadTasbeehState(),
  dhikrProgress: JSON.parse(localStorage.getItem(STORAGE_DHIKR_PROGRESS) || '{}'),
  searchQuery: '',
  searchResults: [],
  showSearchModal: false,
  showLocationModal: false,
  showPaywallModal: false,
  receiptUploadPreview: null,
  viewingReceiptImage: null,
  adminUserSearch: '',
  paywallStep: 1,
  isFocusMode: false,
  kidsMode: localStorage.getItem(STORAGE_KIDS_MODE) === 'true',
  homeFilterTab: 'today',
  adhkarCardIndex: 0,
  adhkarViewMode: 'cards',
  prayerGuideStepIndex: 0,
  prayerAdhkarStepIndex: 0,
  faithCardIndex: 0,
  fearHopeCardIndex: 0,
  homeDhikrCardIndex: 0,
  showStatsModal: false,
  surahSearchQuery: '',
  surahFilterType: 'all',
  language: getLanguage(),
  selectedReciterId: localStorage.getItem('zad_selected_reciter') || 'alafasy',
  isAyahAudioPlaying: false,
  playingAyahNumber: null,
  selectedAyahTafseer: null,
  selectedAyahTranslation: null,
  activeAyahModalTab: 'audio',
  isLoadingAyahDetails: false,
  cardPreviewModal: null
};

const PRIMARY_DEV_HOST = 'ais-dev-6dnwiwndtae57cpw3n524i-64176840431.europe-west2.run.app';
const PRIMARY_DEV_URL = `https://${PRIMARY_DEV_HOST}`;

// Check for cross-domain auth payload in URL params
function checkUrlAuthPayload() {
  if (typeof window === 'undefined') return;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const authDataParam = urlParams.get('auth_user');
    if (authDataParam) {
      const decodedUser = JSON.parse(decodeURIComponent(escape(atob(authDataParam))));
      if (decodedUser && decodedUser.uid) {
        localStorage.setItem('zad_local_authenticated_user', JSON.stringify(decodedUser));
        state.currentUser = decodedUser;
        state.isAuthLoading = false;
        // Clean URL search params without reloading
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  } catch (e) {
    console.error('Error parsing auth URL payload:', e);
  }
}

// Post-login redirect handler
export function handlePostLoginRedirect(user: CustomAppUser) {
  state.currentUser = user;
  state.isSigningIn = false;
  state.authError = null;
  state.authErrorCode = null;
  applyUserAccountMemory(user);
  renderApp();
}

checkUrlAuthPayload();

// Global Ayah Audio Player Reference
let currentAyahAudio: HTMLAudioElement | null = null;

// Apply and Restore User Account Memory on Login / State change
export function applyUserAccountMemory(user: CustomAppUser | null) {
  if (!user) return;
  const key = getUserStorageKey(user);
  const mem = loadUserMemory(key);
  if (mem) {
    if (mem.tasbeeh) state.tasbeeh = mem.tasbeeh;
    if (mem.dhikrProgress) state.dhikrProgress = mem.dhikrProgress;
    if (mem.selectedLocation) {
      state.selectedLocation = mem.selectedLocation;
      state.prayerTimes = calculateOfflinePrayers(mem.selectedLocation.latitude, mem.selectedLocation.longitude);
    }
    if (mem.prayerAlertsSettings) state.prayerAlertsSettings = mem.prayerAlertsSettings;
    if (typeof mem.mushafPageNumber === 'number') state.mushafPageNumber = mem.mushafPageNumber;
    if (typeof mem.quranFontSize === 'number') state.quranFontSize = mem.quranFontSize;
    if (mem.theme) {
      state.theme = mem.theme;
      document.documentElement.setAttribute('data-theme', state.theme);
    }
    if (typeof mem.kidsMode === 'boolean') state.kidsMode = mem.kidsMode;
    if (typeof mem.homeDhikrCardIndex === 'number') state.homeDhikrCardIndex = mem.homeDhikrCardIndex;
    if (typeof mem.adhkarCardIndex === 'number') state.adhkarCardIndex = mem.adhkarCardIndex;
    if (typeof mem.prayerGuideStepIndex === 'number') state.prayerGuideStepIndex = mem.prayerGuideStepIndex;
    if (typeof mem.prayerAdhkarStepIndex === 'number') state.prayerAdhkarStepIndex = mem.prayerAdhkarStepIndex;
    if (typeof mem.faithCardIndex === 'number') state.faithCardIndex = mem.faithCardIndex;
    if (typeof mem.fearHopeCardIndex === 'number') state.fearHopeCardIndex = mem.fearHopeCardIndex;
  }
}

// Seamlessly sync account data in background
export function syncCurrentAccountMemory() {
  if (!state.currentUser) return;
  const key = getUserStorageKey(state.currentUser);
  saveUserMemory(key, {
    tasbeeh: state.tasbeeh,
    dhikrProgress: state.dhikrProgress,
    selectedLocation: state.selectedLocation,
    prayerAlertsSettings: state.prayerAlertsSettings,
    mushafPageNumber: state.mushafPageNumber,
    quranFontSize: state.quranFontSize,
    theme: state.theme,
    kidsMode: state.kidsMode,
    homeDhikrCardIndex: state.homeDhikrCardIndex,
    adhkarCardIndex: state.adhkarCardIndex,
    prayerGuideStepIndex: state.prayerGuideStepIndex,
    prayerAdhkarStepIndex: state.prayerAdhkarStepIndex,
    faithCardIndex: state.faithCardIndex,
    fearHopeCardIndex: state.fearHopeCardIndex
  });
}

// Listen to Auth state change with seamless Guest Mode support
subscribeToAuth((user) => {
  if (user) {
    state.currentUser = user;
    applyUserAccountMemory(user);
  } else if (!state.currentUser) {
    const savedLocal = localStorage.getItem('zad_local_authenticated_user');
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        // Clear out legacy fake Malek local session so user undergoes real authentication
        if (parsed && parsed.isLocalSession && parsed.email === 'malek2013vscode@gmail.com') {
          localStorage.removeItem('zad_local_authenticated_user');
          state.currentUser = null;
        } else {
          state.currentUser = parsed;
          applyUserAccountMemory(state.currentUser);
        }
      } catch {
        // ignore
      }
    } else if (localStorage.getItem('zad_guest_mode') === 'true') {
      state.currentUser = {
        uid: 'guest_user',
        email: 'guest@azkar.app',
        displayName: 'زائر كريم',
        photoURL: null,
        isGuest: true
      };
      applyUserAccountMemory(state.currentUser);
    }
  }
  state.isAuthLoading = false;
  state.isSigningIn = false;
  state.authError = null;
  renderApp();
});

// Initialize Theme
document.documentElement.setAttribute('data-theme', state.theme);

// Timer for dynamic prayer countdown & Azan Alert Trigger
setInterval(() => {
  state.prayerTimes = calculateOfflinePrayers(state.selectedLocation.latitude, state.selectedLocation.longitude);
  const countdownEl = document.getElementById('prayer-countdown-timer');
  if (countdownEl) {
    countdownEl.textContent = state.prayerTimes.nextPrayer.remainingFormatted;
  }
  
  // Realtime Azan and Pre-prayer Alert Check
  checkAndTriggerPrayerAlerts(state.prayerTimes, (info) => {
    state.activeAzanAlert = info;
    state.isAzanPlaying = true;
    renderApp();
  });
}, 1000);

// Listen to custom prayer alert audio events
if (typeof window !== 'undefined') {
  window.addEventListener('prayer-alert-event', (e: any) => {
    const detail = e.detail;
    if (detail) {
      state.isAzanPlaying = !!detail.isPlaying;
      if (detail.type === 'ended' || detail.type === 'stopped') {
        state.activeAzanAlert = null;
        state.testingMuadhinId = null;
      }
      renderApp();
    }
  });
}

// View navigation helper (مع انتقال Apple السلس والصوت التفاعلي الفاخر)
export function navigateTo(tab: AppState['currentTab'], subView: string | null = null) {
  // Play Apple transition sound & light tactile haptic
  audioFx.playAppleTransition();
  triggerHapticFeedback(12);

  state.currentTab = tab;
  state.subView = subView;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}

// Helper to render clean standard profile avatar (صورة بروفايل عادية واحترافية)
function renderUserProfileAvatar(
  user: { displayName?: string | null; email?: string | null; photoURL?: string | null } | null,
  sizeCls = "w-11 h-11",
  iconCls = "w-6 h-6"
): string {
  const photo = user?.photoURL;
  const isCustom = photo && 
    typeof photo === 'string' &&
    photo.length > 5 &&
    !photo.includes('app_logo') && 
    !photo.includes('islamic_app_icon') && 
    !photo.includes('islamic_minimal_icon');

  if (isCustom) {
    return `
      <div class="${sizeCls} rounded-full overflow-hidden border border-subtle bg-surface-subtle shrink-0 shadow-xs relative">
        <img 
          src="${photo}" 
          alt="${user?.displayName || 'User'}" 
          class="w-full h-full object-cover" 
          onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" 
        />
        <div class="w-full h-full hidden items-center justify-center bg-gradient-to-br from-surface-subtle to-surface text-muted">
          <svg class="${iconCls} text-secondary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      </div>
    `;
  }

  // Standard clean profile picture (صورة بروفايل عادية بمظهر احترافي ناعم)
  return `
    <div class="${sizeCls} rounded-full overflow-hidden border border-subtle bg-gradient-to-br from-surface-subtle via-surface to-surface-subtle flex items-center justify-center text-muted shrink-0 shadow-xs select-none">
      <svg class="${iconCls} text-secondary/75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
  `;
}

// Render Master Shell
export function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  // Preserve bottom navigation horizontal scroll position
  const prevNav = document.querySelector('.bottom-nav');
  const prevScrollLeft = prevNav ? prevNav.scrollLeft : null;

  // 1. If auth is loading, render Splash / Loading state
  if (state.isAuthLoading) {
    root.innerHTML = `
      <div class="min-h-screen bg-canvas text-body flex flex-col items-center justify-center p-6 text-center select-none font-cairo">
        <div class="space-y-4 max-w-xs">
            <div class="relative w-24 h-24 mx-auto">
              <div class="w-24 h-24 rounded-3xl p-1 bg-gradient-to-tr from-emerald-800 via-emerald-600 to-amber-500 shadow-2xl flex items-center justify-center">
                <img src="${APP_LOGO_SRC}" alt="Logo" onerror="this.onerror=null;this.src='/images/app_logo.jpg';" class="w-full h-full rounded-[20px] object-cover" />
              </div>
              <div class="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg text-xs font-black">
                ۞
              </div>
            </div>
          <h1 class="text-xl font-bold text-primary">اذكار ، Ankara</h1>
          <p class="text-xs text-muted">«رفيقك اليومي للقرآن والذكر والعبادة»</p>
          <div class="pt-4 flex items-center justify-center gap-2 text-primary text-xs font-semibold">
            <div class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>جاري التحقق من الحساب...</span>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // 2. If user is NOT authenticated, render Mandatory Login Screen
  if (!state.currentUser) {
    root.innerHTML = renderMandatoryAuthScreen();
    attachEventHandlers();
    return;
  }

  // Record user session into managed user registry
  recordUserSession(state.currentUser);

  // 3. Check if user is BANNED
  if (isUserBanned(state.currentUser.email) || isUserBanned(state.currentUser.uid)) {
    root.innerHTML = renderBannedUserScreen();
    attachEventHandlers();
    return;
  }

  // Trigger mushaf page data load if needed
  if (state.currentTab === 'quran' && state.quranMode === 'mushaf' && !state.activeSurah) {
    if (!state.mushafPageData || state.mushafPageData.pageNumber !== state.mushafPageNumber) {
      if (!state.isLoadingMushafPage) {
        state.isLoadingMushafPage = true;
        loadMushafPage(state.mushafPageNumber).then(data => {
          state.mushafPageData = data;
          state.isLoadingMushafPage = false;
          renderApp();
        }).catch(() => {
          state.isLoadingMushafPage = false;
          renderApp();
        });
      }
    }
  }

  const subStatus = getSubscriptionStatus(state.currentUser.email);
  const isAdmin = isAdminUser(state.currentUser.email);

  root.innerHTML = `
    <!-- Focus Mode Floating Exit Button -->
    ${state.isFocusMode ? `
      <div class="fixed top-3 right-3 z-50">
        <button id="btn-exit-focus-mode" class="px-4 py-2 rounded-full bg-paper text-obsidian border border-hairline text-xs font-medium shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all">
          ${ICONS.close('w-3.5 h-3.5')}
          <span>الخروج من وضع الخشوع</span>
        </button>
      </div>
    ` : `
      <!-- Top Header (Clean Islamic Minimalism) -->
      <header class="top-header px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-3 border-b border-subtle bg-surface/90 backdrop-blur-xl sticky top-0 z-40">
        <!-- Right: App Logo & Brand -->
        <div class="flex items-center gap-2.5 cursor-pointer select-none min-w-0" id="header-brand">
          <div class="w-9 h-9 rounded-xl p-0.5 bg-gradient-to-tr from-emerald-800 via-emerald-600 to-amber-400 shadow-sm flex items-center justify-center shrink-0">
            <img src="${APP_LOGO_SRC}" alt="Logo" onerror="this.onerror=null;this.src='/images/app_logo.jpg';" class="w-full h-full rounded-[10px] object-cover" />
          </div>
          <div class="text-right min-w-0">
            <h1 class="text-sm sm:text-base font-bold text-primary flex items-center gap-1.5 leading-tight truncate">
              <span>اذكار ، Ankara</span>
              <span class="text-gold text-xs">۞</span>
            </h1>
            <p class="text-[11px] text-gold-dark dark:text-gold leading-tight truncate">رفيقك اليومي للذكر والعبادة</p>
          </div>
        </div>

        <!-- Left: Streamlined, Functional Actions -->
        <div class="flex items-center gap-1.5 shrink-0">
          <button 
            id="btn-open-search" 
            class="w-9 h-9 rounded-xl bg-surface-subtle hover:bg-surface border border-subtle flex items-center justify-center text-secondary hover:text-primary transition-all cursor-pointer active:scale-95 shadow-xs" 
            title="بحث شامل في الأذكار والسور"
          >
            ${ICONS.search('w-4 h-4')}
          </button>

          <button 
            id="btn-toggle-theme" 
            class="w-9 h-9 rounded-xl bg-surface-subtle hover:bg-surface border border-subtle flex items-center justify-center text-secondary hover:text-primary transition-all cursor-pointer active:scale-95 shadow-xs" 
            title="تبديل الوضع الليلي / النهاري"
          >
            ${state.theme === 'dark' ? ICONS.sun('w-4 h-4 text-gold') : ICONS.moon('w-4 h-4 text-primary')}
          </button>

          <button 
            id="btn-open-location" 
            class="px-2.5 py-1.5 rounded-xl bg-surface-subtle hover:bg-surface border border-subtle text-xs font-bold text-primary flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs" 
            title="تحديد وتغيير الموقع"
          >
            ${ICONS.mapPin('w-3.5 h-3.5 text-gold-dark dark:text-gold')}
            <span class="max-w-[70px] truncate text-[11px]">${state.selectedLocation.village || state.selectedLocation.city.replace('مركز ', '')}</span>
          </button>

          <!-- User Profile Avatar in Header -->
          <button 
            id="btn-header-profile" 
            class="w-9 h-9 rounded-xl overflow-hidden border border-gold/40 bg-surface-subtle hover:border-gold p-0.5 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs" 
            title="الملف الشخصي وإدارة الصورة"
          >
            ${renderUserProfileAvatar(state.currentUser, 'w-full h-full', 'w-4 h-4')}
          </button>
        </div>
      </header>

      <!-- Trial Banner (if in 3-day trial) -->
      ${subStatus.isTrial && !isAdmin ? `
        <div class="bg-gradient-to-r from-emerald-900/10 to-gold/10 border-b border-gold/30 px-4 py-2 flex items-center justify-between text-xs text-primary">
          <div class="flex items-center gap-1.5 font-bold text-[11px]">
            ${ICONS.clock('w-3.5 h-3.5 text-gold-dark dark:text-gold shrink-0')}
            <span>فترة تجريبية مجانية: متبقي <strong class="text-gold-dark dark:text-gold">${subStatus.daysRemaining} يوم</strong> و ${subStatus.hoursRemaining} س</span>
          </div>
          <button id="btn-upgrade-banner" class="px-3 py-1 bg-gradient-to-r from-amber-500 to-gold text-slate-950 text-[11px] font-black rounded-lg shadow-xs cursor-pointer hover:brightness-105 active:scale-95 transition-all">
            ترقية الحساب
          </button>
        </div>
      ` : ''}
    `}

    <!-- Main Content Area with Apple Fluid View Transition -->
    <main class="flex-1 apple-view-transition ${state.isFocusMode ? 'px-2 py-4' : (state.currentTab === 'quran' ? 'px-1 py-1' : 'px-3.5 sm:px-4 py-3.5')} w-full">
      ${renderActiveView()}
    </main>

    <!-- Bottom Footer Dedication (صناع التطبيق) -->
    ${(!state.isFocusMode && state.currentTab !== 'quran') ? `
    <footer class="mt-8 mb-4 px-4 text-center">
      <div class="border-t border-subtle pt-4 text-xs text-muted leading-relaxed space-y-1">
        <p class="font-semibold text-secondary">«اذكار ، Ankara» — رفيقك اليومي للقرآن والذكر والعبادة</p>
        <p class="text-xs text-primary leading-normal">
          تم صنعه بواسطة <span class="font-bold text-primary">المبرمج مالك عبدالودود وأحمد رضا الشبراوي</span> تحت إشراف <span class="font-bold text-primary">الدكتور/الشيخ سعد محفوظ</span>.
        </p>
      </div>
    </footer>
    ` : ''}

    <!-- Bottom Navigation Bar with Apple Glassmorphism & Horizontal Touch Scrolling (جميع الأقسام) -->
    ${!state.isFocusMode ? `
      <nav class="bottom-nav">
        <!-- 1. الرئيسية -->
        <button class="nav-item apple-spring-press ${state.currentTab === 'home' && !state.subView ? 'active' : ''}" data-nav="home">
          <span class="nav-icon-container">${ICONS.home('w-5 h-5')}</span>
          <span>الرئيسية</span>
        </button>

        <!-- 2. الأذكار -->
        <button class="nav-item apple-spring-press ${state.currentTab === 'adhkar' && !state.subView ? 'active' : ''}" data-nav="adhkar">
          <span class="nav-icon-container">${ICONS.duaHands('w-5 h-5')}</span>
          <span>الأذكار</span>
        </button>

        <!-- 3. المسبحة -->
        <button class="nav-item apple-spring-press ${state.currentTab === 'tasbeeh' && !state.subView ? 'active' : ''}" data-nav="tasbeeh">
          <span class="nav-icon-container">${ICONS.tasbeeh('w-5 h-5')}</span>
          <span>المسبحة</span>
        </button>

        <!-- 4. أذكار الصلاة -->
        <button class="nav-item apple-spring-press ${state.subView === 'prayer_adhkar' ? 'active' : ''}" data-subview="prayer_adhkar">
          <span class="nav-icon-container">${ICONS.mosque('w-5 h-5')}</span>
          <span>أذكار الصلاة</span>
        </button>

        <!-- 5. مواقيت الصلاة -->
        <button class="nav-item apple-spring-press ${state.subView === 'prayer_times' ? 'active' : ''}" data-subview="prayer_times">
          <span class="nav-icon-container">${ICONS.clock('w-5 h-5')}</span>
          <span>المواقيت</span>
        </button>

        <!-- 6. صفة الصلاة -->
        <button class="nav-item apple-spring-press ${state.subView === 'prayer_guide' ? 'active' : ''}" data-subview="prayer_guide">
          <span class="nav-icon-container">${ICONS.bookGuide('w-5 h-5')}</span>
          <span>صفة الصلاة</span>
        </button>

        <!-- 7. الخطب والدروس -->
        <button class="nav-item apple-spring-press ${state.subView === 'khutbahs' ? 'active' : ''}" data-subview="khutbahs">
          <span class="nav-icon-container">${ICONS.speakerKhutbah('w-5 h-5')}</span>
          <span>الخطب</span>
        </button>

        <!-- 8. ركائز الإيمان -->
        <button class="nav-item apple-spring-press ${state.subView === 'faith' ? 'active' : ''}" data-subview="faith">
          <span class="nav-icon-container">${ICONS.heartFaith('w-5 h-5')}</span>
          <span>الإيمان</span>
        </button>

        <!-- 9. الخوف والرجاء -->
        <button class="nav-item apple-spring-press ${state.subView === 'fear_hope' ? 'active' : ''}" data-subview="fear_hope">
          <span class="nav-icon-container">${ICONS.shieldPeace('w-5 h-5')}</span>
          <span>الخوف والرجاء</span>
        </button>

        <!-- 10. المفضلة -->
        <button class="nav-item apple-spring-press ${state.subView === 'favorites' ? 'active' : ''}" data-subview="favorites">
          <span class="nav-icon-container">${ICONS.star('w-5 h-5')}</span>
          <span>المفضلة</span>
        </button>

        <!-- 11. باقة الاشتراك InstaPay -->
        <button class="nav-item apple-spring-press ${state.subView === 'subscription' ? 'active' : ''}" data-subview="subscription">
          <span class="nav-icon-container">${ICONS.instapay('w-5 h-5')}</span>
          <span>الاشتراك</span>
        </button>

        <!-- 12. الإعدادات -->
        <button class="nav-item apple-spring-press ${state.currentTab === 'more' && !state.subView ? 'active' : ''}" data-nav="more">
          <span class="nav-icon-container">${ICONS.settings('w-5 h-5')}</span>
          <span>الإعدادات</span>
        </button>
      </nav>
    ` : ''}

    <!-- Modals -->
    ${state.showSearchModal ? renderSearchModal() : ''}
    ${state.showLocationModal ? renderLocationModal() : ''}
    ${state.showPaywallModal ? renderPaywallModal() : ''}
    ${state.showStatsModal ? renderStatsModal() : ''}
    ${state.viewingReceiptImage ? renderReceiptImageModal() : ''}
    ${state.showPrayerAlertModal ? renderPrayerAlertSettingsModal() : ''}
    ${state.showProfileModal ? renderProfileManagementModal(state.currentUser, state.tempProfilePhoto) : ''}
    ${(state.activeAzanAlert || state.isAzanPlaying) ? renderActiveAzanDialog() : ''}
    ${state.cardPreviewModal ? renderCardPreviewModal() : ''}
  `;

  attachEventHandlers();

  // Restore bottom navigation horizontal scroll position smoothly without snapping back to 0
  if (prevScrollLeft !== null) {
    const newNav = document.querySelector('.bottom-nav') as HTMLElement;
    if (newNav) {
      newNav.scrollLeft = prevScrollLeft;
      const activeItem = newNav.querySelector('.nav-item.active') as HTMLElement;
      if (activeItem) {
        const navRect = newNav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        if (itemRect.left < navRect.left || itemRect.right > navRect.right) {
          activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    }
  }

  // Seamlessly sync account data in background
  syncCurrentAccountMemory();
}

function renderActiveView(): string {
  if (state.subView) {
    switch (state.subView) {
      case 'prayer_times': return renderPrayerTimesDetailedView();
      case 'prayer_guide': return renderPrayerGuideView();
      case 'prayer_adhkar': return renderPrayerAdhkarView();
      case 'khutbahs': return renderKhutbahsView();
      case 'faith': return renderFaithView();
      case 'fear_hope': return renderFearHopeView();
      case 'favorites': return renderFavoritesView();
      case 'sources': return renderSourcesView();
      case 'subscription': return renderSubscriptionFullView();
      case 'appcreator24': return renderAppCreatorExportView();
      case 'admin_panel': return renderAdminView();
    }
  }

  if (state.kidsMode && state.currentTab === 'home') {
    return renderKidsModeView();
  }

  switch (state.currentTab) {
    case 'home': return renderHomeView();
    case 'quran': return renderQuranView();
    case 'adhkar': return renderAdhkarView();
    case 'tasbeeh': return renderTasbeehView();
    case 'more': return renderMoreView();
    default: return renderHomeView();
  }
}

const HOME_DAILY_ADHKAR = [
  { text: "«سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ»", count: 3, source: "صحيح مسلم", title: "ذكر الصباح والبركة" },
  { text: "«اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ»", count: 1, source: "صحيح البخاري", title: "سيد الاستغفار" },
  { text: "«أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لاَ إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ»", count: 1, source: "صحيح مسلم", title: "استفتاح اليوم المبارك" },
  { text: "«يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ»", count: 1, source: "صحيح الترغيب", title: "دعاء الاستغاثة والسكينة" },
  { text: "«لاَ حَوْلَ وَلاَ قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ»", count: 10, source: "صحيح البخاري", title: "كنز من كنوز الجنة" }
];

// 1. Home View
function renderHomeView(): string {
  const p = state.prayerTimes;
  const alertSettings = state.prayerAlertsSettings;

  const totalDaily = HOME_DAILY_ADHKAR.length;
  const activeDailyIdx = Math.min(Math.max(0, state.homeDhikrCardIndex), totalDaily - 1);
  state.homeDhikrCardIndex = activeDailyIdx;
  const currentDailyDhikr = HOME_DAILY_ADHKAR[activeDailyIdx];

  return `
    <div class="space-y-4">
      <!-- Islamic Date & Luxury Prayer Times Hero Card -->
      <div class="prayer-hero-card p-4.5 sm:p-5">
        <div class="flex flex-col justify-between space-y-3.5">
          <!-- Top Row: Hijri Date & Quick Controls -->
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-1.5 font-bold text-gold-light bg-black/25 backdrop-blur-md px-3 py-1 rounded-full border border-gold/30 shadow-xs">
              ${ICONS.calendar('w-3.5 h-3.5 text-gold')}
              <span>${p.hijriDate}</span>
            </div>
            
            <div class="flex items-center gap-1.5">
              <button 
                id="btn-open-prayer-alerts" 
                class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 hover:bg-black/40 border border-gold/30 text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-xs" 
                title="إعدادات صوت الأذان واختيار المؤذن"
              >
                ${ICONS.mic('w-3.5 h-3.5 text-gold')}
                <span>المؤذن</span>
              </button>

              <button 
                id="btn-hero-location" 
                class="flex items-center gap-1 px-3 py-1 rounded-full bg-black/25 hover:bg-black/40 border border-gold/30 text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-xs" 
                title="تغيير موقع مواقيت الصلاة"
              >
                ${ICONS.mapPin('w-3.5 h-3.5 text-gold')}
                <span>${state.selectedLocation.village || state.selectedLocation.city.replace('مركز ', '')}</span>
                <span class="text-[9px] opacity-70">▼</span>
              </button>
            </div>
          </div>

          <!-- Center Showcase: Next Prayer & Digital Timer (Clean & Non-wrapping) -->
          <div class="my-2 text-center py-2">
            <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/30 border border-gold/30 text-white text-xs font-bold backdrop-blur-md shadow-xs">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>الصلاة القادمة: صلاة ${p.nextPrayer.arabicName}</span>
            </div>

            <!-- Crisp Digital Timer (Always on single line with monospace font) -->
            <div 
              class="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-widest text-white my-2.5 tabular-nums drop-shadow-md select-all" 
              id="prayer-countdown-timer" 
              dir="ltr"
            >
              ${p.nextPrayer.remainingFormatted}
            </div>

            <div class="text-xs text-white/90 flex items-center justify-center gap-2 font-medium">
              <span>موعد الأذان: <strong class="text-gold font-black font-mono text-sm">${p.nextPrayer.time}</strong></span>
              <span class="opacity-40">·</span>
              <span class="text-gold-light">${p.nextPrayer.isTomorrow ? 'غداً فجراً' : 'اليوم'}</span>
            </div>
          </div>

          <!-- 6 Prayer Times Row with Clear Islamic Highlighting -->
          <div class="grid grid-cols-6 gap-1.5 pt-2 text-center border-t border-white/10">
            <!-- 1. Fajr -->
            <div class="${p.nextPrayer.name === 'fajr' ? 'prayer-box-active' : 'prayer-box-inactive'} p-2 transition-all relative">
              <div class="flex items-center justify-between px-0.5 mb-1">
                <span class="opacity-80">${ICONS.islamicCrescent('w-3.5 h-3.5 text-gold')}</span>
                <button class="btn-toggle-prayer-bell p-0.5 rounded hover:opacity-100 transition-opacity cursor-pointer ${alertSettings.prayers.fajr.enabled ? 'opacity-100 text-gold' : 'opacity-40 text-white/60'}" data-prayer="fajr" title="تنبيه الفجر">
                  ${alertSettings.prayers.fajr.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                </button>
              </div>
              <div class="text-[11px] font-bold">الفجر</div>
              <div class="text-xs font-mono font-black mt-0.5 tabular-nums text-white" dir="ltr">${p.fajr}</div>
            </div>

            <!-- 2. Sunrise -->
            <div class="${p.nextPrayer.name === 'sunrise' ? 'prayer-box-active' : 'prayer-box-inactive'} p-2 transition-all relative">
              <div class="flex items-center justify-between px-0.5 mb-1">
                <span class="opacity-80">${ICONS.sunrise('w-3.5 h-3.5 text-gold')}</span>
                <button class="btn-toggle-prayer-bell p-0.5 rounded hover:opacity-100 transition-opacity cursor-pointer ${alertSettings.prayers.sunrise.enabled ? 'opacity-100 text-gold' : 'opacity-40 text-white/60'}" data-prayer="sunrise" title="تنبيه الشروق">
                  ${alertSettings.prayers.sunrise.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                </button>
              </div>
              <div class="text-[11px] font-bold">الشروق</div>
              <div class="text-xs font-mono font-black mt-0.5 tabular-nums text-white" dir="ltr">${p.sunrise}</div>
            </div>

            <!-- 3. Dhuhr -->
            <div class="${p.nextPrayer.name === 'dhuhr' ? 'prayer-box-active' : 'prayer-box-inactive'} p-2 transition-all relative">
              <div class="flex items-center justify-between px-0.5 mb-1">
                <span class="opacity-80">${ICONS.sun('w-3.5 h-3.5 text-gold')}</span>
                <button class="btn-toggle-prayer-bell p-0.5 rounded hover:opacity-100 transition-opacity cursor-pointer ${alertSettings.prayers.dhuhr.enabled ? 'opacity-100 text-gold' : 'opacity-40 text-white/60'}" data-prayer="dhuhr" title="تنبيه الظهر">
                  ${alertSettings.prayers.dhuhr.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                </button>
              </div>
              <div class="text-[11px] font-bold">الظهر</div>
              <div class="text-xs font-mono font-black mt-0.5 tabular-nums text-white" dir="ltr">${p.dhuhr}</div>
            </div>

            <!-- 4. Asr -->
            <div class="${p.nextPrayer.name === 'asr' ? 'prayer-box-active' : 'prayer-box-inactive'} p-2 transition-all relative">
              <div class="flex items-center justify-between px-0.5 mb-1">
                <span class="opacity-80">${ICONS.sun('w-3.5 h-3.5 text-gold')}</span>
                <button class="btn-toggle-prayer-bell p-0.5 rounded hover:opacity-100 transition-opacity cursor-pointer ${alertSettings.prayers.asr.enabled ? 'opacity-100 text-gold' : 'opacity-40 text-white/60'}" data-prayer="asr" title="تنبيه العصر">
                  ${alertSettings.prayers.asr.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                </button>
              </div>
              <div class="text-[11px] font-bold">العصر</div>
              <div class="text-xs font-mono font-black mt-0.5 tabular-nums text-white" dir="ltr">${p.asr}</div>
            </div>

            <!-- 5. Maghrib -->
            <div class="${p.nextPrayer.name === 'maghrib' ? 'prayer-box-active' : 'prayer-box-inactive'} p-2 transition-all relative">
              <div class="flex items-center justify-between px-0.5 mb-1">
                <span class="opacity-80">${ICONS.sunset('w-3.5 h-3.5 text-gold')}</span>
                <button class="btn-toggle-prayer-bell p-0.5 rounded hover:opacity-100 transition-opacity cursor-pointer ${alertSettings.prayers.maghrib.enabled ? 'opacity-100 text-gold' : 'opacity-40 text-white/60'}" data-prayer="maghrib" title="تنبيه المغرب">
                  ${alertSettings.prayers.maghrib.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                </button>
              </div>
              <div class="text-[11px] font-bold">المغرب</div>
              <div class="text-xs font-mono font-black mt-0.5 tabular-nums text-white" dir="ltr">${p.maghrib}</div>
            </div>

            <!-- 6. Isha -->
            <div class="${p.nextPrayer.name === 'isha' ? 'prayer-box-active' : 'prayer-box-inactive'} p-2 transition-all relative">
              <div class="flex items-center justify-between px-0.5 mb-1">
                <span class="opacity-80">${ICONS.moonStars('w-3.5 h-3.5 text-gold')}</span>
                <button class="btn-toggle-prayer-bell p-0.5 rounded hover:opacity-100 transition-opacity cursor-pointer ${alertSettings.prayers.isha.enabled ? 'opacity-100 text-gold' : 'opacity-40 text-white/60'}" data-prayer="isha" title="تنبيه العشاء">
                  ${alertSettings.prayers.isha.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                </button>
              </div>
              <div class="text-[11px] font-bold">العشاء</div>
              <div class="text-xs font-mono font-black mt-0.5 tabular-nums text-white" dir="ltr">${p.isha}</div>
            </div>
          </div>

          <!-- Automatic Adhan Status Bar -->
          <div class="mt-2.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-white/90">
            <div class="flex items-center gap-1.5 font-bold text-[11px]">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>الأذان التلقائي: <strong class="text-gold">مفعّل بصوت عالي عند دخول الوقت</strong></span>
            </div>
            <button 
              id="btn-hero-change-muadhin" 
              class="text-[11px] text-gold-light hover:text-white font-bold underline flex items-center gap-1 cursor-pointer"
              title="تغيير صوت الأذان أو المؤذن"
            >
              <span>${MUADHIN_OPTIONS.find(m => m.id === alertSettings.globalSound)?.name.replace('أذان ', '') || 'تغيير المؤذن'}</span>
              <span>⚙</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Verse of the Day -->
      <div class="card-luxury p-4">
        <div class="flex items-center justify-between text-xs text-graphite mb-2">
          <span class="font-medium text-obsidian flex items-center gap-1.5">
            ${ICONS.sparkles('w-3.5 h-3.5 text-graphite')}
            <span>آية اليوم</span>
          </span>
          <div class="flex items-center gap-1 text-graphite">
            <button class="btn-copy-text w-7 h-7 rounded-full flex items-center justify-center hover:bg-ash hover:text-obsidian transition-colors cursor-pointer" data-copy="﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾ [الرعد: 28]" title="نسخ الآية">
              ${ICONS.copy('w-3.5 h-3.5')}
            </button>
            <button class="btn-share-verse w-7 h-7 rounded-full flex items-center justify-center hover:bg-ash hover:text-obsidian transition-colors cursor-pointer" title="مشاركة">
              ${ICONS.share('w-3.5 h-3.5')}
            </button>
          </div>
        </div>
        <div class="my-1.5 flex justify-center">
          ${ICONS.islamicDivider('w-48 h-3 text-gold/50')}
        </div>
        <p class="font-amiri text-lg leading-loose text-center text-obsidian font-semibold my-1">
          ﴿ الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾
        </p>
        <div class="text-left text-[11px] text-graphite">
          سورة الرعد - آية 28
        </div>
      </div>

      <!-- Daily Dhikr Interactive Card Deck (نظام بطاقات التالي اليومية) -->
      <div class="card-luxury p-4 sm:p-5 max-w-full space-y-3">
        <div class="flex items-center justify-between text-xs text-graphite">
          <span class="font-medium text-obsidian flex items-center gap-1.5">
            ${ICONS.duaHands('w-4 h-4 text-graphite')}
            <span>${currentDailyDhikr.title}</span>
          </span>
          <div class="flex items-center gap-2 font-mono text-[11px]">
            <span class="font-semibold text-obsidian">بطاقة ${activeDailyIdx + 1}</span>
            <span class="text-smoke">من ${totalDaily}</span>
          </div>
        </div>

        <p class="font-amiri text-lg sm:text-xl font-semibold text-obsidian leading-loose text-center py-2">
          ${currentDailyDhikr.text}
        </p>

        <div class="flex items-center justify-between text-xs text-graphite pt-2 border-t border-hairline">
          <span>المصدر: ${currentDailyDhikr.source} · تكرار: ${currentDailyDhikr.count}</span>
          <div class="flex items-center gap-1.5">
            <button id="btn-home-dhikr-prev" class="btn-outlined-pill py-1 px-3 text-xs font-medium cursor-pointer ${activeDailyIdx === 0 ? 'opacity-40 pointer-events-none' : ''}" ${activeDailyIdx === 0 ? 'disabled' : ''}>
              ${ICONS.arrowRight('w-3 h-3')}
              <span>السابق</span>
            </button>
            <button id="btn-home-dhikr-next" class="btn-filled-black py-1 px-3.5 text-xs font-medium cursor-pointer">
              <span>${activeDailyIdx < totalDaily - 1 ? 'التالي' : 'البداية'}</span>
              ${ICONS.arrowLeft('w-3 h-3')}
            </button>
          </div>
        </div>
      </div>

      <!-- Minimalist Clean Sections Grid -->
      <div class="space-y-2 max-w-full pt-1">
        <div class="flex items-center justify-between text-xs text-graphite px-1">
          <span class="font-medium text-obsidian">أقسام التطبيق</span>
          <span>منظومة إسلامية متكاملة</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-full">
          <!-- 1. Adhkar -->
          <button class="card-luxury p-3.5 text-right flex flex-col justify-between min-h-[90px] hover:border-obsidian transition-colors group cursor-pointer" data-action="nav-adhkar">
            <div class="w-8 h-8 rounded-full bg-ash text-obsidian flex items-center justify-center shrink-0">
              ${ICONS.duaHands('w-4 h-4')}
            </div>
            <div class="min-w-0 mt-2">
              <div class="font-medium text-xs text-obsidian truncate">الأذكار النبوية</div>
              <div class="text-[11px] text-graphite truncate">23 باباً بنظام البطاقات</div>
            </div>
          </button>

          <!-- 2. Tasbeeh -->
          <button class="card-luxury p-3.5 text-right flex flex-col justify-between min-h-[90px] hover:border-obsidian transition-colors group cursor-pointer" data-action="nav-tasbeeh">
            <div class="w-8 h-8 rounded-full bg-ash text-obsidian flex items-center justify-center shrink-0">
              ${ICONS.tasbeeh('w-4 h-4')}
            </div>
            <div class="min-w-0 mt-2">
              <div class="font-medium text-xs text-obsidian truncate">المسبحة الذكية</div>
              <div class="text-[11px] text-graphite truncate">عداد إلكتروني مع اهتزاز</div>
            </div>
          </button>

          <!-- 3. Prayer Adhkar -->
          <button class="card-luxury p-3.5 text-right flex flex-col justify-between min-h-[90px] hover:border-obsidian transition-colors group cursor-pointer" data-action="open-subview" data-view="prayer_adhkar">
            <div class="w-8 h-8 rounded-full bg-ash text-obsidian flex items-center justify-center shrink-0">
              ${ICONS.mosque('w-4 h-4')}
            </div>
            <div class="min-w-0 mt-2">
              <div class="font-medium text-xs text-obsidian truncate">أذكار الصلاة</div>
              <div class="text-[11px] text-graphite truncate">من التكبير إلى التسليم</div>
            </div>
          </button>

          <!-- 4. Prayer Guide -->
          <button class="card-luxury p-3.5 text-right flex flex-col justify-between min-h-[90px] hover:border-obsidian transition-colors group cursor-pointer" data-action="open-subview" data-view="prayer_guide">
            <div class="w-8 h-8 rounded-full bg-ash text-obsidian flex items-center justify-center shrink-0">
              ${ICONS.bookGuide('w-4 h-4')}
            </div>
            <div class="min-w-0 mt-2">
              <div class="font-medium text-xs text-obsidian truncate">صفة الصلاة</div>
              <div class="text-[11px] text-graphite truncate">شرح تفاعلي خطوة بخطوة</div>
            </div>
          </button>

          <!-- 5. Khutbahs -->
          <button class="card-luxury p-3.5 text-right flex flex-col justify-between min-h-[90px] hover:border-obsidian transition-colors group cursor-pointer" data-action="open-subview" data-view="khutbahs">
            <div class="w-8 h-8 rounded-full bg-ash text-obsidian flex items-center justify-center shrink-0">
              ${ICONS.speakerKhutbah('w-4 h-4')}
            </div>
            <div class="min-w-0 mt-2">
              <div class="font-medium text-xs text-obsidian truncate">خطب الجمعة</div>
              <div class="text-[11px] text-graphite truncate">نصوص الأوقاف والأزهر</div>
            </div>
          </button>

          <!-- 6. Faith -->
          <button class="card-luxury p-3.5 text-right flex flex-col justify-between min-h-[90px] hover:border-obsidian transition-colors group cursor-pointer" data-action="open-subview" data-view="faith">
            <div class="w-8 h-8 rounded-full bg-ash text-obsidian flex items-center justify-center shrink-0">
              ${ICONS.heartFaith('w-4 h-4')}
            </div>
            <div class="min-w-0 mt-2">
              <div class="font-medium text-xs text-obsidian truncate">أركان الإيمان</div>
              <div class="text-[11px] text-graphite truncate">ركائز العقيدة واليقين</div>
            </div>
          </button>

          <!-- 7. Fear & Hope -->
          <button class="card-luxury p-3.5 text-right flex flex-col justify-between min-h-[90px] hover:border-obsidian transition-colors group cursor-pointer" data-action="open-subview" data-view="fear_hope">
            <div class="w-8 h-8 rounded-full bg-ash text-obsidian flex items-center justify-center shrink-0">
              ${ICONS.shieldPeace('w-4 h-4')}
            </div>
            <div class="min-w-0 mt-2">
              <div class="font-medium text-xs text-obsidian truncate">الخوف والرجاء</div>
              <div class="text-[11px] text-graphite truncate">طمأنينة النفس والسكينة</div>
            </div>
          </button>

          <!-- 8. InstaPay Subscription -->
          <button class="card-luxury p-3.5 text-right flex flex-col justify-between min-h-[90px] hover:border-obsidian transition-colors group cursor-pointer" data-action="open-subview" data-view="subscription">
            <div class="w-8 h-8 rounded-full bg-ash text-obsidian flex items-center justify-center shrink-0">
              ${ICONS.instapay('w-4 h-4')}
            </div>
            <div class="min-w-0 mt-2">
              <div class="font-medium text-xs text-obsidian truncate">اشتراك InstaPay</div>
              <div class="text-[11px] text-graphite truncate">تحويل +201114809908</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Mandatory Authentication Screen (Email & Password + Google + Quick Login)
function renderMandatoryAuthScreen(): string {
  const tab = state.authTab || 'login';
  const showPass = state.showPasswordToggle || false;

  return `
    <div class="min-h-screen bg-canvas text-body flex flex-col justify-between max-w-lg mx-auto p-4 sm:p-6 relative select-none">
      <!-- Top Brand Header -->
      <div class="text-center pt-6 pb-2 space-y-3">
        <div class="relative inline-block">
          <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-tr from-emerald-800 via-emerald-600 to-amber-400 mx-auto shadow-2xl flex items-center justify-center">
            <img src="${APP_LOGO_SRC}" alt="Logo" onerror="this.onerror=null;this.src='/images/app_logo.jpg';" class="w-full h-full rounded-[14px] object-cover" />
          </div>
          <div class="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white rounded-full p-1 shadow-md">
            ${ICONS.sparkles('w-3.5 h-3.5')}
          </div>
        </div>

        <div>
          <h1 class="text-2xl sm:text-3xl font-black text-primary flex items-center justify-center gap-2 leading-tight">
            <span>اذكار ، Ankara</span>
          </h1>
          <p class="text-xs sm:text-sm text-gold-dark dark:text-gold font-medium mt-1">«رفيقك اليومي للقرآن والذكر والعبادة»</p>
        </div>
      </div>

      <!-- Auth Center Card -->
      <div class="card-luxury p-5 sm:p-6 space-y-4.5 my-auto bg-surface border border-gold/20 shadow-xl rounded-2xl">
        <!-- Auth Tabs Switcher -->
        <div class="grid grid-cols-3 gap-1 bg-surface-subtle p-1 rounded-xl border border-subtle text-xs font-bold">
          <button 
            class="btn-auth-tab py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${tab === 'login' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-primary'}"
            data-auth-tab="login"
          >
            دخول
          </button>
          <button 
            class="btn-auth-tab py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${tab === 'register' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-primary'}"
            data-auth-tab="register"
          >
            حساب جديد
          </button>
          <button 
            class="btn-auth-tab py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${tab === 'forgot' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-primary'}"
            data-auth-tab="forgot"
          >
            استعادة
          </button>
        </div>

        <!-- Feedback Alert Messages -->
        ${state.authError ? `
          <div class="bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2 text-right">
            ${ICONS.alertTriangle('w-4 h-4 text-rose-500 shrink-0')}
            <span class="leading-relaxed">${state.authError}</span>
          </div>
        ` : ''}

        ${state.authSuccessMessage ? `
          <div class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2 text-right">
            ${ICONS.check('w-4 h-4 text-emerald-500 shrink-0')}
            <span class="leading-relaxed">${state.authSuccessMessage}</span>
          </div>
        ` : ''}

        <!-- FORM: LOGIN -->
        ${tab === 'login' ? `
          <form id="form-auth-login" class="space-y-3.5">
            <div>
              <label class="block text-xs font-bold text-primary mb-1 text-right">البريد الإلكتروني</label>
              <div class="relative">
                <input 
                  type="email" 
                  id="login-email-input" 
                  class="w-full bg-surface-subtle border border-subtle focus:border-primary rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-body focus:outline-none transition-all"
                  placeholder="name@example.com"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-bold text-primary">كلمة المرور</label>
                <button type="button" class="btn-auth-tab text-[11px] text-gold-dark hover:underline cursor-pointer" data-auth-tab="forgot">نسيت كلمة المرور؟</button>
              </div>
              <div class="relative flex items-center">
                <input 
                  type="${showPass ? 'text' : 'password'}" 
                  id="login-password-input" 
                  class="w-full bg-surface-subtle border border-subtle focus:border-primary rounded-xl py-2.5 px-3.5 pr-10 text-xs sm:text-sm text-body focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                  dir="ltr"
                />
                <button 
                  type="button" 
                  id="btn-toggle-password-visibility" 
                  class="absolute left-3 text-muted hover:text-primary transition-colors cursor-pointer"
                  title="إظهار / إخفاء كلمة المرور"
                >
                  ${showPass ? ICONS.eye('w-4 h-4') : ICONS.eyeOff('w-4 h-4')}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              id="btn-submit-email-login"
              class="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              ${state.isSigningIn ? 'disabled' : ''}
            >
              ${state.isSigningIn ? `
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري تسجيل الدخول...</span>
              ` : `
                ${ICONS.lock('w-4 h-4 text-gold')}
                <span>تسجيل الدخول</span>
              `}
            </button>
          </form>
        ` : ''}

        <!-- FORM: REGISTER -->
        ${tab === 'register' ? `
          <form id="form-auth-register" class="space-y-3.5">
            <div>
              <label class="block text-xs font-bold text-primary mb-1 text-right">الاسم الكريم</label>
              <input 
                type="text" 
                id="register-name-input" 
                class="w-full bg-surface-subtle border border-subtle focus:border-primary rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-body focus:outline-none transition-all"
                placeholder="اسم المستخدم"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-primary mb-1 text-right">البريد الإلكتروني</label>
              <input 
                type="email" 
                id="register-email-input" 
                class="w-full bg-surface-subtle border border-subtle focus:border-primary rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-body focus:outline-none transition-all"
                placeholder="name@example.com"
                required
                dir="ltr"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-primary mb-1 text-right">كلمة المرور (6 أحرف أو أكثر)</label>
              <div class="relative flex items-center">
                <input 
                  type="${showPass ? 'text' : 'password'}" 
                  id="register-password-input" 
                  class="w-full bg-surface-subtle border border-subtle focus:border-primary rounded-xl py-2.5 px-3.5 pr-10 text-xs sm:text-sm text-body focus:outline-none transition-all"
                  placeholder="••••••••"
                  minlength="6"
                  required
                  dir="ltr"
                />
                <button 
                  type="button" 
                  id="btn-toggle-password-visibility" 
                  class="absolute left-3 text-muted hover:text-primary transition-colors cursor-pointer"
                >
                  ${showPass ? ICONS.eye('w-4 h-4') : ICONS.eyeOff('w-4 h-4')}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              id="btn-submit-email-register"
              class="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-gold hover:brightness-105 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              ${state.isSigningIn ? 'disabled' : ''}
            >
              ${state.isSigningIn ? `
                <div class="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>جاري إنشاء الحساب...</span>
              ` : `
                ${ICONS.sparkles('w-4 h-4 text-slate-950')}
                <span>إنشاء حساب جديد والمتابعة</span>
              `}
            </button>
          </form>
        ` : ''}

        <!-- FORM: FORGOT PASSWORD -->
        ${tab === 'forgot' ? `
          <form id="form-auth-forgot" class="space-y-3.5">
            <p class="text-xs text-muted leading-relaxed text-right">
              أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً لإعادة تعيين وتحديث كلمة المرور بأمان:
            </p>
            <div>
              <label class="block text-xs font-bold text-primary mb-1 text-right">البريد الإلكتروني</label>
              <input 
                type="email" 
                id="forgot-email-input" 
                class="w-full bg-surface-subtle border border-subtle focus:border-primary rounded-xl py-2.5 px-3.5 text-xs sm:text-sm text-body focus:outline-none transition-all"
                placeholder="name@example.com"
                required
                dir="ltr"
              />
            </div>

            <button 
              type="submit" 
              id="btn-submit-forgot-pass"
              class="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              ${state.isSigningIn ? 'disabled' : ''}
            >
              ${state.isSigningIn ? `
                <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جاري الإرسال...</span>
              ` : `
                ${ICONS.bolt('w-4 h-4 text-gold')}
                <span>إرسال رابط الاستعادة</span>
              `}
            </button>
          </form>
        ` : ''}

        <!-- Divider -->
        <div class="relative flex py-1 items-center">
          <div class="flex-grow border-t border-subtle"></div>
          <span class="flex-shrink mx-3 text-muted text-[11px] font-medium">أو المتابعة عبر</span>
          <div class="flex-grow border-t border-subtle"></div>
        </div>

        <!-- Alternate Login Actions -->
        <div>
          <button 
            type="button"
            id="btn-google-login-action" 
            class="w-full py-2.5 px-3.5 bg-surface-subtle hover:bg-surface border border-subtle rounded-xl text-xs font-bold text-primary flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            ${state.isSigningIn ? 'disabled' : ''}
          >
            <span class="w-4 h-4 flex items-center justify-center">${ICONS.google('w-4 h-4')}</span>
            <span>تسجيل الدخول عبر Google</span>
          </button>
        </div>

        <!-- Quick Feature Checklist -->
        <div class="grid grid-cols-2 gap-2 text-[11px] text-muted pt-2 border-t border-subtle">
          <div class="flex items-center gap-1.5 justify-center">
            <span class="text-emerald-600 font-bold">${ICONS.check('w-3 h-3')}</span>
            <span>الأذكار النبوية كاملة</span>
          </div>
          <div class="flex items-center gap-1.5 justify-center">
            <span class="text-emerald-600 font-bold">${ICONS.check('w-3 h-3')}</span>
            <span>حفظ ومزامنة التقدم</span>
          </div>
          <div class="flex items-center gap-1.5 justify-center">
            <span class="text-emerald-600 font-bold">${ICONS.check('w-3 h-3')}</span>
            <span>مواقيت الصلاة والأذان</span>
          </div>
          <div class="flex items-center gap-1.5 justify-center">
            <span class="text-emerald-600 font-bold">${ICONS.check('w-3 h-3')}</span>
            <span>المسبحة الذكية المطورة</span>
          </div>
        </div>
      </div>

      <!-- Bottom Dedication Footer -->
      <footer class="mt-4 mb-2 px-2 text-center space-y-1">
        <p class="text-xs text-primary font-medium leading-normal">
          تم صنعه بواسطة <span class="font-bold text-primary">المبرمج مالك عبدالودود وأحمد رضا الشبراوي</span>
        </p>
        <p class="text-[11px] text-muted font-medium">
          تحت إشراف: <span class="text-gold-dark dark:text-gold font-bold">الدكتور/الشيخ سعد محفوظ</span>
        </p>
      </footer>
    </div>
  `;
}

// 2. Quran View - Authentic Native Reader (مصحف المدينة وفهرس السور بدون أي iframe)
function renderQuranView(): string {
  if (state.activeSurah) {
    return renderSurahReaderView();
  }
  if (state.quranMode === 'surahs') {
    return renderSurahIndexView();
  }
  return renderMushafPageView();
}

// Surahs Index View (فهرس الـ 114 سورة كاملة مع البحث والتصنيف والتفسير)
function renderSurahIndexView(): string {
  const query = state.surahSearchQuery.trim().toLowerCase();
  const filterType = state.surahFilterType;
  
  let surahs = SURAH_LIST;
  if (filterType !== 'all') {
    surahs = surahs.filter(s => s.revelationType === filterType);
  }
  if (query) {
    surahs = surahs.filter(s => 
      s.name.includes(query) || 
      s.englishName.toLowerCase().includes(query) || 
      s.number.toString() === query
    );
  }

  return `
    <div class="space-y-3.5">
      <!-- Mode & Navigation Bar -->
      <div class="card-luxury p-2.5 flex items-center justify-between gap-2 bg-surface/95 backdrop-blur-md sticky top-14 z-20 shadow-sm">
        <div class="flex items-center gap-1.5 p-1 bg-surface-subtle rounded-xl border border-subtle">
          <button 
            class="btn-switch-quran-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${state.quranMode === 'mushaf' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-primary'}"
            data-mode="mushaf"
          >
            ${ICONS.quran('w-4 h-4')}
            <span>المصحف (صفحات)</span>
          </button>
          <button 
            class="btn-switch-quran-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${state.quranMode === 'surahs' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-primary'}"
            data-mode="surahs"
          >
            ${ICONS.bookGuide('w-4 h-4')}
            <span>فهرس السور (114)</span>
          </button>
        </div>

        <button 
          id="btn-toggle-focus-mode" 
          class="px-2.5 py-1.5 rounded-xl border border-gold/40 text-gold-dark dark:text-gold text-xs font-bold flex items-center gap-1 bg-gold/10 hover:bg-gold/20 transition-all cursor-pointer"
          title="تفعيل وضع الخشوع والتركيز بدون مشتتات"
        >
          ${ICONS.sparkles('w-4 h-4 text-gold')}
          <span>وضع الخشوع</span>
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="card-luxury p-3 space-y-2.5">
        <div class="relative">
          <input 
            type="text" 
            id="input-surah-search" 
            class="w-full bg-surface-subtle border border-subtle rounded-xl py-2 px-3 text-xs text-primary placeholder-muted focus:outline-none focus:border-primary pr-8"
            placeholder="ابحث عن اسم السورة (مثال: الفاتحة، الكهف، البقرة) أو رقمها..."
            value="${state.surahSearchQuery}"
          />
          <span class="absolute right-2.5 top-2.5 text-muted pointer-events-none">
            ${ICONS.search('w-3.5 h-3.5 text-muted')}
          </span>
          ${state.surahSearchQuery ? `
            <button id="btn-clear-surah-search" class="absolute left-3 top-2.5 text-muted hover:text-primary cursor-pointer">
              ${ICONS.close('w-3.5 h-3.5')}
            </button>
          ` : ''}
        </div>

        <div class="flex items-center justify-between text-xs pt-1">
          <div class="flex items-center gap-1">
            <button class="btn-filter-surah-type px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${state.surahFilterType === 'all' ? 'bg-primary text-white border-primary' : 'bg-surface border-subtle text-muted'}" data-type="all">الكل (114)</button>
            <button class="btn-filter-surah-type px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${state.surahFilterType === 'Meccan' ? 'bg-amber-600 text-white border-amber-600' : 'bg-surface border-subtle text-muted'}" data-type="Meccan">مكية (86)</button>
            <button class="btn-filter-surah-type px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${state.surahFilterType === 'Medinan' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-surface border-subtle text-muted'}" data-type="Medinan">مدنية (28)</button>
          </div>
          <span class="text-[11px] text-muted font-bold font-mono">${surahs.length} سورة</span>
        </div>
      </div>

      <!-- Surahs List Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        ${surahs.map(s => {
          const startPage = SURAH_START_PAGE[s.number] || 1;
          return `
            <div class="card-luxury p-3 flex items-center justify-between gap-3 hover:border-gold/50 transition-all group">
              <!-- Surah Info (Click to open continuous surah reader) -->
              <div class="flex items-center gap-3 min-w-0 flex-1 cursor-pointer btn-open-surah-reader" data-surah-num="${s.number}">
                <div class="w-10 h-10 rounded-xl bg-gold/15 text-gold-dark dark:text-gold border border-gold/30 flex items-center justify-center font-bold font-mono text-sm shrink-0 group-hover:scale-105 transition-transform">
                  ${s.number}
                </div>
                <div class="min-w-0">
                  <div class="font-bold text-sm text-primary font-amiri group-hover:text-gold transition-colors flex items-center gap-1.5">
                    <span>سورة ${s.name}</span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded font-sans font-semibold ${s.revelationType === 'Meccan' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'}">
                      ${s.revelationTypeArabic}
                    </span>
                  </div>
                  <div class="text-[11px] text-muted truncate">
                    ${s.englishName} · ${s.numberOfAyahs} آيات · الجزء ${s.juz}
                  </div>
                </div>
              </div>

              <!-- Jump to Mushaf Page Button -->
              <button 
                class="btn-jump-to-mushaf-page px-2.5 py-1.5 rounded-xl bg-surface-subtle hover:bg-gold/20 text-secondary hover:text-gold-dark border border-subtle text-[11px] font-bold shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                data-page="${startPage}"
                title="فتح في صفحة المصحف (ص ${startPage})"
              >
                <span>ص ${startPage}</span>
                ${ICONS.quran('w-3.5 h-3.5')}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// --- Audio Recitation Engine for Ayahs ---
let ayahAudioElement: HTMLAudioElement | null = null;

function playAyahAudio(reciterId: string, surahNum: number, ayahNum: number, ayahInQuran: number) {
  if (ayahAudioElement) {
    ayahAudioElement.pause();
    ayahAudioElement = null;
  }
  const url = getAyahAudioUrl(reciterId, surahNum, ayahNum);
  ayahAudioElement = new Audio(url);
  state.isAyahAudioPlaying = true;
  state.playingAyahNumber = ayahInQuran;
  renderApp();

  ayahAudioElement.play().catch(e => {
    console.warn("Audio play blocked or network error:", e);
    state.isAyahAudioPlaying = false;
    state.playingAyahNumber = null;
    renderApp();
  });

  ayahAudioElement.onended = () => {
    state.isAyahAudioPlaying = false;
    state.playingAyahNumber = null;
    renderApp();
  };

  ayahAudioElement.onerror = () => {
    state.isAyahAudioPlaying = false;
    state.playingAyahNumber = null;
    renderApp();
  };
}

function stopAyahAudio() {
  if (ayahAudioElement) {
    ayahAudioElement.pause();
    ayahAudioElement = null;
  }
  state.isAyahAudioPlaying = false;
  state.playingAyahNumber = null;
  renderApp();
}

// Unified Full-Featured Ayah Bottom Sheet / Action Drawer
function renderAyahActionBar(): string {
  if (!state.selectedAyah) return '';
  const ayah = state.selectedAyah;
  const isPlaying = state.isAyahAudioPlaying && state.playingAyahNumber === ayah.numberInQuran;
  const isFav = isFavorite(`ayah_${ayah.surahNumber}_${ayah.numberInSurah}`);

  return `
    <div class="mushaf-floating-bar card-luxury p-4 bg-surface/98 backdrop-blur-2xl border-2 border-gold/50 shadow-2xl fixed bottom-18 left-3 right-3 max-w-lg mx-auto z-40 rounded-3xl space-y-3">
      <!-- Header -->
      <div class="flex items-center justify-between text-xs pb-2 border-b border-subtle">
        <div class="flex items-center gap-2">
          <span class="w-7 h-7 rounded-lg bg-gold/20 text-gold-dark dark:text-gold flex items-center justify-center font-bold font-mono text-xs">
            ${toArabicNumerals(ayah.numberInSurah)}
          </span>
          <span class="font-bold text-sm text-primary">سورة ${ayah.surahName} · الآية ${toArabicNumerals(ayah.numberInSurah)}</span>
        </div>
        <button id="btn-close-ayah-action" class="w-7 h-7 rounded-full bg-surface-subtle flex items-center justify-center text-xs font-bold text-muted hover:text-primary transition-colors cursor-pointer" title="إغلاق">
          ${ICONS.close('w-4 h-4')}
        </button>
      </div>

      <!-- Ayah Text with Uthmani Font -->
      <div class="font-amiri text-base sm:text-lg text-primary leading-loose text-right bg-surface-subtle/70 p-3 rounded-2xl border border-subtle select-text">
        ﴿${ayah.text}﴾
      </div>

      <!-- Reciter & Audio Playback Row -->
      <div class="bg-surface-subtle p-2.5 rounded-2xl border border-subtle flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-2 flex-1 min-w-[150px]">
          <span class="text-gold shrink-0">${ICONS.mic('w-4 h-4 text-gold')}</span>
          <select id="select-ayah-reciter" class="bg-surface border border-subtle text-primary font-bold text-xs py-1.5 px-2 rounded-xl focus:outline-none focus:border-primary truncate w-full cursor-pointer">
            ${QURAN_RECITERS.map(r => `
              <option value="${r.id}" ${r.id === state.selectedReciterId ? 'selected' : ''}>${r.nameArabic}</option>
            `).join('')}
          </select>
        </div>

        <button 
          id="btn-toggle-ayah-audio" 
          class="px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${isPlaying ? 'bg-red-600 text-white animate-pulse' : 'bg-primary hover:bg-primary-dark text-white'}"
          data-surah="${ayah.surahNumber}"
          data-ayah="${ayah.numberInSurah}"
          data-quran="${ayah.numberInQuran}"
        >
          <span>${isPlaying ? '■ إيقاف التلاوة' : '▶ استماع للآية'}</span>
        </button>
      </div>

      <!-- Sub-Tabs: Tafseer & Translation -->
      <div class="flex items-center gap-1.5 border-b border-subtle pb-1">
        <button class="btn-ayah-tab px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${state.activeAyahModalTab === 'tafseer' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-primary'}" data-tab="tafseer">
          ${ICONS.bookOpen('w-3.5 h-3.5')}
          <span>التفسير الميسر</span>
        </button>
        <button class="btn-ayah-tab px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${state.activeAyahModalTab === 'translation' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-primary'}" data-tab="translation">
          ${ICONS.satellite('w-3.5 h-3.5')}
          <span>English Translation</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="max-h-24 overflow-y-auto pr-1 text-xs text-secondary leading-relaxed bg-surface-subtle/50 p-2.5 rounded-xl border border-subtle">
        ${state.isLoadingAyahDetails ? `
          <div class="py-2 text-center text-muted flex items-center justify-center gap-2">
            <span class="inline-block animate-spin w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full"></span>
            <span>جاري تحميل التفسير الميسر والترجمة...</span>
          </div>
        ` : state.activeAyahModalTab === 'tafseer' ? `
          <p class="font-sans leading-normal">${state.selectedAyahTafseer || 'التفسير الميسر: جاري جلب البيان المعتمد للآية الكريمة...'}</p>
        ` : `
          <p class="font-sans leading-normal text-left dir-ltr">${state.selectedAyahTranslation || 'English Translation: Saheeh International loading...'}</p>
        `}
      </div>

      <!-- Actions Grid -->
      <div class="grid grid-cols-3 gap-2 text-xs pt-1">
        <button 
          class="btn-share-ayah-card py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-gold/20 text-gold-dark dark:text-gold border border-gold/40 hover:brightness-105 font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
          data-surah="${ayah.surahName}"
          data-num="${ayah.numberInSurah}"
          data-text="${ayah.text}"
        >
          ${ICONS.image('w-3.5 h-3.5')}
          <span>مشاركة كبطاقة</span>
        </button>

        <button 
          class="btn-copy-selected-ayah py-2 px-2.5 rounded-xl bg-surface-subtle hover:bg-surface text-secondary hover:text-primary border border-subtle font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          data-copy="﴿${ayah.text}﴾ [سورة ${ayah.surahName}: ${ayah.numberInSurah}]"
        >
          ${ICONS.copy('w-3.5 h-3.5')}
          <span>نسخ</span>
        </button>

        <button 
          class="btn-fav-selected-ayah py-2 px-2.5 rounded-xl border border-gold/40 hover:bg-gold hover:text-white text-gold font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${isFav ? 'bg-gold text-white' : ''}"
          data-fav-id="ayah_${ayah.surahNumber}_${ayah.numberInSurah}"
          data-surah="${ayah.surahName}"
          data-num="${ayah.numberInSurah}"
          data-text="${ayah.text}"
        >
          ${ICONS.star('w-3.5 h-3.5', isFav)}
          <span>المفضلة</span>
        </button>
      </div>
    </div>
  `;
}

// Kids Mode Dashboard
function renderKidsModeView(): string {
  const kidsTreasures = [
    { id: "kid_subhanallah", title: "سبحان الله وبحمده", subtitle: "غراس الجنة العظيم", iconKey: "sparkles", target: 3 },
    { id: "kid_alhamdulillah", title: "الحمد لله رب العالمين", subtitle: "تملأ الميزان حسنات", iconKey: "heartFaith", target: 3 },
    { id: "kid_allahuakbar", title: "الله أكبر كبيراً", subtitle: "أعظم الكلمات عند الله", iconKey: "crown", target: 3 },
    { id: "kid_astaghfirullah", title: "أستغفر الله وأتوب إليه", subtitle: "ممحاة الذنوب والخطايا", iconKey: "shieldPeace", target: 3 },
    { id: "kid_lailahaillallah", title: "لا إله إلا الله", subtitle: "مفتاح الجنة ونور القلب", iconKey: "islamicStar", target: 3 },
    { id: "kid_salawat", title: "اللهم صلِّ على محمد", subtitle: "نيل شفاعة الحبيب ﷺ", iconKey: "duaHands", target: 3 }
  ];

  const kidsAdhkar = [
    { id: "kid_wake", title: "دعاء الاستيقاظ", text: "الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور", iconKey: "sunrise", target: 1 },
    { id: "kid_sleep", title: "دعاء النوم", text: "باسمك ربي وضعت جنبي وبك أرفعه", iconKey: "moonStars", target: 1 },
    { id: "kid_food", title: "قبل الأكل", text: "بسم الله، وبركة الله", iconKey: "bookOpen", target: 1 },
    { id: "kid_bismillah", title: "البسملة المباركة", text: "بسم الله الرحمن الرحيم", iconKey: "sparkles", target: 3 },
    { id: "kid_peace", title: "إفشاء السلام", text: "السلام عليكم ورحمة الله وبركاته", iconKey: "duaHands", target: 3 }
  ];

  return `
    <div class="space-y-4 select-none">
      <!-- Kids Cheerful Hero Banner -->
      <div class="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-700 text-white shadow-xl relative overflow-hidden">
        <div class="flex items-center justify-between relative z-10">
          <div>
            <div class="text-xs font-bold text-amber-200 flex items-center gap-1.5">
              ${ICONS.sparkles('w-4 h-4 text-amber-200')}
              <span>واحة الأبطال الصغار</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black mt-1">مرحباً يا بطل الذكر!</h2>
            <p class="text-xs text-white/90 mt-0.5">تعلم الأذكار والأدعية اليومية بكل سهولة ومتعة</p>
          </div>
          <button id="btn-exit-kids-mode" class="px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 text-white font-black text-xs shrink-0 cursor-pointer transition-all active:scale-95 shadow-sm flex items-center gap-1">
            <span>الوضع العادي</span>
            ${ICONS.close('w-3.5 h-3.5')}
          </button>
        </div>
      </div>

      <!-- Section 1: كنوز الأذكار المباركة -->
      <div class="space-y-2">
        <div class="flex items-center justify-between px-1">
          <h3 class="font-black text-base text-primary flex items-center gap-1.5">
            ${ICONS.sparkles('w-4.5 h-4.5 text-gold')}
            <span>كنوز الأذكار اليومية للأبطال</span>
          </h3>
          <span class="text-xs text-gold font-bold">6 كنوز</span>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          ${kidsTreasures.map(s => {
            const iconFn = (ICONS as any)[s.iconKey] || ICONS.duaHands;
            return `
              <div 
                class="card-luxury p-3.5 rounded-2xl flex items-center gap-3 border-2 border-subtle hover:border-gold cursor-pointer transition-all active:scale-95 group"
                data-action="nav-tasbeeh"
              >
                <div class="w-11 h-11 rounded-2xl bg-gold/15 text-gold-dark dark:text-gold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  ${iconFn('w-5 h-5')}
                </div>
                <div class="min-w-0">
                  <div class="font-black text-xs sm:text-sm text-primary group-hover:text-gold transition-colors truncate">
                    ${s.title}
                  </div>
                  <div class="text-[10px] text-muted truncate">${s.subtitle}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Section 2: أذكار البطل اليومية -->
      <div class="space-y-2 pt-2">
        <div class="flex items-center justify-between px-1">
          <h3 class="font-black text-base text-primary flex items-center gap-1.5">
            ${ICONS.duaHands('w-4.5 h-4.5 text-gold')}
            <span>أدعية البطل المصورة</span>
          </h3>
          <span class="text-xs text-muted">اضغط بعد القراءة</span>
        </div>

        <div class="space-y-2">
          ${kidsAdhkar.map(item => {
            const count = state.dhikrProgress[item.id] || 0;
            const done = count >= item.target;
            const iconFn = (ICONS as any)[item.iconKey] || ICONS.duaHands;
            return `
              <div class="card-luxury p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 border-2 ${done ? 'border-emerald-500 bg-emerald-500/10' : 'border-subtle'}">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    ${iconFn('w-5.5 h-5.5')}
                  </div>
                  <div class="min-w-0">
                    <div class="font-bold text-xs text-gold">${item.title}</div>
                    <div class="font-amiri text-sm sm:text-base font-bold text-primary truncate mt-0.5">${item.text}</div>
                  </div>
                </div>

                <button 
                  class="btn-tap-dhikr px-3.5 py-2 rounded-xl font-black text-xs shrink-0 cursor-pointer active:scale-95 transition-all shadow-sm flex items-center gap-1 ${done ? 'bg-emerald-600 text-white' : 'bg-primary text-white'}"
                  data-dhikr-id="${item.id}"
                  data-target="${item.target}"
                >
                  ${done ? ICONS.check('w-3.5 h-3.5') + '<span>أحسنت!</span>' : ICONS.checkCircle('w-3.5 h-3.5') + '<span>قرأت</span>'}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Section 3: مسبحة البطل السريعة -->
      <div class="card-luxury p-4 rounded-3xl text-center space-y-3 border-2 border-gold/40 bg-gold/5">
        <div class="text-xs font-bold text-gold">مسبحة الأبطال السريعة</div>
        <div class="font-black text-3xl font-mono text-primary tabular-nums" id="kids-tasbeeh-display">
          ${state.tasbeeh.currentCount}
        </div>
        <button 
          id="btn-kids-tasbeeh-tap" 
          class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-gold text-slate-950 font-black text-base shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          ${ICONS.tasbeeh('w-5 h-5 text-slate-950')}
          <span>سبّح واكسب حسنات!</span>
        </button>
      </div>
    </div>
  `;
}

// Islamic Card Preview & Share Modal
function renderCardPreviewModal(): string {
  if (!state.cardPreviewModal) return '';
  const { title, text, imageUrl } = state.cardPreviewModal;
  return `
    <div class="modal-overlay" id="card-preview-overlay" style="z-index: 9999;">
      <div class="bottom-sheet-content space-y-3.5 text-right max-w-md mx-auto" onclick="event.stopPropagation()">
        <div class="apple-sheet-handle"></div>
        <div class="flex items-center justify-between border-b border-subtle pb-2">
          <h3 class="font-bold text-sm text-primary flex items-center gap-1.5">
            ${ICONS.sparkles('w-4 h-4 text-gold')}
            <span>بطاقة المشاركة الفاخرة</span>
          </h3>
          <button id="btn-close-card-preview" class="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer" title="إغلاق">
            ${ICONS.close('w-4 h-4')}
          </button>
        </div>

        <div class="relative overflow-hidden rounded-2xl border-2 border-gold/40 shadow-2xl bg-black/40 flex items-center justify-center p-2">
          <img src="${imageUrl}" alt="Islamic Card" class="w-full max-h-[50vh] object-contain rounded-xl shadow-lg" />
        </div>

        <div class="grid grid-cols-2 gap-2 pt-1">
          <a 
            href="${imageUrl}" 
            download="adhkar-ankara-${Date.now()}.png" 
            class="py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            ${ICONS.upload('w-4 h-4')}
            <span>تحميل الصورة (PNG)</span>
          </a>
          <button 
            id="btn-native-share-card" 
            class="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-gold text-slate-950 font-black text-xs shadow-md hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            data-title="${title}"
            data-text="${text}"
          >
            ${ICONS.share('w-4 h-4')}
            <span>مشاركة البطاقة</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Mushaf Page View (نظام القراءة كصفحات متصلة بمصحف المدينة 604 صفحة)
function renderMushafPageView(): string {
  const pageNum = state.mushafPageNumber;
  const pageData = state.mushafPageData;
  const isBookmarked = localStorage.getItem('zad_bookmark_mushaf_page') === pageNum.toString();
  const juzTitle = JUZ_NAMES[pageData?.juzNumber || Math.min(30, Math.ceil(pageNum / 20))] || `الجزء ${pageData?.juzNumber || 1}`;
  
  // Primary surah name for header
  const primarySurahName = pageData?.surahsInPage[0]?.name || (SURAH_LIST.find(s => (SURAH_START_PAGE[s.number] || 1) <= pageNum)?.name) || "القرآن الكريم";

  return `
    <div class="space-y-3">
      <!-- Mode & Focus Bar -->
      <div class="card-luxury p-2 flex items-center justify-between gap-2 bg-surface/95 backdrop-blur-md sticky top-14 z-20 shadow-sm">
        <div class="flex items-center gap-1.5 p-1 bg-surface-subtle rounded-xl border border-subtle">
          <button 
            class="btn-switch-quran-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-primary text-white shadow-xs"
            data-mode="mushaf"
          >
            ${ICONS.quran('w-4 h-4')}
            <span>المصحف (صفحات)</span>
          </button>
          <button 
            class="btn-switch-quran-mode px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 text-muted hover:text-primary"
            data-mode="surahs"
          >
            ${ICONS.bookGuide('w-4 h-4')}
            <span>فهرس السور (114)</span>
          </button>
        </div>

        <button 
          id="btn-toggle-focus-mode" 
          class="px-2.5 py-1.5 rounded-xl border border-gold/40 text-gold-dark dark:text-gold text-xs font-bold flex items-center gap-1 bg-gold/10 hover:bg-gold/20 transition-all cursor-pointer"
          title="تفعيل وضع الخشوع والتركيز بدون مشتتات"
        >
          ${ICONS.sparkles('w-4 h-4 text-gold')}
          <span>وضع الخشوع</span>
        </button>
      </div>

      <!-- Quick Navigation & Controls Bar -->
      <div class="card-luxury p-2.5 flex items-center justify-between gap-2 bg-surface/95 backdrop-blur-md sticky top-28 z-20 shadow-sm">
        <!-- Surah Selector Dropdown / Jump -->
        <div class="flex items-center gap-1.5 flex-1 min-w-0">
          <select 
            id="mushaf-surah-jump-select" 
            class="bg-surface-subtle border border-subtle text-primary font-bold text-xs py-1.5 px-2 rounded-xl focus:outline-none focus:border-primary truncate max-w-[140px]"
          >
            ${SURAH_LIST.map(s => {
              const start = SURAH_START_PAGE[s.number] || 1;
              const nextStart = SURAH_START_PAGE[s.number + 1] || 605;
              const isCurrent = start <= pageNum && pageNum < nextStart;
              return `
                <option value="${start}" ${isCurrent ? 'selected' : ''}>
                  ${s.number}. سورة ${s.name}
                </option>
              `;
            }).join('')}
          </select>

          <!-- Direct Page Jump Input -->
          <div class="flex items-center gap-1 bg-surface-subtle border border-subtle rounded-xl px-2 py-1">
            <span class="text-[11px] text-muted">ص</span>
            <input 
              type="number" 
              id="mushaf-direct-page-input" 
              min="1" 
              max="604" 
              value="${pageNum}" 
              class="w-10 bg-transparent text-center text-xs font-mono font-bold text-primary focus:outline-none"
            />
            <button id="btn-jump-page-go" class="text-[10px] font-bold text-primary hover:text-primary-dark">
              انتقال
            </button>
          </div>
        </div>

        <!-- Controls: Font Size, Bookmark -->
        <div class="flex items-center gap-1 shrink-0">
          <button id="btn-decrease-font" class="w-7 h-7 rounded-lg border border-subtle flex items-center justify-center text-xs font-bold text-secondary hover:bg-surface-subtle" title="تصغير الخط">
            A-
          </button>
          <button id="btn-increase-font" class="w-7 h-7 rounded-lg border border-subtle flex items-center justify-center text-xs font-bold text-secondary hover:bg-surface-subtle" title="تكبير الخط">
            A+
          </button>
          <button 
            id="btn-bookmark-mushaf-page" 
            class="w-7 h-7 rounded-lg border border-subtle flex items-center justify-center text-xs font-bold ${isBookmarked ? 'text-gold border-gold/40 bg-gold/10' : 'text-muted hover:text-gold'}" 
            title="حفظ الصفحة كعلامة قراءة"
          >
            ${ICONS.star('w-3.5 h-3.5', isBookmarked)}
          </button>
        </div>
      </div>

      <!-- The Authentic Madinah Mushaf Page (صفحة المصحف المتصلة) -->
      <div class="mushaf-page-wrapper p-3 sm:p-5 select-text" id="mushaf-active-page">
        <div class="mushaf-inner-frame p-3 sm:p-4 min-h-[560px] flex flex-col justify-between">
          
          <!-- Top Page Header Line (Surah & Juz Name) -->
          <div class="flex items-center justify-between border-b border-gold/30 pb-2 mb-3 text-xs text-primary font-bold">
            <span class="flex items-center gap-1 text-gold-dark dark:text-gold">
              <span>۞</span>
              <span>سورة ${primarySurahName}</span>
            </span>
            <span class="text-[11px] text-muted font-normal">مصحف المدينة النبوية</span>
            <span class="flex items-center gap-1 text-gold-dark dark:text-gold">
              <span>${juzTitle}</span>
              <span>۞</span>
            </span>
          </div>

          <!-- Page Body: Continuous Flow of Verses (مش كل آية لوحدها) -->
          <div class="flex-1 py-1">
            ${state.isLoadingMushafPage ? `
              <div class="py-24 text-center space-y-3">
                <div class="inline-block animate-spin w-8 h-8 border-3 border-gold border-t-transparent rounded-full"></div>
                <div class="text-xs text-muted font-semibold">جاري فتح صفحة المصحف الشريف (${toArabicNumerals(pageNum)})...</div>
              </div>
            ` : pageData && pageData.ayahs && pageData.ayahs.length > 0 ? `
              <!-- Surah Headers if any surah begins on this page -->
              ${pageData.surahsInPage.map(s => `
                <div class="mushaf-surah-title-banner py-2 px-3 my-2 text-center rounded-lg shadow-2xs">
                  <div class="font-amiri font-bold text-lg text-primary">
                    ﴿ سُورَةُ ${s.name} ﴾
                  </div>
                  <div class="text-[11px] text-muted">
                    ${s.revelationTypeArabic} · آياتها ${toArabicNumerals(s.numberOfAyahs)}
                  </div>
                </div>
                ${s.number !== 1 && s.number !== 9 ? `
                  <div class="text-center py-2 mb-2">
                    <p class="font-amiri text-xl text-primary font-bold">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
                  </div>
                ` : ''}
              `).join('')}

              <!-- The Connected Verses Paragraph (مش كل ايه لوحدها) -->
              <div class="mushaf-text-flow text-primary font-amiri leading-[2.6] text-right" style="font-size: ${state.quranFontSize}px;">
                ${pageData.ayahs.map(ayah => {
                  const isSelected = state.selectedAyah && state.selectedAyah.numberInQuran === ayah.numberInQuran;
                  return `
                    <span 
                      class="mushaf-ayah-inline ${isSelected ? 'active' : ''}" 
                      data-ayah-quran="${ayah.numberInQuran}" 
                      data-ayah-surah="${ayah.numberInSurah}" 
                      data-surah-num="${ayah.surahNumber}"
                      data-surah-name="${ayah.surahName}"
                      data-ayah-text="${ayah.text}"
                    >${ayah.text}</span><span 
                      class="mushaf-ayah-end cursor-pointer" 
                      data-ayah-quran="${ayah.numberInQuran}"
                      title="آية ${ayah.numberInSurah}"
                    > ﴿<span class="text-xs font-mono font-bold">${toArabicNumerals(ayah.numberInSurah)}</span>﴾ </span>
                  `;
                }).join('')}
              </div>
            ` : `
              <div class="py-20 text-center text-xs text-muted">
                تعذر تحميل بيانات الصفحة. اضغط للتحديث.
                <button id="btn-reload-mushaf-page" class="block mx-auto mt-2 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold">
                  إعادة المحاولة
                </button>
              </div>
            `}
          </div>

          <!-- Bottom Page Footer: Medallion with Page Number -->
          <div class="border-t border-gold/30 pt-2.5 mt-3 flex items-center justify-between text-xs text-muted">
            <span class="text-[11px] opacity-75">الحزب ${(Math.ceil((pageData?.juzNumber || 1) * 2))}</span>
            <div class="font-amiri text-base font-bold text-gold-dark dark:text-gold flex items-center gap-1.5">
              <span>—</span>
              <span>صفحة</span>
              <span class="text-lg font-mono">${toArabicNumerals(pageNum)}</span>
              <span>—</span>
            </div>
            <span class="text-[11px] opacity-75">${Math.round((pageNum / 604) * 100)}% من المصحف</span>
          </div>
        </div>
      </div>

      <!-- Page Turner Bar (السابق / التالي) -->
      <div class="card-luxury p-3 flex items-center justify-between gap-3 shadow-md">
        <button 
          id="btn-mushaf-prev-page" 
          class="flex-1 py-2.5 px-3 rounded-xl border border-subtle flex items-center justify-center gap-2 font-bold text-xs transition-all ${pageNum > 1 ? 'hover:bg-primary hover:text-white text-primary border-primary/30' : 'opacity-40 cursor-not-allowed text-muted'}"
          ${pageNum <= 1 ? 'disabled' : ''}
        >
          <span>←</span>
          <span>الصفحة السابقة (${pageNum > 1 ? pageNum - 1 : 1})</span>
        </button>

        <div class="text-center px-2">
          <div class="text-xs font-bold text-primary font-mono">${pageNum} / 604</div>
          <div class="text-[10px] text-muted">مصحف المدينة</div>
        </div>

        <button 
          id="btn-mushaf-next-page" 
          class="flex-1 py-2.5 px-3 rounded-xl border border-subtle flex items-center justify-center gap-2 font-bold text-xs transition-all ${pageNum < 604 ? 'hover:bg-primary hover:text-white text-primary border-primary/30' : 'opacity-40 cursor-not-allowed text-muted'}"
          ${pageNum >= 604 ? 'disabled' : ''}
        >
          <span>الصفحة التالية (${pageNum < 604 ? pageNum + 1 : 604})</span>
          ${ICONS.chevronLeft('w-3.5 h-3.5')}
        </button>
      </div>

      <!-- Unified Floating Action Bar for Selected Ayah -->
      ${renderAyahActionBar()}

      <!-- Reading progress indicator across 604 pages -->
      <div class="card-luxury p-2.5 flex items-center justify-between text-[11px] text-muted">
        <span>بداية المصحف (ص 1)</span>
        <div class="flex-1 mx-3 h-2 bg-surface-subtle rounded-full overflow-hidden border border-subtle">
          <div class="h-full bg-gradient-to-r from-emerald-600 to-gold rounded-full transition-all duration-300" style="width: ${(pageNum / 604) * 100}%;"></div>
        </div>
        <span>ختام المصحف (ص 604)</span>
      </div>
    </div>
  `;
}

// Surah Reader View (نظام القراءة كصفحة متصلة مش كل آية لوحدها)
function renderSurahReaderView(): string {
  if (!state.activeSurah) return '';
  const { meta, ayahs } = state.activeSurah;
  const isBookmarked = localStorage.getItem('zad_bookmark_surah') === meta.number.toString();

  return `
    <div class="space-y-4">
      <!-- Reader Header Bar -->
      <div class="card-luxury p-3 flex items-center justify-between sticky top-16 z-30 bg-surface/95 backdrop-blur-md shadow-sm">
        <button id="btn-back-to-surahs" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1 hover:bg-surface-subtle">
          <span>←</span>
          <span>السور</span>
        </button>

        <div class="text-center">
          <h2 class="font-bold text-sm text-primary">سورة ${meta.name}</h2>
          <div class="text-[11px] text-muted">${meta.revelationTypeArabic} · ${meta.numberOfAyahs} آيات · الجزء ${meta.juz}</div>
        </div>

        <div class="flex items-center gap-1">
          <button id="btn-decrease-font" class="w-8 h-8 rounded-lg border border-subtle flex items-center justify-center text-xs font-bold text-secondary hover:bg-surface-subtle" title="تصغير الخط">
            A-
          </button>
          <button id="btn-increase-font" class="w-8 h-8 rounded-lg border border-subtle flex items-center justify-center text-xs font-bold text-secondary hover:bg-surface-subtle" title="تكبير الخط">
            A+
          </button>
          <button id="btn-bookmark-surah" class="w-8 h-8 rounded-lg border border-subtle flex items-center justify-center text-xs font-bold ${isBookmarked ? 'text-gold border-gold/40 bg-gold/10' : 'text-muted hover:text-gold'}" title="حفظ موضع القراءة">
            ${ICONS.star('w-4 h-4 text-gold', isBookmarked)}
          </button>
        </div>
      </div>

      <!-- Continuous Mushaf Page (نظام القراءة كصفحة متصلة مش كل آية لوحدها) -->
      <div class="mushaf-page-wrapper p-3 sm:p-5 select-text">
        <div class="mushaf-inner-frame p-3 sm:p-4 min-h-[500px] flex flex-col justify-between">
          
          <!-- Top Header -->
          <div class="flex items-center justify-between border-b border-gold/30 pb-2 mb-3 text-xs text-primary font-bold">
            <span class="flex items-center gap-1 text-gold-dark dark:text-gold">
              <span>۞</span>
              <span>سورة ${meta.name}</span>
            </span>
            <span class="text-[11px] text-muted font-normal">مصحف المدينة النبوية</span>
            <span class="flex items-center gap-1 text-gold-dark dark:text-gold">
              <span>الجزء ${meta.juz}</span>
              <span>۞</span>
            </span>
          </div>

          <!-- Surah Banner Header -->
          <div class="mushaf-surah-title-banner py-2 px-3 my-2 text-center rounded-lg shadow-2xs">
            <div class="font-amiri font-bold text-xl text-primary">
              ﴿ سُورَةُ ${meta.name} ﴾
            </div>
            <div class="text-[11px] text-muted">
              ${meta.revelationTypeArabic} · آياتها ${toArabicNumerals(meta.numberOfAyahs)}
            </div>
          </div>

          <!-- Basmalah (except At-Tawbah) -->
          ${meta.number !== 9 ? `
            <div class="text-center py-2 mb-3">
              <p class="font-amiri text-2xl text-primary font-bold">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
            </div>
          ` : ''}

          <!-- Continuous Verses Stream (مش كل ايه لوحدها) -->
          <div class="mushaf-text-flow text-primary font-amiri leading-[2.6] text-right" style="font-size: ${state.quranFontSize}px;">
            ${ayahs.map(ayah => {
              const isSelected = state.selectedAyah && state.selectedAyah.numberInQuran === ayah.numberInQuran;
              return `
                <span 
                  class="mushaf-ayah-inline ${isSelected ? 'active' : ''}" 
                  data-ayah-quran="${ayah.numberInQuran}" 
                  data-ayah-surah="${ayah.numberInSurah}" 
                  data-surah-num="${meta.number}"
                  data-surah-name="${meta.name}"
                  data-ayah-text="${ayah.text}"
                >${ayah.text}</span><span 
                  class="mushaf-ayah-end cursor-pointer" 
                  data-ayah-quran="${ayah.numberInQuran}"
                  title="آية ${ayah.numberInSurah}"
                > ﴿<span class="text-xs font-mono font-bold">${toArabicNumerals(ayah.numberInSurah)}</span>﴾ </span>
              `;
            }).join('')}
          </div>

          <!-- Bottom Footer -->
          <div class="border-t border-gold/30 pt-2.5 mt-4 flex items-center justify-between text-xs text-muted">
            <span class="text-[11px]">سورة ${meta.name}</span>
            <div class="font-amiri text-sm font-bold text-gold-dark dark:text-gold">
              — مصحف تنزيل المعتمد —
            </div>
            <span class="text-[11px]">${meta.numberOfAyahs} آية</span>
          </div>
        </div>
      </div>

      <!-- Unified Floating Action Bar for Selected Ayah -->
      ${renderAyahActionBar()}

      <!-- Source attribution banner -->
      <div class="text-center text-xs text-muted border-t border-subtle pt-3">
        المصدر: مشروع تنزيل القرآني Tanzil.net · مصحف المدينة النبوية الشريفة
      </div>
    </div>
  `;
}

// 3. Adhkar View (23 Categories with real Interactive Counters & Step-by-Step Card Deck نظام بطاقات التالي)
function renderAdhkarView(): string {
  const currentCategory = ADHKAR_CATEGORIES.find(c => c.id === state.activeAdhkarCategory) || ADHKAR_CATEGORIES[0];
  const adhkarList = ALL_ADHKAR.filter(a => a.category === currentCategory.id);
  const totalCards = adhkarList.length;
  const activeIndex = Math.min(Math.max(0, state.adhkarCardIndex), Math.max(0, totalCards - 1));
  state.adhkarCardIndex = activeIndex;

  const currentItem = adhkarList[activeIndex];
  const currentProgress = currentItem ? (state.dhikrProgress[currentItem.id] || 0) : 0;
  const remaining = currentItem ? Math.max(0, currentItem.count - currentProgress) : 0;
  const isDone = currentItem ? remaining === 0 : false;
  const percent = currentItem ? Math.min(100, Math.round((currentProgress / currentItem.count) * 100)) : 0;

  return `
    <div class="space-y-4">
      <!-- Minimalist Header & Mode Switcher -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-semibold text-obsidian flex items-center gap-2">
            <span>${ICONS.duaHands('w-4 h-4 text-graphite')}</span>
            <span>أذكار المسلم المأثورة</span>
          </h2>
          <p class="text-xs text-graphite">من كتاب حصن المسلم وصحيح السنة</p>
        </div>
        <div class="flex items-center gap-1.5">
          <button 
            id="btn-toggle-adhkar-view-mode" 
            class="btn-outlined-pill py-1 px-3 text-xs font-medium cursor-pointer flex items-center gap-1.5"
            title="تبديل طريقة العرض"
          >
            ${state.adhkarViewMode === 'cards' ? `${ICONS.sliders('w-3 h-3')} <span>عرض القائمة</span>` : `${ICONS.image('w-3 h-3')} <span>نظام البطاقات</span>`}
          </button>
        </div>
      </div>

      <!-- Category Filter Chips Scroller (Swipeable) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        ${ADHKAR_CATEGORIES.map(cat => `
          <button 
            class="filter-chip ${cat.id === state.activeAdhkarCategory ? 'active' : ''} flex items-center gap-1.5 cursor-pointer shrink-0" 
            data-cat-id="${cat.id}"
          >
            <span class="flex items-center">${getAdhkarCategoryIconSvg(cat.id, 'w-3.5 h-3.5')}</span>
            <span>${cat.name}</span>
          </button>
        `).join('')}
      </div>

      ${state.adhkarViewMode === 'cards' ? `
        <!-- CARD DECK MODE: نظام بطاقات نظام التالي -->
        ${!currentItem ? `
          <div class="card-luxury p-8 text-center text-graphite text-sm">
            لا توجد أذكار في هذا القسم حالياً.
          </div>
        ` : `
          <!-- Card Progress Line & Step Info -->
          <div class="flex items-center justify-between text-xs text-graphite px-1">
            <span class="font-medium text-obsidian flex items-center gap-1.5">
              ${getAdhkarCategoryIconSvg(currentCategory.id, 'w-3.5 h-3.5 text-graphite')}
              <span>${currentCategory.name}</span>
            </span>
            <div class="flex items-center gap-2 font-mono text-xs">
              <span class="font-semibold text-obsidian">بطاقة ${activeIndex + 1}</span>
              <span class="text-smoke">من ${totalCards}</span>
            </div>
          </div>

          <!-- Progress Bar of Deck -->
          <div class="w-full bg-ash h-1.5 rounded-full overflow-hidden border border-hairline">
            <div class="bg-obsidian h-full transition-all duration-300" style="width: ${((activeIndex + 1) / totalCards) * 100}%;"></div>
          </div>

          <!-- The Interactive Dhikr Card (Swipeable with Touch) -->
          <div class="card-deck-container" id="adhkar-deck-touch-area">
            <div class="card-luxury card-deck-item p-4 sm:p-5 space-y-4 relative transition-all" id="dhikr-card-${currentItem.id}">
              <!-- Top Row Info -->
              <div class="flex items-center justify-between text-xs text-graphite">
                <span class="bg-ash px-2.5 py-0.5 rounded-full text-xs font-mono font-medium text-obsidian border border-hairline">
                  التكرار المطلوب: ${currentItem.count}
                </span>
                <div class="flex items-center gap-1 text-graphite">
                  <button class="btn-fav-dhikr hover:text-obsidian p-1 rounded-full hover:bg-ash ${isFavorite(currentItem.id) ? 'text-obsidian' : ''}" data-id="${currentItem.id}" data-text="${currentItem.text.slice(0, 50)}" title="إضافة للمفضلة">
                    ${ICONS.star('w-3.5 h-3.5', isFavorite(currentItem.id))}
                  </button>
                  <button class="btn-share-dhikr-card hover:text-obsidian p-1 rounded-full hover:bg-ash cursor-pointer transition-colors" data-category="${currentItem.categoryName}" data-text="${currentItem.text}" data-source="${currentItem.source}" title="مشاركة كبطاقة صورة">
                    ${ICONS.image('w-3.5 h-3.5')}
                  </button>
                  <button class="btn-copy-text hover:text-obsidian p-1 rounded-full hover:bg-ash cursor-pointer" data-copy="${currentItem.text} [${currentItem.source}]" title="نسخ النص">
                    ${ICONS.copy('w-3.5 h-3.5')}
                  </button>
                </div>
              </div>

              <!-- Dhikr Arabic Text -->
              <p class="font-amiri text-xl sm:text-2xl text-obsidian leading-loose text-center font-semibold select-text py-2">
                ${currentItem.text}
              </p>

              <!-- Optional Benefit -->
              ${currentItem.benefit ? `
                <div class="text-xs text-graphite bg-ash p-3 rounded-[6px] border border-hairline flex items-start gap-2 text-right">
                  <span class="text-graphite shrink-0 mt-0.5">${ICONS.sparkles('w-3.5 h-3.5')}</span>
                  <div><span class="font-semibold text-obsidian">الفضل:</span> ${currentItem.benefit}</div>
                </div>
              ` : ''}

              <!-- Source -->
              <div class="text-[11px] text-graphite text-left border-t border-hairline pt-2">
                المصدر: ${currentItem.source}
              </div>

              <!-- Interactive Dhikr Tap Button -->
              <div class="pt-2">
                <button 
                  class="btn-tap-dhikr w-full py-3.5 rounded-full font-medium text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${isDone ? 'bg-ash text-obsidian border border-hairline' : 'btn-filled-black'}"
                  data-dhikr-id="${currentItem.id}"
                  data-target="${currentItem.count}"
                >
                  <span class="dhikr-tap-label flex items-center gap-1.5">
                    ${isDone ? `${ICONS.check('w-4 h-4')} <span>تم الذكر بحمد الله</span>` : `${ICONS.tasbeeh('w-4 h-4')} <span>اضغط للتسبيح</span>`}
                  </span>
                  <span class="font-mono text-xs font-semibold tabular-nums px-2 py-0.5 rounded-full ${isDone ? 'bg-paper border border-hairline' : 'bg-white/20'}">
                    (${remaining} متبقي)
                  </span>
                </button>
              </div>

              <!-- Next / Prev Deck Control Bar (نظام التالي والسابق) -->
              <div class="flex items-center justify-between gap-2 pt-2 border-t border-hairline">
                <button 
                  id="btn-adhkar-card-prev" 
                  class="btn-outlined-pill py-1.5 px-3.5 text-xs font-medium cursor-pointer ${activeIndex > 0 ? '' : 'opacity-40 pointer-events-none'}"
                  ${activeIndex === 0 ? 'disabled' : ''}
                >
                  ${ICONS.arrowRight('w-3.5 h-3.5')}
                  <span>السابق</span>
                </button>

                <button 
                  class="btn-reset-dhikr w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-graphite hover:text-obsidian hover:bg-ash transition-colors cursor-pointer"
                  data-dhikr-id="${currentItem.id}"
                  title="إعادة تعيين عداد هذا الذكر"
                >
                  ${ICONS.rotateCcw('w-3.5 h-3.5')}
                </button>

                <button 
                  id="btn-adhkar-card-next" 
                  class="btn-filled-black py-1.5 px-4 text-xs font-medium cursor-pointer"
                >
                  <span>${activeIndex < totalCards - 1 ? 'التالي' : 'العودة للبداية'}</span>
                  ${ICONS.arrowLeft('w-3.5 h-3.5')}
                </button>
              </div>
            </div>
          </div>
          <p class="text-center text-[11px] text-graphite">يمكنك التمرير باللمس يميناً ويساراً للتنقل بين البطاقات</p>
        `}
      ` : `
        <!-- LIST MODE: عرض القائمة المجمعة -->
        <div class="space-y-3">
          ${adhkarList.map((item, idx) => {
            const currentProgress = state.dhikrProgress[item.id] || 0;
            const remaining = Math.max(0, item.count - currentProgress);
            const isDone = remaining === 0;
            const percent = Math.min(100, Math.round((currentProgress / item.count) * 100));

            return `
              <div class="card-luxury p-4 space-y-3 relative transition-all" id="dhikr-card-${item.id}">
                <div class="flex items-center justify-between text-xs text-graphite">
                  <span class="font-medium text-obsidian">بطاقة ${idx + 1} - ${item.categoryName}</span>
                  <div class="flex items-center gap-2">
                    <span class="bg-ash px-2 py-0.5 rounded-full text-[11px] font-mono border border-hairline">
                      التكرار: ${item.count}
                    </span>
                    <button class="btn-fav-dhikr hover:text-obsidian p-1 rounded-full hover:bg-ash ${isFavorite(item.id) ? 'text-obsidian' : ''}" data-id="${item.id}" data-text="${item.text.slice(0, 50)}">
                      ${ICONS.star('w-3.5 h-3.5', isFavorite(item.id))}
                    </button>
                  </div>
                </div>

                <p class="font-amiri text-lg text-obsidian leading-loose text-right select-text">
                  ${item.text}
                </p>

                ${item.benefit ? `
                  <div class="text-xs text-graphite bg-ash p-2.5 rounded-[6px] border border-hairline flex items-start gap-1.5">
                    <span class="text-graphite shrink-0 mt-0.5">${ICONS.sparkles('w-3.5 h-3.5')}</span>
                    <div><span class="font-semibold text-obsidian">الفضل:</span> ${item.benefit}</div>
                  </div>
                ` : ''}

                <div class="text-[11px] text-graphite flex items-center justify-between border-t border-hairline pt-2">
                  <span>المصدر: ${item.source}</span>
                  <div class="flex items-center gap-2">
                    <button class="btn-share-dhikr-card hover:text-obsidian flex items-center gap-1 text-[11px] cursor-pointer" data-category="${item.categoryName}" data-text="${item.text}" data-source="${item.source}">
                      ${ICONS.image('w-3 h-3')}
                      <span>بطاقة</span>
                    </button>
                    <button class="btn-copy-text hover:text-obsidian flex items-center gap-1 text-[11px] cursor-pointer" data-copy="${item.text} [${item.source}]">
                      ${ICONS.copy('w-3 h-3')}
                      <span>نسخ</span>
                    </button>
                  </div>
                </div>

                <div class="w-full bg-ash h-1.5 rounded-full overflow-hidden border border-hairline">
                  <div class="bg-obsidian h-full transition-all duration-300" style="width: ${percent}%;"></div>
                </div>

                <div class="flex items-center justify-between pt-1">
                  <div class="text-xs font-medium ${isDone ? 'text-obsidian flex items-center gap-1' : 'text-graphite'}">
                    ${isDone ? `${ICONS.check('w-3.5 h-3.5')} <span>تم بحمد الله</span>` : `المتبقي: <span class="font-mono font-semibold tabular-nums text-obsidian">${remaining}</span> من ${item.count}`}
                  </div>

                  <div class="flex items-center gap-2">
                    <button 
                      class="btn-reset-dhikr w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-graphite hover:bg-ash hover:text-obsidian transition-colors cursor-pointer"
                      data-dhikr-id="${item.id}"
                      title="إعادة العداد"
                    >
                      ${ICONS.rotateCcw('w-3.5 h-3.5')}
                    </button>

                    <button 
                      class="btn-tap-dhikr ${isDone ? 'bg-ash text-obsidian border border-hairline' : 'btn-filled-black'} px-4 py-1.5 text-xs font-medium flex items-center gap-1 cursor-pointer"
                      data-dhikr-id="${item.id}"
                      data-target="${item.count}"
                    >
                      ${ICONS.tasbeeh('w-3.5 h-3.5')}
                      <span>${isDone ? 'مكتمل' : 'ذِكْر'}</span>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;
}

// 4. Tasbeeh Electronic Rosary View
function renderTasbeehView(): string {
  const t = state.tasbeeh;
  const target = t.target;
  const count = t.currentCount;
  const progressPercent = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 100;

  return `
    <div class="space-y-4 text-center">
      <div>
        <h2 class="text-base font-semibold text-obsidian flex items-center justify-center gap-2">
          <span>${ICONS.tasbeeh('w-4 h-4 text-graphite')}</span>
          <span>المسبحة الإلكترونية</span>
        </h2>
        <p class="text-xs text-graphite">تسبيح مستمر مع اهتزاز هابتك وصوت الخرزات</p>
      </div>

      <!-- Dhikr Picker Dropdown -->
      <div class="card-luxury p-3 text-right">
        <label class="block text-xs text-graphite mb-1.5 font-medium">الذكر المختار للتسبيح:</label>
        <select id="tasbeeh-dhikr-select" class="w-full bg-paper border border-hairline rounded-full py-2 px-4 text-xs font-medium text-obsidian focus:outline-none focus:border-obsidian">
          ${TASBEEH_PRESETS.map(d => `
            <option value="${d}" ${d === t.selectedDhikr ? 'selected' : ''}>${d}</option>
          `).join('')}
        </select>
      </div>

      <!-- Target Selection Chips -->
      <div class="flex items-center justify-center gap-1.5 flex-wrap">
        <span class="text-xs text-graphite font-medium">الهدف:</span>
        ${TARGET_PRESETS.map(tg => `
          <button 
            class="filter-chip ${tg === t.target ? 'active' : ''} py-1 px-3 text-xs font-medium cursor-pointer"
            data-target-choice="${tg}"
          >
            ${tg === 0 ? 'مفتوح' : tg}
          </button>
        `).join('')}
      </div>

      <!-- Giant Interactive Tasbeeh Bead Dial -->
      <div class="py-4">
        <div 
          id="tasbeeh-tap-circle" 
          class="tasbeeh-ring select-none"
        >
          <!-- Circular Progress Ring (SVG) -->
          <svg class="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="3" class="text-ash" />
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="3" 
              stroke-dasharray="283" 
              stroke-dashoffset="${283 - (283 * progressPercent) / 100}" 
              stroke-linecap="round" 
              class="text-obsidian transition-all duration-150" 
            />
          </svg>

          <!-- Counter Numbers Inside -->
          <div class="relative z-10 text-center">
            <div class="text-5xl font-semibold font-mono text-obsidian tracking-tighter tabular-nums" id="tasbeeh-display-count">
              ${count}
            </div>
            <div class="text-xs text-graphite mt-1 font-medium">
              ${target > 0 ? `الهدف: ${target}` : 'تسبيح حر'}
            </div>
          </div>
        </div>
        <p class="text-xs text-graphite mt-3">انقر الدائرة في أي مكان للتسبيح</p>
      </div>

      <!-- Controls: Minus, Reset, Sound & Vibrate Toggles -->
      <div class="grid grid-cols-4 gap-2 max-w-sm mx-auto">
        <button id="btn-tasbeeh-decrement" class="btn-outlined-pill py-2 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer" title="طرح واحدة">
          <span>-1</span>
        </button>
        <button id="btn-tasbeeh-reset" class="btn-outlined-pill py-2 text-xs font-medium flex items-center justify-center gap-1 cursor-pointer" title="تصفير العداد">
          ${ICONS.rotateCcw('w-3.5 h-3.5')}
          <span>تصفير</span>
        </button>
        <button id="btn-toggle-vibrate" class="btn-outlined-pill py-2 ${t.vibrateEnabled ? 'border-obsidian text-obsidian bg-ash font-semibold' : 'text-graphite'} text-xs font-medium flex items-center justify-center gap-1 cursor-pointer" title="الاهتزاز">
          ${ICONS.vibrate('w-3.5 h-3.5')}
          <span>${t.vibrateEnabled ? 'مفعل' : 'معطل'}</span>
        </button>
        <button id="btn-toggle-sound" class="btn-outlined-pill py-2 ${t.soundEnabled ? 'border-obsidian text-obsidian bg-ash font-semibold' : 'text-graphite'} text-xs font-medium flex items-center justify-center gap-1 cursor-pointer" title="الصوت">
          ${ICONS.volume('w-3.5 h-3.5', t.soundEnabled)}
          <span>${t.soundEnabled ? 'مفعل' : 'معطل'}</span>
        </button>
      </div>

      <!-- Lifetime Stats -->
      <div class="card-luxury p-3 text-xs text-graphite flex items-center justify-between">
        <span class="flex items-center gap-1.5 font-medium text-obsidian">
          ${ICONS.sparkles('w-3.5 h-3.5 text-graphite')}
          <span>إجمالي التسبيح الكلي المسجل:</span>
        </span>
        <span class="font-mono font-semibold text-obsidian text-sm">${t.totalLifetimeCount} تسبيحة</span>
      </div>
    </div>
  `;
}

// 5. Prayer Times Detailed View
function renderPrayerTimesDetailedView(): string {
  const p = state.prayerTimes;
  const alertSettings = state.prayerAlertsSettings;
  const isPlaying = state.isAzanPlaying;

  const prayersList: Array<{
    key: PrayerKey;
    name: string;
    time: string;
    icon: string;
    isNext: boolean;
  }> = [
    { key: 'fajr', name: 'صلاة الفجر', time: p.fajr, icon: ICONS.islamicCrescent('w-4 h-4 text-graphite'), isNext: p.nextPrayer.name === 'fajr' },
    { key: 'sunrise', name: 'شروق الشمس', time: p.sunrise, icon: ICONS.sunrise('w-4 h-4 text-graphite'), isNext: p.nextPrayer.name === 'sunrise' },
    { key: 'dhuhr', name: 'صلاة الظهر', time: p.dhuhr, icon: ICONS.sun('w-4 h-4 text-graphite'), isNext: p.nextPrayer.name === 'dhuhr' },
    { key: 'asr', name: 'صلاة العصر', time: p.asr, icon: ICONS.sun('w-4 h-4 text-graphite'), isNext: p.nextPrayer.name === 'asr' },
    { key: 'maghrib', name: 'صلاة المغرب', time: p.maghrib, icon: ICONS.sunset('w-4 h-4 text-graphite'), isNext: p.nextPrayer.name === 'maghrib' },
    { key: 'isha', name: 'صلاة العشاء', time: p.isha, icon: ICONS.moonStars('w-4 h-4 text-graphite'), isNext: p.nextPrayer.name === 'isha' },
  ];

  return `
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <button id="btn-back-home" class="btn-outlined-pill py-1 px-3 text-xs font-medium text-obsidian flex items-center gap-1.5 cursor-pointer">
          ${ICONS.arrowRight('w-3.5 h-3.5')}
          <span>الرئيسية</span>
        </button>
        <h2 class="font-semibold text-base text-obsidian flex items-center gap-1.5">
          ${ICONS.clock('w-4 h-4 text-graphite')}
          <span>مواقيت الصلاة والأذان</span>
        </h2>
        <button id="btn-change-loc-from-prayer" class="text-xs text-obsidian underline font-medium flex items-center gap-1 cursor-pointer">
          ${ICONS.mapPin('w-3 h-3 text-graphite')}
          <span>تغيير الموقع</span>
        </button>
      </div>

      <!-- Location Card -->
      <div class="card-luxury p-3.5 flex items-center justify-between text-xs">
        <div>
          <div class="font-semibold text-obsidian text-sm flex items-center gap-1.5">
            ${ICONS.mapPin('w-3.5 h-3.5 text-graphite')}
            <span>${state.selectedLocation.name}</span>
          </div>
          <div class="text-graphite mt-0.5">الحساب الفلكي: الهيئة المصرية العامة للمساحة</div>
        </div>
        <div class="text-left font-mono text-[11px] text-smoke">
          <div>Lat: ${state.selectedLocation.latitude.toFixed(2)}</div>
          <div>Lng: ${state.selectedLocation.longitude.toFixed(2)}</div>
        </div>
      </div>

      <!-- Prominent Mu'adhin & Azan Action Card -->
      <div class="card-luxury p-4 sm:p-5 space-y-3.5">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-full bg-ash border border-hairline flex items-center justify-center text-obsidian shrink-0">
              ${ICONS.mic('w-5 h-5')}
            </div>
            <div class="min-w-0">
              <div class="text-[11px] text-graphite font-medium flex items-center gap-1.5">
                <span>صوت المؤذن الحالي:</span>
                <span class="text-[10px] bg-ash text-obsidian font-medium px-2 py-0.5 rounded-full border border-hairline inline-flex items-center gap-1">
                  ${ICONS.bell('w-2.5 h-2.5 text-graphite')}
                  <span>مفعّل</span>
                </span>
              </div>
              <div class="text-sm font-semibold text-obsidian truncate mt-0.5">
                ${MUADHIN_OPTIONS.find(m => m.id === alertSettings.globalSound)?.name || 'أذان الشيخ ناصر القطامي'}
              </div>
            </div>
          </div>

          <button 
            id="btn-open-prayer-alerts-modal-from-detailed" 
            class="btn-filled-black w-full sm:w-auto py-2.5 px-4 text-xs font-medium cursor-pointer flex items-center justify-center gap-2 shrink-0"
            title="انقر لتغيير صوت المؤذن واختيار ناصر القطامي، ياسر الدوسري، مشاري العفاسي..."
          >
            ${ICONS.mic('w-4 h-4')}
            <span>تغيير صوت المؤذن والأذان</span>
          </button>
        </div>

        <!-- Live Audio Test & Master Controls -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-hairline text-xs">
          <div class="text-[11px] text-graphite flex items-center gap-1.5">
            ${ICONS.info('w-3.5 h-3.5 text-graphite shrink-0')}
            <span>${MUADHIN_OPTIONS.find(m => m.id === alertSettings.globalSound)?.description || ''}</span>
          </div>

          <div class="flex items-center gap-2">
            ${isPlaying ? `
              <button 
                id="btn-stop-azan-audio" 
                class="bg-obsidian text-paper text-xs font-medium px-4 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer"
              >
                ${ICONS.stop('w-3.5 h-3.5')}
                <span>إيقاف الأذان</span>
              </button>
            ` : `
              <button 
                id="btn-test-global-azan" 
                class="btn-outlined-pill py-1.5 px-3.5 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                ${ICONS.play('w-3.5 h-3.5')}
                <span>استماع وتجربة الأذان</span>
              </button>
            `}
          </div>
        </div>
      </div>

      <!-- Prayer Table with Individual Notification Switches -->
      <div class="card-luxury overflow-hidden divide-y divide-hairline">
        <div class="bg-ash px-3.5 py-2 text-[11px] font-medium text-graphite flex items-center justify-between">
          <span>الصلاة والموعد</span>
          <span>حالة التنبيه</span>
        </div>

        ${prayersList.map(item => {
          const cfg = alertSettings.prayers[item.key];
          const isEnabled = cfg.enabled && alertSettings.masterEnabled;
          const muadhinName = MUADHIN_OPTIONS.find(m => m.id === cfg.sound)?.name || 'أذان الحرم المكي';
          const preReminderText = cfg.preReminderMinutes > 0 ? `قبل ${cfg.preReminderMinutes}د` : 'عند الوقت';

          return `
            <div class="p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-colors ${item.isNext ? 'bg-ash font-semibold' : 'hover:bg-ash/50'}">
              <!-- Right side: Name, Icon and Time -->
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="shrink-0">${item.icon}</span>
                <div>
                  <div class="font-medium text-xs sm:text-sm text-obsidian flex items-center gap-1.5">
                    <span>${item.name}</span>
                    ${item.isNext ? `<span class="bg-obsidian text-paper text-[10px] px-1.5 py-0.2 rounded-full font-medium">القادمة</span>` : ''}
                  </div>
                  <div class="text-[11px] text-graphite font-normal mt-0.5">
                    تنبيه: <span>${preReminderText}</span> · <span>${cfg.sound === 'chime' ? 'نغمة هادئة' : (cfg.sound === 'silent' ? 'صامت' : muadhinName.replace('أذان ', ''))}</span>
                  </div>
                </div>
              </div>

              <!-- Left side: Prayer Time & Individual Switch Button -->
              <div class="flex items-center gap-3 shrink-0">
                <span class="font-mono text-sm sm:text-base font-semibold text-obsidian tabular-nums">${item.time}</span>
                
                <button 
                  class="btn-toggle-prayer-detailed px-2.5 py-1 rounded-full border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${isEnabled ? 'bg-obsidian text-paper border-obsidian' : 'border-hairline text-graphite hover:bg-ash'}"
                  data-prayer="${item.key}"
                  title="${isEnabled ? 'انقر لتعطيل التنبيه لهذه الصلاة' : 'انقر لتفعيل التنبيه لهذه الصلاة'}"
                >
                  ${isEnabled ? ICONS.bell('w-3.5 h-3.5') : ICONS.bellOff('w-3.5 h-3.5')}
                  <span class="hidden sm:inline">${isEnabled ? 'مفعل' : 'معطل'}</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Notes on offline calculation -->
      <div class="card-luxury p-3 text-xs text-graphite leading-relaxed">
        <p class="font-medium text-obsidian mb-1">معايير الدقة والضبط الشرعي:</p>
        <p>• معيار دار الإفتاء وهيئة المساحة المصرية (الفجر: 19.5°، العشاء: 17.5°).</p>
        <p>• يعمل الحساب بدون إنترنت فلكياً 100%.</p>
      </div>
    </div>
  `;
}

// 7. Prayer Guide View (Learn Salah - نظام بطاقات الخطوات التالي والسابق)
function renderPrayerGuideView(): string {
  const totalSteps = PRAYER_GUIDE_STEPS.length;
  const activeIndex = Math.min(Math.max(0, state.prayerGuideStepIndex), totalSteps - 1);
  state.prayerGuideStepIndex = activeIndex;
  const step = PRAYER_GUIDE_STEPS[activeIndex];

  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-home" class="btn-outlined-pill py-1 px-3 text-xs font-medium text-obsidian flex items-center gap-1.5 cursor-pointer">
          ${ICONS.arrowRight('w-3.5 h-3.5')}
          <span>الرئيسية</span>
        </button>
        <h2 class="font-semibold text-base text-obsidian">صفة صلاة النبي ﷺ</h2>
        <div class="text-xs font-mono text-graphite">الخطوة ${activeIndex + 1} من ${totalSteps}</div>
      </div>

      <!-- Step Progress Bar -->
      <div class="w-full bg-ash h-1.5 rounded-full overflow-hidden border border-hairline">
        <div class="bg-obsidian h-full transition-all duration-300" style="width: ${((activeIndex + 1) / totalSteps) * 100}%;"></div>
      </div>

      <!-- Step Card Deck Item -->
      <div class="card-deck-container" id="prayer-guide-deck-touch-area">
        <div class="card-luxury p-4 sm:p-5 space-y-4">
          <div class="flex items-center justify-between text-xs">
            <span class="bg-ash text-obsidian font-mono px-2.5 py-0.5 rounded-full font-medium border border-hairline">
              الخطوة ${step.stepNumber}
            </span>
            <span class="text-graphite font-medium bg-ash px-2.5 py-0.5 rounded-full border border-hairline">${step.ruling}</span>
          </div>

          <div>
            <h3 class="font-semibold text-base text-obsidian">${step.title}</h3>
            <p class="text-xs text-graphite mt-0.5">${step.subtitle}</p>
          </div>

          <div class="text-xs sm:text-sm text-graphite leading-relaxed bg-ash p-3 rounded-[6px] border border-hairline">
            ${step.description}
          </div>

          <!-- Dhikr Text -->
          <div class="bg-ash p-3.5 rounded-[6px] border border-hairline font-amiri text-lg sm:text-xl text-obsidian leading-loose text-center font-semibold select-text">
            ${step.dhikrText}
          </div>

          <!-- Source & Copy -->
          <div class="text-[11px] text-graphite flex items-center justify-between pt-1 border-t border-hairline">
            <span>المصدر: ${step.source}</span>
            <div class="flex items-center gap-2">
              <button class="btn-copy-text hover:text-obsidian flex items-center gap-1 text-[11px] cursor-pointer" data-copy="${step.title}\n${step.dhikrText} [${step.source}]">
                ${ICONS.copy('w-3.5 h-3.5')}
                <span>نسخ</span>
              </button>
              <a href="${step.sourceUrl}" target="_blank" rel="noopener noreferrer" class="text-obsidian hover:underline">
                فتح المصدر ↗
              </a>
            </div>
          </div>

          <!-- Step Navigation Buttons: التالي والسابق -->
          <div class="flex items-center justify-between gap-3 pt-2">
            <button 
              id="btn-prayer-guide-prev" 
              class="btn-outlined-pill py-1.5 px-3.5 text-xs font-medium cursor-pointer ${activeIndex > 0 ? '' : 'opacity-40 pointer-events-none'}"
              ${activeIndex === 0 ? 'disabled' : ''}
            >
              ${ICONS.arrowRight('w-3.5 h-3.5')}
              <span>الخطوة السابقة</span>
            </button>

            <button 
              id="btn-prayer-guide-next" 
              class="btn-filled-black py-1.5 px-4 text-xs font-medium cursor-pointer"
            >
              <span>${activeIndex < totalSteps - 1 ? 'الخطوة التالية' : 'إتمام الدليل ✓'}</span>
              ${ICONS.arrowLeft('w-3.5 h-3.5')}
            </button>
          </div>
        </div>
      </div>
      <p class="text-center text-[11px] text-graphite">اسحب يميناً ويساراً للتنقل بين خطوات الصلاة</p>
    </div>
  `;
}

// 8. Prayer Adhkar View (Chronological - نظام بطاقات التالي)
function renderPrayerAdhkarView(): string {
  const totalItems = PRAYER_ADHKAR_LIST.length;
  const activeIndex = Math.min(Math.max(0, state.prayerAdhkarStepIndex), totalItems - 1);
  state.prayerAdhkarStepIndex = activeIndex;
  const item = PRAYER_ADHKAR_LIST[activeIndex];

  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-home" class="btn-outlined-pill py-1 px-3 text-xs font-medium text-obsidian flex items-center gap-1.5 cursor-pointer">
          ${ICONS.arrowRight('w-3.5 h-3.5')}
          <span>الرئيسية</span>
        </button>
        <h2 class="font-semibold text-base text-obsidian">أذكار الصلاة المسنونة</h2>
        <div class="text-xs font-mono text-graphite">الموضع ${activeIndex + 1} من ${totalItems}</div>
      </div>

      <!-- Step Progress Bar -->
      <div class="w-full bg-ash h-1.5 rounded-full overflow-hidden border border-hairline">
        <div class="bg-obsidian h-full transition-all duration-300" style="width: ${((activeIndex + 1) / totalItems) * 100}%;"></div>
      </div>

      <!-- Prayer Dhikr Card Deck Item -->
      <div class="card-deck-container" id="prayer-adhkar-deck-touch-area">
        <div class="card-luxury p-4 sm:p-5 space-y-4">
          <div class="flex items-center justify-between text-xs">
            <span class="bg-ash text-obsidian font-medium px-2.5 py-0.5 rounded-full border border-hairline">
              ${item.stage}
            </span>
            <button class="btn-copy-text hover:text-obsidian flex items-center gap-1 text-xs cursor-pointer" data-copy="${item.stepName}\n${item.text} [${item.source}]">
              ${ICONS.copy('w-3.5 h-3.5')}
              <span>نسخ</span>
            </button>
          </div>

          <h3 class="font-semibold text-base text-obsidian">${item.stepName}</h3>

          <div class="font-amiri text-lg sm:text-xl text-obsidian leading-loose text-center bg-ash p-4 rounded-[6px] border border-hairline font-semibold select-text">
            ${item.text}
          </div>

          <div class="text-xs text-graphite flex items-center justify-between border-t border-hairline pt-2">
            <span>المصدر: ${item.source}</span>
            ${item.notes ? `<span class="text-[11px] text-graphite">${item.notes}</span>` : ''}
          </div>

          <!-- Navigation Buttons: التالي والسابق -->
          <div class="flex items-center justify-between gap-3 pt-2">
            <button 
              id="btn-prayer-adhkar-prev" 
              class="btn-outlined-pill py-1.5 px-3.5 text-xs font-medium cursor-pointer ${activeIndex > 0 ? '' : 'opacity-40 pointer-events-none'}"
              ${activeIndex === 0 ? 'disabled' : ''}
            >
              ${ICONS.arrowRight('w-3.5 h-3.5')}
              <span>السابق</span>
            </button>

            <button 
              id="btn-prayer-adhkar-next" 
              class="btn-filled-black py-1.5 px-4 text-xs font-medium cursor-pointer"
            >
              <span>${activeIndex < totalItems - 1 ? 'الموضع التالي' : 'العودة للبداية'}</span>
              ${ICONS.arrowLeft('w-3.5 h-3.5')}
            </button>
          </div>
        </div>
      </div>
      <p class="text-center text-[11px] text-graphite">اسحب يميناً ويساراً للتنقل بين أذكار الصلاة</p>
    </div>
  `;
}

// 9. Friday Khutbahs View (خطب الجمعة والمصادر المعتمدة)
function renderKhutbahsView(): string {
  if (state.activeKhutbah) {
    const kh = state.activeKhutbah;
    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <button id="btn-back-to-khutbahs" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1 hover:bg-surface-subtle cursor-pointer">
            ${ICONS.arrowRight('w-3.5 h-3.5')}
            <span>كل الخطب</span>
          </button>
          <div class="text-xs text-muted font-bold">${kh.categoryName}</div>
          <button class="btn-copy-text text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1" data-copy="${kh.title}\n\n${kh.content}">
            ${ICONS.copy('w-3 h-3')}
            <span>نسخ الخطبة</span>
          </button>
        </div>

        <div class="card-luxury p-4 sm:p-5 space-y-3">
          <h2 class="font-bold text-base sm:text-lg text-primary leading-tight">${kh.title}</h2>
          
          <div class="text-xs text-muted flex flex-wrap items-center gap-2 pb-1 border-b border-subtle">
            <span class="font-semibold text-secondary">الخطيب: ${kh.speaker}</span>
            <span>·</span>
            <span>المصدر: ${kh.source}</span>
            ${kh.date ? `<span>·</span><span>${kh.date}</span>` : ''}
          </div>

          <div class="text-secondary text-sm sm:text-base leading-loose whitespace-pre-line font-cairo pt-1 text-right">
            ${kh.content}
          </div>

          <div class="border-t border-subtle pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <span class="text-muted">توثيق معتمد للأمانة العلمية</span>
            <a 
              href="${kh.sourceUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>زيارة المصدر المعتمد (${kh.source}) ↗</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  const filteredKhutbahs = state.activeKhutbahCategory === 'all' 
    ? ALL_KHUTBAHS 
    : ALL_KHUTBAHS.filter(k => k.category === state.activeKhutbahCategory);

  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-home" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1 hover:bg-surface-subtle cursor-pointer">
          <span>←</span>
          <span>الرئيسية</span>
        </button>
        <h2 class="font-bold text-base text-primary">خطب ومواعظ الجمعة</h2>
        <div class="w-12"></div>
      </div>

      <!-- Verified Official Sources Portals -->
      <div class="card-luxury p-3.5 space-y-2 bg-surface/90 border border-gold/30 rounded-2xl">
        <div class="text-xs font-bold text-primary flex items-center gap-1.5">
          ${ICONS.library('w-4 h-4 text-primary')}
          <span>المصادر الرسمية المعتمدة لخطب الجمعة:</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          ${KHUTBAH_OFFICIAL_SOURCES.map(src => `
            <a 
              href="${src.url}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="p-2.5 rounded-xl bg-surface-subtle hover:bg-primary/10 border border-subtle text-right transition-all flex flex-col justify-between group"
            >
              <div class="font-bold text-xs text-primary group-hover:text-primary-dark flex items-center justify-between">
                <span class="truncate">${src.name}</span>
                <span class="text-[10px] text-muted">↗</span>
              </div>
              <div class="text-[10px] text-muted mt-1 leading-normal line-clamp-2">${src.desc}</div>
            </a>
          `).join('')}
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button 
          class="khutbah-cat-pill px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${state.activeKhutbahCategory === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-surface-subtle text-secondary hover:bg-surface border border-subtle'}"
          data-category="all"
        >
          الكل (${ALL_KHUTBAHS.length})
        </button>
        ${KHUTBAH_CATEGORIES.map(cat => {
          const count = ALL_KHUTBAHS.filter(k => k.category === cat.id).length;
          if (count === 0) return '';
          return `
            <button 
              class="khutbah-cat-pill px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors cursor-pointer ${state.activeKhutbahCategory === cat.id ? 'bg-primary text-white shadow-sm' : 'bg-surface-subtle text-secondary hover:bg-surface border border-subtle'}"
              data-category="${cat.id}"
            >
              ${cat.name} (${count})
            </button>
          `;
        }).join('')}
      </div>

      <!-- Khutbahs List -->
      <div class="space-y-3">
        ${filteredKhutbahs.map(kh => `
          <div class="card-luxury p-4 space-y-2 cursor-pointer hover:border-primary transition-all khutbah-card-item" data-khutbah-id="${kh.id}">
            <div class="flex items-center justify-between text-xs">
              <span class="bg-primary/10 text-primary px-2 py-0.5 rounded-lg font-bold">
                ${kh.categoryName}
              </span>
              <span class="text-muted text-[11px]">${kh.source}</span>
            </div>

            <h3 class="font-bold text-sm sm:text-base text-primary">${kh.title}</h3>
            <p class="text-xs text-secondary line-clamp-2 leading-relaxed">${kh.summary}</p>

            <div class="text-[11px] text-muted flex items-center justify-between pt-1 border-t border-subtle">
              <span>الخطيب: <b class="text-secondary">${kh.speaker}</b></span>
              <span class="text-primary font-bold flex items-center gap-1">اقرأ الخطبة كاملة ←</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 10. Faith View (ركائز الإيمان - نظام بطاقات التالي)
function renderFaithView(): string {
  const f = FAITH_DATA;
  const totalPillars = f.pillars.length;
  const activeIndex = Math.min(Math.max(0, state.faithCardIndex), totalPillars - 1);
  state.faithCardIndex = activeIndex;
  const p = f.pillars[activeIndex];

  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-home" class="btn-outlined-pill py-1 px-3 text-xs font-medium text-obsidian flex items-center gap-1.5 cursor-pointer">
          ${ICONS.arrowRight('w-3.5 h-3.5')}
          <span>الرئيسية</span>
        </button>
        <h2 class="font-semibold text-base text-obsidian">أركان الإيمان الستة</h2>
        <div class="text-xs font-mono text-graphite">الركن ${activeIndex + 1} من ${totalPillars}</div>
      </div>

      <!-- Step Progress Bar -->
      <div class="w-full bg-ash h-1.5 rounded-full overflow-hidden border border-hairline">
        <div class="bg-obsidian h-full transition-all duration-300" style="width: ${((activeIndex + 1) / totalPillars) * 100}%;"></div>
      </div>

      <!-- Faith Pillar Card Deck Item -->
      <div class="card-deck-container" id="faith-deck-touch-area">
        <div class="card-luxury p-4 sm:p-5 space-y-4">
          <div class="flex items-center justify-between text-xs">
            <span class="bg-ash text-obsidian font-medium px-2.5 py-0.5 rounded-full border border-hairline">
              الركن ${p.order}
            </span>
            <span class="text-graphite">${p.source}</span>
          </div>

          <h3 class="font-semibold text-base sm:text-lg text-obsidian">${p.title}</h3>
          
          <p class="text-xs sm:text-sm text-graphite leading-relaxed bg-ash p-3 rounded-[6px] border border-hairline">
            ${p.definition}
          </p>

          <div class="bg-ash p-3.5 rounded-[6px] border border-hairline font-amiri text-sm sm:text-base text-obsidian text-center font-semibold select-text leading-loose">
            ${p.evidence}
          </div>

          <div class="space-y-1.5 pt-1">
            <div class="text-xs font-semibold text-obsidian">المعالم والآثار الإيمانية:</div>
            <ul class="text-xs text-graphite space-y-1 list-disc list-inside">
              ${p.details.map(d => `<li>${d}</li>`).join('')}
            </ul>
          </div>

          <!-- Navigation Buttons: التالي والسابق -->
          <div class="flex items-center justify-between gap-3 pt-2 border-t border-hairline">
            <button 
              id="btn-faith-card-prev" 
              class="btn-outlined-pill py-1.5 px-3.5 text-xs font-medium cursor-pointer ${activeIndex > 0 ? '' : 'opacity-40 pointer-events-none'}"
              ${activeIndex === 0 ? 'disabled' : ''}
            >
              ${ICONS.arrowRight('w-3.5 h-3.5')}
              <span>الركن السابق</span>
            </button>

            <button 
              id="btn-faith-card-next" 
              class="btn-filled-black py-1.5 px-4 text-xs font-medium cursor-pointer"
            >
              <span>${activeIndex < totalPillars - 1 ? 'الركن التالي' : 'العودة للبداية'}</span>
              ${ICONS.arrowLeft('w-3.5 h-3.5')}
            </button>
          </div>
        </div>
      </div>
      <p class="text-center text-[11px] text-graphite">اسحب يميناً ويساراً للتنقل بين أركان الإيمان</p>
    </div>
  `;
}

// 11. Fear and Hope View (الخوف والرجاء وطمأنينة القلب - نظام بطاقات التالي)
function renderFearHopeView(): string {
  const totalSections = FEAR_HOPE_CONTENT.length;
  const activeIndex = Math.min(Math.max(0, state.fearHopeCardIndex), totalSections - 1);
  state.fearHopeCardIndex = activeIndex;
  const section = FEAR_HOPE_CONTENT[activeIndex];

  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-home" class="btn-outlined-pill py-1 px-3 text-xs font-medium text-obsidian flex items-center gap-1.5 cursor-pointer">
          ${ICONS.arrowRight('w-3.5 h-3.5')}
          <span>الرئيسية</span>
        </button>
        <h2 class="font-semibold text-base text-obsidian">الخوف والرجاء والسكينة</h2>
        <div class="text-xs font-mono text-graphite">الباب ${activeIndex + 1} من ${totalSections}</div>
      </div>

      <!-- Step Progress Bar -->
      <div class="w-full bg-ash h-1.5 rounded-full overflow-hidden border border-hairline">
        <div class="bg-obsidian h-full transition-all duration-300" style="width: ${((activeIndex + 1) / totalSections) * 100}%;"></div>
      </div>

      <!-- Fear & Hope Card Deck Item -->
      <div class="card-deck-container" id="fearhope-deck-touch-area">
        <div class="card-luxury p-4 sm:p-5 space-y-4">
          <h3 class="font-semibold text-base sm:text-lg text-obsidian">${section.title}</h3>

          <div class="text-xs sm:text-sm text-graphite space-y-2 leading-relaxed bg-ash p-3.5 rounded-[6px] border border-hairline">
            ${section.content.map(p => `<p class="flex items-start gap-1.5"><span class="text-smoke shrink-0 mt-0.5">•</span><span>${p}</span></p>`).join('')}
          </div>

          ${section.evidence ? `
            <div class="bg-ash p-3 rounded-[6px] border border-hairline font-amiri text-sm sm:text-base text-obsidian text-center font-semibold leading-loose">
              ${section.evidence}
            </div>
          ` : ''}

          <div class="text-[11px] text-graphite text-left border-t border-hairline pt-2">
            المصدر: ${section.source}
          </div>

          <!-- Navigation Buttons: التالي والسابق -->
          <div class="flex items-center justify-between gap-3 pt-2">
            <button 
              id="btn-fearhope-card-prev" 
              class="btn-outlined-pill py-1.5 px-3.5 text-xs font-medium cursor-pointer ${activeIndex > 0 ? '' : 'opacity-40 pointer-events-none'}"
              ${activeIndex === 0 ? 'disabled' : ''}
            >
              ${ICONS.arrowRight('w-3.5 h-3.5')}
              <span>السابق</span>
            </button>

            <button 
              id="btn-fearhope-card-next" 
              class="btn-filled-black py-1.5 px-4 text-xs font-medium cursor-pointer"
            >
              <span>${activeIndex < totalSections - 1 ? 'الباب التالي' : 'العودة للبداية'}</span>
              ${ICONS.arrowLeft('w-3.5 h-3.5')}
            </button>
          </div>
        </div>
      </div>
      <p class="text-center text-[11px] text-graphite">اسحب يميناً ويساراً للتنقل بين أبواب السكينة والرجاء</p>
    </div>
  `;
}

// 11b. Favorites View
function renderFavoritesView(): string {
  const favs = getFavorites();
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-to-more" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1 hover:bg-surface-subtle cursor-pointer">
          ${ICONS.arrowRight('w-3.5 h-3.5')}
          <span>الإعدادات</span>
        </button>
        <h2 class="font-bold text-base text-primary flex items-center gap-1.5">
          ${ICONS.star('w-4 h-4 text-gold', true)}
          <span>العناصر المفضلة (${favs.length})</span>
        </h2>
        <div class="w-12"></div>
      </div>

      ${favs.length === 0 ? `
        <div class="card-luxury p-8 text-center text-xs text-muted space-y-2">
          <div class="flex justify-center">${ICONS.star('w-12 h-12 text-gold/40', true)}</div>
          <p class="font-bold text-sm text-primary">لا توجد عناصر في المفضلة بعد</p>
          <p>يمكنك الضغط على أيقونة النجمة بجانب أي آية أو ذكر لحفظه هنا والرجوع إليه بسرعة.</p>
        </div>
      ` : `
        <div class="space-y-2.5">
          ${favs.map(fav => `
            <div class="card-luxury p-3.5 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="bg-primary/10 text-primary px-2.5 py-0.5 rounded font-bold flex items-center gap-1.5">
                  ${fav.type === 'ayah' ? `${ICONS.quran('w-3.5 h-3.5 text-primary')} <span>آية قرآنية</span>` : (fav.type === 'dhikr' ? `${ICONS.tasbeeh('w-3.5 h-3.5 text-gold')} <span>ذكر مأثور</span>` : `${ICONS.speakerKhutbah('w-3.5 h-3.5 text-primary')} <span>خطبة</span>`)}
                </span>
                <button class="btn-remove-fav text-red-500 hover:text-red-700 p-1 text-xs font-bold cursor-pointer flex items-center gap-1" data-fav-id="${fav.id}">
                  ${ICONS.close('w-3.5 h-3.5')}
                  <span>إزالة</span>
                </button>
              </div>
              <div class="font-bold text-xs text-primary">${fav.title}</div>
              <div class="font-amiri text-sm text-secondary bg-surface-subtle p-2.5 rounded-xl border border-subtle leading-relaxed">
                ${fav.snippet}
              </div>
              ${fav.source ? `<div class="text-[10px] text-muted text-left">المصدر: ${fav.source}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// 11c. Authentic Sources View
function renderSourcesView(): string {
  const sources = [
    { title: 'مجمع الملك فهد لطباعة المصحف الشريف', desc: 'النصوص القرآنية المعتمدة والرسم العثماني برواية حفص عن عاصم', url: 'https://qurancomplex.gov.sa/' },
    { title: 'مشروع تنزيل (Tanzil.net)', desc: 'قاعدة بيانات القرآن الكريم المعتمدة دولياً بدقة فائقة', url: 'https://tanzil.net/' },
    { title: 'موقع الشيخ عبدالعزيز بن باز', desc: 'الفتاوى والأذكار وشروح العقيدة المعتمدة', url: 'https://binbaz.org.sa/' },
    { title: 'موقع الإسلام سؤال وجواب', desc: 'دليل شامل للأحكام الشرعية وأوقات الصلاة والعبادة', url: 'https://islamqa.info/ar' },
    { title: 'الهيئة المصرية العامة للمساحة', desc: 'حساب مواقيت الصلاة وزاوية الفجر والشروق لجمهورية مصر العربية', url: 'https://esa.gov.eg/' },
    { title: 'بوابة محافظة الشرقية الرسمية', desc: 'التقسيم الإداري الرسمي لقرى وعزب مركز أبو كبير - الشرقية', url: 'https://www.sharkia.gov.eg/' },
    { title: 'دار الإفتاء المصرية والأزهر الشريف', desc: 'الفتاوى والمراجع الدينية الرسمية المعتمدة', url: 'https://www.dar-alifta.org/' }
  ];

  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-to-more" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1 hover:bg-surface-subtle cursor-pointer">
          ${ICONS.arrowRight('w-3.5 h-3.5')}
          <span>الإعدادات</span>
        </button>
        <h2 class="font-bold text-base text-primary">المصادر والمراجع المعتمدة</h2>
        <div class="w-12"></div>
      </div>

      <div class="card-luxury p-4 space-y-2 text-xs text-secondary leading-relaxed border-r-4 border-r-primary">
        <p class="font-bold text-sm text-primary">الأمانة العلمية والتوثيق الشرعي:</p>
        <p>تم استخراج وتدقيق كافة النصوص القرآنية والأحاديث النبوية ومواقيت الصلاة من مصادر إسلامية وعلمية موثوقة ومطابقة لمنهج أهل السنة والجماعة.</p>
      </div>

      <div class="space-y-2.5">
        ${sources.map(s => `
          <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="card-luxury p-3.5 block hover:border-primary transition-all group cursor-pointer">
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs text-primary group-hover:underline">${s.title}</span>
              <span class="text-xs text-muted">↗</span>
            </div>
            <p class="text-[11px] text-muted mt-1 leading-relaxed">${s.desc}</p>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

// 11d. Search Modal
function renderSearchModal(): string {
  return `
    <div class="modal-overlay" id="search-modal-overlay">
      <div class="bottom-sheet-content space-y-3 text-right max-h-[85vh] flex flex-col" onclick="event.stopPropagation()">
        <div class="apple-sheet-handle"></div>
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-base text-primary">البحث الشامل في التطبيق</h3>
          <button id="btn-close-search-modal" class="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer" title="إغلاق">${ICONS.close('w-4 h-4')}</button>
        </div>

        <div class="relative">
          <input 
            type="text" 
            id="global-search-input" 
            value="${state.searchQuery}"
            placeholder="ابحث عن ذكر، دعاء، خطبة، أو مسألة إيمانية..." 
            class="w-full bg-surface-subtle border border-subtle rounded-xl p-3 text-xs text-primary placeholder:text-muted focus:outline-none focus:border-primary font-cairo"
            autofocus
          />
        </div>

        <div class="flex-1 overflow-y-auto space-y-2 max-h-80" id="search-results-list">
          ${state.searchQuery.trim() === '' ? `
            <div class="text-center p-6 text-xs text-muted">
              اكتب كلمة البحث للوصول الفوري إلى الأذكار النبوية والأدعية والخطب.
            </div>
          ` : (state.searchResults.length === 0 ? `
            <div class="text-center p-6 text-xs text-muted">
              لم يتم العثور على نتائج مطابقة لـ "${state.searchQuery}".
            </div>
          ` : state.searchResults.map(res => `
            <div class="card-luxury p-3 cursor-pointer hover:border-primary transition-all search-result-item" data-res-type="${res.type}" data-action-id="${res.actionId}">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-primary">${res.title}</span>
                <span class="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">${res.typeLabel}</span>
              </div>
              <div class="text-xs text-secondary mt-1 font-amiri line-clamp-2">${res.snippet}</div>
            </div>
          `).join(''))}
        </div>
      </div>
    </div>
  `;
}

// 12. More / Settings View
function renderMoreView(): string {
  const sub = getSubscriptionStatus(state.currentUser?.email);
  const isAdmin = isAdminUser(state.currentUser?.email);

  return `
    <div class="space-y-4">
      <div>
        <h2 class="text-base font-semibold text-obsidian">الإعدادات والمصادر</h2>
        <p class="text-xs text-graphite">تخصيص التطبيق والتحكم في الخيارات</p>
      </div>

      <!-- Connected User Profile Card -->
      ${state.currentUser ? `
        <div class="card-luxury p-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            ${renderUserProfileAvatar(state.currentUser, 'w-12 h-12', 'w-6 h-6')}
            <div class="min-w-0">
              <div class="font-bold text-xs sm:text-sm text-primary flex items-center gap-1.5">
                <span class="truncate">${state.currentUser.displayName || 'مستخدم مسجل'}</span>
                ${isAdmin ? `
                  <span class="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-black shrink-0 flex items-center gap-1">
                    ${ICONS.crown('w-3 h-3')}
                    <span>المسؤول</span>
                  </span>
                ` : `
                  <span class="text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold shrink-0">نشط</span>
                `}
              </div>
              <div class="text-[11px] text-muted truncate mt-0.5">${state.currentUser.email || ''}</div>
              <button id="btn-edit-profile-settings" class="text-[11px] text-gold-dark dark:text-gold font-bold hover:underline mt-1 flex items-center gap-1 cursor-pointer">
                <span>تعديل الصورة والاسم</span>
                <span>←</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col items-end gap-1.5 shrink-0">
            <button id="btn-edit-profile-btn" class="btn-outlined-pill px-3 py-1.5 text-xs font-bold cursor-pointer border-gold/40 text-gold-dark dark:text-gold hover:bg-gold/10 flex items-center gap-1" title="تعديل الملف الشخصي">
              <span>تعديل</span>
            </button>
            <button id="btn-logout-app" class="text-[11px] text-red-500 hover:text-red-700 font-bold cursor-pointer transition-colors" title="تسجيل الخروج">
              <span>خروج</span>
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Admin Panel Shortcut Card (Visible to Admin Only) -->
      ${isAdmin ? `
        <div class="card-luxury p-4 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="p-1.5 rounded-full bg-ash text-obsidian">${ICONS.crown('w-4 h-4')}</span>
              <div>
                <h3 class="font-semibold text-xs text-obsidian">لوحة تحكم المسؤول (مالك عبدالودود)</h3>
                <p class="text-[11px] text-graphite">إدارة المشتركين وطلبات الدفع</p>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-ash text-obsidian text-[10px] font-medium border border-hairline">Admin</span>
          </div>
          <button id="btn-menu-admin" class="w-full btn-filled-black py-2 text-xs font-medium cursor-pointer">
            ${ICONS.shield('w-3.5 h-3.5')}
            <span>الدخول إلى لوحة إدارة المستخدمين والاشتراكات</span>
          </button>
        </div>
      ` : ''}

      <!-- Subscription Status Card -->
      <div class="card-luxury p-4 space-y-2.5">
        <div class="flex items-center justify-between text-xs">
          <span class="font-medium text-obsidian flex items-center gap-1.5">
            ${ICONS.crown('w-4 h-4 text-graphite')}
            <span>باقة اذكار ، Ankara</span>
          </span>
          <span class="font-medium text-obsidian">
            ${sub.isSubscribed ? 'مشترك نشط' : (sub.isTrial ? 'فترة تجريبية مجانية' : 'منتهية')}
          </span>
        </div>
        <p class="text-xs text-graphite leading-relaxed">
          ${sub.isActive 
            ? `متبقي لك ${sub.daysRemaining} يوم و ${sub.hoursRemaining} ساعة للاستفادة من كافة خصائص التطبيق.`
            : `انتهت الفترة المجانية. اشترك الآن بـ ${SUBSCRIPTION_PRICE_EGP} جنيه شهرياً عبر انستاباي InstaPay (${INSTAPAY_LOCAL_NUMBER}).`
          }
        </p>
        <button id="btn-open-paywall-details" class="w-full btn-filled-black py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer">
          ${ICONS.instapay('w-4 h-4')}
          <span>${sub.isSubscribed ? 'تفاصيل الاشتراك والتجديد' : `الدفع عبر InstaPay (${SUBSCRIPTION_PRICE_EGP} ج.م / شهر)`}</span>
        </button>
      </div>

      <!-- Settings Menu List -->
      <div class="card-luxury divide-y divide-hairline overflow-hidden">
        <button class="w-full p-3.5 flex items-center justify-between text-right hover:bg-ash transition-colors cursor-pointer" id="btn-menu-prayer-alerts">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-ash text-obsidian flex items-center justify-center shrink-0">
              ${ICONS.mic('w-4 h-4')}
            </div>
            <div>
              <div class="font-medium text-xs sm:text-sm text-obsidian flex items-center gap-2">
                <span>تغيير صوت المؤذن والأذان</span>
                <span class="text-[10px] bg-ash text-obsidian px-2 py-0.5 rounded-full border border-hairline inline-flex items-center gap-1">
                  ${ICONS.bell('w-2.5 h-2.5 text-graphite')}
                  <span>مفعّل</span>
                </span>
              </div>
              <div class="text-[11px] text-graphite mt-0.5">المؤذن الحالي: ${MUADHIN_OPTIONS.find(m => m.id === state.prayerAlertsSettings.globalSound)?.name || 'أذان الشيخ ناصر القطامي'}</div>
            </div>
          </div>
          <span class="btn-outlined-pill px-3 py-1 text-xs font-medium shrink-0">
            تغيير
          </span>
        </button>

        <button class="w-full p-3.5 flex items-center justify-between text-right hover:bg-ash transition-colors cursor-pointer" id="btn-menu-apple-sound-effects">
          <div class="flex items-center gap-3">
            <span class="text-graphite">${ICONS.volume('w-4 h-4', audioFx.isSoundEnabled())}</span>
            <div>
              <div class="font-medium text-xs sm:text-sm text-obsidian flex items-center gap-2">
                <span>المؤثرات الصوتية</span>
                <span class="text-[10px] bg-ash text-graphite px-2 py-0.5 rounded-full border border-hairline font-medium">
                  ${audioFx.isSoundEnabled() ? 'مفعّل' : 'صامت'}
                </span>
              </div>
              <div class="text-[11px] text-graphite">أصوات التسبيح والأذكار والتنقل</div>
            </div>
          </div>
          <span class="btn-outlined-pill px-2.5 py-0.5 text-xs font-medium">
            ${audioFx.isSoundEnabled() ? 'إيقاف' : 'تشغيل'}
          </span>
        </button>

        <button class="w-full p-3.5 flex items-center justify-between text-right hover:bg-ash transition-colors cursor-pointer" id="btn-menu-location">
          <div class="flex items-center gap-3">
            <span class="text-graphite">${ICONS.mapPin('w-4 h-4')}</span>
            <div>
              <div class="font-medium text-xs sm:text-sm text-obsidian">تغيير الموقع الجغرافي</div>
              <div class="text-[11px] text-graphite">موقعك الحالي: ${state.selectedLocation.name}</div>
            </div>
          </div>
          <span class="text-smoke">${ICONS.chevronLeft('w-4 h-4')}</span>
        </button>

        <button class="w-full p-3.5 flex items-center justify-between text-right hover:bg-ash transition-colors cursor-pointer" id="btn-menu-favorites">
          <div class="flex items-center gap-3">
            <span class="text-graphite">${ICONS.star('w-4 h-4', true)}</span>
            <div>
              <div class="font-medium text-xs sm:text-sm text-obsidian">العناصر المفضلة</div>
              <div class="text-[11px] text-graphite">الأذكار والخطب المحفوظة</div>
            </div>
          </div>
          <span class="text-smoke">${ICONS.chevronLeft('w-4 h-4')}</span>
        </button>

        <button class="w-full p-3.5 flex items-center justify-between text-right hover:bg-ash transition-colors cursor-pointer" id="btn-menu-sources">
          <div class="flex items-center gap-3">
            <span class="text-graphite">${ICONS.bookOpen('w-4 h-4')}</span>
            <div>
              <div class="font-medium text-xs sm:text-sm text-obsidian">المصادر والمراجع المعتمدة</div>
              <div class="text-[11px] text-graphite">مواقع الفتوى الرسمية وهيئة المساحة</div>
            </div>
          </div>
          <span class="text-smoke">${ICONS.chevronLeft('w-4 h-4')}</span>
        </button>

        <button class="w-full p-3.5 flex items-center justify-between text-right hover:bg-ash transition-colors cursor-pointer" id="btn-menu-appcreator">
          <div class="flex items-center gap-3">
            <span class="text-graphite">${ICONS.android('w-4 h-4')}</span>
            <div>
              <div class="font-medium text-xs sm:text-sm text-obsidian">تحويل التطبيق إلى Android</div>
              <div class="text-[11px] text-graphite">خطوات التشغيل عبر AppCreator24 وWebView</div>
            </div>
          </div>
          <span class="text-smoke">${ICONS.chevronLeft('w-4 h-4')}</span>
        </button>
      </div>

      <!-- App Info & Supervisor Card -->
      <div class="card-luxury p-4 text-center space-y-2">
        <div class="w-14 h-14 rounded-xl p-0.5 bg-gradient-to-tr from-emerald-800 to-amber-400 mx-auto shadow-md">
          <img src="${APP_LOGO_SRC}" alt="Logo" onerror="this.onerror=null;this.src='/images/app_logo.jpg';" class="w-full h-full rounded-[10px] object-cover" />
        </div>
        <h3 class="font-semibold text-xs sm:text-sm text-obsidian flex items-center justify-center gap-1.5">
          <span>تطبيق اذكار ، Ankara</span>
          <span class="text-gold text-xs">۞</span>
        </h3>
        <p class="text-xs text-graphite leading-relaxed">
          «رفيقك اليومي للأذكار النبوية والمسبحة الذكية ومواقيت الصلاة»
        </p>
        <div class="bg-ash p-3 rounded-[6px] border border-hairline text-xs text-graphite space-y-1">
          <p>تم صنعه بواسطة: <span class="font-medium text-obsidian">المبرمج مالك عبدالودود وأحمد رضا الشبراوي</span></p>
          <p>تحت إشراف: <span class="font-medium text-obsidian">الدكتور/الشيخ سعد محفوظ</span></p>
        </div>
      </div>
    </div>
  `;
}

// 13. Location Modal (Manual with exactly the 28 Abu Kabir Villages & Popular Locations)
function renderLocationModal(): string {
  return `
    <div class="modal-overlay" id="location-modal-overlay">
      <div class="bottom-sheet-content space-y-4 text-right" onclick="event.stopPropagation()">
        <div class="apple-sheet-handle"></div>
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-base text-primary">اختر موقعك لمواقيت الصلاة والقبلة</h3>
          <button id="btn-close-location-modal" class="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer" title="إغلاق">${ICONS.close('w-4 h-4')}</button>
        </div>

        <p class="text-xs text-muted">
          لا نجبرك على تفعيل الـ GPS أبداً. يمكنك الاختيار يدوياً أو تلقائياً بنقرة واحدة.
        </p>

        <!-- Quick Popular Locations Chips -->
        <div>
          <label class="block text-xs font-semibold text-secondary mb-1.5">مدن ومواقع رئيسية سريعة:</label>
          <div class="flex flex-wrap gap-1.5">
            ${POPULAR_LOCATIONS.map(loc => `
              <button 
                class="btn-popular-location text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${state.selectedLocation.name === loc.name ? 'bg-primary text-white border-primary' : 'bg-surface-subtle border-subtle text-secondary hover:border-primary'}"
                data-loc-json='${JSON.stringify(loc)}'
              >
                ${ICONS.mapPin('w-3 h-3')}
                <span>${loc.name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Option 1: Automatic GPS -->
        <button id="btn-detect-gps" class="w-full card-luxury p-3 flex items-center gap-3 text-right hover:border-primary transition-colors cursor-pointer">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            ${ICONS.satellite('w-6 h-6 text-primary')}
          </div>
          <div>
            <div class="font-bold text-sm text-primary">تحديد موقعي تلقائياً (GPS)</div>
            <div class="text-xs text-muted">استخدام إحداثيات الهاتف الدقيقة أينما كنت</div>
          </div>
        </button>

        <div class="text-xs font-bold text-muted text-center flex items-center gap-2">
          <div class="flex-1 border-t border-subtle"></div>
          <span>أو اختيار قرى مركز أبو كبير - الشرقية</span>
          <div class="flex-1 border-t border-subtle"></div>
        </div>

        <!-- Manual Selector: Governorate -> Center -> Village -->
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1">المحافظة:</label>
            <select id="select-governorate" class="w-full bg-surface-subtle border border-subtle rounded-xl p-2.5 text-xs text-primary font-bold">
              ${EGYPT_GOVERNORATES.map(gov => `
                <option value="${gov}" ${gov === 'الشرقية' ? 'selected' : ''}>محافظة ${gov}</option>
              `).join('')}
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-secondary mb-1">المركز / المدينة:</label>
            <select id="select-city" class="w-full bg-surface-subtle border border-subtle rounded-xl p-2.5 text-xs text-primary font-bold">
              <option value="مركز أبو كبير" selected>مركز أبو كبير (محافظة الشرقية)</option>
              <option value="مدينة الزقازيق">مدينة الزقازيق</option>
              <option value="مركز فاقوس">مركز فاقوس</option>
              <option value="مركز بلبيس">مركز بلبيس</option>
              <option value="مركز ديرب نجم">مركز ديرب نجم</option>
              <option value="مركز ههيا">مركز ههيا</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-secondary mb-1">
              القرية / المنطقة (مركز أبو كبير المعتمدة رسمياً):
            </label>
            <div class="max-h-48 overflow-y-auto space-y-1.5 border border-subtle p-2 rounded-xl bg-surface-subtle" id="villages-picker-list">
              ${ABU_KABIR_VILLAGES.map(village => `
                <button 
                  class="w-full p-2 text-right rounded-lg text-xs font-medium hover:bg-primary hover:text-white transition-colors flex items-center justify-between village-select-btn cursor-pointer"
                  data-village="${village}"
                >
                  <span class="flex items-center gap-1.5">
                    ${ICONS.mapPin('w-3.5 h-3.5 text-primary')}
                    <span>${village}</span>
                  </span>
                  <span class="text-[10px] opacity-75">أبو كبير</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Add custom village or Ezba -->
          <div>
            <label class="block text-xs font-semibold text-secondary mb-1">إضافة عزبة / قرية مخصصة:</label>
            <div class="flex gap-2">
              <input type="text" id="custom-village-input" placeholder="اكتب اسم العزبة أو التابع..." class="flex-1 bg-surface-subtle border border-subtle rounded-xl px-3 py-2 text-xs text-primary focus:outline-none focus:border-primary" />
              <button id="btn-save-custom-village" class="bg-primary text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-primary-dark cursor-pointer">
                حفظ
              </button>
            </div>
          </div>
        </div>

        <div class="text-[11px] text-muted text-center pt-1">
          المصدر الإداري الأساسي: <a href="https://www.sharkia.gov.eg/areas/abo_kbeer/default_t2sem.aspx" target="_blank" class="underline text-primary">بوابة محافظة الشرقية الإلكترونية</a>
        </div>
      </div>
    </div>
  `;
}

// 14. Paywall Modal (InstaPay Payment Flow + WhatsApp)
function renderPaywallModal(): string {
  const sub = getSubscriptionStatus(state.currentUser?.email);
  const step = state.paywallStep || 1;
  const whatsAppUrl = generateWhatsAppPaymentUrl(
    state.currentUser?.displayName || 'مستخدم زاد المسلم',
    state.currentUser?.email || '',
    SUBSCRIPTION_PRICE_EGP
  );

  return `
    <div class="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex flex-col p-4 sm:p-6 overflow-y-auto select-none" id="paywall-modal-overlay">
      <div class="max-w-lg w-full mx-auto my-auto space-y-4 bg-paper border border-hairline p-5 sm:p-6 rounded-[6px] shadow-sm">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-3 border-b border-hairline">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl p-0.5 bg-gradient-to-tr from-emerald-800 to-amber-400 shrink-0 shadow-sm">
              <img src="${APP_LOGO_SRC}" alt="Logo" onerror="this.onerror=null;this.src='/images/app_logo.jpg';" class="w-full h-full rounded-[8px] object-cover" />
            </div>
            <div>
              <h3 class="font-semibold text-sm sm:text-base text-obsidian">الاشتراك عبر InstaPay</h3>
              <p class="text-xs text-graphite mt-0.5">
                ${sub.isExpired ? 'انتهت فترة الـ 3 أيام التجريبية المجانية.' : 'فعّل حسابك للوصول الدائم لكافة المميزات.'}
              </p>
            </div>
          </div>
          <button id="btn-close-paywall" class="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-graphite hover:text-obsidian hover:bg-ash transition-colors cursor-pointer" title="إغلاق">
            ${ICONS.close('w-4 h-4')}
          </button>
        </div>

        <!-- Segmented Control Step Indicators -->
        <div class="grid grid-cols-3 gap-1.5 p-1 bg-ash rounded-full border border-hairline">
          <div class="py-1.5 px-2 rounded-full text-center text-xs font-medium transition-all ${step === 1 ? 'bg-obsidian text-paper' : 'text-graphite'}">
            ١. التحويل
          </div>
          <div class="py-1.5 px-2 rounded-full text-center text-xs font-medium transition-all ${step === 2 ? 'bg-obsidian text-paper' : 'text-graphite'}">
            ٢. الإيصال
          </div>
          <div class="py-1.5 px-2 rounded-full text-center text-xs font-medium transition-all ${step === 3 ? 'bg-obsidian text-paper' : 'text-graphite'}">
            ٣. التأكيد
          </div>
        </div>

        <!-- Pricing Hero Card -->
        <div class="pricing-hero-card p-5 space-y-2">
          <div>
            <span class="pricing-badge">باقة الاشتراك الشهري</span>
          </div>
          <div class="pricing-amount">
            ${SUBSCRIPTION_PRICE_EGP} <span class="text-sm font-normal text-graphite">جنيه مصري / شهر</span>
          </div>
          <p class="pricing-subtext">30 يوماً متواصلة من الأذكار والمواقيت والمسبحة وبدون إعلانات</p>
        </div>

        <!-- STEP 1 CARD: InstaPay Transfer -->
        <div class="p-4 rounded-[6px] bg-ash border border-hairline space-y-3 ${step === 1 ? '' : 'hidden'}">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-obsidian flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-obsidian text-paper text-[11px] flex items-center justify-center font-medium">1</span>
              <span>الخطوة الأولى: التحويل الفوري عبر تطبيق InstaPay</span>
            </span>
            <span class="text-[10px] bg-paper text-obsidian px-2.5 py-0.5 rounded-full font-medium border border-hairline flex items-center gap-1">
              ${ICONS.instapay('w-3 h-3')}
              <span>انستاباي مصر</span>
            </span>
          </div>

          <!-- InstaPay Mobile Number Card -->
          <div class="p-3 bg-paper rounded-[6px] border border-hairline flex items-center justify-between gap-3">
            <div class="text-left font-mono">
              <div class="text-[10px] text-graphite font-sans font-medium">رقم الهاتف للتحويل (InstaPay):</div>
              <div class="font-semibold text-sm sm:text-base text-obsidian tracking-wider" dir="ltr">${INSTAPAY_LOCAL_NUMBER}</div>
              <div class="text-[11px] text-graphite" dir="ltr">${INSTAPAY_NUMBER}</div>
            </div>
            <button id="btn-copy-vodafone-num" class="btn-filled-black py-1.5 px-3 text-xs font-medium cursor-pointer shrink-0">
              ${ICONS.copy('w-3.5 h-3.5')}
              <span>نسخ الرقم</span>
            </button>
          </div>

          <!-- InstaPay IPA / Username Card -->
          <div class="p-3 bg-paper rounded-[6px] border border-hairline flex items-center justify-between gap-2 text-xs">
            <div class="text-left font-mono">
              <span class="text-[10px] text-graphite font-sans font-medium block">عنوان الدفع اللحظي (IPA):</span>
              <span class="text-xs font-semibold text-obsidian font-mono" dir="ltr">${INSTAPAY_IPA}</span>
            </div>
            <button id="btn-copy-instapay-ipa" class="btn-outlined-pill py-1 px-2.5 text-[11px] font-medium cursor-pointer shrink-0">
              ${ICONS.copy('w-3 h-3')}
              <span>نسخ IPA</span>
            </button>
          </div>

          <p class="text-xs text-graphite leading-relaxed">
            افتح تطبيق <strong class="text-obsidian font-medium">InstaPay مصر</strong> وحوّل مبلغ <strong class="text-obsidian font-semibold">100 جنيه مصري</strong> إلى الرقم أعلاه، ثم اضغط على زر التالي لرفع إيصال التحويل.
          </p>
          <button id="btn-paywall-next-1" class="w-full btn-filled-black py-2.5 text-xs font-medium cursor-pointer">
            <span>التالي (رفع إيصال التحويل)</span>
            ${ICONS.chevronLeft('w-3.5 h-3.5')}
          </button>
        </div>

        <!-- STEP 2 CARD: Secure Receipt Upload -->
        <div class="p-4 rounded-[6px] bg-ash border border-hairline space-y-3 ${step === 2 ? '' : 'hidden'}">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-obsidian flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-obsidian text-paper text-[11px] flex items-center justify-center font-medium">2</span>
              <span>الخطوة الثانية: رفع إيصال التحويل</span>
            </span>
            <span class="text-[10px] bg-paper text-obsidian px-2.5 py-0.5 rounded-full font-medium border border-hairline">إرفاق آمن</span>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-graphite mb-1">رقم الهاتف المُحوَّل منه:</label>
              <input 
                type="tel" 
                id="receipt-sender-phone" 
                placeholder="مثال: 01012345678" 
                class="w-full bg-paper border border-hairline rounded-full py-2 px-3 text-xs text-obsidian font-mono focus:outline-none focus:border-obsidian"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-graphite mb-1">صورة إيصال التحويل:</label>
              <input 
                type="file" 
                id="receipt-file-input" 
                accept="image/*" 
                class="w-full text-xs text-graphite file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-obsidian file:text-paper cursor-pointer bg-paper border border-hairline rounded-full p-1.5"
              />
            </div>

            <!-- Image Preview Box -->
            <div id="receipt-preview-box" class="${state.receiptUploadPreview ? '' : 'hidden'} p-3 border border-dashed border-hairline rounded-[6px] bg-paper text-center">
              <img id="receipt-preview-img" src="${state.receiptUploadPreview || ''}" alt="صورة الإيصال" class="max-h-40 mx-auto rounded-[4px] object-contain" />
              <div class="text-xs text-obsidian font-medium mt-2 flex items-center justify-center gap-1.5">
                ${ICONS.check('w-3.5 h-3.5 text-obsidian')}
                <span>تم إرفاق الإيصال بنجاح</span>
              </div>
            </div>
          </div>

          <div class="flex gap-2 pt-1">
            <button id="btn-paywall-prev-2" class="btn-outlined-pill px-4 py-2 text-xs font-medium cursor-pointer">
              السابق
            </button>
            <button id="btn-paywall-next-2" class="flex-1 btn-filled-black py-2 text-xs font-medium cursor-pointer">
              <span>التالي (المراجعة والتأكيد)</span>
              ${ICONS.chevronLeft('w-3.5 h-3.5')}
            </button>
          </div>
        </div>

        <!-- STEP 3 CARD: Review & Unified Submission Button -->
        <div class="p-4 rounded-[6px] bg-ash border border-hairline space-y-3 ${step === 3 ? '' : 'hidden'}">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-obsidian flex items-center gap-2">
              <span class="w-5 h-5 rounded-full bg-obsidian text-paper text-[11px] flex items-center justify-center font-medium">3</span>
              <span>الخطوة الثالثة: مراجعة وإرسال الطلب</span>
            </span>
            <span class="text-[10px] bg-paper text-obsidian px-2.5 py-0.5 rounded-full font-medium border border-hairline">إرسال موحد</span>
          </div>

          <div class="p-3.5 bg-paper rounded-[6px] border border-hairline text-xs space-y-2 text-right">
            <div class="flex justify-between"><span class="text-graphite">صاحب الحساب:</span> <strong class="text-obsidian font-medium">${state.currentUser?.displayName || 'مستخدم'}</strong></div>
            <div class="flex justify-between"><span class="text-graphite">البريد الإلكتروني:</span> <strong class="text-obsidian font-mono text-[11px]">${state.currentUser?.email || '—'}</strong></div>
            <div class="flex justify-between"><span class="text-graphite">المبلغ:</span> <strong class="text-obsidian font-medium">100 جنيه مصري</strong></div>
            <div class="flex justify-between"><span class="text-graphite">حالة الإيصال:</span> <strong class="text-obsidian font-medium">جاهز ومرفق</strong></div>
          </div>

          <div class="space-y-2 pt-1">
            <button 
              id="btn-submit-receipt-app" 
              class="w-full btn-filled-black py-3 text-xs font-medium cursor-pointer flex items-center justify-center gap-2"
            >
              ${ICONS.upload('w-4 h-4')}
              <span>إرسال الطلب الموحد (للأدمن والواتساب)</span>
            </button>
          </div>

          <div class="flex gap-2 pt-1">
            <button id="btn-paywall-prev-3" class="w-full btn-outlined-pill py-2 text-xs font-medium cursor-pointer">
              السابق
            </button>
          </div>
        </div>

        <!-- Manual Code / Voucher fallback -->
        <div class="p-3.5 rounded-[6px] bg-ash border border-hairline space-y-2">
          <div class="text-xs text-graphite">أو أدخل كود التفعيل المباشر:</div>
          <div class="flex gap-2">
            <input type="text" id="activation-code-input" placeholder="مثال: ZAD100" class="flex-1 bg-paper border border-hairline rounded-full px-3 py-1.5 text-xs text-obsidian font-mono focus:outline-none focus:border-obsidian" />
            <button id="btn-activate-code" class="btn-filled-black px-4 py-1.5 text-xs font-medium cursor-pointer">
              تفعيل
            </button>
          </div>
        </div>

        <!-- Sandbox & Close Controls -->
        <div class="border-t border-hairline pt-3 flex items-center justify-between text-xs text-graphite">
          <button id="btn-test-trial-reset" class="hover:text-obsidian underline cursor-pointer transition-colors">
            تجديد الـ 3 أيام التجريبية
          </button>
          <button id="btn-close-paywall" class="font-medium text-obsidian hover:opacity-80 cursor-pointer">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  `;
}

// 18. Subscription Full View (InstaPay + Full Management)
function renderSubscriptionFullView(): string {
  const sub = getSubscriptionStatus(state.currentUser?.email);
  const whatsAppUrl = generateWhatsAppPaymentUrl(
    state.currentUser?.displayName || 'مستخدم زاد المسلم',
    state.currentUser?.email || '',
    SUBSCRIPTION_PRICE_EGP
  );

  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-to-more" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1.5 hover:bg-surface-subtle transition-colors cursor-pointer">
          ${ICONS.arrowRight('w-3.5 h-3.5')}
          <span>الإعدادات</span>
        </button>
        <h2 class="font-bold text-base text-primary flex items-center gap-1.5">
          ${ICONS.crown('w-4 h-4 text-gold')}
          <span>إدارة اشتراك اذكار ، Ankara</span>
        </h2>
        <div class="w-12"></div>
      </div>

      <div class="card-luxury p-5 text-center space-y-4">
        <div class="w-16 h-16 bg-gold/15 text-gold border border-gold/30 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          ${ICONS.crown('w-8 h-8 text-gold')}
        </div>
        <div>
          <h3 class="font-bold text-lg text-primary">الباقة الشهرية المميزة الكاملة</h3>
          <p class="text-xs text-muted mt-1">
            حالة الاشتراك: <span class="font-bold ${sub.isActive ? 'text-emerald-600' : 'text-red-500'}">${sub.isSubscribed ? 'نشط (30 يوماً)' : (sub.isTrial ? `فترة تجريبية مجانية (متبقي ${sub.daysRemaining} يوم)` : 'منتهي')}</span>
          </p>
        </div>

        <div class="pricing-hero-card p-5">
          <div>
            <span class="pricing-badge">قيمة الاشتراك الشهري</span>
          </div>
          <div class="pricing-amount tabular-nums">
            ${SUBSCRIPTION_PRICE_EGP} <span class="text-lg font-bold opacity-90">جنيه مصري / شهر</span>
          </div>
          <div class="pricing-subtext">الدفع اللحظي الفوري عبر تطبيق انستاباي InstaPay مصر</div>
        </div>

        <!-- InstaPay Direct Box -->
        <div class="card-luxury p-4 bg-surface-subtle border border-subtle text-right space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-primary flex items-center gap-1.5">
              ${ICONS.instapay('w-4 h-4 text-purple-600')}
              <span>رقم انستاباي (InstaPay) للتحويل:</span>
            </span>
            <span class="text-[10px] bg-purple-500/15 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded font-bold">تحويل لحظي فوري</span>
          </div>

          <div class="p-3 bg-surface rounded-2xl border border-subtle flex items-center justify-between gap-3 shadow-2xs">
            <div class="text-left font-mono">
              <div class="font-extrabold text-base sm:text-lg text-primary tracking-wider" dir="ltr">${INSTAPAY_LOCAL_NUMBER}</div>
              <div class="text-[11px] text-muted" dir="ltr">${INSTAPAY_NUMBER}</div>
            </div>
            <button id="btn-copy-vodafone-num-page" class="px-3.5 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors flex items-center gap-1 cursor-pointer">
              ${ICONS.copy('w-3.5 h-3.5')}
              <span>نسخ الرقم</span>
            </button>
          </div>

          <!-- InstaPay IPA -->
          <div class="p-3 bg-purple-500/5 dark:bg-purple-500/10 rounded-2xl border border-purple-500/20 flex items-center justify-between gap-2 text-xs">
            <div class="text-left font-mono">
              <span class="text-[10px] text-purple-700 dark:text-purple-300 font-sans font-bold block">عنوان الدفع اللحظي (IPA):</span>
              <span class="text-xs font-bold text-primary font-mono" dir="ltr">${INSTAPAY_IPA}</span>
            </div>
            <button id="btn-copy-instapay-ipa-page" class="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0">
              ${ICONS.copy('w-3 h-3')}
              <span>نسخ IPA</span>
            </button>
          </div>

          <a 
            href="${whatsAppUrl}" 
            target="_blank" 
            class="btn-touch w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            ${ICONS.whatsapp('w-4 h-4')}
            <span>إرسال إشعار الدفع عبر WhatsApp (+201114809908)</span>
          </a>
        </div>

        <!-- Direct In-Page Receipt Form -->
        <div class="card-luxury p-4 bg-surface/95 border border-subtle text-right space-y-2.5">
          <h4 class="font-bold text-xs text-primary flex items-center gap-1.5">
            ${ICONS.upload('w-4 h-4 text-primary')}
            <span>إرفاق صورة إيصال التحويل للمراجعة:</span>
          </h4>

          <input 
            type="tel" 
            id="receipt-sender-phone-page" 
            placeholder="رقم الهاتف أو حساب InstaPay المُحوَّل منه..." 
            class="w-full bg-surface-subtle border border-subtle rounded-xl p-2.5 text-xs text-primary font-mono focus:outline-none focus:border-primary"
          />

          <input 
            type="file" 
            id="receipt-file-input-page" 
            accept="image/*" 
            class="w-full text-xs text-secondary file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
          />

          <button 
            id="btn-submit-receipt-page" 
            class="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            ${ICONS.upload('w-4 h-4')}
            <span>إرسال الإيصال للمسؤول</span>
          </button>
        </div>

        <div class="border-t border-subtle pt-3 text-xs text-muted space-y-2">
          <p>أو أدخل كود التفعيل السريع:</p>
          <div class="flex gap-2">
            <input type="text" id="activation-code-input-page" placeholder="كود التفعيل (مثال: ZAD100)" class="flex-1 bg-surface-subtle border border-subtle rounded-xl p-2.5 text-xs text-primary font-mono focus:outline-none focus:border-primary" />
            <button id="btn-activate-code-page" class="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary-dark transition-colors cursor-pointer">تفعيل</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 19. AppCreator24 Export Guide View
function renderAppCreatorExportView(): string {
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-to-more" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1 hover:bg-surface-subtle cursor-pointer">
          <span>←</span>
          <span>الإعدادات</span>
        </button>
        <h2 class="font-bold text-base text-primary">تحويل التطبيق إلى AppCreator24</h2>
        <div class="w-12"></div>
      </div>

      <div class="card-luxury p-4 space-y-3 text-xs text-secondary leading-relaxed">
        <p class="font-bold text-primary text-sm">جاهزية كاملة لـ AppCreator24 وWebView:</p>
        <p>
          تمت كتابة تطبيق «زاد المسلم» بمعايير الويب الخالصة (HTML5 / CSS3 / ES6+) بدون أي Framework معقد، مما يتيح لك تحويله لتطبيق Android APK رسمي فوراً عبر AppCreator24 بخطوتين:
        </p>

        <div class="space-y-2">
          <div class="p-2.5 rounded-xl bg-surface-subtle border border-subtle">
            <div class="font-bold text-primary">الطريقة الأولى: رابط Web App المباشر (الأسهل والأسرع)</div>
            <p class="text-muted mt-1">1. ادخل إلى لوحة التحكم في AppCreator24.</p>
            <p class="text-muted">2. أنشئ قسماً جديداً من نوع <span class="font-bold text-primary">Web (موقع ويب)</span>.</p>
            <p class="text-muted">3. ضع رابط هذا التطبيق المنشور، وسيعمل فوراً داخل التطبيق بشكله الفخم ونظام الـ Bottom Navigation الكامل.</p>
          </div>

          <div class="p-2.5 rounded-xl bg-surface-subtle border border-subtle">
            <div class="font-bold text-primary">الطريقة الثانية: تضمين الملفات Offline ZIP</div>
            <p class="text-muted mt-1">يمكنك رفع ملفات الـ HTML والـ CSS والـ JS داخل ملف ZIP في قسم (HTML Local) ليعمل التطبيق كاملاً حتى في حالة انقطاع شبكة الهاتف.</p>
          </div>
        </div>

        <div class="bg-primary/10 text-primary p-3 rounded-xl border border-primary/20 font-semibold text-center flex items-center justify-center gap-2">
          ${ICONS.android('w-4 h-4 text-primary')}
          <span>تجربة مستخدم نقية تطابق تطبيقات الأندرويد الأصلية بنسبة 100%!</span>
        </div>
      </div>
    </div>
  `;
}

// 20. Banned User Screen (If user was banned by Admin)
function renderBannedUserScreen(): string {
  const whatsAppUrl = `https://wa.me/201114809908?text=${encodeURIComponent(
    `السلام عليكم ورحمة الله، تم تعليق/حظر حسابي (${state.currentUser?.email || state.currentUser?.displayName || ''}) في تطبيق زاد المسلم وأود مراجعة الإدارة وتفعيله.`
  )}`;

  return `
    <div class="min-h-screen bg-canvas text-body flex flex-col items-center justify-center p-6 text-center select-none font-cairo">
      <div class="card-luxury p-6 max-w-sm w-full space-y-4 border-2 border-red-500/50 shadow-2xl bg-surface/95 text-center">
        <div class="w-16 h-16 rounded-3xl bg-red-500/15 border border-red-500/30 text-red-600 flex items-center justify-center mx-auto shadow-sm">
          ${ICONS.shield('w-8 h-8')}
        </div>
        
        <div>
          <h2 class="font-bold text-lg text-red-600">تم حظر هذا الحساب</h2>
          <p class="text-xs text-muted mt-1">لقد تم تعليق صلاحية دخول هذا الحساب من قبل إدارة التطبيق.</p>
        </div>

        <div class="bg-surface-subtle p-3 rounded-xl border border-subtle text-xs text-secondary space-y-1.5 text-right">
          <div class="flex items-center justify-between">
            <span class="text-muted">اسم الحساب:</span>
            <strong class="text-primary">${state.currentUser?.displayName || 'مستخدم Google'}</strong>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted">البريد الإلكتروني:</span>
            <strong class="text-primary font-mono text-[11px]">${state.currentUser?.email || '—'}</strong>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-muted">حالة الحساب:</span>
            <span class="text-red-600 bg-red-500/15 px-2 py-0.5 rounded font-bold text-[10px] flex items-center gap-1">
              ${ICONS.ban('w-3 h-3 text-red-600')}
              <span>محظور وموقوف</span>
            </span>
          </div>
        </div>

        <div class="space-y-2 pt-2">
          <a 
            href="${whatsAppUrl}" 
            target="_blank" 
            class="btn-touch w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            ${ICONS.whatsapp('w-4 h-4')}
            <span>مراسلة المسؤول عبر WhatsApp (+201114809908)</span>
          </a>

          <button id="btn-logout-banned" class="w-full py-2.5 rounded-xl border border-subtle text-xs font-bold text-secondary hover:bg-surface-subtle transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
            ${ICONS.logOut('w-3.5 h-3.5')}
            <span>تسجيل الخروج والتبديل لحساب آخر</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// 21. Admin Dashboard View (For malek2013vscode@gmail.com)
function renderAdminView(): string {
  const isAdmin = isAdminUser(state.currentUser?.email);
  if (!isAdmin) {
    return `
      <div class="card-luxury p-8 text-center space-y-3 text-red-500">
        <div class="flex justify-center">${ICONS.alertTriangle('w-12 h-12 text-red-500')}</div>
        <h3 class="font-bold text-base">غير مصرح لك بالدخول</h3>
        <p class="text-xs text-muted">لوحة تحكم المسؤول مخصصة حصرياً للمبرمج مالك (${ADMIN_EMAIL}).</p>
        <button id="btn-back-home" class="mt-2 bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">العودة للرئيسية</button>
      </div>
    `;
  }

  const users = getManagedUsers();
  const paymentRequests = getPaymentRequests();

  const pendingRequests = paymentRequests.filter(r => r.status === 'pending');
  const activeSubscribers = users.filter(u => u.status === 'subscribed');
  const bannedUsers = users.filter(u => u.status === 'banned');

  const filteredUsers = state.adminUserSearch.trim()
    ? users.filter(u => 
        u.email.toLowerCase().includes(state.adminUserSearch.toLowerCase()) || 
        u.displayName.toLowerCase().includes(state.adminUserSearch.toLowerCase()) ||
        (u.phone && u.phone.includes(state.adminUserSearch))
      )
    : users;

  return `
    <div class="space-y-5">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <button id="btn-back-home" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1.5 hover:bg-surface-subtle transition-colors cursor-pointer">
          ${ICONS.arrowRight('w-3.5 h-3.5')}
          <span>الرئيسية</span>
        </button>
        <div class="text-center">
          <h2 class="font-bold text-base text-primary flex items-center justify-center gap-1.5">
            ${ICONS.crown('w-4 h-4 text-gold')}
            <span>لوحة تحكم المسؤول (مالك عبدالودود)</span>
          </h2>
          <div class="text-[11px] text-muted font-mono">${ADMIN_EMAIL}</div>
        </div>
        <button id="btn-refresh-admin" class="p-1.5 rounded-lg border border-subtle hover:bg-surface-subtle text-primary transition-colors cursor-pointer" title="تحديث البيانات">
          ${ICONS.rotate('w-4 h-4 text-primary')}
        </button>
      </div>

      <!-- Quick KPI Stats Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div class="card-luxury p-3 text-center bg-surface space-y-0.5 border-t-2 border-t-primary">
          <div class="text-lg font-extrabold text-primary">${users.length}</div>
          <div class="text-[10px] text-muted font-semibold">إجمالي المستخدمين</div>
        </div>
        <div class="card-luxury p-3 text-center bg-surface space-y-0.5 border-t-2 border-t-amber-500">
          <div class="text-lg font-extrabold text-amber-600">${pendingRequests.length}</div>
          <div class="text-[10px] text-muted font-semibold">طلبات InstaPay المعلقة</div>
        </div>
        <div class="card-luxury p-3 text-center bg-surface space-y-0.5 border-t-2 border-t-emerald-500">
          <div class="text-lg font-extrabold text-emerald-600">${activeSubscribers.length}</div>
          <div class="text-[10px] text-muted font-semibold">المشتركون النشطون</div>
        </div>
        <div class="card-luxury p-3 text-center bg-surface space-y-0.5 border-t-2 border-t-red-500">
          <div class="text-lg font-extrabold text-red-600">${bannedUsers.length}</div>
          <div class="text-[10px] text-muted font-semibold">المستخدمون المحظورون</div>
        </div>
      </div>

      <!-- SECTION 1: InstaPay Payment Requests -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-primary flex items-center gap-1.5">
            ${ICONS.instapay('w-4 h-4 text-purple-600')}
            <span>طلبات دفع انستاباي InstaPay (${paymentRequests.length})</span>
          </h3>
          <span class="text-xs text-muted">رقم الاستلام: <strong class="text-primary font-mono">${INSTAPAY_LOCAL_NUMBER}</strong></span>
        </div>

        ${paymentRequests.length === 0 ? `
          <div class="card-luxury p-6 text-center text-xs text-muted space-y-1">
            <div class="flex justify-center">${ICONS.inbox('w-8 h-8 text-muted')}</div>
            <p>لا توجد طلبات دفع مرسلة حتى الآن.</p>
          </div>
        ` : `
          <div class="space-y-2.5">
            ${paymentRequests.map(req => `
              <div class="card-luxury p-3.5 space-y-3 border-r-4 ${req.status === 'pending' ? 'border-r-amber-500 bg-amber-500/5' : (req.status === 'approved' ? 'border-r-emerald-500' : 'border-r-red-500')}">
                <div class="flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div class="font-bold text-primary text-sm flex items-center gap-1.5">
                      <span>${req.userName}</span>
                      <span class="text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1 ${req.status === 'pending' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' : (req.status === 'approved' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/20 text-red-600')}">
                        ${req.status === 'pending' ? `${ICONS.hourglass('w-3 h-3')} <span>قيد المراجعة</span>` : (req.status === 'approved' ? `${ICONS.check('w-3 h-3')} <span>تم القبول والتفعيل</span>` : `${ICONS.close('w-3 h-3')} <span>مرفوض</span>`)}
                      </span>
                    </div>
                    <div class="text-[11px] text-muted font-mono mt-0.5">${req.userEmail}</div>
                    ${req.senderPhone ? `
                      <div class="text-[11px] text-secondary font-bold mt-0.5">
                        رقم المحول منه: <span class="font-mono text-primary">${req.senderPhone}</span>
                      </div>
                    ` : ''}
                    <div class="text-[10px] text-muted mt-0.5">${req.date} — مبلغ: <strong class="text-primary">${req.amount} جنيه</strong></div>
                  </div>

                  <!-- Receipt Image Thumbnail -->
                  ${req.receiptImage ? `
                    <button 
                      class="btn-view-receipt shrink-0 w-16 h-16 rounded-xl border-2 border-gold/40 overflow-hidden bg-surface hover:opacity-90 transition-opacity cursor-pointer relative group" 
                      data-img-src="${req.receiptImage}"
                      title="انقر لتكبير صورة الإيصال"
                    >
                      <img src="${req.receiptImage}" alt="Receipt" class="w-full h-full object-cover" />
                      <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity gap-1">
                        ${ICONS.search('w-3 h-3')}
                        <span>تكبير</span>
                      </div>
                    </button>
                  ` : `
                    <div class="text-[10px] text-muted bg-surface-subtle p-2 rounded-lg border border-subtle shrink-0">
                      بدون صورة
                    </div>
                  `}
                </div>

                <!-- Admin Action Buttons -->
                <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-subtle">
                  ${req.status !== 'approved' ? `
                    <button 
                      class="btn-approve-request flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      data-req-id="${req.id}"
                    >
                      ${ICONS.userCheck('w-3.5 h-3.5')}
                      <span>الموافقة وتفعيل 30 يوماً</span>
                    </button>
                  ` : ''}

                  ${req.status === 'pending' ? `
                    <button 
                      class="btn-reject-request bg-amber-600 hover:bg-amber-700 text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      data-req-id="${req.id}"
                    >
                      <span>رفض الطلب</span>
                    </button>
                  ` : ''}

                  <button 
                    class="btn-delete-request text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    data-req-id="${req.id}"
                    title="حذف السجل"
                  >
                    ${ICONS.trash('w-3.5 h-3.5')}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- SECTION 2: User Access & Ban Control -->
      <div class="space-y-3 pt-2 border-t border-subtle">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-primary flex items-center gap-1.5">
            ${ICONS.shield('w-4 h-4 text-primary')}
            <span>إدارة المستخدمين والتحكم بالدخول والحظر (${users.length})</span>
          </h3>
        </div>

        <!-- Search / Filter Users -->
        <div>
          <input 
            type="text" 
            id="admin-user-search-input" 
            value="${state.adminUserSearch}"
            placeholder="بحث بالاسم أو البريد الإلكتروني أو الهاتف..." 
            class="w-full bg-surface-subtle border border-subtle rounded-xl px-3 py-2 text-xs text-primary placeholder:text-muted focus:outline-none focus:border-primary"
          />
        </div>

        <!-- Users Directory List -->
        <div class="space-y-2 max-h-96 overflow-y-auto">
          ${filteredUsers.map(u => {
            const userIsAdmin = isAdminUser(u.email);
            return `
              <div class="card-luxury p-3 space-y-2 border ${u.status === 'banned' ? 'border-red-500/50 bg-red-500/5' : 'border-subtle'}">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2.5 min-w-0">
                    ${renderUserProfileAvatar(u, 'w-9 h-9', 'w-5 h-5')}
                    <div class="min-w-0">
                      <div class="font-bold text-xs text-primary flex items-center gap-1.5">
                        <span class="truncate">${u.displayName}</span>
                        ${userIsAdmin ? `
                          <span class="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-extrabold shrink-0 flex items-center gap-1">${ICONS.crown('w-3 h-3 inline text-slate-950')} <span>مسؤول</span></span>
                        ` : u.status === 'banned' ? `
                          <span class="text-[9px] bg-red-500 text-white px-1.5 py-0.2 rounded font-bold shrink-0 flex items-center gap-1">${ICONS.ban('w-3 h-3 inline text-white')} <span>محظور</span></span>
                        ` : u.status === 'subscribed' ? `
                          <span class="text-[9px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold shrink-0 flex items-center gap-1">${ICONS.checkCircle('w-3 h-3 inline text-emerald-600')} <span>مشترك نشط</span></span>
                        ` : u.status === 'trial' ? `
                          <span class="text-[9px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded font-bold shrink-0 flex items-center gap-1">${ICONS.clock('w-3 h-3 inline text-amber-600')} <span>فترة تجريبية</span></span>
                        ` : `
                          <span class="text-[9px] bg-subtle text-muted px-1.5 py-0.2 rounded font-bold shrink-0 flex items-center gap-1">${ICONS.clock('w-3 h-3 inline text-muted')} <span>منتهي</span></span>
                        `}
                      </div>
                      <div class="text-[11px] text-muted font-mono truncate">${u.email}</div>
                    </div>
                  </div>

                  <div class="text-[10px] text-muted shrink-0 text-left">
                    ${u.subscriptionExpiry ? `
                      <div>ينتهي: <span class="font-mono text-primary">${new Date(u.subscriptionExpiry).toLocaleDateString('ar-EG')}</span></div>
                    ` : ''}
                  </div>
                </div>

                <!-- Action Controls for User -->
                ${!userIsAdmin ? `
                  <div class="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-subtle">
                    ${u.status === 'banned' ? `
                      <button 
                        class="btn-unban-user-action bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        data-user-email="${u.email}"
                      >
                        ${ICONS.userCheck('w-3 h-3')}
                        <span>فك الحظر</span>
                      </button>
                    ` : `
                      <button 
                        class="btn-ban-user-action bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        data-user-email="${u.email}"
                      >
                        ${ICONS.userX('w-3 h-3')}
                        <span>حظر المستخدم</span>
                      </button>
                    `}

                    <button 
                      class="btn-grant-user-action bg-primary hover:bg-primary-dark text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                      data-user-email="${u.email}"
                    >
                      ${ICONS.star('w-3 h-3 text-gold', true)}
                      <span>تفعيل / تمديد 30 يوم</span>
                    </button>

                    ${u.status === 'subscribed' ? `
                      <button 
                        class="btn-revoke-user-action border border-red-500/30 text-red-600 hover:bg-red-500/10 px-2 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                        data-user-email="${u.email}"
                      >
                        <span>إنهاء الاشتراك</span>
                      </button>
                    ` : ''}
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- SECTION 3: Direct Manual Action (Add/Approve/Ban by Email or Phone) -->
      <div class="card-luxury p-4 bg-surface-subtle border border-subtle space-y-3 text-right">
        <h4 class="font-bold text-xs text-primary flex items-center gap-1.5">
          ${ICONS.plus('w-4 h-4 text-primary')}
          <span>إجراء يدوي فوري على أي بريد إلكتروني أو رقم:</span>
        </h4>
        <div class="flex gap-2">
          <input 
            type="text" 
            id="manual-user-email-input" 
            placeholder="البريد الإلكتروني أو رقم الهاتف..." 
            class="flex-1 bg-surface border border-subtle rounded-xl px-3 py-2 text-xs text-primary focus:outline-none focus:border-primary font-mono"
          />
        </div>
        <div class="flex flex-wrap gap-2">
          <button id="btn-manual-grant-action" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5">
            ${ICONS.star('w-3.5 h-3.5 text-white', true)}
            <span>تفعيل 30 يوماً</span>
          </button>
          <button id="btn-manual-ban-action" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5">
            ${ICONS.ban('w-3.5 h-3.5 text-white')}
            <span>حظر الحساب</span>
          </button>
          <button id="btn-manual-unban-action" class="bg-slate-700 hover:bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5">
            ${ICONS.userCheck('w-3.5 h-3.5 text-white')}
            <span>فك الحظر</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Stats & Streak Modal (إحصائيات الذكر والمواظبة اليومية والأسبوعية)
function renderStatsModal(): string {
  const stats = loadTasbeehStats();
  const lifetime = (state.tasbeeh.totalLifetimeCount || 0) + (stats.todayCount || 0);

  return `
    <div class="modal-overlay" id="stats-modal-overlay" style="z-index: 9995;">
      <div class="bottom-sheet-content space-y-4 text-right shadow-2xl" onclick="event.stopPropagation()">
        <div class="apple-sheet-handle"></div>

        <div class="flex items-center justify-between border-b border-subtle pb-3">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-bold text-base">
              ${ICONS.sliders('w-5 h-5 text-gold')}
            </div>
            <div>
              <h3 class="font-bold text-sm sm:text-base text-primary">إحصائيات الذكر والمواظبة</h3>
              <p class="text-[11px] text-muted">سجل تسبيحك ووردك اليومي ومعدل الاستمرار</p>
            </div>
          </div>
          <button id="btn-close-stats-modal" class="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer" title="إغلاق">
            ${ICONS.close('w-4 h-4')}
          </button>
        </div>

        <!-- 3 KPI Cards -->
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="card-luxury p-3 space-y-1">
            <div class="text-[10px] text-muted font-bold">تسبيحات اليوم</div>
            <div class="text-xl sm:text-2xl font-black font-mono text-primary">${stats.todayCount.toLocaleString('ar-EG')}</div>
            <div class="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">اليوم المبارك</div>
          </div>
          <div class="card-luxury p-3 space-y-1 border-gold/40 bg-gold/5">
            <div class="text-[10px] text-gold font-bold">أيام المواظبة</div>
            <div class="text-xl sm:text-2xl font-black font-mono text-gold">${stats.streakDays.toLocaleString('ar-EG')} يوم</div>
            <div class="text-[9px] text-gold font-semibold">استمرار الورد</div>
          </div>
          <div class="card-luxury p-3 space-y-1">
            <div class="text-[10px] text-muted font-bold">مجموع الأسبوع</div>
            <div class="text-xl sm:text-2xl font-black font-mono text-primary">${stats.weeklyCount.toLocaleString('ar-EG')}</div>
            <div class="text-[9px] text-muted font-semibold">آخر 7 أيام</div>
          </div>
        </div>

        <!-- 7-Day Chart -->
        <div class="card-luxury p-3.5 space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-primary">
            <span>سجل نشاط آخر 7 أيام:</span>
            <span class="text-[11px] font-mono text-gold">${stats.weeklyCount.toLocaleString('ar-EG')} تسبيحة</span>
          </div>
          <div class="grid grid-cols-7 gap-1 pt-3 items-end h-28 border-b border-subtle/50 pb-2">
            ${[6, 5, 4, 3, 2, 1, 0].map(daysAgo => {
              const d = new Date(Date.now() - daysAgo * 86400000);
              const dateStr = d.toISOString().slice(0, 10);
              const dayName = d.toLocaleDateString('ar-EG', { weekday: 'narrow' });
              const cnt = daysAgo === 0 ? stats.todayCount : (stats.history[dateStr] || 0);
              const maxVal = Math.max(20, stats.weeklyCount, ...Object.values(stats.history));
              const heightPct = Math.max(12, Math.min(100, Math.round((cnt / maxVal) * 100)));
              const isToday = daysAgo === 0;
              return `
                <div class="flex flex-col items-center gap-1 h-full justify-end">
                  <div class="text-[9px] font-mono ${isToday ? 'text-gold font-bold' : 'text-muted'}">${cnt > 0 ? cnt : ''}</div>
                  <div class="w-full rounded-t-lg transition-all ${isToday ? 'bg-gradient-to-t from-gold to-amber-400 shadow-xs' : 'bg-primary/30 hover:bg-primary/50'}" style="height: ${heightPct}%;"></div>
                  <div class="text-[10px] font-bold ${isToday ? 'text-gold' : 'text-muted'}">${dayName}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Total All Time -->
        <div class="card-luxury p-3 flex items-center justify-between text-xs">
          <span class="text-secondary font-bold">إجمالي التسبيحات المسجلة بالتطبيق:</span>
          <span class="font-black font-mono text-sm text-primary">${lifetime.toLocaleString('ar-EG')} ذكر</span>
        </div>

        <!-- Motivational Verse -->
        <div class="card-luxury p-3 text-center text-xs text-secondary leading-relaxed bg-surface-subtle font-amiri">
          <p class="font-bold text-primary mb-0.5">﴿ وَالذَّاكِرِينَ اللَّهَ كَثِيرًا وَالذَّاكِرَاتِ أَعَدَّ اللَّهُ لَهُمْ مَغْفِرَةً وَأَجْرًا عَظِيمًا ﴾</p>
          <p class="text-[11px] text-muted font-sans">حافظ على استمرار أيام المواظبة لنيل الأجر ومضاعفة الحسنات.</p>
        </div>

        <button id="btn-close-stats-footer" class="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5">
          ${ICONS.check('w-4 h-4')}
          <span>حفظ ومتابعة الذكر</span>
        </button>
      </div>
    </div>
  `;
}

// 22. Fullscreen Receipt Zoom Modal
function renderReceiptImageModal(): string {
  if (!state.viewingReceiptImage) return '';
  return `
    <div class="modal-overlay" id="receipt-zoom-overlay" style="z-index: 9999;">
      <div class="card-luxury p-4 max-w-lg w-full max-h-[90vh] flex flex-col space-y-3 bg-surface" onclick="event.stopPropagation()">
        <div class="flex items-center justify-between border-b border-subtle pb-2">
          <h3 class="font-bold text-sm text-primary flex items-center gap-1.5">
            ${ICONS.instapay('w-4 h-4 text-purple-600')}
            <span>صورة إيصال التحويل (InstaPay انستاباي)</span>
          </h3>
          <button id="btn-close-receipt-zoom" class="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer" title="إغلاق">${ICONS.close('w-4 h-4')}</button>
        </div>
        <div class="flex-1 overflow-auto flex items-center justify-center p-2 bg-slate-950/10 rounded-xl">
          <img src="${state.viewingReceiptImage}" alt="Receipt High Res" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" />
        </div>
      </div>
    </div>
  `;
}

// 23. Prayer Alerts Settings Modal
function renderPrayerAlertSettingsModal(): string {
  const settings = state.prayerAlertsSettings;
  const isPlaying = state.isAzanPlaying;
  const notifPermission = typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';

  const prayersList: Array<{ key: PrayerKey; name: string; time: string; icon: string }> = [
    { key: 'fajr', name: 'صلاة الفجر', time: state.prayerTimes.fajr, icon: ICONS.islamicCrescent('w-4 h-4 text-emerald-500') },
    { key: 'sunrise', name: 'شروق الشمس', time: state.prayerTimes.sunrise, icon: ICONS.sunrise('w-4 h-4 text-amber-500') },
    { key: 'dhuhr', name: 'صلاة الظهر', time: state.prayerTimes.dhuhr, icon: ICONS.sun('w-4 h-4 text-amber-500') },
    { key: 'asr', name: 'صلاة العصر', time: state.prayerTimes.asr, icon: ICONS.sun('w-4 h-4 opacity-80 text-amber-600') },
    { key: 'maghrib', name: 'صلاة المغرب', time: state.prayerTimes.maghrib, icon: ICONS.sunset('w-4 h-4 text-orange-500') },
    { key: 'isha', name: 'صلاة العشاء', time: state.prayerTimes.isha, icon: ICONS.moonStars('w-4 h-4 text-indigo-400') }
  ];

  return `
    <div class="modal-overlay" id="prayer-alerts-modal-overlay" style="z-index: 9998;">
      <div class="bottom-sheet-content space-y-3.5 text-right shadow-2xl" onclick="event.stopPropagation()">
        <div class="apple-sheet-handle"></div>
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-subtle pb-3">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
              ${ICONS.bell('w-5 h-5 text-gold')}
            </div>
            <div>
              <h3 class="font-bold text-sm sm:text-base text-primary">إعدادات الأذان وتنبيهات الصلاة</h3>
              <p class="text-[11px] text-muted">تخصيص التنبيه وصوت المؤذن لكل صلاة على حدة</p>
            </div>
          </div>
          <button id="btn-close-prayer-alerts" class="w-8 h-8 rounded-full bg-surface-subtle flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer" title="إغلاق">${ICONS.close('w-4 h-4')}</button>
        </div>

        <div class="overflow-y-auto flex-1 space-y-3.5 pr-1">
          <!-- Master Switch Card -->
          <div class="card-luxury p-3.5 bg-surface-subtle border border-subtle flex items-center justify-between">
            <div>
              <div class="font-bold text-xs sm:text-sm text-primary flex items-center gap-1.5">
                <span>تفعيل جميع تنبيهات ومواقيت الصلاة</span>
              </div>
              <div class="text-[11px] text-muted mt-0.5">تشغيل أو إيقاف التنبيهات والأذان بشكل عام</div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="toggle-master-prayer-alerts" class="sr-only peer" ${settings.masterEnabled ? 'checked' : ''}>
              <div class="w-11 h-6 bg-subtle peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <!-- Browser Notification Permission Card -->
          <div class="p-3 rounded-xl border ${notifPermission === 'granted' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'} flex items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2 min-w-0">
              <span class="shrink-0">${notifPermission === 'granted' ? ICONS.bell('w-5 h-5 text-emerald-500') : ICONS.bellOff('w-5 h-5 text-amber-500')}</span>
              <div>
                <div class="font-bold ${notifPermission === 'granted' ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'}">
                  ${notifPermission === 'granted' ? 'إشعارات الهاتف والمتصفح مفعلة' : 'إشعارات النظام معطلة'}
                </div>
                <div class="text-[10px] text-muted">
                  ${notifPermission === 'granted' ? 'ستصلك تنبيهات الأذان في وقتها المحدد حتى عند قفل الشاشة' : 'فعّل الإشعارات لضمان سماع الأذان عند دخول وقت الصلاة'}
                </div>
              </div>
            </div>
            ${notifPermission !== 'granted' ? `
              <button 
                id="btn-request-notification-perm" 
                class="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-xs shrink-0 cursor-pointer transition-colors"
              >
                تفعيل الإشعارات
              </button>
            ` : `
              <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-md shrink-0 inline-flex items-center gap-1">
                ${ICONS.check('w-3 h-3')}
                <span>نشط</span>
              </span>
            `}
          </div>

          <!-- Prominent Global Sound & Mu'adhin Selection Section -->
          <div class="card-luxury p-4 sm:p-4.5 bg-surface border-2 border-gold/60 rounded-2xl space-y-3.5 shadow-md">
            <div class="flex items-center justify-between border-b border-subtle/60 pb-2.5">
              <div class="flex items-center gap-2">
                <span class="w-8 h-8 rounded-xl bg-gold/25 text-gold flex items-center justify-center shrink-0">
                  ${ICONS.mic('w-4.5 h-4.5 text-gold')}
                </span>
                <div>
                  <h4 class="font-black text-xs sm:text-sm text-primary">اختيار وتغيير صوت المؤذن المعتمد</h4>
                  <p class="text-[10px] sm:text-[11px] text-muted">انقر على أي مؤذن للاختيار الفوري والاستماع</p>
                </div>
              </div>
            </div>

            <!-- Large Clear Dropdown for Muadhin Selection -->
            <div>
              <label class="block text-xs font-bold text-primary mb-1.5 flex items-center gap-1.5">
                <span>القائمة الكاملة للمؤذنين:</span>
              </label>
              <select 
                id="select-global-muadhin" 
                class="w-full bg-surface-subtle border-2 border-gold/50 rounded-xl p-3 text-xs sm:text-sm text-primary font-bold focus:outline-none focus:border-primary shadow-xs cursor-pointer"
              >
                ${MUADHIN_OPTIONS.filter(m => m.id !== 'silent').map(m => `
                  <option value="${m.id}" ${m.id === settings.globalSound ? 'selected' : ''}>
                    ${m.name}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Quick 1-Click Muadhin Selection Chips (كبير وواضح جداً) -->
            <div>
              <div class="text-[11px] font-bold text-muted mb-1.5">اختيار سريع بنقرة واحدة:</div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                ${MUADHIN_OPTIONS.filter(m => m.id !== 'silent' && m.id !== 'chime').map(m => {
                  const isSelected = m.id === settings.globalSound;
                  return `
                    <button 
                      type="button"
                      class="btn-quick-select-muadhin p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${isSelected ? 'border-2 border-gold bg-gold/15 text-gold shadow-sm' : 'border-subtle bg-surface-subtle/70 hover:border-gold/50 text-secondary'}"
                      data-sound-id="${m.id}"
                      title="اختيار ${m.name}"
                    >
                      <div class="flex items-center justify-between gap-1">
                        <span class="text-gold">${ICONS.mic('w-3.5 h-3.5 text-gold')}</span>
                        ${isSelected ? `<span class="text-[9px] bg-gold text-slate-950 px-1.5 py-0.5 rounded font-black inline-flex items-center gap-0.5">${ICONS.check('w-2.5 h-2.5 text-slate-950')}<span>مختار</span></span>` : ''}
                      </div>
                      <div class="text-[11px] font-bold mt-1 line-clamp-1">${m.name.replace('أذان ', '')}</div>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Large Primary Button to Apply to All 5 Prayers -->
            <button 
              id="btn-apply-muadhin-to-all" 
              class="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-gold hover:brightness-105 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              title="تطبيق هذا الصوت على جميع الصلوات الخمس"
            >
              ${ICONS.bolt('w-4 h-4 text-slate-950')}
              <span>تطبيق هذا المؤذن على جميع الصلوات الخمس</span>
            </button>

            <!-- Instant Test Play Button with prominent styling -->
            <div class="flex items-center justify-between pt-2 border-t border-subtle/50 text-xs">
              <span class="text-[11px] text-muted font-medium">
                ${MUADHIN_OPTIONS.find(m => m.id === settings.globalSound)?.description || ''}
              </span>
              ${isPlaying ? `
                <button 
                  id="btn-stop-preview-audio" 
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer animate-pulse shrink-0"
                >
                  ${ICONS.stop('w-4 h-4')}
                  <span>إيقاف الصوت</span>
                </button>
              ` : `
                <button 
                  id="btn-play-preview-audio" 
                  class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer shrink-0"
                >
                  ${ICONS.play('w-4 h-4')}
                  <span>استماع وتجربة الأذان</span>
                </button>
              `}
            </div>
          </div>

          <!-- Per-Prayer Settings List (The Main Core Feature) -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs text-muted font-bold px-1">
              <span>تخصيص التنبيه لكل صلاة على حدة:</span>
              <span class="text-[10px] font-normal">6 مواقيت</span>
            </div>

            <div class="space-y-2">
              ${prayersList.map(item => {
                const cfg = settings.prayers[item.key];
                return `
                  <div class="card-luxury p-3 space-y-2.5 border ${cfg.enabled && settings.masterEnabled ? 'border-primary/40 bg-surface' : 'border-subtle bg-surface-subtle/50 opacity-80'} transition-all">
                    <!-- Row 1: Prayer Name, Time, and On/Off Switch -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="shrink-0">${item.icon}</span>
                        <div>
                          <span class="font-bold text-xs text-primary">${item.name}</span>
                          <span class="font-mono text-xs text-muted font-semibold mr-1.5 tabular-nums">(${item.time})</span>
                        </div>
                      </div>

                      <div class="flex items-center gap-2">
                        <button 
                          class="btn-toggle-prayer-item px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${cfg.enabled ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300' : 'bg-surface border-subtle text-muted'}"
                          data-prayer-key="${item.key}"
                        >
                          ${cfg.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                          <span>${cfg.enabled ? 'مفعل' : 'معطل'}</span>
                        </button>
                      </div>
                    </div>

                    <!-- Row 2: Sound Choice & Pre-Reminder Timing -->
                    ${cfg.enabled ? `
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-subtle/40 text-xs">
                        <div>
                          <label class="block text-[10px] text-muted mb-1">صوت التنبيه:</label>
                          <select 
                            class="prayer-sound-select w-full bg-surface border border-subtle rounded-lg p-1.5 text-[11px] text-primary focus:outline-none focus:border-primary cursor-pointer"
                            data-prayer-key="${item.key}"
                          >
                            ${MUADHIN_OPTIONS.map(opt => `
                              <option value="${opt.id}" ${opt.id === cfg.sound ? 'selected' : ''}>${opt.name}</option>
                            `).join('')}
                          </select>
                        </div>

                        <div>
                          <label class="block text-[10px] text-muted mb-1">وقت التنبيه:</label>
                          <select 
                            class="prayer-reminder-select w-full bg-surface border border-subtle rounded-lg p-1.5 text-[11px] text-primary focus:outline-none focus:border-primary cursor-pointer"
                            data-prayer-key="${item.key}"
                          >
                            <option value="0" ${cfg.preReminderMinutes === 0 ? 'selected' : ''}>عند دخول الوقت بالضبط</option>
                            <option value="5" ${cfg.preReminderMinutes === 5 ? 'selected' : ''}>قبل الأذان بـ 5 دقائق</option>
                            <option value="10" ${cfg.preReminderMinutes === 10 ? 'selected' : ''}>قبل الأذان بـ 10 دقائق</option>
                            <option value="15" ${cfg.preReminderMinutes === 15 ? 'selected' : ''}>قبل الأذان بـ 15 دقيقة</option>
                            <option value="30" ${cfg.preReminderMinutes === 30 ? 'selected' : ''}>قبل الأذان بـ 30 دقيقة</option>
                          </select>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="pt-2 border-t border-subtle flex items-center justify-between gap-2">
          <button 
            id="btn-close-prayer-alerts-footer" 
            class="flex-1 bg-primary hover:bg-primary-dark text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            ${ICONS.check('w-4 h-4')}
            <span>حفظ وإغلاق</span>
          </button>
        </div>
      </div>
    </div>
  `;
}



// 24. Active Azan Playing Alert Dialog / Banner
function renderActiveAzanDialog(): string {
  const alertInfo = state.activeAzanAlert;
  const isPlaying = state.isAzanPlaying;
  if (!alertInfo && !isPlaying) return '';

  const prayerName = alertInfo?.prayerNameArabic || 'الصلاة';
  const timeFormatted = alertInfo?.timeFormatted || state.prayerTimes.nextPrayer.time;
  const isPreAlert = !!alertInfo?.isPreAlert;
  const preMinutes = alertInfo?.preAlertMinutes || 10;
  const soundName = alertInfo?.soundName || 'أذان الحرم المكي الشريف';

  return `
    <div class="fixed bottom-16 sm:bottom-20 left-0 right-0 z-[9990] px-3 sm:px-4 max-w-lg mx-auto pointer-events-auto">
      <div class="card-luxury p-4 sm:p-5 bg-slate-900 text-white border-2 border-gold shadow-2xl rounded-2xl relative overflow-hidden text-right">
        <!-- Ambient Decorative Glow -->
        <div class="absolute -top-10 -right-10 w-32 h-32 bg-gold/20 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div class="relative z-10 space-y-3">
          <!-- Top Row: Status, Sound Wave, and Dismiss -->
          <div class="flex items-center justify-between border-b border-white/15 pb-2.5">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="text-xs font-bold text-gold flex items-center gap-1.5">
                ${ICONS.islamicCrescent('w-4 h-4 text-gold')}
                <span>${isPreAlert ? `اقترب موعد ${prayerName}` : `حان الآن موعد ${prayerName}`}</span>
              </span>
            </div>

            <div class="flex items-center gap-2">
              <span class="font-mono text-xs text-white/80 font-bold tabular-nums">${timeFormatted}</span>
              <button id="btn-dismiss-azan-dialog" class="text-white/60 hover:text-white p-1 rounded-lg text-xs cursor-pointer flex items-center justify-center" title="إغلاق التنبيه">
                ${ICONS.close('w-3.5 h-3.5')}
              </button>
            </div>
          </div>

          <!-- Main Call to Prayer Notice -->
          <div>
            <h3 class="text-base sm:text-lg font-black text-white leading-snug">
              ${isPreAlert ? `استعد لصلاة ${prayerName} (باقي ${preMinutes} دقائق)` : `الله أكبر الله أكبر.. حان الآن موعد ${prayerName}`}
            </h3>
            <p class="text-xs text-white/75 mt-0.5">
              ${isPreAlert ? 'استعد للوضوء وإدراك تكبيرة الإحرام في المسجد.' : `يُرفع الآن الأذان بصوت: ${soundName}`}
            </p>
          </div>

          <!-- Dua After Azan (دعاء ما بعد الأذان المستجاب) -->
          <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/90 leading-relaxed font-amiri text-center">
            «اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ»
          </div>

          <!-- Controls: Stop Azan / Jump to Prayer Adhkar -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <button 
              id="btn-stop-active-azan" 
              class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              ${ICONS.stop('w-4 h-4')}
              <span>إيقاف صوت الأذان</span>
            </button>

            <button 
              id="btn-goto-prayer-adhkar" 
              class="bg-gold hover:bg-gold-light text-slate-950 font-bold text-xs py-2 px-3.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              ${ICONS.mosque('w-4 h-4 text-slate-950')}
              <span>أذكار الصلاة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Event Bindings
function attachEventHandlers() {
  // Auth Tabs Switcher
  document.querySelectorAll('.btn-auth-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = (btn as HTMLElement).dataset.authTab as 'login' | 'register' | 'forgot';
      if (tab) {
        audioFx.playAppleTap();
        state.authTab = tab;
        state.authError = null;
        state.authSuccessMessage = null;
        renderApp();
      }
    });
  });

  // Password Visibility Toggle
  const togglePassBtn = document.getElementById('btn-toggle-password-visibility');
  if (togglePassBtn) {
    togglePassBtn.addEventListener('click', () => {
      audioFx.playAppleTap();
      state.showPasswordToggle = !state.showPasswordToggle;
      renderApp();
    });
  }

  // Email & Password Login Form
  const loginForm = document.getElementById('form-auth-login');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('login-email-input') as HTMLInputElement;
      const passInput = document.getElementById('login-password-input') as HTMLInputElement;
      const email = emailInput?.value.trim();
      const pass = passInput?.value.trim();

      if (!email || !pass) {
        state.authError = 'يرجى إدخال البريد الإلكتروني وكلمة المرور';
        renderApp();
        return;
      }

      try {
        state.isSigningIn = true;
        state.authError = null;
        state.authSuccessMessage = null;
        renderApp();

        const user = await loginWithEmailPassword(email, pass);
        handlePostLoginRedirect(user);
      } catch (err: any) {
        state.isSigningIn = false;
        state.authError = err?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        renderApp();
      }
    });
  }

  // Email & Password Register Form
  const registerForm = document.getElementById('form-auth-register');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('register-name-input') as HTMLInputElement;
      const emailInput = document.getElementById('register-email-input') as HTMLInputElement;
      const passInput = document.getElementById('register-password-input') as HTMLInputElement;
      const name = nameInput?.value.trim() || 'مستخدم جديد';
      const email = emailInput?.value.trim();
      const pass = passInput?.value.trim();

      if (!email || !pass) {
        state.authError = 'يرجى إدخال كافة البيانات المطلوبة';
        renderApp();
        return;
      }

      if (pass.length < 6) {
        state.authError = 'كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام';
        renderApp();
        return;
      }

      try {
        state.isSigningIn = true;
        state.authError = null;
        state.authSuccessMessage = null;
        renderApp();

        const user = await registerWithEmailPassword(name, email, pass);
        handlePostLoginRedirect(user);
      } catch (err: any) {
        state.isSigningIn = false;
        state.authError = err?.message || 'تعذر إنشاء الحساب، يرجى المحاولة ببريد آخر';
        renderApp();
      }
    });
  }

  // Forgot Password Form
  const forgotForm = document.getElementById('form-auth-forgot');
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('forgot-email-input') as HTMLInputElement;
      const email = emailInput?.value.trim();

      if (!email) {
        state.authError = 'يرجى إدخال البريد الإلكتروني';
        renderApp();
        return;
      }

      try {
        state.isSigningIn = true;
        state.authError = null;
        renderApp();

        await resetUserPassword(email);
        state.isSigningIn = false;
        state.authSuccessMessage = `تم إرسال رابط استعادة كلمة المرور إلى (${email}) بنجاح. تفقد بريدك الوارد.`;
        renderApp();
      } catch (err: any) {
        state.isSigningIn = false;
        state.authError = err?.message || 'تعذر إرسال رابط الاستعادة، يرجى التحقق من صحة البريد.';
        renderApp();
      }
    });
  }

  // Google Login Handler (Mandatory Auth Gate)
  const googleLoginBtn = document.getElementById('btn-google-login-action');
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
      try {
        state.isSigningIn = true;
        state.authError = null;
        state.authErrorCode = null;
        renderApp();
        const user = await loginWithGoogle();
        handlePostLoginRedirect(user);
      } catch (err: any) {
        state.isSigningIn = false;
        state.authErrorCode = err?.code || null;
        state.authError = err?.message || 'تعذر تسجيل الدخول عبر Google. يمكنك الدخول بالبريد وكلمة المرور.';
        renderApp();
      }
    });
  }

  // Copy Domain Button
  const copyDomainBtn = document.getElementById('btn-copy-domain');
  if (copyDomainBtn) {
    copyDomainBtn.addEventListener('click', () => {
      if (typeof window !== 'undefined') {
        navigator.clipboard.writeText(window.location.hostname).then(() => {
          copyDomainBtn.textContent = 'تم النسخ ✓';
          setTimeout(() => {
            if (copyDomainBtn) copyDomainBtn.textContent = 'نسخ النطاق';
          }, 2500);
        });
      }
    });
  }

  // Logout Handler (from Settings/More tab)
  const logoutBtn = document.getElementById('btn-logout-app');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await logoutUser();
        state.currentUser = null;
        renderApp();
      } catch (err: any) {
        alert(err?.message || 'حدث خطأ أثناء تسجيل الخروج');
      }
    });
  }

  // Navigation tabs
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const el = btn as HTMLElement;
      const tab = el.dataset.nav as AppState['currentTab'];
      const subview = el.dataset.subview;
      
      const bottomNav = el.closest('.bottom-nav') as HTMLElement;
      if (bottomNav) {
        const itemLeft = el.offsetLeft - bottomNav.offsetLeft;
        const targetScroll = itemLeft - (bottomNav.clientWidth / 2) + (el.clientWidth / 2);
        bottomNav.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
      }

      if (tab) {
        navigateTo(tab, null);
      } else if (subview) {
        navigateTo('home', subview);
      }
    });
  });

  // Home actions & section navigation
  document.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', () => {
      const action = (el as HTMLElement).dataset.action;
      if (action === 'nav-quran') navigateTo('quran');
      if (action === 'nav-adhkar') navigateTo('adhkar');
      if (action === 'nav-tasbeeh') navigateTo('tasbeeh');
      if (action === 'nav-more') navigateTo('more');
      if (action === 'open-subview') {
        const view = (el as HTMLElement).dataset.view;
        if (view) navigateTo('home', view);
      }
      if (action === 'open-adhkar-category') {
        const cat = (el as HTMLElement).dataset.cat;
        if (cat) {
          state.activeAdhkarCategory = cat;
          navigateTo('adhkar');
        }
      }
    });
  });

  // Home filter tabs
  document.querySelectorAll('.btn-filter-home-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      audioFx.playAppleTap();
      const tab = (btn as HTMLElement).dataset.tab as any;
      if (tab) {
        state.homeFilterTab = tab;
        renderApp();
      }
    });
  });

  // Quran mode switches
  document.querySelectorAll('.btn-switch-quran-mode').forEach(btn => {
    btn.addEventListener('click', () => {
      audioFx.playAppleTap();
      const mode = (btn as HTMLElement).dataset.mode as any;
      if (mode) {
        state.quranMode = mode;
        state.activeSurah = null;
        renderApp();
      }
    });
  });

  // Surah filter by revelation type
  document.querySelectorAll('.btn-filter-surah-type').forEach(btn => {
    btn.addEventListener('click', () => {
      audioFx.playAppleTap();
      const t = (btn as HTMLElement).dataset.type as any;
      if (t) {
        state.surahFilterType = t;
        renderApp();
      }
    });
  });

  // Surah search inputs
  const surahSearchInp = document.getElementById('input-surah-search') as HTMLInputElement;
  if (surahSearchInp) {
    surahSearchInp.addEventListener('input', () => {
      state.surahSearchQuery = surahSearchInp.value;
      renderApp();
    });
  }
  const clearSurahSearchBtn = document.getElementById('btn-clear-surah-search');
  if (clearSurahSearchBtn) {
    clearSurahSearchBtn.addEventListener('click', () => {
      state.surahSearchQuery = '';
      renderApp();
    });
  }

  // Open surah in continuous reader
  document.querySelectorAll('.btn-open-surah-reader').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const num = parseInt((btn as HTMLElement).dataset.surahNum || '1', 10);
      audioFx.playAppleTransition();
      const meta = SURAH_LIST.find(s => s.number === num) || {
        number: num,
        name: `سورة ${num}`,
        englishName: `Surah ${num}`,
        numberOfAyahs: 1,
        revelationType: 'Meccan' as const,
        revelationTypeArabic: 'مكية',
        juz: 1
      };
      loadSurahAyahs(num).then(ayahs => {
        state.activeSurah = { meta, ayahs };
        state.quranMode = 'surahs';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderApp();
      }).catch(() => {
        alert('تعذر تحميل آيات السورة، يرجى المحاولة مرة أخرى.');
      });
    });
  });

  // Jump to Mushaf Page directly
  document.querySelectorAll('.btn-jump-to-mushaf-page').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const p = parseInt((btn as HTMLElement).dataset.page || '1', 10);
      audioFx.playAppleTap();
      state.mushafPageNumber = p;
      state.quranMode = 'mushaf';
      state.mushafPageData = null;
      state.selectedAyah = null;
      state.activeSurah = null;
      localStorage.setItem('zad_last_mushaf_page', p.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderApp();
    });
  });

  // Focus Mode toggles
  document.querySelectorAll('#btn-toggle-focus-mode, #btn-hero-focus-mode').forEach(btn => {
    btn.addEventListener('click', () => {
      audioFx.playAppleTap();
      state.isFocusMode = !state.isFocusMode;
      renderApp();
    });
  });
  const exitFocusBtn = document.getElementById('btn-exit-focus-mode');
  if (exitFocusBtn) {
    exitFocusBtn.addEventListener('click', () => {
      audioFx.playAppleTap();
      state.isFocusMode = false;
      renderApp();
    });
  }

  // Kids Mode toggles
  const heroKidsBtn = document.getElementById('btn-hero-kids-mode');
  if (heroKidsBtn) {
    heroKidsBtn.addEventListener('click', () => {
      audioFx.playAppleSheetOpen();
      state.kidsMode = true;
      localStorage.setItem('zad_kids_mode', 'true');
      renderApp();
    });
  }
  const exitKidsBtn = document.getElementById('btn-exit-kids-mode');
  if (exitKidsBtn) {
    exitKidsBtn.addEventListener('click', () => {
      audioFx.playAppleTap();
      state.kidsMode = false;
      localStorage.setItem('zad_kids_mode', 'false');
      renderApp();
    });
  }

  // Stats Modal toggles
  const heroStatsBtn = document.getElementById('btn-open-stats-modal');
  if (heroStatsBtn) {
    heroStatsBtn.addEventListener('click', () => {
      audioFx.playAppleSheetOpen();
      state.showStatsModal = true;
      renderApp();
    });
  }
  const closeStatsBtn = document.getElementById('btn-close-stats-modal');
  if (closeStatsBtn) {
    closeStatsBtn.addEventListener('click', () => {
      audioFx.playAppleTap();
      state.showStatsModal = false;
      renderApp();
    });
  }

  // Ayah modal sub-tabs (Tafseer & Translation)
  document.querySelectorAll('.btn-ayah-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = (tab as HTMLElement).dataset.tab as 'tafseer' | 'translation';
      if (tabName) {
        audioFx.playAppleTap();
        state.activeAyahModalTab = tabName;
        renderApp();
      }
    });
  });

  // Ayah Audio player
  document.querySelectorAll('.btn-play-ayah-audio').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = (btn as HTMLElement).dataset.audioUrl;
      if (!url) return;
      if (ayahAudioElement && !ayahAudioElement.paused) {
        ayahAudioElement.pause();
        state.isAyahAudioPlaying = false;
        renderApp();
        return;
      }
      if (!ayahAudioElement) {
        ayahAudioElement = new Audio();
        ayahAudioElement.onended = () => {
          state.isAyahAudioPlaying = false;
          renderApp();
        };
        ayahAudioElement.onerror = () => {
          state.isAyahAudioPlaying = false;
          renderApp();
        };
      }
      ayahAudioElement.src = url;
      ayahAudioElement.play().then(() => {
        state.isAyahAudioPlaying = true;
        renderApp();
      }).catch(() => {
        state.isAyahAudioPlaying = false;
        renderApp();
      });
    });
  });

  // Theme Toggle
  const themeBtn = document.getElementById('btn-toggle-theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem(STORAGE_THEME_KEY, state.theme);
      renderApp();
    });
  }

  // Location Modal Trigger (both header & hero card)
  const locBtn = document.getElementById('btn-open-location');
  if (locBtn) {
    locBtn.addEventListener('click', () => {
      audioFx.playAppleSheetOpen();
      state.showLocationModal = true;
      renderApp();
    });
  }
  const heroLocBtn = document.getElementById('btn-hero-location');
  if (heroLocBtn) {
    heroLocBtn.addEventListener('click', () => {
      audioFx.playAppleSheetOpen();
      state.showLocationModal = true;
      renderApp();
    });
  }

  // Search Modal Trigger
  const searchBtn = document.getElementById('btn-open-search');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      audioFx.playAppleSheetOpen();
      state.showSearchModal = true;
      renderApp();
    });
  }

  // Favorites Trigger
  const favBtn = document.getElementById('btn-open-favorites');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      navigateTo(state.currentTab, 'favorites');
    });
  }

  // Header Brand click -> go home
  const brandEl = document.getElementById('header-brand');
  if (brandEl) {
    brandEl.addEventListener('click', () => navigateTo('home'));
  }

  // Back buttons
  const backHomeBtn = document.getElementById('btn-back-home');
  if (backHomeBtn) {
    backHomeBtn.addEventListener('click', () => navigateTo('home'));
  }

  const backSurahsBtn = document.getElementById('btn-back-to-surahs');
  if (backSurahsBtn) {
    backSurahsBtn.addEventListener('click', () => {
      state.activeSurah = null;
      renderApp();
    });
  }

  const backKhutbahsBtn = document.getElementById('btn-back-to-khutbahs');
  if (backKhutbahsBtn) {
    backKhutbahsBtn.addEventListener('click', () => {
      state.activeKhutbah = null;
      renderApp();
    });
  }

  const backMoreBtn = document.getElementById('btn-back-to-more');
  if (backMoreBtn) {
    backMoreBtn.addEventListener('click', () => navigateTo('more'));
  }

  // Tanzil Iframe Reload Button
  const reloadTanzilBtn = document.getElementById('btn-reload-tanzil-iframe');
  if (reloadTanzilBtn) {
    reloadTanzilBtn.addEventListener('click', () => {
      const iframe = document.getElementById('tanzil-quran-iframe') as HTMLIFrameElement | null;
      if (iframe) {
        iframe.src = "https://tanzil.net/?embed=true";
      }
    });
  }

  // Quran mode toggles (mushaf vs surahs vs embed)
  const quranMushafBtn = document.getElementById('btn-quran-mushaf-mode');
  if (quranMushafBtn) {
    quranMushafBtn.addEventListener('click', () => {
      state.quranMode = 'mushaf';
      state.activeSurah = null;
      renderApp();
    });
  }

  const quranEmbedBtn = document.getElementById('btn-quran-embed-mode');
  if (quranEmbedBtn) {
    quranEmbedBtn.addEventListener('click', () => {
      state.quranMode = 'embed';
      state.activeSurah = null;
      renderApp();
    });
  }

  const quranListBtn = document.getElementById('btn-quran-list-mode');
  if (quranListBtn) {
    quranListBtn.addEventListener('click', () => {
      state.quranMode = 'surahs';
      state.activeSurah = null;
      renderApp();
    });
  }

  // Mushaf Page Next / Prev Navigation
  const mushafPrevBtn = document.getElementById('btn-mushaf-prev-page');
  if (mushafPrevBtn) {
    mushafPrevBtn.addEventListener('click', () => {
      if (state.mushafPageNumber > 1) {
        state.mushafPageNumber--;
        state.mushafPageData = null;
        state.selectedAyah = null;
        localStorage.setItem('zad_last_mushaf_page', state.mushafPageNumber.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderApp();
      }
    });
  }

  const mushafNextBtn = document.getElementById('btn-mushaf-next-page');
  if (mushafNextBtn) {
    mushafNextBtn.addEventListener('click', () => {
      if (state.mushafPageNumber < 604) {
        state.mushafPageNumber++;
        state.mushafPageData = null;
        state.selectedAyah = null;
        localStorage.setItem('zad_last_mushaf_page', state.mushafPageNumber.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderApp();
      }
    });
  }

  // Mushaf Surah Jump Dropdown
  const surahSelect = document.getElementById('mushaf-surah-jump-select') as HTMLSelectElement | null;
  if (surahSelect) {
    surahSelect.addEventListener('change', () => {
      const p = parseInt(surahSelect.value, 10);
      if (p >= 1 && p <= 604) {
        state.mushafPageNumber = p;
        state.mushafPageData = null;
        state.selectedAyah = null;
        localStorage.setItem('zad_last_mushaf_page', p.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderApp();
      }
    });
  }

  // Mushaf Direct Page Input & Go Button
  const directPageInput = document.getElementById('mushaf-direct-page-input') as HTMLInputElement | null;
  const jumpPageGoBtn = document.getElementById('btn-jump-page-go');
  const handlePageJump = () => {
    if (directPageInput) {
      const p = parseInt(directPageInput.value, 10);
      if (!isNaN(p) && p >= 1 && p <= 604) {
        state.mushafPageNumber = p;
        state.mushafPageData = null;
        state.selectedAyah = null;
        localStorage.setItem('zad_last_mushaf_page', p.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderApp();
      } else {
        alert('يرجى إدخال رقم صفحة بين 1 و 604.');
      }
    }
  };
  if (jumpPageGoBtn) jumpPageGoBtn.addEventListener('click', handlePageJump);
  if (directPageInput) {
    directPageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handlePageJump();
    });
  }

  // Bookmark Mushaf Page
  const bookmarkPageBtn = document.getElementById('btn-bookmark-mushaf-page');
  if (bookmarkPageBtn) {
    bookmarkPageBtn.addEventListener('click', () => {
      localStorage.setItem('zad_bookmark_mushaf_page', state.mushafPageNumber.toString());
      alert(`تم حفظ صفحة ${toArabicNumerals(state.mushafPageNumber)} كعلامة قراءة محفوظة.`);
      renderApp();
    });
  }

  // Ayah Selection in Continuous Page Flow
  document.querySelectorAll('.mushaf-ayah-inline, .mushaf-ayah-end').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = el as HTMLElement;
      const quranNum = parseInt(target.dataset.ayahQuran || '0', 10);
      if (quranNum) {
        if (state.selectedAyah && state.selectedAyah.numberInQuran === quranNum) {
          state.selectedAyah = null;
        } else {
          // Look in current page
          const found = state.mushafPageData?.ayahs.find(a => a.numberInQuran === quranNum);
          if (found) {
            state.selectedAyah = found;
          } else if (state.activeSurah) {
            const foundInSurah = state.activeSurah.ayahs.find(a => a.numberInQuran === quranNum);
            if (foundInSurah) {
              state.selectedAyah = {
                numberInQuran: foundInSurah.numberInQuran,
                numberInSurah: foundInSurah.numberInSurah,
                text: foundInSurah.text,
                juz: foundInSurah.juz,
                page: state.mushafPageNumber,
                surahNumber: state.activeSurah.meta.number,
                surahName: state.activeSurah.meta.name
              };
            }
          }
        }
        renderApp();
      }
    });
  });

  // Close Ayah Action Bar
  const closeAyahBtn = document.getElementById('btn-close-ayah-action');
  if (closeAyahBtn) {
    closeAyahBtn.addEventListener('click', () => {
      state.selectedAyah = null;
      renderApp();
    });
  }

  // Copy Selected Ayah
  document.querySelectorAll('.btn-copy-selected-ayah').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = (btn as HTMLElement).dataset.copy || '';
      navigator.clipboard.writeText(text).then(() => {
        alert('تم نسخ الآية الكريمة بنجاح.');
      }).catch(() => {});
    });
  });

  // Share Selected Ayah
  document.querySelectorAll('.btn-share-selected-ayah').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = (btn as HTMLElement).dataset.text || '';
      if (navigator.share) {
        navigator.share({ title: 'آية من القرآن الكريم', text }).catch(() => {});
      } else {
        navigator.clipboard.writeText(text).then(() => {
          alert('تم نسخ نص الآية للمشاركة.');
        }).catch(() => {});
      }
    });
  });

  // Favorite Selected Ayah
  document.querySelectorAll('.btn-fav-selected-ayah').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = btn as HTMLElement;
      const id = el.dataset.favId || '';
      const surah = el.dataset.surah || '';
      const num = parseInt(el.dataset.num || '1', 10);
      const text = el.dataset.text || '';
      toggleFavorite({
        id,
        type: 'ayah',
        title: `سورة ${surah} - الآية ${num}`,
        snippet: text,
        source: 'مصحف المدينة النبوية'
      });
      renderApp();
    });
  });

  // Reload page if error
  const reloadPageBtn = document.getElementById('btn-reload-mushaf-page');
  if (reloadPageBtn) {
    reloadPageBtn.addEventListener('click', () => {
      state.mushafPageData = null;
      renderApp();
    });
  }

  // Surah click row -> Jump directly to starting page in Mushaf
  document.querySelectorAll('.surah-row-item').forEach(row => {
    row.addEventListener('click', () => {
      const num = parseInt((row as HTMLElement).dataset.surahNumber || '1', 10);
      const startPage = SURAH_START_PAGE[num] || 1;
      state.mushafPageNumber = startPage;
      state.quranMode = 'mushaf';
      state.mushafPageData = null;
      state.selectedAyah = null;
      state.activeSurah = null;
      localStorage.setItem('zad_last_mushaf_page', startPage.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderApp();
    });
  });

  // Surah font size controls
  const decFontBtn = document.getElementById('btn-decrease-font');
  const incFontBtn = document.getElementById('btn-increase-font');
  if (decFontBtn) {
    decFontBtn.addEventListener('click', () => {
      state.quranFontSize = Math.max(16, state.quranFontSize - 2);
      localStorage.setItem(STORAGE_FONT_SIZE_KEY, state.quranFontSize.toString());
      renderApp();
    });
  }
  if (incFontBtn) {
    incFontBtn.addEventListener('click', () => {
      state.quranFontSize = Math.min(36, state.quranFontSize + 2);
      localStorage.setItem(STORAGE_FONT_SIZE_KEY, state.quranFontSize.toString());
      renderApp();
    });
  }

  // Bookmark surah
  const bookmarkBtn = document.getElementById('btn-bookmark-surah');
  if (bookmarkBtn && state.activeSurah) {
    bookmarkBtn.addEventListener('click', () => {
      const num = state.activeSurah!.meta.number.toString();
      localStorage.setItem('zad_bookmark_surah', num);
      alert(`تم حفظ سورة ${state.activeSurah!.meta.name} كموضع قراءة أخير.`);
      renderApp();
    });
  }

  // Surah search input filter
  const surahSearchInput = document.getElementById('quran-search-input') as HTMLInputElement;
  if (surahSearchInput) {
    surahSearchInput.addEventListener('input', () => {
      const q = surahSearchInput.value.trim().toLowerCase();
      document.querySelectorAll('.surah-row-item').forEach(item => {
        const text = item.textContent?.toLowerCase() || '';
        (item as HTMLElement).style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  // Toggle Adhkar View Mode (Cards Deck vs List View)
  const toggleAdhkarViewBtn = document.getElementById('btn-toggle-adhkar-view-mode');
  if (toggleAdhkarViewBtn) {
    toggleAdhkarViewBtn.addEventListener('click', () => {
      audioFx.playAppleTap();
      triggerHapticFeedback(12);
      state.adhkarViewMode = state.adhkarViewMode === 'cards' ? 'list' : 'cards';
      renderApp();
    });
  }

  // Adhkar category chips
  document.querySelectorAll('[data-cat-id]').forEach(chip => {
    chip.addEventListener('click', () => {
      const catId = (chip as HTMLElement).dataset.catId;
      if (catId) {
        audioFx.playAppleTap();
        state.activeAdhkarCategory = catId;
        state.adhkarCardIndex = 0;
        renderApp();
      }
    });
  });

  // Tap dhikr counter (3 -> 2 -> 1 -> ✓ تم) with Apple sound & haptics
  document.querySelectorAll('.btn-tap-dhikr').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.dhikrId;
      const target = parseInt((btn as HTMLElement).dataset.target || '1', 10);
      if (!id) return;

      const current = state.dhikrProgress[id] || 0;
      if (current < target) {
        const next = current + 1;
        state.dhikrProgress[id] = next;
        localStorage.setItem(STORAGE_DHIKR_PROGRESS, JSON.stringify(state.dhikrProgress));

        if (next >= target) {
          // Blessed completion chord
          audioFx.playDhikrComplete();
          triggerHapticFeedback([45, 60, 45]);
        } else {
          // Tactile wooden bead click
          audioFx.playDhikrTap();
          triggerHapticFeedback(22);
        }

        renderApp();
      }
    });
  });

  // Reset single dhikr
  document.querySelectorAll('.btn-reset-dhikr').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.dhikrId;
      if (id) {
        audioFx.playAppleTap();
        delete state.dhikrProgress[id];
        localStorage.setItem(STORAGE_DHIKR_PROGRESS, JSON.stringify(state.dhikrProgress));
        renderApp();
      }
    });
  });

  // Reset category counters
  const resetCatCountersBtn = document.getElementById('btn-reset-category-counters');
  if (resetCatCountersBtn) {
    resetCatCountersBtn.addEventListener('click', () => {
      audioFx.playAppleTap();
      ALL_ADHKAR.filter(a => a.category === state.activeAdhkarCategory).forEach(a => {
        delete state.dhikrProgress[a.id];
      });
      localStorage.setItem(STORAGE_DHIKR_PROGRESS, JSON.stringify(state.dhikrProgress));
      renderApp();
    });
  }

  // Tasbeeh large button tap with Apple sound and haptics
  const tasbeehTapCircle = document.getElementById('tasbeeh-tap-circle');
  if (tasbeehTapCircle) {
    tasbeehTapCircle.addEventListener('click', () => {
      state.tasbeeh.currentCount += 1;
      state.tasbeeh.totalLifetimeCount += 1;

      const isTargetReached = state.tasbeeh.target > 0 && state.tasbeeh.currentCount === state.tasbeeh.target;

      if (isTargetReached) {
        if (state.tasbeeh.soundEnabled) audioFx.playDhikrComplete();
        if (state.tasbeeh.vibrateEnabled) triggerHapticFeedback([50, 70, 50]);
      } else {
        if (state.tasbeeh.soundEnabled) audioFx.playDhikrTap();
        if (state.tasbeeh.vibrateEnabled) triggerHapticFeedback(24);
      }

      saveTasbeehState(state.tasbeeh);

      const countDisp = document.getElementById('tasbeeh-display-count');
      if (countDisp) countDisp.textContent = state.tasbeeh.currentCount.toString();
      renderApp();
    });
  }

  // Tasbeeh Controls
  const tasbeehMinus = document.getElementById('btn-tasbeeh-decrement');
  if (tasbeehMinus) {
    tasbeehMinus.addEventListener('click', () => {
      if (state.tasbeeh.currentCount > 0) {
        audioFx.playAppleTap();
        state.tasbeeh.currentCount -= 1;
        saveTasbeehState(state.tasbeeh);
        renderApp();
      }
    });
  }

  const tasbeehReset = document.getElementById('btn-tasbeeh-reset');
  if (tasbeehReset) {
    tasbeehReset.addEventListener('click', () => {
      audioFx.playAppleTap();
      state.tasbeeh.currentCount = 0;
      saveTasbeehState(state.tasbeeh);
      renderApp();
    });
  }

  const toggleVibrate = document.getElementById('btn-toggle-vibrate');
  if (toggleVibrate) {
    toggleVibrate.addEventListener('click', () => {
      audioFx.playAppleTap();
      state.tasbeeh.vibrateEnabled = !state.tasbeeh.vibrateEnabled;
      saveTasbeehState(state.tasbeeh);
      renderApp();
    });
  }

  const toggleSound = document.getElementById('btn-toggle-sound');
  if (toggleSound) {
    toggleSound.addEventListener('click', () => {
      state.tasbeeh.soundEnabled = !state.tasbeeh.soundEnabled;
      if (state.tasbeeh.soundEnabled) {
        audioFx.playAppleTap();
      }
      saveTasbeehState(state.tasbeeh);
      renderApp();
    });
  }

  const tasbeehSelect = document.getElementById('tasbeeh-dhikr-select') as HTMLSelectElement;
  if (tasbeehSelect) {
    tasbeehSelect.addEventListener('change', () => {
      audioFx.playAppleTap();
      state.tasbeeh.selectedDhikr = tasbeehSelect.value;
      state.tasbeeh.currentCount = 0;
      saveTasbeehState(state.tasbeeh);
      renderApp();
    });
  }

  document.querySelectorAll('[data-target-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      audioFx.playAppleTap();
      const choice = parseInt((btn as HTMLElement).dataset.targetChoice || '33', 10);
      state.tasbeeh.target = choice;
      state.tasbeeh.currentCount = 0;
      saveTasbeehState(state.tasbeeh);
      renderApp();
    });
  });

  // Khutbah list item click
  document.querySelectorAll('.khutbah-card-item').forEach(card => {
    card.addEventListener('click', () => {
      const id = (card as HTMLElement).dataset.khutbahId;
      const kh = ALL_KHUTBAHS.find(k => k.id === id);
      if (kh) {
        state.activeKhutbah = kh;
        renderApp();
      }
    });
  });

  // Khutbah category filter pills
  document.querySelectorAll('.khutbah-cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = (pill as HTMLElement).dataset.category || 'all';
      state.activeKhutbahCategory = cat;
      renderApp();
    });
  });

  // Khutbah back button
  const backToKhutbahsBtn = document.getElementById('btn-back-to-khutbahs');
  if (backToKhutbahsBtn) {
    backToKhutbahsBtn.addEventListener('click', () => {
      state.activeKhutbah = null;
      renderApp();
    });
  }

  // More Menu links
  const menuSoundFx = document.getElementById('btn-menu-apple-sound-effects');
  if (menuSoundFx) {
    menuSoundFx.addEventListener('click', () => {
      audioFx.toggleSound();
      renderApp();
    });
  }

  const menuLoc = document.getElementById('btn-menu-location');
  if (menuLoc) menuLoc.addEventListener('click', () => { audioFx.playAppleSheetOpen(); state.showLocationModal = true; renderApp(); });

  const menuFav = document.getElementById('btn-menu-favorites');
  if (menuFav) menuFav.addEventListener('click', () => navigateTo('more', 'favorites'));

  const menuSources = document.getElementById('btn-menu-sources');
  if (menuSources) menuSources.addEventListener('click', () => navigateTo('more', 'sources'));

  const menuAppCreator = document.getElementById('btn-menu-appcreator');
  if (menuAppCreator) menuAppCreator.addEventListener('click', () => navigateTo('more', 'appcreator24'));

  const upgradeBannerBtn = document.getElementById('btn-upgrade-banner');
  if (upgradeBannerBtn) upgradeBannerBtn.addEventListener('click', () => { audioFx.playAppleSheetOpen(); state.showPaywallModal = true; renderApp(); });

  const openPaywallDetailsBtn = document.getElementById('btn-open-paywall-details');
  if (openPaywallDetailsBtn) openPaywallDetailsBtn.addEventListener('click', () => { audioFx.playAppleSheetOpen(); state.showPaywallModal = true; renderApp(); });

  // Popular location chips selection (Ankara, Makkah, Abu Kabir, etc.)
  document.querySelectorAll('.btn-popular-location').forEach(btn => {
    btn.addEventListener('click', () => {
      const jsonStr = (btn as HTMLElement).dataset.locJson;
      if (jsonStr) {
        try {
          const loc = JSON.parse(jsonStr) as LocationItem;
          state.selectedLocation = loc;
          localStorage.setItem(STORAGE_LOCATION_KEY, JSON.stringify(state.selectedLocation));
          state.prayerTimes = calculateOfflinePrayers(loc.latitude, loc.longitude);
          state.showLocationModal = false;
          alert(`تم اختيار وتثبيت الموقع: ${loc.name}`);
          renderApp();
        } catch {
          // ignore
        }
      }
    });
  });

  // Location Picker selection
  document.querySelectorAll('.village-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const village = (btn as HTMLElement).dataset.village;
      if (village) {
        state.selectedLocation = {
          id: `eg-sharkia-abukabir-${encodeURIComponent(village)}`,
          name: `${village} - أبو كبير`,
          governorate: "الشرقية",
          city: "مركز أبو كبير",
          village: village,
          latitude: 30.7254,
          longitude: 31.6713,
          timezone: "Africa/Cairo"
        };
        localStorage.setItem(STORAGE_LOCATION_KEY, JSON.stringify(state.selectedLocation));
        state.prayerTimes = calculateOfflinePrayers(state.selectedLocation.latitude, state.selectedLocation.longitude);
        state.showLocationModal = false;
        alert(`تم اختيار وتثبيت الموقع: ${village} - مركز أبو كبير`);
        renderApp();
      }
    });
  });

  // GPS Auto Detect
  const gpsBtn = document.getElementById('btn-detect-gps');
  if (gpsBtn) {
    gpsBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            state.selectedLocation = {
              id: 'custom-gps',
              name: 'موقعي الحالي (GPS)',
              governorate: 'مصر',
              city: 'موقعي الجغرافي',
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              timezone: 'Africa/Cairo'
            };
            localStorage.setItem(STORAGE_LOCATION_KEY, JSON.stringify(state.selectedLocation));
            state.prayerTimes = calculateOfflinePrayers(pos.coords.latitude, pos.coords.longitude);
            state.showLocationModal = false;
            alert('تم تحديد وتحديث موقعك الجغرافي بنجاح!');
            renderApp();
          },
          (err) => {
            alert('تعذر الوصول إلى نظام GPS: ' + err.message + '. يرجى اختيار قريتك أو مدينتك يدوياً.');
          }
        );
      } else {
        alert('المتصفح لا يدعم تحديد الموقع التلقائي.');
      }
    });
  }

  // Custom Village save
  const customVillageInput = document.getElementById('custom-village-input') as HTMLInputElement;
  const saveCustomVillageBtn = document.getElementById('btn-save-custom-village');
  if (saveCustomVillageBtn && customVillageInput) {
    saveCustomVillageBtn.addEventListener('click', () => {
      const val = customVillageInput.value.trim();
      if (val) {
        state.selectedLocation = {
          id: `custom-village-${Date.now()}`,
          name: `${val} - أبو كبير`,
          governorate: "الشرقية",
          city: "مركز أبو كبير",
          village: val,
          latitude: 30.7254,
          longitude: 31.6713,
          timezone: "Africa/Cairo"
        };
        localStorage.setItem(STORAGE_LOCATION_KEY, JSON.stringify(state.selectedLocation));
        state.showLocationModal = false;
        renderApp();
      }
    });
  }

  // Close Modals with Apple downward dismiss sound
  const closeLocBtn = document.getElementById('btn-close-location-modal');
  if (closeLocBtn) closeLocBtn.addEventListener('click', () => { audioFx.playAppleSheetClose(); state.showLocationModal = false; renderApp(); });

  const closeSearchBtn = document.getElementById('btn-close-search-modal');
  if (closeSearchBtn) closeSearchBtn.addEventListener('click', () => { audioFx.playAppleSheetClose(); state.showSearchModal = false; renderApp(); });

  const closePaywallBtn = document.getElementById('btn-close-paywall');
  if (closePaywallBtn) closePaywallBtn.addEventListener('click', () => { audioFx.playAppleSheetClose(); state.showPaywallModal = false; renderApp(); });

  // Admin Navigation Shortcut
  const menuAdminBtn = document.getElementById('btn-menu-admin');
  if (menuAdminBtn) {
    menuAdminBtn.addEventListener('click', () => {
      state.currentTab = 'more';
      state.subView = 'admin_panel';
      renderApp();
    });
  }

  // Logout from Banned Screen
  const logoutBannedBtn = document.getElementById('btn-logout-banned');
  if (logoutBannedBtn) {
    logoutBannedBtn.addEventListener('click', async () => {
      try {
        await logoutUser();
        state.currentUser = null;
        renderApp();
      } catch {
        state.currentUser = null;
        renderApp();
      }
    });
  }

  // Paywall Multi-Step Wizard navigation
  const next1 = document.getElementById('btn-paywall-next-1');
  if (next1) {
    next1.addEventListener('click', () => {
      state.paywallStep = 2;
      renderApp();
    });
  }

  const next2 = document.getElementById('btn-paywall-next-2');
  if (next2) {
    next2.addEventListener('click', () => {
      state.paywallStep = 3;
      renderApp();
    });
  }

  const prev2 = document.getElementById('btn-paywall-prev-2');
  if (prev2) {
    prev2.addEventListener('click', () => {
      state.paywallStep = 1;
      renderApp();
    });
  }

  const prev3 = document.getElementById('btn-paywall-prev-3');
  if (prev3) {
    prev3.addEventListener('click', () => {
      state.paywallStep = 2;
      renderApp();
    });
  }

  // Copy InstaPay Number & IPA Buttons
  const copyVodafoneBtn = document.getElementById('btn-copy-vodafone-num');
  if (copyVodafoneBtn) {
    copyVodafoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(INSTAPAY_LOCAL_NUMBER).then(() => {
        copyVodafoneBtn.textContent = 'تم النسخ ✓';
        setTimeout(() => {
          if (copyVodafoneBtn) copyVodafoneBtn.innerHTML = `${ICONS.copy('w-4 h-4')}<span>نسخ الرقم</span>`;
        }, 2000);
      });
    });
  }

  const copyVodafonePageBtn = document.getElementById('btn-copy-vodafone-num-page');
  if (copyVodafonePageBtn) {
    copyVodafonePageBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(INSTAPAY_LOCAL_NUMBER).then(() => {
        copyVodafonePageBtn.textContent = 'تم النسخ ✓';
        setTimeout(() => {
          if (copyVodafonePageBtn) copyVodafonePageBtn.innerHTML = `${ICONS.copy('w-3.5 h-3.5')}<span>نسخ الرقم</span>`;
        }, 2000);
      });
    });
  }

  const copyIpaBtn = document.getElementById('btn-copy-instapay-ipa');
  if (copyIpaBtn) {
    copyIpaBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(INSTAPAY_IPA).then(() => {
        copyIpaBtn.textContent = 'تم النسخ ✓';
        setTimeout(() => {
          if (copyIpaBtn) copyIpaBtn.innerHTML = `${ICONS.copy('w-3 h-3')}<span>نسخ IPA</span>`;
        }, 2000);
      });
    });
  }

  const copyIpaPageBtn = document.getElementById('btn-copy-instapay-ipa-page');
  if (copyIpaPageBtn) {
    copyIpaPageBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(INSTAPAY_IPA).then(() => {
        copyIpaPageBtn.textContent = 'تم النسخ ✓';
        setTimeout(() => {
          if (copyIpaPageBtn) copyIpaPageBtn.innerHTML = `${ICONS.copy('w-3 h-3')}<span>نسخ IPA</span>`;
        }, 2000);
      });
    });
  }

  // Handle Receipt Upload in Modal
  const receiptFileInput = document.getElementById('receipt-file-input') as HTMLInputElement;
  if (receiptFileInput) {
    receiptFileInput.addEventListener('change', async () => {
      const file = receiptFileInput.files?.[0];
      if (file) {
        const previewBox = document.getElementById('receipt-preview-box');
        const previewImg = document.getElementById('receipt-preview-img') as HTMLImageElement;
        if (previewBox) {
          previewBox.classList.remove('hidden');
          if (previewImg) previewImg.alt = 'جاري رفع صورة الإيصال...';
        }
        
        try {
          const ikUrl = await uploadReceiptToImageKit(file);
          state.receiptUploadPreview = ikUrl;
          if (previewImg) {
            previewImg.src = ikUrl;
            previewImg.alt = 'صورة الإيصال المرفقة';
          }
        } catch {
          const reader = new FileReader();
          reader.onload = (e) => {
            state.receiptUploadPreview = e.target?.result as string;
            if (previewImg) previewImg.src = state.receiptUploadPreview;
          };
          reader.readAsDataURL(file);
        }
      }
    });
  }

  // Submit Receipt in Modal (Dual integration: Admin Dashboard + WhatsApp)
  const submitReceiptModalBtn = document.getElementById('btn-submit-receipt-app');
  if (submitReceiptModalBtn) {
    submitReceiptModalBtn.addEventListener('click', () => {
      const phoneInput = document.getElementById('receipt-sender-phone') as HTMLInputElement;
      const senderPhone = phoneInput ? phoneInput.value.trim() : '';

      submitPaymentRequest({
        userEmail: state.currentUser?.email || 'unknown@google.user',
        userName: state.currentUser?.displayName || 'مستخدم',
        senderPhone: senderPhone,
        receiptImage: state.receiptUploadPreview || undefined,
        amount: SUBSCRIPTION_PRICE_EGP,
      });

      const whatsAppUrl = generateWhatsAppPaymentUrl(
        state.currentUser?.displayName || 'مستخدم زاد المسلم',
        state.currentUser?.email || '',
        SUBSCRIPTION_PRICE_EGP
      );
      window.open(whatsAppUrl, '_blank');

      state.receiptUploadPreview = null;
      state.showPaywallModal = false;
      state.paywallStep = 1;
      alert('تم إرسال الطلب إلى لوحة تحكم المسؤول وفتح واتساب المبرمج مالك للإشعار الفوري بنجاح!');
      renderApp();
    });
  }

  // Handle Receipt Upload in Full Page
  const receiptFilePageInput = document.getElementById('receipt-file-input-page') as HTMLInputElement;
  let pageReceiptBase64 = '';
  if (receiptFilePageInput) {
    receiptFilePageInput.addEventListener('change', () => {
      const file = receiptFilePageInput.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          pageReceiptBase64 = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Submit Receipt in Full Page
  const submitReceiptPageBtn = document.getElementById('btn-submit-receipt-page');
  if (submitReceiptPageBtn) {
    submitReceiptPageBtn.addEventListener('click', () => {
      const phoneInput = document.getElementById('receipt-sender-phone-page') as HTMLInputElement;
      const senderPhone = phoneInput ? phoneInput.value.trim() : '';

      submitPaymentRequest({
        userEmail: state.currentUser?.email || 'unknown@google.user',
        userName: state.currentUser?.displayName || 'مستخدم',
        senderPhone: senderPhone,
        receiptImage: pageReceiptBase64 || undefined,
        amount: SUBSCRIPTION_PRICE_EGP,
      });

      alert('تم إرسال طلب الاشتراك وصورة الإيصال بنجاح إلى المسؤول مالك عبدالودود!');
      renderApp();
    });
  }

  // Code Activation on Full Page
  const activatePageBtn = document.getElementById('btn-activate-code-page');
  const codeInputPage = document.getElementById('activation-code-input-page') as HTMLInputElement;
  if (activatePageBtn && codeInputPage) {
    activatePageBtn.addEventListener('click', () => {
      const code = codeInputPage.value.trim().toUpperCase();
      if (code) {
        activateSubscription(30, state.currentUser?.email);
        alert('تهانينا! تم تفعيل باقة زاد المسلم الشهرية بنجاح لمدة 30 يوماً.');
        renderApp();
      }
    });
  }

  // Code Activation (ZAD100 or any voucher in Modal)
  const activateBtn = document.getElementById('btn-activate-code');
  const codeInput = document.getElementById('activation-code-input') as HTMLInputElement;
  if (activateBtn && codeInput) {
    activateBtn.addEventListener('click', () => {
      const code = codeInput.value.trim().toUpperCase();
      if (code) {
        activateSubscription(30, state.currentUser?.email);
        alert('تهانينا! تم تفعيل باقة زاد المسلم الشهرية بنجاح لمدة 30 يوماً.');
        state.showPaywallModal = false;
        renderApp();
      }
    });
  }

  // Admin Dashboard Event Listeners
  const refreshAdminBtn = document.getElementById('btn-refresh-admin');
  if (refreshAdminBtn) {
    refreshAdminBtn.addEventListener('click', () => {
      renderApp();
    });
  }

  const adminSearchInput = document.getElementById('admin-user-search-input') as HTMLInputElement;
  if (adminSearchInput) {
    adminSearchInput.addEventListener('input', () => {
      state.adminUserSearch = adminSearchInput.value;
      renderApp();
    });
  }

  // Approve Payment Request
  document.querySelectorAll('.btn-approve-request').forEach(btn => {
    btn.addEventListener('click', () => {
      const reqId = (btn as HTMLElement).dataset.reqId;
      if (reqId) {
        approvePaymentRequest(reqId);
        alert('تمت الموافقة على الطلب وتفعيل الاشتراك لمدة 30 يوماً للمستخدم ✓');
        renderApp();
      }
    });
  });

  // Reject Payment Request
  document.querySelectorAll('.btn-reject-request').forEach(btn => {
    btn.addEventListener('click', () => {
      const reqId = (btn as HTMLElement).dataset.reqId;
      if (reqId) {
        rejectPaymentRequest(reqId);
        alert('تم رفض طلب الدفع.');
        renderApp();
      }
    });
  });

  // Delete Payment Request
  document.querySelectorAll('.btn-delete-request').forEach(btn => {
    btn.addEventListener('click', () => {
      const reqId = (btn as HTMLElement).dataset.reqId;
      if (reqId) {
        deletePaymentRequest(reqId);
        renderApp();
      }
    });
  });

  // View Receipt Zoom Modal
  document.querySelectorAll('.btn-view-receipt').forEach(btn => {
    btn.addEventListener('click', () => {
      const imgSrc = (btn as HTMLElement).dataset.imgSrc;
      if (imgSrc) {
        state.viewingReceiptImage = imgSrc;
        renderApp();
      }
    });
  });

  // Close Receipt Zoom Modal
  const closeReceiptZoomBtn = document.getElementById('btn-close-receipt-zoom');
  if (closeReceiptZoomBtn) {
    closeReceiptZoomBtn.addEventListener('click', () => {
      state.viewingReceiptImage = null;
      renderApp();
    });
  }

  const receiptZoomOverlay = document.getElementById('receipt-zoom-overlay');
  if (receiptZoomOverlay) {
    receiptZoomOverlay.addEventListener('click', () => {
      state.viewingReceiptImage = null;
      renderApp();
    });
  }

  // Ban User Action
  document.querySelectorAll('.btn-ban-user-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = (btn as HTMLElement).dataset.userEmail;
      if (email) {
        if (confirm(`هل أنت متأكد من رغبتك في حظر المستخدم (${email}) ومنعه من الدخول؟`)) {
          banUser(email);
          alert(`تم حظر المستخدم ${email} بنجاح.`);
          renderApp();
        }
      }
    });
  });

  // Unban User Action
  document.querySelectorAll('.btn-unban-user-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = (btn as HTMLElement).dataset.userEmail;
      if (email) {
        unbanUser(email);
        alert(`تم فك حظر المستخدم ${email} بنجاح.`);
        renderApp();
      }
    });
  });

  // Grant 30 Days Subscription
  document.querySelectorAll('.btn-grant-user-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = (btn as HTMLElement).dataset.userEmail;
      if (email) {
        grantSubscriptionByAdmin(email, 30);
        alert(`تم تفعيل / تمديد الاشتراك لمدة 30 يوماً للمستخدم (${email}) بنجاح.`);
        renderApp();
      }
    });
  });

  // Revoke Subscription
  document.querySelectorAll('.btn-revoke-user-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = (btn as HTMLElement).dataset.userEmail;
      if (email) {
        if (confirm(`هل أنت متأكد من إنهاء اشتراك (${email})؟`)) {
          revokeSubscriptionByAdmin(email);
          renderApp();
        }
      }
    });
  });

  // Manual Direct Admin Actions
  const manualInput = document.getElementById('manual-user-email-input') as HTMLInputElement;
  const manualGrantBtn = document.getElementById('btn-manual-grant-action');
  if (manualGrantBtn && manualInput) {
    manualGrantBtn.addEventListener('click', () => {
      const val = manualInput.value.trim();
      if (!val) return alert('يرجى كتابة البريد الإلكتروني أو رقم الهاتف');
      grantSubscriptionByAdmin(val, 30);
      alert(`تم تفعيل 30 يوماً لـ ${val} بنجاح.`);
      manualInput.value = '';
      renderApp();
    });
  }

  const manualBanBtn = document.getElementById('btn-manual-ban-action');
  if (manualBanBtn && manualInput) {
    manualBanBtn.addEventListener('click', () => {
      const val = manualInput.value.trim();
      if (!val) return alert('يرجى كتابة البريد الإلكتروني أو رقم الهاتف');
      banUser(val);
      alert(`تم حظر ${val} بنجاح.`);
      manualInput.value = '';
      renderApp();
    });
  }

  const manualUnbanBtn = document.getElementById('btn-manual-unban-action');
  if (manualUnbanBtn && manualInput) {
    manualUnbanBtn.addEventListener('click', () => {
      const val = manualInput.value.trim();
      if (!val) return alert('يرجى كتابة البريد الإلكتروني أو رقم الهاتف');
      unbanUser(val);
      alert(`تم فك الحظر عن ${val} بنجاح.`);
      manualInput.value = '';
      renderApp();
    });
  }

  // Developer Test Controls
  const testTrialResetBtn = document.getElementById('btn-test-trial-reset');
  if (testTrialResetBtn) {
    testTrialResetBtn.addEventListener('click', () => {
      resetToTrialForTesting();
      state.showPaywallModal = false;
      alert('تم إعادة تعيين الفترة التجريبية (3 أيام مجاناً) للاختبار.');
      renderApp();
    });
  }

  // Global Search Input
  const globalSearchInput = document.getElementById('global-search-input') as HTMLInputElement;
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', () => {
      state.searchQuery = globalSearchInput.value;
      state.searchResults = performGlobalSearch(state.searchQuery);
      const resultsContainer = document.getElementById('search-results-list');
      if (resultsContainer) {
        renderApp();
      }
    });
  }

  // Search Results Click
  document.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', async () => {
      const type = (item as HTMLElement).dataset.resType;
      const actionId = (item as HTMLElement).dataset.actionId;
      state.showSearchModal = false;

      if (type === 'dhikr') {
        state.activeAdhkarCategory = actionId || 'morning';
        navigateTo('adhkar');
      } else if (type === 'khutbah') {
        const kh = ALL_KHUTBAHS.find(k => k.id === actionId);
        if (kh) {
          state.activeKhutbah = kh;
          navigateTo('home', 'khutbahs');
        }
      } else if (type === 'prayer_guide') {
        navigateTo('home', 'prayer_guide');
      } else if (type === 'faith') {
        navigateTo('home', 'faith');
      } else if (type === 'fear_hope') {
        navigateTo('home', 'fear_hope');
      }
    });
  });

  // Copy Buttons
  document.querySelectorAll('.btn-copy-text').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const txt = (btn as HTMLElement).dataset.copy;
      if (txt) {
        navigator.clipboard.writeText(txt).then(() => {
          alert('تم نسخ النص بنجاح.');
        }).catch(() => {
          // fallback
        });
      }
    });
  });

  // Share Buttons
  document.querySelectorAll('.btn-share-verse').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const txt = (btn as HTMLElement).dataset.ayahText || 'زاد المسلم - رفيقك اليومي للقرآن والذكر';
      if (navigator.share) {
        navigator.share({
          title: 'زاد المسلم',
          text: txt,
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(txt);
        alert('تم نسخ النص للمشاركة.');
      }
    });
  });

  // Favorite Verse / Dhikr
  document.querySelectorAll('.btn-fav-ayah').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = (btn as HTMLElement).dataset.ayahId!;
      const surah = (btn as HTMLElement).dataset.surah!;
      const num = (btn as HTMLElement).dataset.num!;
      const text = (btn as HTMLElement).dataset.text!;
      const added = toggleFavorite({
        id,
        type: 'ayah',
        title: `آية من سورة ${surah} (${num})`,
        snippet: text,
        source: 'تنزيل Tanzil.net'
      });
      alert(added ? 'تمت إضافة الآية إلى المفضلة ★' : 'تم حذف الآية من المفضلة');
      renderApp();
    });
  });

  document.querySelectorAll('.btn-fav-dhikr').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = (btn as HTMLElement).dataset.id!;
      const text = (btn as HTMLElement).dataset.text!;
      const added = toggleFavorite({
        id,
        type: 'dhikr',
        title: 'ذكر مأثور',
        snippet: text,
        source: 'حصن المسلم'
      });
      alert(added ? 'تمت إضافة الذكر للمفضلة ★' : 'تم حذف الذكر من المفضلة');
      renderApp();
    });
  });

  document.querySelectorAll('.btn-remove-fav').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.favId!;
      toggleFavorite({ id, type: 'ayah', title: '', snippet: '' });
      renderApp();
    });
  });

  // Quick Tasbeeh from Home
  const quickTasbeehBtn = document.getElementById('btn-quick-tasbeeh');
  if (quickTasbeehBtn) {
    quickTasbeehBtn.addEventListener('click', () => {
      state.tasbeeh.selectedDhikr = "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ";
      state.tasbeeh.target = 3;
      state.tasbeeh.currentCount = 0;
      saveTasbeehState(state.tasbeeh);
      navigateTo('tasbeeh');
    });
  }

  // --- Prayer Alerts & Azan Event Handlers ---
  const openAlertsBtns = [
    'btn-open-prayer-alerts', 
    'btn-hero-change-muadhin', 
    'btn-open-prayer-alerts-modal-from-detailed',
    'btn-menu-prayer-alerts'
  ];
  openAlertsBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        audioFx.playAppleSheetOpen();
        state.showPrayerAlertModal = true;
        renderApp();
      });
    }
  });

  // Quick 1-click Mu'adhin selection chips inside modal
  document.querySelectorAll('.btn-quick-select-muadhin').forEach(btn => {
    btn.addEventListener('click', () => {
      const soundId = (btn as HTMLElement).dataset.soundId;
      if (soundId) {
        audioFx.playAppleTap();
        updateMasterPrayerSettings({ globalSound: soundId });
        state.prayerAlertsSettings = loadPrayerAlertsSettings();
        // Play immediate preview of the selected Mu'adhin
        playPrayerAudio(soundId, 1.0, () => {
          state.isAzanPlaying = false;
          renderApp();
        });
        state.isAzanPlaying = true;
        renderApp();
      }
    });
  });

  const closeAlertsBtns = ['btn-close-prayer-alerts', 'btn-close-prayer-alerts-footer'];
  closeAlertsBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        audioFx.playAppleSheetClose();
        state.showPrayerAlertModal = false;
        renderApp();
      });
    }
  });

  // Master alerts toggle
  const masterAlertToggle = document.getElementById('toggle-master-prayer-alerts') as HTMLInputElement | null;
  if (masterAlertToggle) {
    masterAlertToggle.addEventListener('change', () => {
      const enabled = masterAlertToggle.checked;
      updateMasterPrayerSettings({ masterEnabled: enabled });
      state.prayerAlertsSettings = loadPrayerAlertsSettings();
      renderApp();
    });
  }

  // Request notification permission
  const reqNotifBtn = document.getElementById('btn-request-notification-perm');
  if (reqNotifBtn) {
    reqNotifBtn.addEventListener('click', async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        alert('تم تفعيل إشعارات الأذان بنجاح. ستصلك التنبيهات في مواقيتها بدقة.');
      } else {
        alert('يرجى السماح بالإشعارات من إعدادات المتصفح/الجهاز.');
      }
      renderApp();
    });
  }

  // Global Mu'adhin select
  const globalMuadhinSelect = document.getElementById('select-global-muadhin') as HTMLSelectElement | null;
  if (globalMuadhinSelect) {
    globalMuadhinSelect.addEventListener('change', () => {
      const val = globalMuadhinSelect.value as any;
      updateMasterPrayerSettings({ globalSound: val });
      state.prayerAlertsSettings = loadPrayerAlertsSettings();
      renderApp();
    });
  }

  // Apply sound to all prayers button
  const applyAllBtn = document.getElementById('btn-apply-muadhin-to-all');
  if (applyAllBtn && globalMuadhinSelect) {
    applyAllBtn.addEventListener('click', () => {
      const val = globalMuadhinSelect.value as any;
      applySoundToAllPrayers(val);
      state.prayerAlertsSettings = loadPrayerAlertsSettings();
      alert('تم تطبيق هذا الصوت على جميع الصلوات الخمس بنجاح.');
      renderApp();
    });
  }

  // Test play Azan audio
  const playPreviewBtns = ['btn-play-preview-audio', 'btn-test-global-azan'];
  playPreviewBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        const sound = state.prayerAlertsSettings.globalSound || 'makkah';
        playPrayerAudio(sound, 1.0, () => {
          state.isAzanPlaying = false;
          renderApp();
        });
        state.isAzanPlaying = true;
        renderApp();
      });
    }
  });

  // Stop Azan audio
  const stopAudioBtns = ['btn-stop-preview-audio', 'btn-stop-azan-audio', 'btn-stop-active-azan'];
  stopAudioBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        stopAzanAudio();
        state.isAzanPlaying = false;
        state.activeAzanAlert = null;
        renderApp();
      });
    }
  });

  // Individual prayer alert toggle buttons (from Home, Detailed View, and Modal)
  document.querySelectorAll('.btn-toggle-prayer-bell, .btn-toggle-prayer-detailed, .btn-toggle-prayer-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const el = btn as HTMLElement;
      const key = (el.dataset.prayer || el.dataset.prayerKey) as PrayerKey;
      if (key) {
        toggleIndividualPrayerAlert(key);
        state.prayerAlertsSettings = loadPrayerAlertsSettings();
        renderApp();
      }
    });
  });

  // Individual prayer sound selectors
  document.querySelectorAll('.prayer-sound-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const el = sel as HTMLSelectElement;
      const key = el.dataset.prayerKey as PrayerKey;
      const val = el.value as any;
      if (key && val) {
        updatePrayerConfig(key, { sound: val });
        state.prayerAlertsSettings = loadPrayerAlertsSettings();
      }
    });
  });

  // Individual prayer reminder timing selectors
  document.querySelectorAll('.prayer-reminder-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const el = sel as HTMLSelectElement;
      const key = el.dataset.prayerKey as PrayerKey;
      const val = parseInt(el.value, 10);
      if (key && !isNaN(val)) {
        updatePrayerConfig(key, { preReminderMinutes: val });
        state.prayerAlertsSettings = loadPrayerAlertsSettings();
      }
    });
  });

  // Dismiss Azan Dialog
  const dismissAzanBtn = document.getElementById('btn-dismiss-azan-dialog');
  if (dismissAzanBtn) {
    dismissAzanBtn.addEventListener('click', () => {
      state.activeAzanAlert = null;
      renderApp();
    });
  }

  // Goto Prayer Adhkar from Azan Alert Dialog
  const gotoPrayerAdhkarBtn = document.getElementById('btn-goto-prayer-adhkar');
  if (gotoPrayerAdhkarBtn) {
    gotoPrayerAdhkarBtn.addEventListener('click', () => {
      stopAzanAudio();
      state.isAzanPlaying = false;
      state.activeAzanAlert = null;
      navigateTo('home', 'prayer_adhkar');
    });
  }

  // --- Profile Management Modal Handlers ---
  const openProfileBtns = ['btn-header-profile', 'btn-edit-profile-settings', 'btn-edit-profile-btn'];
  openProfileBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        audioFx.playAppleSheetOpen();
        state.showProfileModal = true;
        state.tempProfilePhoto = state.currentUser?.photoURL || null;
        state.tempProfileName = state.currentUser?.displayName || '';
        renderApp();
      });
    }
  });

  const closeProfileBtns = ['btn-close-profile-modal', 'btn-cancel-profile-modal', 'profile-management-modal-overlay'];
  closeProfileBtns.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (id === 'profile-management-modal-overlay' && e.target !== el) return;
        audioFx.playAppleSheetClose();
        state.showProfileModal = false;
        state.tempProfilePhoto = null;
        state.tempProfileName = null;
        renderApp();
      });
    }
  });

  // Upload custom profile image from device
  const profileFileInput = document.getElementById('profile-avatar-file-input') as HTMLInputElement | null;
  if (profileFileInput) {
    profileFileInput.addEventListener('change', async () => {
      const file = profileFileInput.files?.[0];
      if (file) {
        try {
          const compressedDataUrl = await compressProfileImage(file, 256, 0.85);
          state.tempProfilePhoto = compressedDataUrl;
          renderApp();
        } catch (err: any) {
          alert(err?.message || 'تعذر معالجة الصورة، يرجى اختيار ملف صورة آخر.');
        }
      }
    });
  }

  // Remove Profile Photo
  const removePhotoBtn = document.getElementById('btn-remove-profile-photo');
  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', () => {
      audioFx.playAppleTap();
      state.tempProfilePhoto = '';
      renderApp();
    });
  }

  // Save Profile Changes
  const saveProfileBtn = document.getElementById('btn-save-profile-changes');
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
      const current = state.currentUser;
      if (!current) return;

      const nameInput = document.getElementById('input-profile-display-name') as HTMLInputElement | null;
      const newName = nameInput ? nameInput.value.trim() : (current.displayName || 'مستخدم كريم');
      const finalPhoto = state.tempProfilePhoto === '' ? null : (state.tempProfilePhoto !== null ? state.tempProfilePhoto : (current.photoURL || null));

      audioFx.playAppleTap();
      triggerHapticFeedback(20);

      // Update current state user
      const updatedUser: CustomAppUser = {
        ...current,
        uid: current.uid,
        displayName: newName || 'مستخدم كريم',
        photoURL: finalPhoto
      };
      state.currentUser = updatedUser;

      // Save to localStorage for persistent local session
      const LOCAL_USER_KEY = 'zad_custom_local_user';
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updatedUser));

      // Record in managed users & account memory
      recordUserSession(updatedUser);
      const userKey = getUserStorageKey(updatedUser);
      saveUserMemory(userKey, {
        lastUpdated: new Date().toISOString()
      });

      state.showProfileModal = false;
      state.tempProfilePhoto = null;
      state.tempProfileName = null;
      renderApp();
    });
  }

  // Touch swipe support for flipping Mushaf pages
  const mushafPageEl = document.getElementById('mushaf-active-page');
  if (mushafPageEl) {
    let touchStartX = 0;
    let touchEndX = 0;
    mushafPageEl.addEventListener('touchstart', (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    mushafPageEl.addEventListener('touchend', (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (diff < -60 && state.mushafPageNumber < 604) {
        state.mushafPageNumber++;
        state.mushafPageData = null;
        state.selectedAyah = null;
        localStorage.setItem('zad_last_mushaf_page', state.mushafPageNumber.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderApp();
      } else if (diff > 60 && state.mushafPageNumber > 1) {
        state.mushafPageNumber--;
        state.mushafPageData = null;
        state.selectedAyah = null;
        localStorage.setItem('zad_last_mushaf_page', state.mushafPageNumber.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderApp();
      }
    }, { passive: true });
  }

  // --- Apple Fluid Interface Mechanics (Emil Kowalski / WWDC Designing Fluid Interfaces) ---
  // 1. Direct Manipulation, Interruptible Springs & Momentum Projection for Bottom Sheets
  document.querySelectorAll('.bottom-sheet-content').forEach(sheet => {
    const el = sheet as HTMLElement;
    const overlay = el.closest('.modal-overlay') as HTMLElement | null;
    let startY = 0;
    let initialSheetOffset = 0;
    let currentY = 0;
    let isDragging = false;
    let activeSpring: SpringAnimation | null = null;
    const tracker = new VelocityTracker();

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('input') || target.closest('select') || target.closest('textarea')) return;
      if (el.scrollTop > 8 && !target.closest('.apple-sheet-handle')) return;

      // Principle 3: Interruptibility - interrupt ongoing spring immediately without jump
      if (activeSpring) {
        activeSpring.stop();
        initialSheetOffset = activeSpring.getCurrentPosition();
        activeSpring = null;
      } else {
        const computed = window.getComputedStyle(el).transform;
        if (computed && computed !== 'none') {
          const matrix = new DOMMatrixReadOnly(computed);
          initialSheetOffset = matrix.m42 || 0;
        } else {
          initialSheetOffset = 0;
        }
      }

      isDragging = true;
      startY = e.clientY;
      currentY = initialSheetOffset;
      tracker.reset(currentY);

      el.style.transition = 'none';
      try {
        el.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const rawDy = e.clientY - startY;
      const proposedY = initialSheetOffset + rawDy;

      // Principle 9: Rubber-banding (Exact iOS UIScrollView formula)
      if (proposedY < 0) {
        currentY = appleRubberBand(proposedY, window.innerHeight, 0.55);
      } else {
        // Principle 2: Direct manipulation — 1:1 tracking
        currentY = proposedY;
      }

      tracker.addSample(currentY);
      el.style.transform = `translateY(${currentY}px)`;

      // Continuous visual response
      if (overlay) {
        const opacityRatio = Math.max(0, Math.min(1, 1 - (currentY / (window.innerHeight * 0.7))));
        overlay.style.backgroundColor = `rgba(0, 0, 0, ${(0.52 * opacityRatio).toFixed(3)})`;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}

      // Principle 5 & 6: Velocity handoff & Momentum projection
      const releaseVelocity = tracker.getVelocity(); // px/s
      const projectedY = projectMomentum(currentY, releaseVelocity / 1000);
      const sheetHeight = el.getBoundingClientRect().height || 400;

      // Dismiss condition: either projected beyond 35% height or strong downward flick
      const shouldDismiss = projectedY > sheetHeight * 0.35 || releaseVelocity > 700;

      if (shouldDismiss) {
        // Spring animate out to screen bottom with inherited velocity
        audioFx.playAppleSheetClose();
        const targetDismissY = window.innerHeight;
        activeSpring = new SpringAnimation(
          currentY,
          releaseVelocity,
          targetDismissY,
          APPLE_SPRINGS.sheet,
          (pos) => {
            el.style.transform = `translateY(${pos}px)`;
            if (overlay) {
              const remaining = Math.max(0, 1 - (pos / targetDismissY));
              overlay.style.backgroundColor = `rgba(0, 0, 0, ${(0.52 * remaining).toFixed(3)})`;
              overlay.style.opacity = remaining.toFixed(3);
            }
          },
          () => {
            activeSpring = null;
            if (state.showLocationModal) state.showLocationModal = false;
            if (state.showSearchModal) state.showSearchModal = false;
            if (state.showPaywallModal) state.showPaywallModal = false;
            if (state.showPrayerAlertModal) state.showPrayerAlertModal = false;
            renderApp();
          }
        ).start();
      } else {
        // Principle 4 & 5: Settle back with Apple spring (damping 0.82, response 0.32)
        activeSpring = new SpringAnimation(
          currentY,
          releaseVelocity,
          0,
          APPLE_SPRINGS.sheet,
          (pos) => {
            el.style.transform = `translateY(${pos}px)`;
            if (overlay) {
              overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.52)';
              overlay.style.opacity = '1';
            }
          },
          () => {
            activeSpring = null;
            el.style.transform = 'translateY(0px)';
          }
        ).start();
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
  });

  // 2. Principle 1: Response — Kill Latency & Tactile Spring Feedback
  // Immediate response on pointerdown with zero delay
  document.querySelectorAll('.apple-spring-press, .nav-item, .card-luxury, .quran-ayah-box, .filter-chip, .btn-touch').forEach(btn => {
    btn.addEventListener('pointerdown', () => {
      triggerHapticFeedback(10);
    }, { passive: true });
  });
}

// Global Keyboard Navigation for Mushaf Pages
window.addEventListener('keydown', (e: KeyboardEvent) => {
  if (state.currentTab === 'quran' && state.quranMode === 'mushaf' && !state.activeSurah) {
    if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') return;
    if (e.key === 'ArrowLeft' && state.mushafPageNumber < 604) {
      state.mushafPageNumber++;
      state.mushafPageData = null;
      state.selectedAyah = null;
      localStorage.setItem('zad_last_mushaf_page', state.mushafPageNumber.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderApp();
    } else if (e.key === 'ArrowRight' && state.mushafPageNumber > 1) {
      state.mushafPageNumber--;
      state.mushafPageData = null;
      state.selectedAyah = null;
      localStorage.setItem('zad_last_mushaf_page', state.mushafPageNumber.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderApp();
    }
  }
});

// Initial Boot
renderApp();
