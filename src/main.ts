/**
 * تطبيق "زاد المسلم" - رفيقك اليومي للقرآن والذكر والعبادة
 * تم صنعه بواسطة: المبرمج مالك عبدالودود وأحمد رضا الشبراوي تحت إشراف الدكتور/الشيخ سعد محفوظ
 */

import './index.css';
import { SpringAnimation, VelocityTracker, appleRubberBand, projectMomentum, APPLE_SPRINGS } from './utils/appleSpring.ts';
import { ICONS } from './utils/icons.ts';
import { ABU_KABIR_VILLAGES, DEFAULT_LOCATION, LocationItem, POPULAR_LOCATIONS, EGYPT_GOVERNORATES } from './data/locationsData.ts';
import { calculateOfflinePrayers, PrayerTimesResult } from './modules/prayerCalculation.ts';
import { ALL_ADHKAR, ADHKAR_CATEGORIES, DhikrItem } from './data/adhkarData.ts';
import { PRAYER_ADHKAR_LIST } from './data/prayerAdhkarData.ts';
import { SURAH_LIST, loadSurahAyahs, AyahItem, SurahMeta } from './data/quranData.ts';
import { ALL_KHUTBAHS, KHUTBAH_CATEGORIES, KHUTBAH_OFFICIAL_SOURCES, KhutbahItem } from './data/khutbahData.ts';
import { PRAYER_GUIDE_STEPS, PrayerGuideStep } from './data/prayerGuideData.ts';
import { FAITH_DATA } from './data/faithData.ts';
import { FEAR_HOPE_CONTENT, MEDICAL_DISCLAIMER } from './data/fearHopeData.ts';
import { loadTasbeehState, saveTasbeehState, TASBEEH_PRESETS, TARGET_PRESETS, playBeadSound, triggerHapticFeedback, TasbeehState } from './modules/tasbeeh.ts';
import { 
  getSubscriptionStatus, 
  activateSubscription, 
  SubscriptionStatus, 
  resetToTrialForTesting, 
  expireTrialForTesting,
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
  toArabicNumerals 
} from './modules/mushafService.ts';
import { 
  loginWithGoogle, 
  loginWithLocalSession,
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

// State Management
interface AppState {
  currentUser: CustomAppUser | null;
  isAuthLoading: boolean;
  isSigningIn: boolean;
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
  quranMode: 'mushaf' | 'surahs' | 'embed';
  mushafPageNumber: number;
  mushafPageData: MushafPageData | null;
  isLoadingMushafPage: boolean;
  selectedAyah: MushafAyah | null;
  prayerTimes: PrayerTimesResult;
  prayerAlertsSettings: PrayerAlertsSettings;
  showPrayerAlertModal: boolean;
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
  compassHeading: number | null;
  compassPitch: number;
  compassRoll: number;
  compassIsLevel: boolean;
  compassSoundEnabled: boolean;
  compassPermissionGranted: boolean;
  receiptUploadPreview: string | null;
  viewingReceiptImage: string | null;
  adminUserSearch: string;
  paywallStep: number;
}

const STORAGE_LOCATION_KEY = 'zad_user_location';
const STORAGE_THEME_KEY = 'zad_app_theme';
const STORAGE_FONT_SIZE_KEY = 'zad_quran_font_size';
const STORAGE_DHIKR_PROGRESS = 'zad_dhikr_progress';
const STORAGE_COMPASS_SOUND = 'zad_compass_sound';

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
  compassHeading: null,
  compassPitch: 0,
  compassRoll: 0,
  compassIsLevel: true,
  compassSoundEnabled: localStorage.getItem(STORAGE_COMPASS_SOUND) !== 'false',
  compassPermissionGranted: false,
  receiptUploadPreview: null,
  viewingReceiptImage: null,
  adminUserSearch: '',
  paywallStep: 1
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

// Post-login redirect handler (redirects to primary dev URL if logged in from another host)
export function handlePostLoginRedirect(user: CustomAppUser) {
  state.currentUser = user;
  state.isSigningIn = false;
  state.authError = null;
  state.authErrorCode = null;

  if (typeof window !== 'undefined') {
    if (window.location.hostname !== PRIMARY_DEV_HOST) {
      try {
        const payload = btoa(unescape(encodeURIComponent(JSON.stringify(user))));
        const redirectUrl = `${PRIMARY_DEV_URL}?auth_user=${payload}`;
        window.location.href = redirectUrl;
        return;
      } catch {
        window.location.href = PRIMARY_DEV_URL;
        return;
      }
    }
  }
  renderApp();
}

checkUrlAuthPayload();

// Listen to Firebase Auth state change
subscribeToAuth((user) => {
  if (user) {
    state.currentUser = user;
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
  // Check subscription paywall
  const subStatus = getSubscriptionStatus();
  if (subStatus.isExpired && tab !== 'more') {
    state.showPaywallModal = true;
    audioFx.playAppleSheetOpen();
    renderApp();
    return;
  }

  // Play Apple transition sound & light tactile haptic
  audioFx.playAppleTransition();
  triggerHapticFeedback(12);

  state.currentTab = tab;
  state.subView = subView;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderApp();
}

// Render Master Shell
export function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  // 1. If auth is loading, render Splash / Loading state
  if (state.isAuthLoading) {
    root.innerHTML = `
      <div class="min-h-screen bg-canvas text-body flex flex-col items-center justify-center p-6 text-center select-none font-cairo">
        <div class="space-y-4 max-w-xs">
          <div class="relative w-24 h-24 mx-auto">
            <img src="/images/app_logo.jpg" alt="Logo" class="w-24 h-24 rounded-3xl object-cover border-2 border-gold shadow-xl" />
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
    <!-- Top Header -->
    <header class="top-header px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-xs gap-2">
      <!-- Right Side (RTL Start): App Logo & Clean Brand Title -->
      <div class="flex items-center gap-2 cursor-pointer select-none min-w-0" id="header-brand">
        <img src="/images/app_logo.jpg" alt="Logo" class="w-9 h-9 rounded-xl object-cover border border-gold/40 shadow-xs shrink-0" />
        <div class="text-right min-w-0">
          <h1 class="text-sm sm:text-base font-black tracking-tight text-primary flex items-center gap-1 leading-tight truncate">
            <span>اذكار ، Ankara</span>
            <span class="text-gold shrink-0">${ICONS.sparkles('w-3 h-3')}</span>
          </h1>
          <p class="text-[10px] text-muted leading-tight truncate hidden xs:block">رفيقك اليومي للقرآن والذكر والعبادة</p>
        </div>
      </div>

      <!-- Left Side (RTL End): Action Icons with consistent touch targets -->
      <div class="flex items-center gap-1.5 shrink-0">
        ${isAdmin ? `
          <button id="btn-header-admin" class="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-r from-amber-500 to-gold text-slate-950 shadow-sm hover:brightness-105 transition-all cursor-pointer shrink-0" title="لوحة تحكم المسؤول">
            ${ICONS.crown('w-4.5 h-4.5 text-slate-950')}
          </button>
        ` : ''}
        <button id="btn-open-favorites" class="w-9 h-9 rounded-xl flex items-center justify-center border border-subtle hover:bg-surface-subtle transition-colors text-gold cursor-pointer shrink-0" title="المفضلة">
          ${ICONS.star('w-4 h-4', true)}
        </button>
        <button id="btn-open-search" class="w-9 h-9 rounded-xl flex items-center justify-center border border-subtle hover:bg-surface-subtle text-secondary transition-colors cursor-pointer shrink-0" title="بحث شامل">
          ${ICONS.search('w-4 h-4')}
        </button>
        <button id="btn-toggle-theme" class="w-9 h-9 rounded-xl flex items-center justify-center border border-subtle hover:bg-surface-subtle text-secondary transition-colors cursor-pointer shrink-0" title="الوضع الليلي">
          ${state.theme === 'dark' ? ICONS.sun('w-4 h-4 text-gold') : ICONS.moon('w-4 h-4 text-secondary')}
        </button>
      </div>
    </header>

    <!-- Trial Banner (if in 3-day trial) -->
    ${subStatus.isTrial && !isAdmin ? `
      <div class="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
        <div class="flex items-center gap-1.5 font-medium text-[11px]">
          ${ICONS.clock('w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0')}
          <span>فترة تجريبية مجانية: متبقي <strong class="font-bold">${subStatus.daysRemaining} يوم</strong> و ${subStatus.hoursRemaining} س</span>
        </div>
        <button id="btn-upgrade-banner" class="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded-lg text-[11px] font-bold shadow-xs transition-colors cursor-pointer">
          فودافون كاش
        </button>
      </div>
    ` : ''}

    <!-- Main Content Area with Apple Fluid View Transition -->
    <main class="flex-1 apple-view-transition ${state.currentTab === 'quran' ? 'px-1 py-1' : 'px-4 py-4'} max-w-lg mx-auto w-full">
      ${renderActiveView()}
    </main>

    <!-- Bottom Footer Dedication (صناع التطبيق) -->
    ${state.currentTab !== 'quran' ? `
    <footer class="mt-8 mb-4 px-4 text-center">
      <div class="border-t border-subtle pt-4 text-xs text-muted leading-relaxed space-y-1">
        <p class="font-semibold text-secondary">«اذكار ، Ankara» — رفيقك اليومي للقرآن والذكر والعبادة</p>
        <p class="text-xs text-primary leading-normal">
          تم صنعه بواسطة <span class="font-bold text-primary">المبرمج مالك عبدالودود وأحمد رضا الشبراوي</span> تحت إشراف <span class="font-bold text-primary">الدكتور/الشيخ سعد محفوظ</span>.
        </p>
      </div>
    </footer>
    ` : ''}

    <!-- Bottom Navigation Bar with Horizontal Touch Scroll & All App Sections -->
    <nav class="bottom-nav">
      <button class="nav-item apple-spring-press ${state.currentTab === 'home' && !state.subView ? 'active' : ''}" data-nav="home">
        <span class="nav-icon-container">${ICONS.home('w-5 h-5')}</span>
        <span>الرئيسية</span>
      </button>
      <button class="nav-item apple-spring-press ${state.currentTab === 'quran' ? 'active' : ''}" data-nav="quran">
        <span class="nav-icon-container">${ICONS.quran('w-5 h-5')}</span>
        <span>القرآن</span>
      </button>
      <button class="nav-item apple-spring-press ${state.currentTab === 'adhkar' ? 'active' : ''}" data-nav="adhkar">
        <span class="nav-icon-container">${ICONS.duaHands('w-5 h-5')}</span>
        <span>الأذكار</span>
      </button>
      <button class="nav-item apple-spring-press ${state.currentTab === 'tasbeeh' ? 'active' : ''}" data-nav="tasbeeh">
        <span class="nav-icon-container">${ICONS.tasbeeh('w-5 h-5')}</span>
        <span>المسبحة</span>
      </button>
      <button class="nav-item apple-spring-press ${state.subView === 'prayer_adhkar' ? 'active' : ''}" data-subview="prayer_adhkar">
        <span class="nav-icon-container">${ICONS.mosque('w-5 h-5')}</span>
        <span>أذكار الصلاة</span>
      </button>
      <button class="nav-item apple-spring-press ${state.subView === 'prayer_times' ? 'active' : ''}" data-subview="prayer_times">
        <span class="nav-icon-container">${ICONS.clock('w-5 h-5')}</span>
        <span>المواقيت</span>
      </button>
      <button class="nav-item apple-spring-press ${state.subView === 'prayer_guide' ? 'active' : ''}" data-subview="prayer_guide">
        <span class="nav-icon-container">${ICONS.bookGuide('w-5 h-5')}</span>
        <span>تعليم الصلاة</span>
      </button>
      <button class="nav-item apple-spring-press ${state.subView === 'khutbahs' ? 'active' : ''}" data-subview="khutbahs">
        <span class="nav-icon-container">${ICONS.speakerKhutbah('w-5 h-5')}</span>
        <span>الخطب</span>
      </button>
      <button class="nav-item apple-spring-press ${state.subView === 'faith' ? 'active' : ''}" data-subview="faith">
        <span class="nav-icon-container">${ICONS.heartFaith('w-5 h-5')}</span>
        <span>الإيمان</span>
      </button>
      <button class="nav-item apple-spring-press ${state.subView === 'fear_hope' ? 'active' : ''}" data-subview="fear_hope">
        <span class="nav-icon-container">${ICONS.shieldPeace('w-5 h-5')}</span>
        <span>الخوف والرجاء</span>
      </button>
      <button class="nav-item apple-spring-press ${state.currentTab === 'more' ? 'active' : ''}" data-nav="more">
        <span class="nav-icon-container">${ICONS.settings('w-5 h-5')}</span>
        <span>المزيد</span>
      </button>
    </nav>

    <!-- Modals -->
    ${state.showSearchModal ? renderSearchModal() : ''}
    ${state.showLocationModal ? renderLocationModal() : ''}
    ${state.showPaywallModal ? renderPaywallModal() : ''}
    ${state.viewingReceiptImage ? renderReceiptImageModal() : ''}
    ${state.showPrayerAlertModal ? renderPrayerAlertSettingsModal() : ''}
    ${(state.activeAzanAlert || state.isAzanPlaying) ? renderActiveAzanDialog() : ''}
  `;

  attachEventHandlers();
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

  switch (state.currentTab) {
    case 'home': return renderHomeView();
    case 'quran': return renderQuranView();
    case 'adhkar': return renderAdhkarView();
    case 'tasbeeh': return renderTasbeehView();
    case 'more': return renderMoreView();
    default: return renderHomeView();
  }
}

// 1. Home View
function renderHomeView(): string {
  const p = state.prayerTimes;
  const alertSettings = state.prayerAlertsSettings;

  return `
    <div class="space-y-4">
      <!-- Islamic Date & Luxury Prayer Times Hero Card -->
      <div class="prayer-hero-card p-4 sm:p-5 text-white">
        <div class="relative z-10 flex flex-col justify-between">
          <!-- Top Row: Hijri Date, Prayer Alerts Button & Location Selector -->
          <div class="flex items-center justify-between text-xs text-white/90">
            <div class="flex items-center gap-1.5 font-medium">
              ${ICONS.calendar('w-4 h-4 text-gold')}
              <span>${p.hijriDate}</span>
            </div>
            
            <div class="flex items-center gap-1.5">
              <button id="btn-open-prayer-alerts" class="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-gold text-slate-950 hover:brightness-110 border border-gold/70 px-3 py-1 rounded-full text-xs font-black transition-all active:scale-95 cursor-pointer shadow-sm" title="إعدادات صوت الأذان وتغيير المؤذن">
                ${ICONS.mic('w-3.5 h-3.5 text-slate-950')}
                <span>تغيير المؤذن</span>
              </button>
              <button id="btn-hero-location" class="flex items-center gap-1.5 bg-black/25 hover:bg-black/40 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-white transition-all active:scale-95 cursor-pointer" title="تغيير موقع مواقيت الصلاة">
                ${ICONS.mapPin('w-3.5 h-3.5 text-gold')}
                <span>${state.selectedLocation.city.replace('مركز ', '')}</span>
                <span class="text-[9px] text-white/70">▼</span>
              </button>
            </div>
          </div>

          <!-- Center Showcase: Next Prayer & Giant Timer -->
          <div class="my-3 text-center">
            <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold/25 border border-gold/40 text-gold-light text-xs font-bold shadow-xs">
              ${ICONS.islamicCrescent('w-3.5 h-3.5 text-gold')}
              <span>الصلاة القادمة: صلاة ${p.nextPrayer.arabicName}</span>
            </div>
            <div class="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white my-2 tabular-nums drop-shadow-md" id="prayer-countdown-timer">
              ${p.nextPrayer.remainingFormatted}
            </div>
            <div class="text-xs text-white/85 flex items-center justify-center gap-2">
              <span>موعد الأذان: <strong class="text-gold font-bold font-mono text-sm">${p.nextPrayer.time}</strong></span>
              <span class="text-white/40">·</span>
              <span class="text-[11px] text-white/75">${p.nextPrayer.isTomorrow ? 'غداً فجراً' : 'اليوم'}</span>
            </div>
          </div>

          <!-- 6 Prayer Times Row with custom Islamic SVG Icons & Individual Bell Toggles -->
          <div class="grid grid-cols-6 gap-1.5 pt-2 text-center">
            <!-- 1. Fajr -->
            <div class="${p.nextPrayer.name === 'fajr' ? 'prayer-box-active' : 'prayer-box-inactive'} p-1.5 transition-all relative">
              <div class="flex items-center justify-between px-0.5 mb-1">
                <span class="text-white/70">${ICONS.islamicCrescent('w-3.5 h-3.5')}</span>
                <button 
                  class="btn-toggle-prayer-bell p-0.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer ${alertSettings.prayers.fajr.enabled ? 'text-gold' : 'text-white/30'}"
                  data-prayer="fajr" 
                  title="${alertSettings.prayers.fajr.enabled ? 'تنبيه الفجر: مفعل (انقر للتعطيل)' : 'تنبيه الفجر: معطل (انقر للتفعيل)'}"
                >
                  ${alertSettings.prayers.fajr.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                </button>
              </div>
              <div class="text-[11px] font-bold ${p.nextPrayer.name === 'fajr' ? 'text-gold' : 'text-white/80'}">الفجر</div>
              <div class="text-xs font-mono font-bold text-white mt-0.5 tabular-nums">${p.fajr}</div>
            </div>

            <!-- 2. Sunrise -->
            <div class="${p.nextPrayer.name === 'sunrise' ? 'prayer-box-active' : 'prayer-box-inactive'} p-1.5 transition-all relative">
              <div class="flex items-center justify-between px-0.5 mb-1">
                <span class="text-white/70">${ICONS.sunrise('w-3.5 h-3.5')}</span>
                <button 
                  class="btn-toggle-prayer-bell p-0.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer ${alertSettings.prayers.sunrise.enabled ? 'text-gold' : 'text-white/30'}"
                  data-prayer="sunrise" 
                  title="${alertSettings.prayers.sunrise.enabled ? 'تنبيه الشروق: مفعل (انقر للتعطيل)' : 'تنبيه الشروق: معطل (انقر للتفعيل)'}"
                >
                  ${alertSettings.prayers.sunrise.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                </button>
              </div>
              <div class="text-[11px] font-bold ${p.nextPrayer.name === 'sunrise' ? 'text-gold' : 'text-white/80'}">الشروق</div>
              <div class="text-xs font-mono font-bold text-white mt-0.5 tabular-nums">${p.sunrise}</div>
            </div>

            <!-- 3. Dhuhr -->
            <div class="${p.nextPrayer.name === 'dhuhr' ? 'prayer-box-active' : 'prayer-box-inactive'} p-1.5 transition-all relative">
              <div class="flex items-center justify-between px-0.5 mb-1">
                <span class="text-white/70">${ICONS.sun('w-3.5 h-3.5')}</span>
                <button 
                  class="btn-toggle-prayer-bell p-0.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer ${alertSettings.prayers.dhuhr.enabled ? 'text-gold' : 'text-white/30'}"
                  data-prayer="dhuhr" 
                  title="${alertSettings.prayers.dhuhr.enabled ? 'تنبيه الظهر: مفعل (انقر للتعطيل)' : 'تنبيه الظهر: معطل (انقر للتفعيل)'}"
                >
                  ${alertSettings.prayers.dhuhr.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                </button>
              </div>
              <div class="text-[11px] font-bold ${p.nextPrayer.name === 'dhuhr' ? 'text-gold' : 'text-white/80'}">الظهر</div>
              <div class="text-xs font-mono font-bold text-white mt-0.5 tabular-nums">${p.dhuhr}</div>
            </div>

            <!-- 4. Asr -->
            <div class="${p.nextPrayer.name === 'asr' ? 'prayer-box-active' : 'prayer-box-inactive'} p-1.5 transition-all relative">
              <div class="flex items-center justify-between px-0.5 mb-1">
                <span class="text-white/70">${ICONS.sun('w-3.5 h-3.5 opacity-80')}</span>
                <button 
                  class="btn-toggle-prayer-bell p-0.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer ${alertSettings.prayers.asr.enabled ? 'text-gold' : 'text-white/30'}"
                  data-prayer="asr" 
                  title="${alertSettings.prayers.asr.enabled ? 'تنبيه العصر: مفعل (انقر للتعطيل)' : 'تنبيه العصر: معطل (انقر للتفعيل)'}"
                >
                  ${alertSettings.prayers.asr.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                </button>
              </div>
              <div class="text-[11px] font-bold ${p.nextPrayer.name === 'asr' ? 'text-gold' : 'text-white/80'}">العصر</div>
              <div class="text-xs font-mono font-bold text-white mt-0.5 tabular-nums">${p.asr}</div>
            </div>

            <!-- 5. Maghrib -->
            <div class="${p.nextPrayer.name === 'maghrib' ? 'prayer-box-active' : 'prayer-box-inactive'} p-1.5 transition-all relative">
              <div class="flex items-center justify-between px-0.5 mb-1">
                <span class="text-white/70">${ICONS.sunset('w-3.5 h-3.5')}</span>
                <button 
                  class="btn-toggle-prayer-bell p-0.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer ${alertSettings.prayers.maghrib.enabled ? 'text-gold' : 'text-white/30'}"
                  data-prayer="maghrib" 
                  title="${alertSettings.prayers.maghrib.enabled ? 'تنبيه المغرب: مفعل (انقر للتعطيل)' : 'تنبيه المغرب: معطل (انقر للتفعيل)'}"
                >
                  ${alertSettings.prayers.maghrib.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                </button>
              </div>
              <div class="text-[11px] font-bold ${p.nextPrayer.name === 'maghrib' ? 'text-gold' : 'text-white/80'}">المغرب</div>
              <div class="text-xs font-mono font-bold text-white mt-0.5 tabular-nums">${p.maghrib}</div>
            </div>

            <!-- 6. Isha -->
            <div class="${p.nextPrayer.name === 'isha' ? 'prayer-box-active' : 'prayer-box-inactive'} p-1.5 transition-all relative">
              <div class="flex items-center justify-between px-0.5 mb-1">
                <span class="text-white/70">${ICONS.moonStars('w-3.5 h-3.5')}</span>
                <button 
                  class="btn-toggle-prayer-bell p-0.5 rounded-md hover:bg-white/20 transition-colors cursor-pointer ${alertSettings.prayers.isha.enabled ? 'text-gold' : 'text-white/30'}"
                  data-prayer="isha" 
                  title="${alertSettings.prayers.isha.enabled ? 'تنبيه العشاء: مفعل (انقر للتعطيل)' : 'تنبيه العشاء: معطل (انقر للتفعيل)'}"
                >
                  ${alertSettings.prayers.isha.enabled ? ICONS.bell('w-3 h-3') : ICONS.bellOff('w-3 h-3')}
                </button>
              </div>
              <div class="text-[11px] font-bold ${p.nextPrayer.name === 'isha' ? 'text-gold' : 'text-white/80'}">العشاء</div>
              <div class="text-xs font-mono font-bold text-white mt-0.5 tabular-nums">${p.isha}</div>
            </div>
          </div>

          <!-- Prominent Large Mu'adhin Bar (تصميم راقٍ بأيقونات SVG بدون إيموجي) -->
          <div class="pt-3 border-t border-white/15 mt-3">
            <div class="bg-slate-950/70 backdrop-blur-md rounded-2xl p-3 border border-gold/40 shadow-xl transition-all">
              <div class="flex items-center justify-between gap-2 mb-2.5">
                <div class="flex items-center gap-2.5 min-w-0">
                  <div class="w-9 h-9 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shrink-0 shadow-xs">
                    ${ICONS.mic('w-4.5 h-4.5 text-gold')}
                  </div>
                  <div class="min-w-0 text-right">
                    <div class="text-[11px] text-white/70 font-medium leading-tight">صوت المؤذن المعتمد:</div>
                    <div class="text-xs sm:text-sm font-black text-gold truncate mt-0.5">
                      ${MUADHIN_OPTIONS.find(m => m.id === alertSettings.globalSound)?.name || 'أذان الشيخ ناصر القطامي'}
                    </div>
                  </div>
                </div>

                <div class="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                  ${ICONS.bell('w-3 h-3 text-emerald-400')}
                  <span>مفعّل</span>
                </div>
              </div>

              <button 
                id="btn-hero-change-muadhin" 
                class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-gold hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer"
                title="انقر لتغيير صوت المؤذن (القطامي، الدوسري، العفاسي، المنشاوي، عبد الباسط، الحصري)"
              >
                ${ICONS.mic('w-4 h-4 text-slate-950')}
                <span>تغيير صوت المؤذن والأذان</span>
                ${ICONS.bolt('w-3.5 h-3.5 text-slate-950')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Verse of the Day -->
      <div class="card-luxury p-4 border-r-4 border-r-gold bg-surface">
        <div class="flex items-center justify-between text-xs text-muted mb-2">
          <span class="font-bold text-gold flex items-center gap-1.5">
            ${ICONS.sparkles('w-4 h-4')}
            <span>آية اليوم</span>
          </span>
          <div class="flex items-center gap-1 text-secondary">
            <button class="btn-copy-text w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-subtle hover:text-primary transition-colors" data-copy="﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾ [الرعد: 28]" title="نسخ الآية">
              ${ICONS.copy('w-4 h-4')}
            </button>
            <button class="btn-share-verse w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-subtle hover:text-primary transition-colors" title="مشاركة">
              ${ICONS.share('w-4 h-4')}
            </button>
          </div>
        </div>
        <p class="font-amiri text-lg leading-loose text-center text-primary font-bold my-1">
          ﴿ الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ ۗ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾
        </p>
        <div class="text-left text-[11px] text-muted">
          سورة الرعد - آية 28 · <a href="https://tanzil.net" target="_blank" class="underline hover:text-primary">Tanzil.net</a>
        </div>
      </div>

      <!-- Quran Interactive Direct Image Card -->
      <div class="relative overflow-hidden rounded-2xl border border-gold/30 shadow-md cursor-pointer group" data-action="nav-quran">
        <img src="/images/quran_rehal.jpg" alt="المصحف الشريف" class="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end justify-between p-3.5 text-white">
          <div>
            <div class="text-xs text-gold font-bold flex items-center gap-1.5">
              ${ICONS.quran('w-4 h-4 text-gold')}
              <span>المصحف الإلكتروني الشريف</span>
            </div>
            <div class="text-sm font-bold mt-0.5">تصفح القرآن الكريم كاملاً عبر Tanzil.net</div>
          </div>
          <span class="bg-gold text-emerald-950 font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-transform group-hover:scale-105">فتح المصحف ←</span>
        </div>
      </div>

      <!-- Dhikr of the Day Card -->
      <div class="card-luxury p-4 bg-surface">
        <div class="flex items-center justify-between text-xs text-muted mb-2">
          <span class="font-bold text-primary flex items-center gap-1.5">
            ${ICONS.duaHands('w-4 h-4')}
            <span>ذكر اليوم المأثور</span>
          </span>
          <span class="text-[11px] text-muted">صحيح مسلم</span>
        </div>
        <p class="text-sm font-medium text-secondary leading-relaxed">
          «سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ»
        </p>
        <div class="mt-3 flex items-center justify-between">
          <button id="btn-quick-tasbeeh" class="bg-primary/10 text-primary hover:bg-primary hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95">
            ${ICONS.tasbeeh('w-3.5 h-3.5')}
            <span>سبّح بها الآن</span>
          </button>
          <span class="text-xs text-muted">تُقال 3 مرات صباحاً</span>
        </div>
      </div>

      <!-- 14 Main Sections Grid -->
      <div>
        <h2 class="text-sm font-bold text-secondary mb-3 flex items-center justify-between">
          <span>أقسام تطبيق اذكار ، Ankara</span>
          <span class="text-xs text-muted font-normal">13 قسماً إسلامياً</span>
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <!-- 1. Quran -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="nav-quran">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.quran('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">القرآن الكريم</div>
              <div class="text-[10px] text-muted">مصحف تنزيل المعتمد (Tanzil.net)</div>
            </div>
          </button>

          <!-- 2. Adhkar -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="nav-adhkar">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.duaHands('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">الأذكار النبوية</div>
              <div class="text-[10px] text-muted">23 تصنيفاً معتمداً بالأدلة</div>
            </div>
          </button>

          <!-- 3. Tasbeeh -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="nav-tasbeeh">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.tasbeeh('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">المسبحة الإلكترونية</div>
              <div class="text-[10px] text-muted">عداد ذكي مع اهتزاز وصوت</div>
            </div>
          </button>

          <!-- 4. Prayer Adhkar -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="open-subview" data-view="prayer_adhkar">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.mosque('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">أذكار الصلاة</div>
              <div class="text-[10px] text-muted">مرتبة زمنيّاً بالسنن والأدعية</div>
            </div>
          </button>

          <!-- 5. Prayer Times -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="open-subview" data-view="prayer_times">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.clock('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">مواقيت الصلاة</div>
              <div class="text-[10px] text-muted">حساب فلكي دقيق بالثانية</div>
            </div>
          </button>

          <!-- 6. Prayer Guide -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="open-subview" data-view="prayer_guide">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.bookGuide('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">تعليم الصلاة</div>
              <div class="text-[10px] text-muted">تفاعلي بالخطوات والوضوء</div>
            </div>
          </button>

          <!-- 8. Khutbahs -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="open-subview" data-view="khutbahs">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.speakerKhutbah('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">خطب الجمعة</div>
              <div class="text-[10px] text-muted">ابن باز ومصادر معتمدة</div>
            </div>
          </button>

          <!-- 9. Faith -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="open-subview" data-view="faith">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.heartFaith('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">الإيمان بالله</div>
              <div class="text-[10px] text-muted">الأركان الستة بالأدلة القرآنية</div>
            </div>
          </button>

          <!-- 10. Fear & Hope -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="open-subview" data-view="fear_hope">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.shieldPeace('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">الخوف والرجاء</div>
              <div class="text-[10px] text-muted">السكينة والهدوء النفسي</div>
            </div>
          </button>

          <!-- 11. Morning Adhkar -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="open-adhkar-category" data-cat="morning">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.sunrise('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">أذكار الصباح</div>
              <div class="text-[10px] text-muted">تحصين وبداية يوم مبارك</div>
            </div>
          </button>

          <!-- 12. Evening Adhkar -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="open-adhkar-category" data-cat="evening">
            <div class="w-10 h-10 rounded-xl bg-amber-600/10 text-amber-700 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.sunset('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">أذكار المساء</div>
              <div class="text-[10px] text-muted">حفظ وبركة وسكينة الليل</div>
            </div>
          </button>

          <!-- 13. Sleep Adhkar -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="open-adhkar-category" data-cat="sleep">
            <div class="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.moonStars('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">أذكار النوم</div>
              <div class="text-[10px] text-muted">تسبيح فاطمة والاستعاذة</div>
            </div>
          </button>

          <!-- 14. Settings -->
          <button class="card-luxury p-3 text-right flex flex-col justify-between h-28 hover:border-primary transition-all group" data-action="nav-more">
            <div class="w-10 h-10 rounded-xl bg-slate-500/10 text-secondary flex items-center justify-center transition-transform group-hover:scale-110">
              ${ICONS.settings('w-5 h-5')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary">الإعدادات والمصادر</div>
              <div class="text-[10px] text-muted">المراجع والاشتراك وتطبيق Android</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Mandatory Google Login Screen
function renderMandatoryAuthScreen(): string {
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const isUnauthorizedDomain = state.authErrorCode === 'auth/unauthorized-domain' || (state.authError && state.authError.includes('unauthorized-domain'));

  return `
    <div class="min-h-screen bg-canvas text-body font-cairo flex flex-col justify-between max-w-lg mx-auto p-4 sm:p-6 relative overflow-hidden select-none">
      <!-- Ambient Glows -->
      <div class="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-gold/15 blur-3xl pointer-events-none"></div>

      <!-- Top Brand -->
      <div class="text-center pt-6 pb-2 space-y-3">
        <div class="relative inline-block">
          <img src="/images/app_logo.jpg" alt="Logo" class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-gold shadow-lg mx-auto" />
          <span class="absolute -bottom-1 -right-1 bg-emerald-700 text-gold p-1.5 rounded-xl border border-gold shadow-md">
            ${ICONS.sparkles('w-3.5 h-3.5')}
          </span>
        </div>

        <div>
          <h1 class="text-xl sm:text-2xl font-bold text-primary flex items-center justify-center gap-1.5 leading-tight">
            <span>اذكار ، Ankara</span>
          </h1>
          <p class="text-xs text-muted mt-1 font-medium">«رفيقك اليومي للقرآن والذكر والعبادة»</p>
        </div>
      </div>

      <!-- Auth Center Card -->
      <div class="card-luxury p-5 sm:p-6 bg-surface/95 border border-gold/40 rounded-3xl shadow-xl space-y-4 my-auto">
        <div class="text-center space-y-1.5">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 mx-auto flex items-center justify-center font-bold">
            ${ICONS.lock('w-6 h-6')}
          </div>
          <h2 class="text-base font-bold text-primary">تسجيل الدخول إجباري للمتابعة</h2>
          <p class="text-xs text-muted leading-relaxed">
            يرجى تسجيل الدخول بحسابك في Google عبر Firebase لحفظ ختمتك القرآنية وأذكارك ومزامنة بياناتك بأمان.
          </p>
        </div>

        ${isUnauthorizedDomain ? `
          <div class="bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 p-3.5 rounded-2xl text-xs space-y-2.5 text-right">
            <div class="font-bold text-xs flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              ${ICONS.alertTriangle('w-4 h-4 text-amber-600')}
              <span>تنبيه تفعيل النطاق في Firebase (Authorized Domain)</span>
            </div>
            <p class="leading-relaxed text-[11px]">
              النطاق الحالي للتطبيق يحتاج للإضافة في قائمة النطاقات المسموح بها في Firebase Console:
            </p>
            <div class="p-2 rounded-xl bg-black/10 dark:bg-black/30 font-mono text-[11px] text-center select-all flex items-center justify-between gap-2 border border-subtle">
              <span class="truncate font-semibold text-primary" id="copy-domain-text">${currentHost}</span>
              <button id="btn-copy-domain" class="px-2 py-1 rounded bg-surface border border-subtle text-[10px] font-sans hover:bg-surface-subtle shrink-0">
                نسخ النطاق
              </button>
            </div>
            <div class="pt-1 flex items-center justify-between gap-2">
              <a 
                href="https://console.firebase.google.com/project/azkar-df7c4/authentication/settings" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-[11px] text-primary underline font-bold"
              >
                فتح إعدادات Firebase ↗
              </a>
              <span class="text-[10px] text-muted">Authentication > Settings > Authorized domains</span>
            </div>
          </div>
        ` : (state.authError ? `
          <div class="bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 p-3 rounded-xl text-xs leading-relaxed text-center">
            ${state.authError}
          </div>
        ` : '')}

        <div class="space-y-3 pt-1">
          <button 
            id="btn-google-login-action" 
            class="w-full py-3.5 px-4 bg-white hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-bold rounded-2xl border-2 border-emerald-600/30 hover:border-emerald-600 shadow-md flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            ${state.isSigningIn ? 'disabled' : ''}
          >
            ${state.isSigningIn ? `
              <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span class="text-sm">جاري تسجيل الدخول عبر Google...</span>
            ` : `
              <span class="w-5 h-5 flex items-center justify-center">${ICONS.google('w-5 h-5')}</span>
              <span class="text-sm font-bold">المتابعة باستخدام حساب Google</span>
            `}
          </button>

          <!-- Instant Demo/Developer Login (Always available so testing is never blocked) -->
          <button 
            id="btn-demo-login-action" 
            class="w-full py-2.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold rounded-xl border border-emerald-500/30 text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            ${ICONS.bolt('w-3.5 h-3.5 text-emerald-600')}
            <span>المتابعة بحساب المطور مالك عبدالودود (دخول فوري)</span>
          </button>

          <div class="grid grid-cols-2 gap-2 text-[11px] text-muted pt-2 border-t border-subtle">
            <div class="flex items-center gap-1.5 justify-center">
              ${ICONS.check('w-3.5 h-3.5 text-emerald-600')}
              <span>المصحف الشريف الكامل</span>
            </div>
            <div class="flex items-center gap-1.5 justify-center">
              ${ICONS.check('w-3.5 h-3.5 text-emerald-600')}
              <span>حفظ تقدم الأذكار</span>
            </div>
            <div class="flex items-center gap-1.5 justify-center">
              ${ICONS.check('w-3.5 h-3.5 text-emerald-600')}
              <span>مواقيت الصلاة الدقيقة</span>
            </div>
            <div class="flex items-center gap-1.5 justify-center">
              ${ICONS.check('w-3.5 h-3.5 text-emerald-600')}
              <span>السبحة الإلكترونية</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Dedication Footer -->
      <footer class="mt-4 mb-2 px-2 text-center space-y-1">
        <p class="text-xs text-primary leading-normal">
          تم صنعه بواسطة <span class="font-bold text-primary">المبرمج مالك عبدالودود وأحمد رضا الشبراوي</span>
        </p>
        <p class="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
          تحت إشراف: <span class="font-bold">الدكتور/الشيخ سعد محفوظ</span>
        </p>
      </footer>
    </div>
  `;
}

// 2. Quran View - Tanzil.net Direct Embed (مصحف تنزيل ملء الصفحة بجودة فائقة ووضوح تام بدون أي فهرس)
function renderQuranView(): string {
  return `
    <div class="flex flex-col w-full h-full pb-1 space-y-1.5">
      <!-- Sleek Top Controls Bar -->
      <div class="card-luxury px-3 py-2 flex items-center justify-between bg-surface/95 border border-gold/30 rounded-xl shadow-xs">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            ${ICONS.quran('w-4 h-4')}
          </div>
          <div>
            <div class="text-xs font-bold text-primary flex items-center gap-1.5">
              <span>المصحف الشريف - Tanzil.net</span>
              <span class="text-[9px] bg-gold/15 text-gold-dark dark:text-gold px-1.5 py-0.5 rounded font-bold border border-gold/30">معتمد</span>
            </div>
            <div class="text-[10px] text-muted">قراءة كاملة بالصفحات والأجزاء والسور مع التلاوات والتفاسير</div>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <button 
            id="btn-reload-tanzil-iframe" 
            class="px-2.5 py-1.5 rounded-lg border border-subtle text-secondary hover:text-primary hover:bg-surface-subtle transition-colors flex items-center gap-1 text-[11px] cursor-pointer" 
            title="تحديث المصحف"
          >
            ${ICONS.rotate('w-3.5 h-3.5')}
            <span class="text-[10px]">تحديث</span>
          </button>
          <a 
            href="https://tanzil.net/?embed=true" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary-dark transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
            title="فتح مصحف تنزيل في نافذة كاملة"
          >
            <span>ملء الشاشة</span>
            <span>↗</span>
          </a>
        </div>
      </div>

      <!-- Tanzil Embedded Iframe Quran - Maximum Height & Width (ملء الصفحة بوضوح تام) -->
      <div class="w-full bg-surface rounded-2xl overflow-hidden border border-gold/30 shadow-lg relative flex-1" style="height: calc(100vh - 130px); min-height: 820px;">
        <iframe 
          id="tanzil-quran-iframe"
          width="100%" 
          height="100%" 
          src="https://tanzil.net/?embed=true" 
          style="border: none; width: 100%; height: 100%; min-height: 820px; display: block;" 
          scrolling="auto" 
          frameborder="0"
          allow="fullscreen"
          allowfullscreen>
        </iframe>
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
      <!-- Quick Navigation & Controls Bar -->
      <div class="card-luxury p-2.5 flex items-center justify-between gap-2 bg-surface/95 backdrop-blur-md sticky top-14 z-20 shadow-sm">
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

      <!-- Floating Action Bar for Selected Ayah -->
      ${state.selectedAyah ? `
        <div class="mushaf-floating-bar card-luxury p-3.5 bg-surface border-2 border-gold/40 shadow-xl fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-40 rounded-2xl">
          <div class="flex items-center justify-between text-xs text-muted mb-2 pb-1.5 border-b border-subtle">
            <span class="font-bold text-primary flex items-center gap-1.5">
              ${ICONS.quran('w-4 h-4 text-gold')}
              <span>سورة ${state.selectedAyah.surahName} · الآية ${state.selectedAyah.numberInSurah}</span>
            </span>
            <button id="btn-close-ayah-action" class="w-6 h-6 rounded-full bg-surface-subtle flex items-center justify-center text-xs font-bold text-muted hover:text-primary">
              ${ICONS.close('w-3.5 h-3.5')}
            </button>
          </div>

          <p class="font-amiri text-sm text-primary leading-relaxed mb-3 line-clamp-2 text-right">
            ﴿${state.selectedAyah.text}﴾
          </p>

          <div class="grid grid-cols-3 gap-2 text-xs">
            <button 
              class="btn-copy-selected-ayah py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary hover:text-white text-primary font-semibold flex items-center justify-center gap-1.5 transition-colors"
              data-copy="﴿${state.selectedAyah.text}﴾ [سورة ${state.selectedAyah.surahName}: ${state.selectedAyah.numberInSurah}]"
            >
              ${ICONS.copy('w-3.5 h-3.5')}
              <span>نسخ</span>
            </button>

            <button 
              class="btn-share-selected-ayah py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary hover:text-white text-primary font-semibold flex items-center justify-center gap-1.5 transition-colors"
              data-text="﴿${state.selectedAyah.text}﴾ [سورة ${state.selectedAyah.surahName}: ${state.selectedAyah.numberInSurah}]"
            >
              ${ICONS.share('w-3.5 h-3.5')}
              <span>مشاركة</span>
            </button>

            <button 
              class="btn-fav-selected-ayah py-2 px-3 rounded-xl border border-gold/40 hover:bg-gold hover:text-white text-gold font-semibold flex items-center justify-center gap-1.5 transition-colors ${isFavorite(`ayah_${state.selectedAyah.surahNumber}_${state.selectedAyah.numberInSurah}`) ? 'bg-gold text-white' : ''}"
              data-fav-id="ayah_${state.selectedAyah.surahNumber}_${state.selectedAyah.numberInSurah}"
              data-surah="${state.selectedAyah.surahName}"
              data-num="${state.selectedAyah.numberInSurah}"
              data-text="${state.selectedAyah.text}"
            >
              ${ICONS.star('w-3.5 h-3.5', true)}
              <span>المفضلة</span>
            </button>
          </div>
        </div>
      ` : ''}

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
            ★
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

      <!-- Floating Action Bar for Selected Ayah -->
      ${state.selectedAyah ? `
        <div class="mushaf-floating-bar card-luxury p-3.5 bg-surface border-2 border-gold/40 shadow-xl fixed bottom-20 left-4 right-4 max-w-lg mx-auto z-40 rounded-2xl">
          <div class="flex items-center justify-between text-xs text-muted mb-2 pb-1.5 border-b border-subtle">
            <span class="font-bold text-primary flex items-center gap-1.5">
              ${ICONS.quran('w-4 h-4 text-gold')}
              <span>سورة ${state.selectedAyah.surahName} · الآية ${state.selectedAyah.numberInSurah}</span>
            </span>
            <button id="btn-close-ayah-action" class="w-6 h-6 rounded-full bg-surface-subtle flex items-center justify-center text-xs font-bold text-muted hover:text-primary">
              ${ICONS.close('w-3.5 h-3.5')}
            </button>
          </div>

          <p class="font-amiri text-sm text-primary leading-relaxed mb-3 line-clamp-2 text-right">
            ﴿${state.selectedAyah.text}﴾
          </p>

          <div class="grid grid-cols-3 gap-2 text-xs">
            <button 
              class="btn-copy-selected-ayah py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary hover:text-white text-primary font-semibold flex items-center justify-center gap-1.5 transition-colors"
              data-copy="﴿${state.selectedAyah.text}﴾ [سورة ${state.selectedAyah.surahName}: ${state.selectedAyah.numberInSurah}]"
            >
              ${ICONS.copy('w-3.5 h-3.5')}
              <span>نسخ</span>
            </button>

            <button 
              class="btn-share-selected-ayah py-2 px-3 rounded-xl bg-primary/10 hover:bg-primary hover:text-white text-primary font-semibold flex items-center justify-center gap-1.5 transition-colors"
              data-text="﴿${state.selectedAyah.text}﴾ [سورة ${state.selectedAyah.surahName}: ${state.selectedAyah.numberInSurah}]"
            >
              ${ICONS.share('w-3.5 h-3.5')}
              <span>مشاركة</span>
            </button>

            <button 
              class="btn-fav-selected-ayah py-2 px-3 rounded-xl border border-gold/40 hover:bg-gold hover:text-white text-gold font-semibold flex items-center justify-center gap-1.5 transition-colors ${isFavorite(`ayah_${state.selectedAyah.surahNumber}_${state.selectedAyah.numberInSurah}`) ? 'bg-gold text-white' : ''}"
              data-fav-id="ayah_${state.selectedAyah.surahNumber}_${state.selectedAyah.numberInSurah}"
              data-surah="${state.selectedAyah.surahName}"
              data-num="${state.selectedAyah.numberInSurah}"
              data-text="${state.selectedAyah.text}"
            >
              ${ICONS.star('w-3.5 h-3.5', true)}
              <span>المفضلة</span>
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Source attribution banner -->
      <div class="text-center text-xs text-muted border-t border-subtle pt-3">
        المصدر: مشروع تنزيل القرآني Tanzil.net · مصحف المدينة النبوية الشريفة
      </div>
    </div>
  `;
}

// 3. Adhkar View (23 Categories with real Interactive Counters & Progress)
function renderAdhkarView(): string {
  const currentCategory = ADHKAR_CATEGORIES.find(c => c.id === state.activeAdhkarCategory) || ADHKAR_CATEGORIES[0];
  const adhkarList = ALL_ADHKAR.filter(a => a.category === currentCategory.id);

  return `
    <div class="space-y-4">
      <!-- Adhkar Spiritual Image Banner -->
      <div class="relative overflow-hidden rounded-2xl border border-gold/30 shadow-md">
        <img src="/images/adhkar_banner.jpg" alt="الأذكار والتسبيح" class="w-full h-32 object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-3.5 text-white">
          <div class="text-xs text-gold font-bold flex items-center gap-1.5">
            ${ICONS.islamicCrescent('w-3.5 h-3.5 text-gold')}
            <span>﴿ فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي ﴾</span>
          </div>
          <div class="text-sm font-bold mt-0.5">حصن المسلم - 23 باباً من الأذكار النبوية المأثورة</div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-primary flex items-center gap-2">
            <span class="text-gold">${ICONS.duaHands('w-5 h-5 text-gold')}</span>
            <span>أذكار المسلم المأثورة</span>
          </h2>
          <p class="text-xs text-muted">من كتاب حصن المسلم وصحيح السنة النبوية</p>
        </div>
        <span class="text-xs bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
          ${adhkarList.length} أذكار
        </span>
      </div>

      <!-- Category Filter Chips Scroller -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        ${ADHKAR_CATEGORIES.map(cat => `
          <button 
            class="filter-chip ${cat.id === state.activeAdhkarCategory ? 'active' : ''}" 
            data-cat-id="${cat.id}"
          >
            <span>${cat.icon}</span>
            <span>${cat.name}</span>
          </button>
        `).join('')}
      </div>

      <!-- Active Category Header -->
      <div class="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl p-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">${currentCategory.icon}</span>
          <div>
            <h3 class="font-bold text-sm text-primary">${currentCategory.name}</h3>
            <span class="text-xs text-muted">${adhkarList.length} أذكار واردة</span>
          </div>
        </div>
        <button id="btn-reset-category-counters" class="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 cursor-pointer">
          ${ICONS.rotateCcw('w-3.5 h-3.5 text-primary')}
          <span>إعادة تعيين العدادات</span>
        </button>
      </div>

      <!-- Adhkar Cards List with Apple Spring Physics & Sound FX -->
      <div class="space-y-3">
        ${adhkarList.length === 0 ? `
          <div class="card-luxury p-8 text-center text-muted text-sm">
            لا توجد أذكار في هذا القسم حالياً.
          </div>
        ` : adhkarList.map(item => {
          const currentProgress = state.dhikrProgress[item.id] || 0;
          const remaining = Math.max(0, item.count - currentProgress);
          const isDone = remaining === 0;
          const percent = Math.min(100, Math.round((currentProgress / item.count) * 100));

          return `
            <div class="card-luxury apple-spring-press p-4 space-y-3 relative transition-all ${isDone ? 'border-primary/60 bg-primary/5 apple-celebrate-glow' : ''}" id="dhikr-card-${item.id}">
              <!-- Top Info -->
              <div class="flex items-center justify-between text-xs text-muted">
                <span class="font-bold text-primary">${item.categoryName}</span>
                <div class="flex items-center gap-2">
                  <span class="bg-surface-subtle px-2 py-0.5 rounded text-[11px] font-mono">
                    التكرار: ${item.count}
                  </span>
                  <button class="btn-fav-dhikr text-muted hover:text-gold ${isFavorite(item.id) ? 'text-gold' : ''}" data-id="${item.id}" data-text="${item.text.slice(0, 50)}">
                    ${ICONS.star('w-3.5 h-3.5', isFavorite(item.id))}
                  </button>
                </div>
              </div>

              <!-- Dhikr Text -->
              <p class="font-amiri text-lg text-primary leading-loose text-right select-text">
                ${item.text}
              </p>

              <!-- Benefit / Source -->
              ${item.benefit ? `
                <div class="text-xs text-secondary bg-surface-subtle/80 p-2.5 rounded-xl border border-subtle flex items-start gap-1.5">
                  <span class="text-gold shrink-0 mt-0.5">${ICONS.sparkles('w-3.5 h-3.5 text-gold')}</span>
                  <div><span class="font-bold text-primary">الفضل:</span> ${item.benefit}</div>
                </div>
              ` : ''}
              <div class="text-[11px] text-muted flex items-center justify-between">
                <span>المصدر: ${item.source}</span>
                <button class="btn-copy-text hover:text-primary flex items-center gap-1 text-[11px] cursor-pointer" data-copy="${item.text} [${item.source}]">
                  ${ICONS.copy('w-3 h-3')}
                  <span>نسخ</span>
                </button>
              </div>

              <!-- Progress Bar -->
              <div class="w-full bg-surface-subtle h-2 rounded-full overflow-hidden border border-subtle">
                <div class="bg-primary h-full transition-all duration-300" style="width: ${percent}%;"></div>
              </div>

              <!-- Interactive Counter Controls with Apple Sound FX -->
              <div class="flex items-center justify-between pt-1">
                <div class="text-xs font-bold ${isDone ? 'text-emerald-600 dark:text-emerald-400 flex items-center gap-1' : 'text-secondary'}">
                  ${isDone ? `${ICONS.check('w-3.5 h-3.5')} <span>تم بحمد الله</span>` : `المتبقي: <span class="font-mono font-black tabular-nums">${remaining}</span> من ${item.count}`}
                </div>

                <div class="flex items-center gap-2">
                  <button 
                    class="btn-reset-dhikr apple-spring-press w-9 h-9 rounded-xl border border-subtle flex items-center justify-center text-secondary hover:bg-surface-subtle transition-all cursor-pointer"
                    data-dhikr-id="${item.id}"
                    title="إعادة العداد"
                  >
                    ${ICONS.rotateCcw('w-4 h-4 text-secondary')}
                  </button>
                  <button 
                    class="btn-tap-dhikr btn-touch apple-spring-press px-5 py-2.5 rounded-xl font-black text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer ${isDone ? 'bg-primary/20 text-primary border-2 border-primary/50' : 'bg-primary hover:bg-primary-dark text-white'}"
                    data-dhikr-id="${item.id}"
                    data-target="${item.count}"
                  >
                    <span class="dhikr-tap-label flex items-center gap-1">
                      ${isDone ? `${ICONS.check('w-4 h-4')} <span>تم</span>` : '<span>ذِكْر</span>'}
                    </span>
                    <span class="font-mono text-xs font-black tabular-nums">(${remaining})</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
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
        <h2 class="text-base font-bold text-primary flex items-center justify-center gap-2">
          <span>${ICONS.tasbeeh('w-5 h-5 text-gold')}</span>
          <span>المسبحة الإلكترونية الفخمة</span>
        </h2>
        <p class="text-xs text-muted">تسبيح مستمر مع اهتزاز هابتك وصوت الخرزات</p>
      </div>

      <!-- Dhikr Picker Dropdown / Chips -->
      <div class="card-luxury p-3">
        <label class="block text-xs text-muted mb-1 text-right">الذكر المختار للتسبيح:</label>
        <select id="tasbeeh-dhikr-select" class="w-full bg-surface-subtle border border-subtle rounded-xl p-2.5 text-sm font-bold text-primary focus:outline-none focus:border-primary">
          ${TASBEEH_PRESETS.map(d => `
            <option value="${d}" ${d === t.selectedDhikr ? 'selected' : ''}>${d}</option>
          `).join('')}
        </select>
      </div>

      <!-- Target Selection Buttons -->
      <div class="flex items-center justify-center gap-2">
        <span class="text-xs text-muted">الهدف:</span>
        ${TARGET_PRESETS.map(tg => `
          <button 
            class="px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${tg === t.target ? 'bg-primary text-white border-primary' : 'bg-surface border-subtle text-secondary'}"
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
          class="tasbeeh-ring bg-gradient-to-b from-surface to-surface-subtle border-4 border-gold shadow-lg hover:shadow-xl active:scale-95 transition-all select-none"
        >
          <!-- Circular Progress Ring (SVG) -->
          <svg class="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="4" class="text-subtle opacity-20" />
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="5" 
              stroke-dasharray="283" 
              stroke-dashoffset="${283 - (283 * progressPercent) / 100}" 
              stroke-linecap="round" 
              class="text-primary transition-all duration-150" 
            />
          </svg>

          <!-- Counter Numbers Inside -->
          <div class="relative z-10">
            <div class="text-5xl font-black font-mono text-primary tracking-tight tabular-nums" id="tasbeeh-display-count">
              ${count}
            </div>
            <div class="text-xs text-muted mt-1 font-semibold">
              ${target > 0 ? `الهدف: ${target}` : 'تسبيح حر'}
            </div>
          </div>
        </div>
        <p class="text-xs text-muted mt-2">المس الدائرة في أي مكان للتسبيح</p>
      </div>

      <!-- Controls: Minus, Reset, Sound & Vibrate Toggles with SVGs -->
      <div class="grid grid-cols-4 gap-2 max-w-sm mx-auto">
        <button id="btn-tasbeeh-decrement" class="btn-touch bg-surface border border-subtle rounded-xl text-secondary hover:bg-surface-subtle text-sm font-bold flex items-center justify-center gap-1 shadow-xs" title="طرح واحدة">
          <span>-1</span>
        </button>
        <button id="btn-tasbeeh-reset" class="btn-touch bg-surface border border-subtle rounded-xl text-secondary hover:bg-surface-subtle text-xs font-bold flex items-center justify-center gap-1 shadow-xs" title="تصفير العداد">
          ${ICONS.rotate('w-3.5 h-3.5')}
          <span>تصفير</span>
        </button>
        <button id="btn-toggle-vibrate" class="btn-touch bg-surface border border-subtle rounded-xl ${t.vibrateEnabled ? 'text-primary border-primary bg-primary/5' : 'text-muted'} text-xs font-bold flex items-center justify-center gap-1 shadow-xs" title="الاهتزاز">
          ${ICONS.vibrate('w-3.5 h-3.5')}
          <span>${t.vibrateEnabled ? 'مفعل' : 'معطل'}</span>
        </button>
        <button id="btn-toggle-sound" class="btn-touch bg-surface border border-subtle rounded-xl ${t.soundEnabled ? 'text-primary border-primary bg-primary/5' : 'text-muted'} text-xs font-bold flex items-center justify-center gap-1 shadow-xs" title="الصوت">
          ${ICONS.volume('w-3.5 h-3.5', t.soundEnabled)}
          <span>${t.soundEnabled ? 'مفعل' : 'معطل'}</span>
        </button>
      </div>

      <!-- Lifetime Stats -->
      <div class="card-luxury p-3 text-xs text-muted flex items-center justify-between">
        <span class="flex items-center gap-1.5 font-medium text-secondary">
          ${ICONS.sparkles('w-4 h-4 text-gold')}
          <span>إجمالي التسبيح الكلي المسجل:</span>
        </span>
        <span class="font-mono font-bold text-primary text-sm">${t.totalLifetimeCount} تسبيحة</span>
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
    color: string;
    isNext: boolean;
  }> = [
    { key: 'fajr', name: 'صلاة الفجر', time: p.fajr, icon: ICONS.islamicCrescent('w-5 h-5'), color: 'text-emerald-500', isNext: p.nextPrayer.name === 'fajr' },
    { key: 'sunrise', name: 'شروق الشمس', time: p.sunrise, icon: ICONS.sunrise('w-5 h-5'), color: 'text-amber-500', isNext: p.nextPrayer.name === 'sunrise' },
    { key: 'dhuhr', name: 'صلاة الظهر', time: p.dhuhr, icon: ICONS.sun('w-5 h-5'), color: 'text-amber-500', isNext: p.nextPrayer.name === 'dhuhr' },
    { key: 'asr', name: 'صلاة العصر', time: p.asr, icon: ICONS.sun('w-5 h-5 opacity-80'), color: 'text-amber-600', isNext: p.nextPrayer.name === 'asr' },
    { key: 'maghrib', name: 'صلاة المغرب', time: p.maghrib, icon: ICONS.sunset('w-5 h-5'), color: 'text-orange-500', isNext: p.nextPrayer.name === 'maghrib' },
    { key: 'isha', name: 'صلاة العشاء', time: p.isha, icon: ICONS.moonStars('w-5 h-5'), color: 'text-indigo-400', isNext: p.nextPrayer.name === 'isha' },
  ];

  return `
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <button id="btn-back-home" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1.5 hover:bg-surface-subtle transition-colors cursor-pointer">
          ${ICONS.arrowRight('w-3.5 h-3.5')}
          <span>الرئيسية</span>
        </button>
        <h2 class="font-bold text-base text-primary flex items-center gap-1.5">
          ${ICONS.clock('w-4 h-4 text-gold')}
          <span>مواقيت الصلاة والأذان</span>
        </h2>
        <button id="btn-change-loc-from-prayer" class="text-xs text-primary underline font-semibold flex items-center gap-1 cursor-pointer">
          ${ICONS.mapPin('w-3 h-3')}
          <span>تغيير الموقع</span>
        </button>
      </div>

      <!-- Location Card -->
      <div class="card-luxury p-3.5 bg-primary/10 border-primary/20 flex items-center justify-between text-xs">
        <div>
          <div class="font-bold text-primary text-sm flex items-center gap-1.5">
            ${ICONS.mapPin('w-4 h-4 text-primary')}
            <span>${state.selectedLocation.name}</span>
          </div>
          <div class="text-muted mt-0.5">الحساب الفلكي: الهيئة المصرية العامة للمساحة (دقيق 100%)</div>
        </div>
        <div class="text-left font-mono text-[11px] text-muted">
          <div>Lat: ${state.selectedLocation.latitude.toFixed(2)}</div>
          <div>Lng: ${state.selectedLocation.longitude.toFixed(2)}</div>
        </div>
      </div>

      <!-- Prominent Mu'adhin & Azan Action Card (تصميم فاخر بأيقونات SVG) -->
      <div class="card-luxury p-4 sm:p-5 bg-gradient-to-r from-amber-500/15 via-gold/10 to-transparent border-2 border-gold/60 rounded-2xl space-y-3.5 shadow-md">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-12 h-12 rounded-2xl bg-gold/25 border-2 border-gold/50 flex items-center justify-center text-gold shrink-0 shadow-sm">
              ${ICONS.mic('w-6 h-6 text-gold')}
            </div>
            <div class="min-w-0">
              <div class="text-[11px] text-muted font-bold flex items-center gap-1.5">
                <span>صوت المؤذن الحالي لجميع الصلوات:</span>
                <span class="text-[9px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  ${ICONS.bell('w-2.5 h-2.5 text-emerald-500')}
                  <span>مفعّل</span>
                </span>
              </div>
              <div class="text-sm sm:text-base font-black text-primary truncate mt-0.5">
                ${MUADHIN_OPTIONS.find(m => m.id === alertSettings.globalSound)?.name || 'أذان الشيخ ناصر القطامي'}
              </div>
            </div>
          </div>

          <button 
            id="btn-open-prayer-alerts-modal-from-detailed" 
            class="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-gold hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
            title="انقر لتغيير صوت المؤذن واختيار ناصر القطامي، ياسر الدوسري، مشاري العفاسي، المنشاوي..."
          >
            ${ICONS.mic('w-4.5 h-4.5 text-slate-950')}
            <span>تغيير صوت المؤذن والأذان</span>
            ${ICONS.bolt('w-3.5 h-3.5 text-slate-950')}
          </button>
        </div>

        <!-- Live Audio Test & Master Controls -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-subtle/50 text-xs">
          <div class="text-[11px] text-muted flex items-center gap-1.5">
            ${ICONS.info('w-3.5 h-3.5 text-gold shrink-0')}
            <span>${MUADHIN_OPTIONS.find(m => m.id === alertSettings.globalSound)?.description || ''}</span>
          </div>

          <div class="flex items-center gap-2">
            ${isPlaying ? `
              <button 
                id="btn-stop-azan-audio" 
                class="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer animate-pulse"
              >
                ${ICONS.stop('w-4 h-4')}
                <span>إيقاف الأذان</span>
              </button>
            ` : `
              <button 
                id="btn-test-global-azan" 
                class="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                ${ICONS.play('w-4 h-4')}
                <span>استماع وتجربة الأذان</span>
              </button>
            `}
          </div>
        </div>
      </div>

      <!-- Prayer Table with Individual Notification Switches -->
      <div class="card-luxury overflow-hidden border border-subtle divide-y divide-subtle">
        <div class="bg-surface-subtle px-3.5 py-2 text-[11px] font-bold text-muted flex items-center justify-between">
          <span>الصلاة والموعد</span>
          <span>حالة التنبيه وصوت الأذان</span>
        </div>

        ${prayersList.map(item => {
          const cfg = alertSettings.prayers[item.key];
          const isEnabled = cfg.enabled && alertSettings.masterEnabled;
          const muadhinName = MUADHIN_OPTIONS.find(m => m.id === cfg.sound)?.name || 'أذان الحرم المكي';
          const preReminderText = cfg.preReminderMinutes > 0 ? `قبل ${cfg.preReminderMinutes}د` : 'عند الوقت';

          return `
            <div class="p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-colors ${item.isNext ? 'bg-primary/10 font-bold border-r-4 border-r-gold' : 'hover:bg-surface-subtle/50'}">
              <!-- Right side: Name, Icon and Time -->
              <div class="flex items-center gap-2.5 min-w-0">
                <span class="${item.color} shrink-0">${item.icon}</span>
                <div>
                  <div class="font-bold text-xs sm:text-sm text-primary flex items-center gap-1.5">
                    <span>${item.name}</span>
                    ${item.isNext ? `<span class="bg-gold/20 text-gold text-[10px] px-1.5 py-0.2 rounded font-bold">القادمة</span>` : ''}
                  </div>
                  <div class="text-[11px] text-muted font-medium mt-0.5">
                    تنبيه: <span class="text-secondary font-semibold">${preReminderText}</span> · <span class="text-secondary">${cfg.sound === 'chime' ? 'نغمة هادئة' : (cfg.sound === 'silent' ? 'صامت' : muadhinName.replace('أذان ', ''))}</span>
                  </div>
                </div>
              </div>

              <!-- Left side: Prayer Time & Individual Switch Button -->
              <div class="flex items-center gap-3 shrink-0">
                <span class="font-mono text-sm sm:text-base font-bold text-primary tabular-nums">${item.time}</span>
                
                <button 
                  class="btn-toggle-prayer-detailed px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isEnabled ? 'bg-primary/15 border-primary/40 text-primary hover:bg-primary/25' : 'bg-surface-subtle border-subtle text-muted hover:text-primary'}"
                  data-prayer="${item.key}"
                  title="${isEnabled ? 'انقر لتعطيل التنبيه لهذه الصلاة' : 'انقر لتفعيل التنبيه لهذه الصلاة'}"
                >
                  ${isEnabled ? ICONS.bell('w-3.5 h-3.5 text-primary') : ICONS.bellOff('w-3.5 h-3.5 text-muted')}
                  <span class="hidden sm:inline">${isEnabled ? 'مفعل' : 'معطل'}</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Notes on offline calculation -->
      <div class="card-luxury p-3 text-xs text-muted leading-relaxed">
        <p class="font-semibold text-secondary mb-1">معايير الدقة والضبط الشرعي:</p>
        <p>• زاوية الفجر: 19.5 درجة، زاوية العشاء: 17.5 درجة (معيار دار الإفتاء وهيئة المساحة المصرية).</p>
        <p>• يعمل الحساب بدون إنترنت فلكياً 100%، ويتطابق مع التوقيت المحلي لمركز أبو كبير والمحافظات المصرية ومدينة Ankara.</p>
      </div>
    </div>
  `;
}

// 7. Prayer Guide View (Learn Salah)
function renderPrayerGuideView(): string {
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-home" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1 hover:bg-surface-subtle">
          <span>←</span>
          <span>الرئيسية</span>
        </button>
        <h2 class="font-bold text-base text-primary">دليل تعلم الصلاة والوضوء</h2>
        <a href="https://islamhouse.com/ar/articles/2785501/" target="_blank" class="text-xs text-primary underline font-semibold">
          المصدر
        </a>
      </div>

      <!-- Prayer Steps Banner Image -->
      <div class="relative overflow-hidden rounded-2xl border border-gold/30 shadow-md">
        <img src="/images/prayer_steps_banner.jpg" alt="تعليم الصلاة والوضوء" class="w-full h-36 object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-3.5 text-white text-right">
          <div class="text-xs text-gold font-bold flex items-center gap-1.5">
            ${ICONS.islamicStar('w-3.5 h-3.5 text-gold')}
            <span>صفة صلاة النبي ﷺ خطوة بخطوة</span>
          </div>
          <div class="text-sm font-bold mt-0.5">شرح مصور تفاعلي بالسنن والأركان والأدعية الصحيحة</div>
        </div>
      </div>

      <div class="card-luxury p-3 text-xs text-muted leading-relaxed">
        شرح تعليمي تفاعلي لصفة صلاة النبي ﷺ خطوة بخطوة، مع الأذكار والأدعية المسنونة في كل ركن.
      </div>

      <div class="space-y-3">
        ${PRAYER_GUIDE_STEPS.map(step => `
          <div class="card-luxury p-4 space-y-2 border-r-4 border-r-primary">
            <div class="flex items-center justify-between text-xs">
              <span class="bg-primary text-white font-mono px-2 py-0.5 rounded font-bold">
                الخطوة ${step.stepNumber}
              </span>
              <span class="text-gold font-semibold">${step.ruling}</span>
            </div>

            <h3 class="font-bold text-sm text-primary">${step.title}</h3>
            <p class="text-xs text-muted">${step.subtitle}</p>

            <div class="text-xs text-secondary leading-relaxed pt-1">
              ${step.description}
            </div>

            <div class="bg-surface-subtle p-3 rounded-xl border border-subtle font-amiri text-base text-primary leading-loose text-right">
              ${step.dhikrText}
            </div>

            <div class="text-[11px] text-muted flex items-center justify-between pt-1">
              <span>المصدر: ${step.source}</span>
              <a href="${step.sourceUrl}" target="_blank" class="text-primary hover:underline">
                فتح المصدر الأصلي ↗
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 8. Prayer Adhkar View (Chronological)
function renderPrayerAdhkarView(): string {
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-home" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1 hover:bg-surface-subtle">
          <span>←</span>
          <span>الرئيسية</span>
        </button>
        <h2 class="font-bold text-base text-primary">أذكار الصلاة المسنونة</h2>
        <div class="w-12"></div>
      </div>

      <p class="text-xs text-muted">
        الأذكار الصحيحة الواردة عن النبي ﷺ مرتبة تسلسلياً بحسب وقت الذكر في الصلاة.
      </p>

      <div class="space-y-3">
        ${PRAYER_ADHKAR_LIST.map(item => `
          <div class="card-luxury p-4 space-y-2 border-r-4 border-r-gold">
            <div class="flex items-center justify-between text-xs">
              <span class="bg-gold/15 text-gold-dark font-bold px-2 py-0.5 rounded">
                ${item.stage}
              </span>
              <button class="btn-copy-text text-muted hover:text-primary flex items-center gap-1 text-xs cursor-pointer" data-copy="${item.text}">
                ${ICONS.copy('w-3 h-3')}
                <span>نسخ</span>
              </button>
            </div>

            <h3 class="font-bold text-sm text-primary">${item.stepName}</h3>

            <div class="font-amiri text-lg text-primary leading-loose text-right bg-surface-subtle p-3 rounded-xl border border-subtle whitespace-pre-line">
              ${item.text}
            </div>

            <div class="text-xs text-muted flex items-center justify-between">
              <span>المصدر: ${item.source}</span>
              ${item.notes ? `<span class="italic text-[11px]">${item.notes}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
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

// 10. Faith View
function renderFaithView(): string {
  const f = FAITH_DATA;
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-home" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1 hover:bg-surface-subtle">
          <span>←</span>
          <span>الرئيسية</span>
        </button>
        <h2 class="font-bold text-base text-primary">الإيمان بالله وأركانه الستة</h2>
        <div class="w-12"></div>
      </div>

      <!-- Definition Card -->
      <div class="card-luxury p-4 border-r-4 border-r-primary space-y-2">
        <h3 class="font-bold text-sm text-primary">${f.definition.title}</h3>
        <p class="text-xs text-secondary leading-relaxed">${f.definition.meaning}</p>
        <p class="font-amiri text-sm text-primary/90 mt-1">${f.definition.evidence}</p>
      </div>

      <!-- 6 Pillars List -->
      <div class="space-y-3">
        ${f.pillars.map(p => `
          <div class="card-luxury p-4 space-y-2.5">
            <div class="flex items-center justify-between text-xs">
              <span class="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded">
                الركن ${p.order}
              </span>
              <span class="text-muted">${p.source}</span>
            </div>

            <h4 class="font-bold text-sm text-primary">${p.title}</h4>
            <p class="text-xs text-secondary leading-relaxed">${p.definition}</p>

            <div class="bg-surface-subtle p-2.5 rounded-xl border border-subtle font-amiri text-xs text-primary leading-relaxed">
              ${p.evidence}
            </div>

            <ul class="text-xs text-secondary space-y-1 list-disc list-inside pt-1">
              ${p.details.map(d => `<li>${d}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// 11. Fear and Hope View
function renderFearHopeView(): string {
  return `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <button id="btn-back-home" class="px-3 py-1.5 rounded-lg border border-subtle text-xs font-bold text-secondary flex items-center gap-1 hover:bg-surface-subtle">
          <span>←</span>
          <span>الرئيسية</span>
        </button>
        <h2 class="font-bold text-base text-primary">الخوف والرجاء وطمأنينة القلب</h2>
        <div class="w-12"></div>
      </div>

      <!-- Medical / Guidance Disclaimer Banner -->
      <div class="card-luxury p-4 bg-amber-500/10 border-amber-500/30 text-xs space-y-1 text-secondary">
        <div class="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
          ${ICONS.alertTriangle('w-4 h-4 text-amber-600')}
          <span>${MEDICAL_DISCLAIMER.title}</span>
        </div>
        <p class="leading-relaxed">${MEDICAL_DISCLAIMER.text}</p>
      </div>

      <!-- Content Sections -->
      <div class="space-y-3">
        ${FEAR_HOPE_CONTENT.map(section => `
          <div class="card-luxury p-4 space-y-2 border-r-4 border-r-gold">
            <h3 class="font-bold text-sm text-primary">${section.title}</h3>
            <div class="text-xs text-secondary space-y-1.5 leading-relaxed">
              ${section.content.map(p => `<p>• ${p}</p>`).join('')}
            </div>

            ${section.evidence ? `
              <div class="bg-surface-subtle p-2.5 rounded-xl border border-subtle font-amiri text-xs text-primary mt-1">
                ${section.evidence}
              </div>
            ` : ''}

            <div class="text-[11px] text-muted text-left">
              المصدر: ${section.source}
            </div>
          </div>
        `).join('')}
      </div>
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
            placeholder="ابحث عن آية، سورة، ذكر، خطبة، أو مسألة فقهية..." 
            class="w-full bg-surface-subtle border border-subtle rounded-xl p-3 text-xs text-primary placeholder:text-muted focus:outline-none focus:border-primary font-cairo"
            autofocus
          />
        </div>

        <div class="flex-1 overflow-y-auto space-y-2 max-h-80" id="search-results-list">
          ${state.searchQuery.trim() === '' ? `
            <div class="text-center p-6 text-xs text-muted">
              اكتب كلمة البحث للوصول الفوري إلى الآيات القرآنية والأذكار والخطب.
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
        <h2 class="text-base font-bold text-primary">الإعدادات والمصادر والمعلومات</h2>
        <p class="text-xs text-muted">تخصيص التطبيق والتحكم في الخيارات</p>
      </div>

      <!-- Connected Google Profile Card -->
      ${state.currentUser ? `
        <div class="card-luxury p-3.5 bg-surface/95 border border-primary/20 rounded-2xl flex items-center justify-between shadow-xs">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gold/40 flex items-center justify-center bg-primary/10 shrink-0">
              ${state.currentUser.photoURL ? `
                <img src="${state.currentUser.photoURL}" alt="${state.currentUser.displayName || ''}" class="w-full h-full object-cover" />
              ` : `
                ${ICONS.user('w-6 h-6 text-primary')}
              `}
            </div>
            <div class="min-w-0">
              <div class="font-bold text-sm text-primary flex items-center gap-1.5">
                <span class="truncate">${state.currentUser.displayName || 'مستخدم Google'}</span>
                ${isAdmin ? `
                  <span class="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md font-extrabold shrink-0 flex items-center gap-1">
                    ${ICONS.crown('w-3 h-3 text-slate-950')}
                    <span>المسؤول</span>
                  </span>
                ` : `
                  <span class="text-[9px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold shrink-0">نشط</span>
                `}
              </div>
              <div class="text-xs text-muted truncate">${state.currentUser.email || ''}</div>
            </div>
          </div>

          <button id="btn-logout-app" class="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0" title="تسجيل الخروج">
            ${ICONS.logOut('w-3.5 h-3.5')}
            <span>خروج</span>
          </button>
        </div>
      ` : ''}

      <!-- Admin Panel Shortcut Card (Visible to Admin Only) -->
      ${isAdmin ? `
        <div class="card-luxury p-4 bg-gradient-to-r from-amber-500/20 via-gold/15 to-transparent border-2 border-gold/40 space-y-2 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="p-2 rounded-xl bg-gold/20 text-gold">${ICONS.crown('w-5 h-5 text-gold')}</span>
              <div>
                <h3 class="font-bold text-sm text-primary">لوحة تحكم المسؤول (مالك عبدالودود)</h3>
                <p class="text-[11px] text-muted">إدارة المشتركين، طلبات فودافون كاش، وحظر/فك حظر الحسابات</p>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 text-[10px] font-bold">Admin</span>
          </div>
          <button id="btn-menu-admin" class="w-full bg-gradient-to-r from-amber-500 to-gold text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm hover:brightness-105 transition-all cursor-pointer">
            ${ICONS.shield('w-4 h-4 text-slate-950')}
            <span>الدخول إلى لوحة إدارة المستخدمين والاشتراكات</span>
          </button>
        </div>
      ` : ''}

      <!-- Subscription Status Card (Vodafone Cash) -->
      <div class="card-luxury p-4 bg-gradient-to-r from-primary/10 via-gold/10 to-transparent border-primary/20 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-primary flex items-center gap-1.5">
            ${ICONS.crown('w-4 h-4 text-gold')}
            <span>باقة اذكار ، Ankara</span>
          </span>
          <span class="font-bold ${sub.isActive ? 'text-emerald-600' : 'text-amber-600'}">
            ${sub.isSubscribed ? 'مشترك نشط' : (sub.isTrial ? 'فترة تجريبية مجانية' : 'منتهية')}
          </span>
        </div>
        <p class="text-xs text-secondary leading-relaxed">
          ${sub.isActive 
            ? `متبقي لك ${sub.daysRemaining} يوم و ${sub.hoursRemaining} ساعة للاستفادة الكاملة من كافة خصائص التطبيق.`
            : `انتهت الفترة المجانية. اشترك الآن بـ ${SUBSCRIPTION_PRICE_EGP} جنيه شهرياً عبر فودافون كاش (${VODAFONE_CASH_LOCAL_NUMBER}).`
          }
        </p>
        <button id="btn-open-paywall-details" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
          ${ICONS.phone('w-3.5 h-3.5')}
          <span>${sub.isSubscribed ? 'تفاصيل الاشتراك والتجديد' : `الدفع عبر فودافون كاش (${SUBSCRIPTION_PRICE_EGP} ج.م / شهر)`}</span>
        </button>
      </div>

      <!-- Settings Menu List with SVGs -->
      <div class="card-luxury divide-y divide-subtle overflow-hidden">
        <button class="w-full p-4 flex items-center justify-between text-right hover:bg-surface-subtle transition-colors cursor-pointer bg-gradient-to-r from-amber-500/10 via-gold/5 to-transparent border-r-4 border-r-gold" id="btn-menu-prayer-alerts">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gold/25 text-gold flex items-center justify-center shrink-0">
              ${ICONS.mic('w-5 h-5 text-gold')}
            </div>
            <div>
              <div class="font-bold text-sm text-primary flex items-center gap-2">
                <span>تغيير صوت المؤذن والأذان</span>
                <span class="text-[10px] bg-gold text-slate-950 px-2 py-0.5 rounded font-black inline-flex items-center gap-1">
                  ${ICONS.bell('w-2.5 h-2.5 text-slate-950')}
                  <span>مفعّل</span>
                </span>
              </div>
              <div class="text-xs text-muted mt-0.5">المؤذن الحالي: ${MUADHIN_OPTIONS.find(m => m.id === state.prayerAlertsSettings.globalSound)?.name || 'أذان الشيخ ناصر القطامي'}</div>
            </div>
          </div>
          <span class="text-gold font-bold text-xs bg-gold/20 px-3 py-1.5 rounded-xl border border-gold/30 shrink-0 inline-flex items-center gap-1">
            <span>تغيير</span>
            ${ICONS.bolt('w-3 h-3 text-gold')}
          </span>
        </button>

        <button class="w-full p-3.5 flex items-center justify-between text-right hover:bg-surface-subtle transition-colors cursor-pointer" id="btn-menu-apple-sound-effects">
          <div class="flex items-center gap-3">
            <span class="text-primary">${ICONS.volume('w-5 h-5', audioFx.isSoundEnabled())}</span>
            <div>
              <div class="font-semibold text-sm text-primary flex items-center gap-2">
                <span>المؤثرات الصوتية وانتقالات Apple</span>
                <span class="text-[10px] ${audioFx.isSoundEnabled() ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-surface-subtle text-muted'} px-2 py-0.5 rounded font-bold">
                  ${audioFx.isSoundEnabled() ? 'مفعّل' : 'صامت'}
                </span>
              </div>
              <div class="text-xs text-muted">أصوات التسبيح، الأذكار، والتنقل السلس</div>
            </div>
          </div>
          <span class="text-xs font-bold ${audioFx.isSoundEnabled() ? 'text-primary' : 'text-muted'} bg-surface-subtle px-2.5 py-1 rounded-lg border border-subtle">
            ${audioFx.isSoundEnabled() ? 'إيقاف' : 'تشغيل'}
          </span>
        </button>

        <button class="w-full p-3.5 flex items-center justify-between text-right hover:bg-surface-subtle transition-colors cursor-pointer" id="btn-menu-location">
          <div class="flex items-center gap-3">
            <span class="text-primary">${ICONS.mapPin('w-5 h-5')}</span>
            <div>
              <div class="font-semibold text-sm text-primary">تغيير الموقع الجغرافي</div>
              <div class="text-xs text-muted">موقعك الحالي: ${state.selectedLocation.name}</div>
            </div>
          </div>
          <span class="text-muted">${ICONS.chevronLeft('w-4 h-4')}</span>
        </button>

        <button class="w-full p-3.5 flex items-center justify-between text-right hover:bg-surface-subtle transition-colors cursor-pointer" id="btn-menu-favorites">
          <div class="flex items-center gap-3">
            <span class="text-gold">${ICONS.star('w-5 h-5', true)}</span>
            <div>
              <div class="font-semibold text-sm text-primary">العناصر المفضلة</div>
              <div class="text-xs text-muted">الآيات والأذكار والخطب المحفوظة</div>
            </div>
          </div>
          <span class="text-muted">${ICONS.chevronLeft('w-4 h-4')}</span>
        </button>

        <button class="w-full p-3.5 flex items-center justify-between text-right hover:bg-surface-subtle transition-colors cursor-pointer" id="btn-menu-sources">
          <div class="flex items-center gap-3">
            <span class="text-primary">${ICONS.bookOpen('w-5 h-5')}</span>
            <div>
              <div class="font-semibold text-sm text-primary">المصادر والمراجع المعتمدة</div>
              <div class="text-xs text-muted">Tanzil, Quran.com, IslamHouse, بن باز</div>
            </div>
          </div>
          <span class="text-muted">${ICONS.chevronLeft('w-4 h-4')}</span>
        </button>

        <button class="w-full p-3.5 flex items-center justify-between text-right hover:bg-surface-subtle transition-colors cursor-pointer" id="btn-menu-appcreator">
          <div class="flex items-center gap-3">
            <span class="text-primary">${ICONS.android('w-5 h-5')}</span>
            <div>
              <div class="font-semibold text-sm text-primary">تحويل التطبيق إلى Android</div>
              <div class="text-xs text-muted">خطوات التشغيل عبر AppCreator24 وWebView</div>
            </div>
          </div>
          <span class="text-muted">${ICONS.chevronLeft('w-4 h-4')}</span>
        </button>
      </div>

      <!-- App Info & Supervisor Card -->
      <div class="card-luxury p-4 text-center space-y-2 border-t-2 border-t-gold">
        <img src="/images/app_logo.jpg" alt="Logo" class="w-14 h-14 rounded-2xl mx-auto border-2 border-gold/40 shadow-sm object-cover" />
        <h3 class="font-bold text-sm text-primary">تطبيق اذكار ، Ankara الإصدار 1.0</h3>
        <p class="text-xs text-secondary leading-relaxed">
          «رفيقك اليومي للقرآن والذكر والعبادة»
        </p>
        <div class="bg-surface-subtle p-3 rounded-xl border border-subtle text-xs text-muted space-y-1">
          <p>تم صنعه بواسطة: <span class="font-bold text-primary">المبرمج مالك عبدالودود وأحمد رضا الشبراوي</span></p>
          <p>تحت إشراف: <span class="font-bold text-primary">الدكتور/الشيخ سعد محفوظ</span></p>
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

// 14. Paywall Modal (Vodafone Cash Payment Flow + WhatsApp)
function renderPaywallModal(): string {
  const sub = getSubscriptionStatus(state.currentUser?.email);
  const step = state.paywallStep || 1;
  const whatsAppUrl = generateWhatsAppPaymentUrl(
    state.currentUser?.displayName || 'مستخدم زاد المسلم',
    state.currentUser?.email || '',
    SUBSCRIPTION_PRICE_EGP
  );

  return `
    <div class="fixed inset-0 z-[9999] bg-[#F7F6F3]/90 dark:bg-black/90 backdrop-blur-2xl flex flex-col p-4 sm:p-8 overflow-y-auto select-none font-cairo" id="paywall-modal-overlay">
      <div class="max-w-lg w-full mx-auto my-auto space-y-6 bg-white/90 dark:bg-[#1C1C1E]/95 backdrop-blur-xl border border-black/5 dark:border-white/10 p-6 sm:p-8 rounded-[32px] shadow-2xl shadow-black/10">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
          <div class="flex items-center gap-3.5">
            <img src="/images/app_logo.jpg" alt="Logo" class="w-13 h-13 rounded-2xl object-cover shadow-md ring-1 ring-black/5" />
            <div>
              <h3 class="font-extrabold text-base text-[#1D1D1F] dark:text-white tracking-tight">الاشتراك عبر فودافون كاش</h3>
              <p class="text-xs text-secondary mt-0.5">
                ${sub.isExpired ? 'انتهت فترة الـ 3 أيام التجريبية المجانية.' : 'فعّل حسابك للوصول الدائم لكافة المميزات.'}
              </p>
            </div>
          </div>
          <button id="btn-close-paywall" class="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-secondary hover:text-[#1D1D1F] dark:hover:text-white transition-all cursor-pointer" title="إغلاق">
            ${ICONS.close('w-5 h-5')}
          </button>
        </div>

        <!-- Apple Segmented Control Step Indicators -->
        <div class="grid grid-cols-3 gap-2 p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl">
          <div class="py-2.5 px-2 rounded-xl text-center text-xs font-bold transition-all ${step === 1 ? 'bg-[#0A4D3C] text-white shadow-sm' : 'text-secondary hover:text-[#1D1D1F] dark:hover:text-white'}">
            ١. التحويل المالي
          </div>
          <div class="py-2.5 px-2 rounded-xl text-center text-xs font-bold transition-all ${step === 2 ? 'bg-[#0A4D3C] text-white shadow-sm' : 'text-secondary hover:text-[#1D1D1F] dark:hover:text-white'}">
            ٢. رفع الإيصال
          </div>
          <div class="py-2.5 px-2 rounded-xl text-center text-xs font-bold transition-all ${step === 3 ? 'bg-[#0A4D3C] text-white shadow-sm' : 'text-secondary hover:text-[#1D1D1F] dark:hover:text-white'}">
            ٣. الإرسال الموحد
          </div>
        </div>

        <!-- Pricing Hero Card (Apple Card Style) -->
        <div class="relative overflow-hidden p-6 rounded-[24px] bg-gradient-to-br from-[#0A4D3C] to-[#06382a] text-white shadow-lg shadow-[#0A4D3C]/20">
          <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-[#C9A86C]/15 rounded-full blur-2xl pointer-events-none"></div>
          <div class="relative z-10 space-y-2">
            <div>
              <span class="inline-block px-3 py-1 rounded-full bg-[#C9A86C]/20 text-[#C9A86C] text-[11px] font-bold tracking-wide uppercase border border-[#C9A86C]/30">باقة الاشتراك الشهري</span>
            </div>
            <div class="text-2xl sm:text-3xl font-black tracking-tight tabular-nums flex items-baseline gap-1.5">
              ${SUBSCRIPTION_PRICE_EGP} <span class="text-sm font-semibold opacity-80">جنيه مصري / شهر</span>
            </div>
            <p class="text-xs text-white/80 leading-relaxed font-light">30 يوماً متواصلة من القرآن والأذكار والمواقيت وبدون إعلانات</p>
          </div>
        </div>

        <!-- STEP 1 CARD -->
        <div class="p-5 rounded-[24px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 space-y-4 ${step === 1 ? '' : 'hidden'}">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#1D1D1F] dark:text-white flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-[#0A4D3C] text-white text-[11px] flex items-center justify-center font-bold">1</span>
              <span>الخطوة الأولى: تحويل القيمة لمحفظة فودافون كاش</span>
            </span>
            <span class="text-[10px] bg-red-500/10 text-red-600 px-2.5 py-0.5 rounded-full font-bold">Vodafone Cash</span>
          </div>

          <div class="p-4 bg-white dark:bg-[#2C2C2E] rounded-2xl border border-black/5 dark:border-white/10 flex items-center justify-between gap-3 shadow-xs">
            <div class="text-left font-mono">
              <div class="font-extrabold text-base sm:text-lg text-[#1D1D1F] dark:text-white tracking-wider" dir="ltr">${VODAFONE_CASH_LOCAL_NUMBER}</div>
              <div class="text-[11px] text-secondary" dir="ltr">${VODAFONE_CASH_NUMBER}</div>
            </div>
            <button id="btn-copy-vodafone-num" class="px-4 py-2 rounded-xl bg-[#0A4D3C] text-white text-xs font-bold hover:bg-[#06382a] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs">
              ${ICONS.copy('w-4 h-4')}
              <span>نسخ الرقم</span>
            </button>
          </div>
          <p class="text-xs text-secondary leading-relaxed">
            حوّل مبلغ <strong class="text-[#1D1D1F] dark:text-white font-bold">100 جنيه</strong> إلى الرقم أعلاه من أي محفظة إلكترونية ثم اضغط على زر التالي أدناه.
          </p>
          <button id="btn-paywall-next-1" class="w-full bg-[#0A4D3C] hover:bg-[#06382a] text-white py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0A4D3C]/20">
            <span>التالي (رفع إيصال ImageKit)</span>
            ${ICONS.chevronLeft('w-4 h-4')}
          </button>
        </div>

        <!-- STEP 2 CARD: ImageKit Secure Upload -->
        <div class="p-5 rounded-[24px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 space-y-4 ${step === 2 ? '' : 'hidden'}">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#1D1D1F] dark:text-white flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-[#0A4D3C] text-white text-[11px] flex items-center justify-center font-bold">2</span>
              <span>الخطوة الثانية: رفع إيصال التحويل عبر ImageKit الآمن</span>
            </span>
            <span class="text-[10px] bg-emerald-500/10 text-emerald-600 px-2.5 py-0.5 rounded-full font-bold">ImageKit Secure CDN</span>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-secondary mb-1.5">رقم الهاتف المُحوَّل منه:</label>
              <input 
                type="tel" 
                id="receipt-sender-phone" 
                placeholder="مثال: 01012345678" 
                class="w-full bg-white dark:bg-[#2C2C2E] border border-black/10 dark:border-white/10 rounded-2xl p-3 text-xs text-[#1D1D1F] dark:text-white font-mono focus:outline-none focus:border-[#0A4D3C] transition-all shadow-xs"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-secondary mb-1.5">صورة إيصال التحويل (رفع مشفر عبر ImageKit):</label>
              <input 
                type="file" 
                id="receipt-file-input" 
                accept="image/*" 
                class="w-full text-xs text-secondary file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0A4D3C] file:text-white hover:file:bg-[#06382a] cursor-pointer bg-white dark:bg-[#2C2C2E] border border-black/10 dark:border-white/10 rounded-2xl p-2"
              />
            </div>

            <!-- Image Preview Box -->
            <div id="receipt-preview-box" class="${state.receiptUploadPreview ? '' : 'hidden'} p-3 border border-dashed border-[#0A4D3C]/30 rounded-2xl bg-white dark:bg-[#2C2C2E] text-center shadow-xs">
              <img id="receipt-preview-img" src="${state.receiptUploadPreview || ''}" alt="Receipt Preview" class="max-h-44 mx-auto rounded-xl object-contain" />
              <div class="text-xs text-emerald-600 font-bold mt-2 flex items-center justify-center gap-1.5">
                ${ICONS.check('w-4 h-4 text-emerald-600')}
                <span>تم الرفع المشفر بنجاح عبر ImageKit</span>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button id="btn-paywall-prev-2" class="px-5 py-3 rounded-2xl border border-black/10 dark:border-white/10 text-xs font-bold text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer">
              السابق
            </button>
            <button id="btn-paywall-next-2" class="flex-1 bg-[#0A4D3C] hover:bg-[#06382a] text-white py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0A4D3C]/20">
              <span>التالي (المراجعة والتأكيد الشامل)</span>
              ${ICONS.chevronLeft('w-4 h-4')}
            </button>
          </div>
        </div>

        <!-- STEP 3 CARD: Review & Unified Submission Button -->
        <div class="p-5 rounded-[24px] bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 space-y-4 ${step === 3 ? '' : 'hidden'}">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-[#1D1D1F] dark:text-white flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-[#0A4D3C] text-white text-[11px] flex items-center justify-center font-bold">3</span>
              <span>الخطوة الثالثة: مراجعة وإرسال الطلب الشامل</span>
            </span>
            <span class="text-[10px] bg-[#C9A86C]/15 text-[#C9A86C] px-2.5 py-0.5 rounded-full font-bold">إرسال موحد</span>
          </div>

          <div class="p-4 bg-white dark:bg-[#2C2C2E] rounded-2xl border border-black/5 dark:border-white/10 text-xs space-y-2.5 text-right shadow-xs">
            <div class="flex justify-between"><span class="text-secondary">صاحب الحساب:</span> <strong class="text-[#1D1D1F] dark:text-white font-medium">${state.currentUser?.displayName || 'مستخدم'}</strong></div>
            <div class="flex justify-between"><span class="text-secondary">البريد الإلكتروني:</span> <strong class="text-[#1D1D1F] dark:text-white font-mono text-[11px]">${state.currentUser?.email || '—'}</strong></div>
            <div class="flex justify-between"><span class="text-secondary">المبلغ:</span> <strong class="text-[#1D1D1F] dark:text-white font-medium">100 جنيه مصري</strong></div>
            <div class="flex justify-between"><span class="text-secondary">حالة الإيصال:</span> <strong class="text-emerald-600 font-medium">جاهز ومرفوع عبر ImageKit</strong></div>
          </div>

          <div class="space-y-3">
            <button 
              id="btn-submit-receipt-app" 
              class="w-full bg-gradient-to-r from-[#0A4D3C] to-[#06382a] hover:opacity-95 text-white py-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0A4D3C]/25 cursor-pointer"
            >
              ${ICONS.upload('w-4 h-4')}
              <span>إرسال الطلب الموحد (للأدمن والواتساب معاً)</span>
            </button>
          </div>

          <div class="flex gap-3 pt-2">
            <button id="btn-paywall-prev-3" class="w-full py-3 rounded-2xl border border-black/10 dark:border-white/10 text-xs font-bold text-secondary hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer">
              السابق
            </button>
          </div>
        </div>

        <!-- Manual Code / Voucher fallback -->
        <div class="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 space-y-2.5">
          <div class="text-xs text-secondary">أو أدخل كود التفعيل المباشر إذا كان لديك:</div>
          <div class="flex gap-2">
            <input type="text" id="activation-code-input" placeholder="مثال: ZAD100" class="flex-1 bg-white dark:bg-[#2C2C2E] border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-[#1D1D1F] dark:text-white font-mono focus:outline-none focus:border-[#0A4D3C]" />
            <button id="btn-activate-code" class="bg-[#0A4D3C] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#06382a] transition-all cursor-pointer shadow-xs">
              تفعيل
            </button>
          </div>
        </div>

        <!-- Sandbox & Close Controls -->
        <div class="border-t border-black/5 dark:border-white/10 pt-3 flex items-center justify-between text-xs text-secondary">
          <button id="btn-test-trial-reset" class="hover:text-[#1D1D1F] dark:hover:text-white underline cursor-pointer transition-colors">
            تجديد الـ 3 أيام التجريبية
          </button>
          <button id="btn-close-paywall" class="font-bold text-[#1D1D1F] dark:text-white hover:opacity-80 cursor-pointer transition-opacity">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  `;
}

// 18. Subscription Full View (Vodafone Cash + Full Management)
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
          <div class="pricing-subtext">الدفع عبر محفظة فودافون كاش مباشرة للمسؤول</div>
        </div>

        <!-- Vodafone Cash Direct Box -->
        <div class="card-luxury p-4 bg-surface-subtle border border-subtle text-right space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-bold text-xs text-primary flex items-center gap-1">
              ${ICONS.phone('w-4 h-4 text-red-500')}
              <span>رقم فودافون كاش للتحويل:</span>
            </span>
            <button id="btn-copy-vodafone-num-page" class="px-2.5 py-1 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-primary-dark transition-colors flex items-center gap-1 cursor-pointer">
              ${ICONS.copy('w-3 h-3')}
              <span>نسخ الرقم</span>
            </button>
          </div>
          <div class="p-2.5 bg-surface rounded-xl border border-subtle text-center font-mono font-extrabold text-base text-primary" dir="ltr">
            ${VODAFONE_CASH_LOCAL_NUMBER} (${VODAFONE_CASH_NUMBER})
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
            <span>إرفاق صورة الإيصال للمراجعة:</span>
          </h4>

          <input 
            type="tel" 
            id="receipt-sender-phone-page" 
            placeholder="رقم الهاتف المُحوَّل منه (مثال: 011...)" 
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
          <div class="text-[10px] text-muted font-semibold">طلبات فودافون كاش المعلقة</div>
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

      <!-- SECTION 1: Vodafone Cash Payment Requests -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-sm text-primary flex items-center gap-1.5">
            ${ICONS.phone('w-4 h-4 text-red-500')}
            <span>طلبات دفع فودافون كاش (${paymentRequests.length})</span>
          </h3>
          <span class="text-xs text-muted">رقم الاستلام: <strong class="text-primary font-mono">${VODAFONE_CASH_LOCAL_NUMBER}</strong></span>
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
                    <div class="w-9 h-9 rounded-xl overflow-hidden border border-subtle flex items-center justify-center bg-primary/10 shrink-0">
                      ${u.photoURL ? `
                        <img src="${u.photoURL}" alt="" class="w-full h-full object-cover" />
                      ` : `
                        ${ICONS.user('w-4 h-4 text-primary')}
                      `}
                    </div>
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

// 22. Fullscreen Receipt Zoom Modal
function renderReceiptImageModal(): string {
  if (!state.viewingReceiptImage) return '';
  return `
    <div class="modal-overlay" id="receipt-zoom-overlay" style="z-index: 9999;">
      <div class="card-luxury p-4 max-w-lg w-full max-h-[90vh] flex flex-col space-y-3 bg-surface" onclick="event.stopPropagation()">
        <div class="flex items-center justify-between border-b border-subtle pb-2">
          <h3 class="font-bold text-sm text-primary">صورة إيصال التحويل (فودافون كاش)</h3>
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
        state.authError = err?.message || 'تعذر تسجيل الدخول عبر Google. يرجى المحاولة مجدداً.';
        renderApp();
      }
    });
  }

  // Instant Demo / Developer Login
  const demoLoginBtn = document.getElementById('btn-demo-login-action');
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', () => {
      const user = loginWithLocalSession('مالك عبدالودود', 'malek2013vscode@gmail.com');
      handlePostLoginRedirect(user);
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
    btn.addEventListener('click', () => {
      const el = btn as HTMLElement;
      const tab = el.dataset.nav as AppState['currentTab'];
      const subview = el.dataset.subview;
      if (tab) {
        navigateTo(tab, null);
      } else if (subview) {
        navigateTo('home', subview);
      }
    });
  });

  // Home actions
  document.querySelectorAll('[data-action]').forEach(el => {
    el.addEventListener('click', () => {
      const action = (el as HTMLElement).dataset.action;
      if (action === 'nav-quran') navigateTo('quran');
      if (action === 'nav-adhkar') navigateTo('adhkar');
      if (action === 'nav-tasbeeh') navigateTo('tasbeeh');
      if (action === 'nav-more') navigateTo('more');
      if (action === 'open-subview') {
        const view = (el as HTMLElement).dataset.view;
        if (view) navigateTo(state.currentTab, view);
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

  // Adhkar category chips
  document.querySelectorAll('[data-cat-id]').forEach(chip => {
    chip.addEventListener('click', () => {
      const catId = (chip as HTMLElement).dataset.catId;
      if (catId) {
        audioFx.playAppleTap();
        state.activeAdhkarCategory = catId;
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

  // Copy Vodafone Number Buttons
  const copyVodafoneBtn = document.getElementById('btn-copy-vodafone-num');
  if (copyVodafoneBtn) {
    copyVodafoneBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(VODAFONE_CASH_LOCAL_NUMBER).then(() => {
        copyVodafoneBtn.textContent = 'تم النسخ ✓';
        setTimeout(() => {
          if (copyVodafoneBtn) copyVodafoneBtn.innerHTML = `${ICONS.copy('w-3.5 h-3.5')}<span>نسخ الرقم</span>`;
        }, 2000);
      });
    });
  }

  const copyVodafonePageBtn = document.getElementById('btn-copy-vodafone-num-page');
  if (copyVodafonePageBtn) {
    copyVodafonePageBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(VODAFONE_CASH_LOCAL_NUMBER).then(() => {
        copyVodafonePageBtn.textContent = 'تم النسخ ✓';
        setTimeout(() => {
          if (copyVodafonePageBtn) copyVodafonePageBtn.innerHTML = `${ICONS.copy('w-3 h-3')}<span>نسخ الرقم</span>`;
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
          if (previewImg) previewImg.alt = 'جاري الرفع عبر ImageKit (dttd3hna3)...';
        }
        
        try {
          const ikUrl = await uploadReceiptToImageKit(file);
          state.receiptUploadPreview = ikUrl;
          if (previewImg) {
            previewImg.src = ikUrl;
            previewImg.alt = 'Receipt ImageKit CDN';
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

      if (type === 'quran' && actionId) {
        const num = parseInt(actionId, 10);
        const startPage = SURAH_START_PAGE[num] || 1;
        state.mushafPageNumber = startPage;
        state.quranMode = 'mushaf';
        state.mushafPageData = null;
        state.selectedAyah = null;
        state.activeSurah = null;
        localStorage.setItem('zad_last_mushaf_page', startPage.toString());
        navigateTo('quran');
      } else if (type === 'dhikr') {
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
