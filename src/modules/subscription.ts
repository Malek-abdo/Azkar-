/**
 * نظام الاشتراك والباقة وإدارة المسؤول (مالك عبدالودود) لتطبيق زاد المسلم
 * الدفع عبر فودافون كاش على الرقم +201114809908 والتواصل عبر واتساب
 */

export const VODAFONE_CASH_NUMBER = "+201114809908";
export const VODAFONE_CASH_LOCAL_NUMBER = "01114809908";
export const ADMIN_EMAIL = "malek2013vscode@gmail.com";
export const SUBSCRIPTION_PRICE_EGP = 100;

const STORAGE_INSTALL_KEY = "zad_install_timestamp";
const STORAGE_SUB_EXPIRY_KEY = "zad_subscription_expiry";
const STORAGE_PAYMENT_REQUESTS_KEY = "zad_payment_requests";
const STORAGE_MANAGED_USERS_KEY = "zad_managed_users";
const STORAGE_BANNED_USERS_KEY = "zad_banned_users_list";

const TRIAL_DURATION_DAYS = 3;
const SUBSCRIPTION_DURATION_DAYS = 30;

export interface SubscriptionStatus {
  isActive: boolean;
  isTrial: boolean;
  isExpired: boolean;
  isSubscribed: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  expiryDateStr: string;
}

export interface PaymentRequest {
  id: string;
  userUid: string;
  userName: string;
  userEmail: string;
  senderPhone: string;
  amount: number;
  receiptImage?: string; // base64 image data
  timestamp: number;
  date?: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  approvedAt?: number;
}

export interface ManagedUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  isBanned: boolean;
  isSubscribed: boolean;
  status?: 'admin' | 'banned' | 'subscribed' | 'trial' | 'expired';
  subscriptionExpiry: number; // timestamp
  createdAt: number;
  lastLoginAt: number;
  phone?: string;
}

export function isAdminUser(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export function initSubscription(): void {
  if (typeof localStorage === 'undefined') return;
  if (!localStorage.getItem(STORAGE_INSTALL_KEY)) {
    localStorage.setItem(STORAGE_INSTALL_KEY, Date.now().toString());
  }
}

export function getSubscriptionStatus(userEmail?: string | null): SubscriptionStatus {
  initSubscription();
  
  // Admin has permanent full active access
  if (userEmail && isAdminUser(userEmail)) {
    return {
      isActive: true,
      isTrial: false,
      isExpired: false,
      isSubscribed: true,
      daysRemaining: 9999,
      hoursRemaining: 23,
      minutesRemaining: 59,
      expiryDateStr: "حساب المسؤول الكامل (غير محدود)"
    };
  }

  const installTime = parseInt(localStorage.getItem(STORAGE_INSTALL_KEY) || Date.now().toString(), 10);
  const subExpiry = parseInt(localStorage.getItem(STORAGE_SUB_EXPIRY_KEY) || "0", 10);
  const now = Date.now();

  // If active paid subscription exists
  if (subExpiry > now) {
    const diffMs = subExpiry - now;
    const daysRemaining = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const expiryDate = new Date(subExpiry);

    return {
      isActive: true,
      isTrial: false,
      isExpired: false,
      isSubscribed: true,
      daysRemaining,
      hoursRemaining,
      minutesRemaining,
      expiryDateStr: expiryDate.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  }

  // Check 3-day trial
  const trialEnd = installTime + (TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000);
  if (now < trialEnd) {
    const diffMs = trialEnd - now;
    const daysRemaining = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const expiryDate = new Date(trialEnd);

    return {
      isActive: true,
      isTrial: true,
      isExpired: false,
      isSubscribed: false,
      daysRemaining,
      hoursRemaining,
      minutesRemaining,
      expiryDateStr: expiryDate.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })
    };
  }

  // Expired
  return {
    isActive: false,
    isTrial: false,
    isExpired: true,
    isSubscribed: false,
    daysRemaining: 0,
    hoursRemaining: 0,
    minutesRemaining: 0,
    expiryDateStr: "منتهية"
  };
}

export function activateSubscription(days: number = SUBSCRIPTION_DURATION_DAYS, userEmail?: string | null): void {
  const currentExpiry = parseInt(localStorage.getItem(STORAGE_SUB_EXPIRY_KEY) || "0", 10);
  const baseTime = currentExpiry > Date.now() ? currentExpiry : Date.now();
  const newExpiry = baseTime + (days * 24 * 60 * 60 * 1000);
  localStorage.setItem(STORAGE_SUB_EXPIRY_KEY, newExpiry.toString());
  if (userEmail) {
    grantUserSubscription(userEmail, days);
  }
}

export function resetToTrialForTesting(): void {
  localStorage.setItem(STORAGE_INSTALL_KEY, Date.now().toString());
  localStorage.removeItem(STORAGE_SUB_EXPIRY_KEY);
}

export function expireTrialForTesting(): void {
  const fourDaysAgo = Date.now() - (4 * 24 * 60 * 60 * 1000);
  localStorage.setItem(STORAGE_INSTALL_KEY, fourDaysAgo.toString());
  localStorage.removeItem(STORAGE_SUB_EXPIRY_KEY);
}

// ----------------- PAYMENT REQUESTS ENGINE -----------------

export function getPaymentRequests(): PaymentRequest[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_PAYMENT_REQUESTS_KEY);
    const list: PaymentRequest[] = data ? JSON.parse(data) : [];
    return list.map(r => ({
      ...r,
      date: r.date || new Date(r.timestamp).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    }));
  } catch {
    return [];
  }
}

export function savePaymentRequests(requests: PaymentRequest[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_PAYMENT_REQUESTS_KEY, JSON.stringify(requests));
}

export function createPaymentRequest(data: {
  userUid?: string;
  userName?: string;
  userEmail: string;
  senderPhone?: string;
  amount?: number;
  receiptImage?: string;
  notes?: string;
}): PaymentRequest {
  const requests = getPaymentRequests();
  const newReq: PaymentRequest = {
    id: 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    userUid: data.userUid || data.userEmail,
    userName: data.userName || 'مستخدم زاد المسلم',
    userEmail: data.userEmail,
    senderPhone: data.senderPhone || '',
    amount: data.amount || SUBSCRIPTION_PRICE_EGP,
    receiptImage: data.receiptImage,
    timestamp: Date.now(),
    date: new Date().toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    status: 'pending',
    notes: data.notes || ''
  };

  requests.unshift(newReq);
  savePaymentRequests(requests);
  return newReq;
}

export const submitPaymentRequest = createPaymentRequest;

export function approvePaymentRequest(requestId: string): boolean {
  const requests = getPaymentRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return false;

  req.status = 'approved';
  req.approvedAt = Date.now();
  savePaymentRequests(requests);

  // Activate subscription for current browser session if it belongs to this user
  activateSubscription(30, req.userEmail);

  // Update in managed users
  grantUserSubscription(req.userEmail || req.userUid, 30);
  return true;
}

export function rejectPaymentRequest(requestId: string): boolean {
  const requests = getPaymentRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return false;

  req.status = 'rejected';
  savePaymentRequests(requests);
  return true;
}

export function deletePaymentRequest(requestId: string): boolean {
  let requests = getPaymentRequests();
  requests = requests.filter(r => r.id !== requestId);
  savePaymentRequests(requests);
  return true;
}

// ----------------- USER ACCESS & BAN MANAGEMENT -----------------

export function getBannedList(): string[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_BANNED_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isUserBanned(identifier?: string | null): boolean {
  if (!identifier) return false;
  const cleanId = identifier.trim().toLowerCase();
  
  // Admin can NEVER be banned
  if (cleanId === ADMIN_EMAIL.toLowerCase()) return false;

  const banned = getBannedList();
  return banned.some(b => b.toLowerCase() === cleanId);
}

export function banUser(identifier: string): void {
  if (!identifier) return;
  const cleanId = identifier.trim().toLowerCase();
  if (cleanId === ADMIN_EMAIL.toLowerCase()) return; // Protection

  const banned = getBannedList();
  if (!banned.includes(cleanId)) {
    banned.push(cleanId);
    localStorage.setItem(STORAGE_BANNED_USERS_KEY, JSON.stringify(banned));
  }

  // Update in managed users
  const users = getManagedUsers();
  const u = users.find(x => x.email?.toLowerCase() === cleanId || x.uid === cleanId);
  if (u) {
    u.isBanned = true;
    u.status = 'banned';
    saveManagedUsers(users);
  }
}

export function unbanUser(identifier: string): void {
  if (!identifier) return;
  const cleanId = identifier.trim().toLowerCase();
  let banned = getBannedList();
  banned = banned.filter(b => b.toLowerCase() !== cleanId);
  localStorage.setItem(STORAGE_BANNED_USERS_KEY, JSON.stringify(banned));

  // Update in managed users
  const users = getManagedUsers();
  const u = users.find(x => x.email?.toLowerCase() === cleanId || x.uid === cleanId);
  if (u) {
    u.isBanned = false;
    u.status = u.subscriptionExpiry > Date.now() ? 'subscribed' : 'expired';
    saveManagedUsers(users);
  }
}

export function getManagedUsers(): ManagedUser[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_MANAGED_USERS_KEY);
    let users: ManagedUser[] = data ? JSON.parse(data) : [];
    
    // Ensure admin is in list
    if (!users.some(u => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase())) {
      users.unshift({
        uid: 'admin_malek',
        email: ADMIN_EMAIL,
        displayName: 'مالك عبدالودود (المسؤول)',
        photoURL: '/images/app_logo.jpg',
        isBanned: false,
        isSubscribed: true,
        status: 'admin',
        subscriptionExpiry: Date.now() + (365 * 10 * 24 * 60 * 60 * 1000),
        createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000),
        lastLoginAt: Date.now(),
        phone: VODAFONE_CASH_LOCAL_NUMBER
      });
    }

    const now = Date.now();
    users = users.map(u => {
      const banned = isUserBanned(u.email) || isUserBanned(u.uid);
      let status: 'admin' | 'banned' | 'subscribed' | 'trial' | 'expired' = 'expired';
      if (isAdminUser(u.email)) {
        status = 'admin';
      } else if (banned) {
        status = 'banned';
      } else if (u.subscriptionExpiry > now) {
        status = u.isSubscribed ? 'subscribed' : 'trial';
      } else {
        status = 'expired';
      }
      return {
        ...u,
        isBanned: banned,
        status
      };
    });

    return users;
  } catch {
    return [];
  }
}

export function saveManagedUsers(users: ManagedUser[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_MANAGED_USERS_KEY, JSON.stringify(users));
}

export function recordUserSession(user: { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null }): ManagedUser {
  const users = getManagedUsers();
  const email = user.email || `${user.uid}@zad.app`;
  const existing = users.find(u => u.uid === user.uid || (user.email && u.email.toLowerCase() === user.email.toLowerCase()));
  const isBanned = isUserBanned(email) || isUserBanned(user.uid);

  if (existing) {
    existing.lastLoginAt = Date.now();
    existing.displayName = user.displayName || existing.displayName;
    existing.photoURL = user.photoURL || existing.photoURL;
    existing.isBanned = isBanned;
    saveManagedUsers(users);
    return existing;
  }

  const newUser: ManagedUser = {
    uid: user.uid,
    email,
    displayName: user.displayName || 'مستخدم جديد',
    photoURL: user.photoURL,
    isBanned,
    isSubscribed: false,
    status: isBanned ? 'banned' : 'trial',
    subscriptionExpiry: Date.now() + (TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000),
    createdAt: Date.now(),
    lastLoginAt: Date.now()
  };

  users.push(newUser);
  saveManagedUsers(users);
  return newUser;
}

export function grantUserSubscription(identifier: string, days: number = 30): void {
  const users = getManagedUsers();
  const cleanId = identifier.trim().toLowerCase();
  const u = users.find(x => x.email?.toLowerCase() === cleanId || x.uid === cleanId);
  if (u) {
    const base = u.subscriptionExpiry > Date.now() ? u.subscriptionExpiry : Date.now();
    u.subscriptionExpiry = base + (days * 24 * 60 * 60 * 1000);
    u.isSubscribed = true;
    u.status = 'subscribed';
    saveManagedUsers(users);
  }
}

export const grantSubscriptionByAdmin = grantUserSubscription;

export function revokeUserSubscription(identifier: string): void {
  const users = getManagedUsers();
  const cleanId = identifier.trim().toLowerCase();
  const u = users.find(x => x.email?.toLowerCase() === cleanId || x.uid === cleanId);
  if (u) {
    u.subscriptionExpiry = 0;
    u.isSubscribed = false;
    u.status = 'expired';
    saveManagedUsers(users);
  }
}

export const revokeSubscriptionByAdmin = revokeUserSubscription;

export function generateWhatsAppPaymentUrl(
  userOrName?: string | { email?: string | null; displayName?: string | null; phone?: string },
  userEmail?: string,
  _amount?: number
): string {
  let name = 'مستخدم زاد المسلم';
  let email = '';

  if (typeof userOrName === 'string') {
    name = userOrName;
    if (userEmail) email = ` (${userEmail})`;
  } else if (userOrName && typeof userOrName === 'object') {
    name = userOrName.displayName || userOrName.email || 'مستخدم زاد المسلم';
    if (userOrName.email) email = ` (${userOrName.email})`;
  }

  const text = `السلام عليكم ورحمة الله،\nلقد قمت بتحويل مبلغ الاشتراك (100 جنيه مصري) عبر فودافون كاش لرقم المحفظة ${VODAFONE_CASH_LOCAL_NUMBER}.\nاسم المشترك: ${name}${email}\nيرجى مراجعة إيصال التحويل المرفق وتفعيل الحساب.\nشكراً جزيلاً.`;
  return `https://wa.me/201114809908?text=${encodeURIComponent(text)}`;
}
