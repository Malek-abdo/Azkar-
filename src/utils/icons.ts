/**
 * Iconsax Design System Icons (https://app.iconsax.io/)
 * Linear / Geometric Vector Icons with consistent stroke and curve radius.
 * Islamic & Special heritage icons preserved.
 */

export const ICONS = {
  // Navigation & Core
  home: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9.02 2.84L3.63 7.04C2.41 7.99 1.63 10.01 1.63 11.54V17.36C1.63 20.73 4.36 23.46 7.73 23.46H16.27C19.64 23.46 22.37 20.73 22.37 17.36V11.54C22.37 10.01 21.59 7.99 20.37 7.04L14.98 2.84C13.34 1.57 10.66 1.57 9.02 2.84Z"/>
      <path d="M12 17.99V14.99"/>
    </svg>`,

  eye: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>`,

  eyeOff: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>`,

  rubElHizb: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="5" width="14" height="14" rx="1.5"/>
      <rect x="5" y="5" width="14" height="14" rx="1.5" transform="rotate(45 12 12)"/>
      <circle cx="12" cy="12" r="2" fill="currentColor"/>
    </svg>`,

  islamicDivider: (cls = "w-full h-4 text-gold/60") => `
    <svg class="${cls}" viewBox="0 0 300 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 12H120M180 12H300" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
      <circle cx="128" cy="12" r="2" fill="currentColor" opacity="0.6"/>
      <circle cx="172" cy="12" r="2" fill="currentColor" opacity="0.6"/>
      <g transform="translate(150 12)">
        <rect x="-6" y="-6" width="12" height="12" rx="1" stroke="currentColor" stroke-width="1.2" fill="currentColor" fill-opacity="0.15"/>
        <rect x="-6" y="-6" width="12" height="12" rx="1" stroke="currentColor" stroke-width="1.2" transform="rotate(45)" fill="currentColor" fill-opacity="0.15"/>
        <circle cx="0" cy="0" r="1.5" fill="currentColor"/>
      </g>
    </svg>`,

  islamicCrescentStar: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8A9 9 0 0 0 12 3z"/>
      <path d="M19 5l.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2L19 5z" fill="currentColor" stroke="none"/>
    </svg>`,

  islamicLantern: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v2M8 4h8M9 4l-2 5h10l-2-5M7 9v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9M9 19l-1 3h8l-1-3M10 13h4M12 9v6"/>
    </svg>`,

  islamicMihrab: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 21V11C4 7 7.5 3.5 12 2C16.5 3.5 20 7 20 11V21"/>
      <path d="M8 21V12C8 9.8 9.8 8 12 7C14.2 8 16 9.8 16 12V21"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>`,

  islamicStarAccent: (cls = "w-4 h-4") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z"/>
    </svg>`,

  // InstaPay & Modern Egyptian Payment Vector
  instapay: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" fill-opacity="0.15"/>
      <circle cx="12" cy="12" r="9.5" stroke-width="1.6"/>
    </svg>`,

  instapayLogo: (cls = "w-6 h-6") => `
    <svg class="${cls}" viewBox="0 0 48 48" fill="none">
      <rect width="48" height="48" rx="14" fill="#5C1D84"/>
      <path d="M14 24C14 18.4772 18.4772 14 24 14C29.5228 14 34 18.4772 34 24C34 29.5228 29.5228 34 24 34" stroke="#00E5FF" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M26 18L18 28H25L23 34L32 22H24L26 18Z" fill="#FFFFFF"/>
      <circle cx="24" cy="24" r="3" fill="#00E5FF"/>
    </svg>`,

  bank: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 9.5L12 4L21 9.5"/>
      <path d="M5 20H19"/>
      <path d="M3 20H21"/>
      <path d="M6 10V17"/>
      <path d="M10 10V17"/>
      <path d="M14 10V17"/>
      <path d="M18 10V17"/>
      <circle cx="12" cy="7" r="1" fill="currentColor"/>
    </svg>`,

  wallet: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 7V4C19 3 18 2 17 2H5C3.5 2 2 3.5 2 5V19C2 20.5 3.5 22 5 22H19C20.5 22 22 20.5 22 19V14C22 13 21 12 20 12H17C15.5 12 14 10.5 14 9C14 7.5 15.5 6 17 6H19"/>
      <circle cx="17.5" cy="9" r="1.5" fill="currentColor"/>
    </svg>`,

  qrCode: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <path d="M14 14H17V17H14V14Z" fill="currentColor"/>
      <path d="M17 17H21V21H17V17Z" fill="currentColor"/>
      <path d="M14 19H16"/>
      <path d="M19 14V16"/>
      <circle cx="6.5" cy="6.5" r="1" fill="currentColor"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
      <circle cx="6.5" cy="17.5" r="1" fill="currentColor"/>
    </svg>`,

  receiptText: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 2H19C20.1 2 21 2.9 21 4V21L18 19.5L15 21L12 19.5L9 21L6 19.5L3 21V4C3 2.9 3.9 2 5 2Z"/>
      <path d="M8 7H16"/>
      <path d="M8 11H16"/>
      <path d="M8 15H12"/>
    </svg>`,

  mosque: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2V4"/>
      <path d="M12 4C9 6.5 8 9 8 12V20H16V12C16 9 15 6.5 12 4Z"/>
      <path d="M4 11V20H7V13C7 12.45 7.45 12 8 12"/>
      <path d="M20 11V20H17V13C17 12.45 16.55 12 16 12"/>
      <path d="M10 20V16C10 14.9 10.9 14 12 14C13.1 14 14 14.9 14 16V20"/>
      <circle cx="12" cy="8" r="1" fill="currentColor"/>
    </svg>`,

  quran: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3.5 18V7C3.5 4.5 5 3 7.5 3H16.5C19 3 20.5 4.5 20.5 7V18C20.5 20.5 19 22 16.5 22H7.5C5 22 3.5 20.5 3.5 18Z"/>
      <path d="M7 8H17"/>
      <path d="M7 12H14"/>
      <path d="M7 16H11"/>
    </svg>`,

  duaHands: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 19C4 15 5.5 11.5 8 9L9.5 15.5"/>
      <path d="M20 19C20 15 18.5 11.5 16 9L14.5 15.5"/>
      <path d="M9.5 15.5C11 17 13 17 14.5 15.5"/>
      <path d="M7 8C7 6.9 7.9 6 9 6.3V12"/>
      <path d="M17 8C17 6.9 16.1 6 15 6.3V12"/>
      <path d="M5 21H19"/>
    </svg>`,

  tasbeeh: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="4" r="1.5"/>
      <circle cx="16.5" cy="5.5" r="1.5"/>
      <circle cx="19.5" cy="9.5" r="1.5"/>
      <circle cx="19.5" cy="14.5" r="1.5"/>
      <circle cx="16.5" cy="18.5" r="1.5"/>
      <circle cx="12" cy="19.5" r="1.5"/>
      <circle cx="7.5" cy="18.5" r="1.5"/>
      <circle cx="4.5" cy="14.5" r="1.5"/>
      <circle cx="4.5" cy="9.5" r="1.5"/>
      <circle cx="7.5" cy="5.5" r="1.5"/>
      <path d="M12 21V23"/>
      <path d="M10 23H14"/>
    </svg>`,

  clock: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"/>
      <path d="M15.71 15.18L12.61 13.33C12.07 13.01 11.63 12.24 11.63 11.61V7.51"/>
    </svg>`,

  qiblaCompass: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"/>
      <path d="M14.73 9.27L12.81 14.73C12.58 15.39 12.06 15.91 11.4 16.14L5.94 18.06C5.05 18.37 4.26 17.58 4.57 16.69L6.49 11.23C6.72 10.57 7.24 10.05 7.9 9.82L13.36 7.9C14.25 7.59 15.04 8.38 14.73 9.27Z"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>`,

  kaaba: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 7L12 3L20 7V18L12 22L4 18V7Z"/>
      <path d="M4 7L12 11L20 7"/>
      <path d="M12 11V22"/>
      <path d="M7 8.5L12 11L17 8.5"/>
      <line x1="8" y1="12" x2="8" y2="15" stroke="currentColor" stroke-width="1.5"/>
    </svg>`,

  sun: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 18.5C15.59 18.5 18.5 15.59 18.5 12C18.5 8.41 15.59 5.5 12 5.5C8.41 5.5 5.5 8.41 5.5 12C5.5 15.59 8.41 18.5 12 18.5Z"/>
      <path d="M12 2V4"/>
      <path d="M12 20V22"/>
      <path d="M4.93 4.93L6.34 6.34"/>
      <path d="M17.66 17.66L19.07 19.07"/>
      <path d="M2 12H4"/>
      <path d="M20 12H22"/>
      <path d="M6.34 17.66L4.93 19.07"/>
      <path d="M19.07 4.93L17.66 6.34"/>
    </svg>`,

  sunrise: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2V6"/>
      <path d="M4.93 7.93L6.34 9.34"/>
      <path d="M19.07 7.93L17.66 9.34"/>
      <path d="M2 18H22"/>
      <path d="M4 22H20"/>
      <path d="M8 18C8 15.79 9.79 14 12 14C14.21 14 16 15.79 16 18"/>
      <path d="M9 4L12 1L15 4"/>
    </svg>`,

  sunset: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 6V2"/>
      <path d="M4.93 7.93L6.34 9.34"/>
      <path d="M19.07 7.93L17.66 9.34"/>
      <path d="M2 18H22"/>
      <path d="M4 22H20"/>
      <path d="M8 18C8 15.79 9.79 14 12 14C14.21 14 16 15.79 16 18"/>
      <path d="M9 4L12 7L15 4"/>
    </svg>`,

  moon: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21.07 10.55C20.93 10.48 20.77 10.47 20.62 10.51C19.56 10.83 18.43 11 17.25 11C11.32 11 6.5 6.18 6.5 0.25C6.5 -0.93 6.67 -2.06 6.99 -3.12C7.03 -3.27 7.02 -3.43 6.95 -3.57C6.87 -3.71 6.74 -3.8 6.58 -3.82C2.39 -2.2 0 1.8 0 6C0 12.08 4.92 17 11 17C15.2 17 18.8 14.61 20.82 11.42C20.91 11.27 20.9 11.09 20.81 10.95C20.72 10.8 20.57 10.72 20.41 10.7L21.07 10.55Z" transform="translate(1, 4.5)"/>
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 11.33 21.93 10.68 21.81 10.05C20.78 10.66 19.58 11 18.3 11C14.27 11 11 7.73 11 3.7C11 2.42 11.34 1.22 11.95 0.19C11.32 0.07 10.67 0 10 0" opacity="0"/>
    </svg>`,

  moonStars: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3.17 7.44C1.98 10.07 2.37 13.25 4.35 15.51C7.08 18.63 11.75 19.06 15.01 16.5C16.89 15.02 17.89 12.75 17.75 10.45C16.71 11.12 15.48 11.5 14.16 11.5C10.21 11.5 7 8.29 7 4.34C7 3.02 7.38 1.79 8.05 0.75C5.75 0.61 3.48 1.61 2 3.49"/>
      <path d="M19 2V6"/>
      <path d="M21 4H17"/>
      <path d="M14 7V9"/>
      <path d="M15 8H13"/>
    </svg>`,

  search: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"/>
      <path d="M22 22L20 20"/>
    </svg>`,

  star: (cls = "w-5 h-5", filled = false) => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13.73 3.51L15.49 7.07C15.85 7.79 16.79 8.48 17.6 8.6L20.79 9.08C22.83 9.39 23.31 10.88 21.84 12.39L19.36 14.94C18.74 15.58 18.4 16.81 18.59 17.69L19.29 20.72C19.85 23.16 18.56 24.1 16.41 22.81L13.42 21.02C12.65 20.56 11.39 20.56 10.61 21.02L7.62 22.81C5.48 24.09 4.17 23.15 4.74 20.72L5.44 17.69C5.63 16.81 5.29 15.58 4.67 14.94L2.19 12.39C0.72 10.88 1.2 9.39 3.24 9.08L6.43 8.6C7.23 8.48 8.18 7.79 8.54 7.07L10.3 3.51C11.24 1.56 12.79 1.56 13.73 3.51Z"/>
    </svg>`,

  islamicStar: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="5" y="5" width="14" height="14" rx="2"/>
      <rect x="5" y="5" width="14" height="14" rx="2" transform="rotate(45 12 12)"/>
      <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
    </svg>`,

  mapPin: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 13.43C13.7231 13.43 15.12 12.0331 15.12 10.31C15.12 8.58686 13.7231 7.19 12 7.19C10.2769 7.19 8.88 8.58686 8.88 10.31C8.88 12.0331 10.2769 13.43 12 13.43Z"/>
      <path d="M3.62 8.49C5.59 -0.17 18.42 -0.16 20.38 8.5C21.53 13.58 18.37 17.88 15.6 20.54C13.59 22.48 10.41 22.48 8.39 20.54C5.63 17.88 2.47 13.57 3.62 8.49Z"/>
    </svg>`,

  settings: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"/>
      <path d="M2 12.88V11.12C2 10.08 2.85 9.22 3.9 9.22C5.7 9.22 6.44 7.94 5.54 6.37C5.02 5.47 5.32 4.3 6.23 3.78L7.76 2.9C8.66 2.38 9.83 2.68 10.35 3.59C11.25 5.16 12.73 5.16 13.63 3.59C14.15 2.68 15.32 2.38 16.22 2.9L17.75 3.78C18.66 4.3 18.96 5.47 18.44 6.37C17.54 7.94 18.28 9.22 20.08 9.22C21.13 9.22 21.98 10.08 21.98 11.12V12.88C21.98 13.92 21.13 14.78 20.08 14.78C18.28 14.78 17.54 16.06 18.44 17.63C18.96 18.53 18.66 19.7 17.75 20.22L16.22 21.1C15.32 21.62 14.15 21.32 13.63 20.41C12.73 18.84 11.25 18.84 10.35 20.41C9.83 21.32 8.66 21.62 7.76 21.1L6.23 20.22C5.32 19.7 5.02 18.53 5.54 17.63C6.44 16.06 5.7 14.78 3.9 14.78C2.85 14.78 2 13.92 2 12.88Z"/>
    </svg>`,

  share: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M13.06 10.94L18.88 5.12"/>
      <path d="M19.12 9.41V4.88H14.59"/>
      <path d="M9 5C4.5 5 2 7.5 2 12C2 16.5 4.5 19 9 19H15C19.5 19 22 16.5 22 12C22 11.09 21.9 10.25 21.69 9.5"/>
    </svg>`,

  copy: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z"/>
      <path d="M22 6.9V11.1C22 14.6 20.6 16 17.1 16H16V12.9C16 9.4 14.6 8 11.1 8H8V6.9C8 3.4 9.4 2 12.9 2H17.1C20.6 2 22 3.4 22 6.9Z"/>
    </svg>`,

  check: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.5 12.75L9.5 17.75L19.5 7.25"/>
    </svg>`,

  sparkles: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L13.96 7.88L20 10L13.96 12.12L12 18L10.04 12.12L4 10L10.04 7.88L12 2Z"/>
      <path d="M19 17L19.8 19.2L22 20L19.8 20.8L19 23L18.2 20.8L16 20L18.2 19.2L19 17Z"/>
    </svg>`,

  calendar: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 2V5"/>
      <path d="M16 2V5"/>
      <path d="M3.5 9.09H20.5"/>
      <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"/>
      <path d="M11.995 13.7H12.005"/>
      <path d="M8.294 13.7H8.304"/>
      <path d="M8.294 16.7H8.304"/>
    </svg>`,

  bookGuide: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 6.54V17.46C22 19.71 20.25 21 18.11 21H5.89C3.75 21 2 19.71 2 17.46V6.54C2 4.29 3.75 3 5.89 3H18.11C20.25 3 22 4.29 22 6.54Z"/>
      <path d="M6 8H18"/>
      <path d="M6 12H18"/>
      <path d="M6 16H12"/>
    </svg>`,

  speakerKhutbah: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"/>
      <path d="M7.5 12H7.51"/>
      <path d="M12 12H12.01"/>
      <path d="M16.5 12H16.51"/>
      <path d="M12 7V17"/>
      <path d="M9.5 9.5V14.5"/>
      <path d="M14.5 9.5V14.5"/>
    </svg>`,

  heartFaith: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z"/>
      <path d="M12 8.5V12.5"/>
      <path d="M10 10.5H14"/>
    </svg>`,

  shieldPeace: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L19.5 5V11.38C19.5 16.86 16.29 21.75 11.34 23.82C10.9 24.06 10.1 24.06 9.66 23.82C4.71 21.75 1.5 16.86 1.5 11.38V5L9 2H12Z"/>
      <path d="M9 12.5L11 14.5L15 10.5"/>
    </svg>`,

  crown: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2.5 7L5.5 17.5C5.8 18.5 6.7 19 7.7 19H16.3C17.3 19 18.2 18.5 18.5 17.5L21.5 7L16 11.5L12 5L8 11.5L2.5 7Z"/>
      <circle cx="12" cy="4" r="1.5" fill="currentColor"/>
    </svg>`,

  volume: (cls = "w-5 h-5", on = true) => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 10V14C2 16 3 17 5 17H7.15C7.8 17 8.44 17.23 8.95 17.64L12.1 20.16C14.14 21.79 16 20.88 16 18.32V5.68C16 3.11 14.14 2.2 12.1 3.84L8.95 6.36C8.44 6.77 7.8 7 7.15 7H5C3 7 2 8 2 10Z"/>
      ${on ? `
        <path d="M18.5 8C19.83 10.67 19.83 13.33 18.5 16"/>
        <path d="M21 5C23.67 9.67 23.67 14.33 21 19"/>
      ` : `
        <path d="M22 9L17 15"/>
        <path d="M17 9L22 15"/>
      `}
    </svg>`,

  vibrate: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9.5 2H14.5C17 2 18 3 18 5.5V18.5C18 21 17 22 14.5 22H9.5C7 22 6 21 6 18.5V5.5C6 3 7 2 9.5 2Z"/>
      <path d="M2 9V15"/>
      <path d="M22 9V15"/>
      <path d="M11 18H13"/>
    </svg>`,

  rotate: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 12C22 17.52 17.52 22 12 22C7.57 22 3.8 19.12 2.48 15.09"/>
      <path d="M2 12C2 6.48 6.48 2 12 2C16.43 2 20.2 4.88 21.52 8.91"/>
      <path d="M2 4V12H10"/>
      <path d="M22 20V12H14"/>
    </svg>`,

  arrowLeft: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9.57 5.93L3.5 12L9.57 18.07"/>
      <path d="M20.5 12H3.67"/>
    </svg>`,

  arrowRight: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.43 5.93L20.5 12L14.43 18.07"/>
      <path d="M3.5 12H20.33"/>
    </svg>`,

  chevronLeft: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 19.92L8.48 13.4C7.71 12.63 7.71 11.37 8.48 10.6L15 4.08"/>
    </svg>`,

  chevronRight: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8.91 19.92L15.43 13.4C16.2 12.63 16.2 11.37 15.43 10.6L8.91 4.08"/>
    </svg>`,

  close: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 6L6 18"/>
      <path d="M6 6L18 18"/>
    </svg>`,

  android: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 10H19C20.1 10 21 10.9 21 12V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V12C3 10.9 3.9 10 5 10Z"/>
      <path d="M6 10V7C6 4.24 8.24 2 11 2H13C15.76 2 18 4.24 18 7V10"/>
      <circle cx="9" cy="6" r="1" fill="currentColor"/>
      <circle cx="15" cy="6" r="1" fill="currentColor"/>
    </svg>`,

  islamicCrescent: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C15.11 21 17.84 19.42 19.45 17.02C18.8 17.18 18.11 17.27 17.4 17.27C12.43 17.27 8.4 13.24 8.4 8.27C8.4 6.25 9.07 4.39 10.2 2.89C10.78 2.96 11.39 3 12 3Z"/>
      <polygon points="18 4 18.8 5.8 20.8 6.1 19.3 7.5 19.7 9.5 18 8.5 16.3 9.5 16.7 7.5 15.2 6.1 17.2 5.8 18 4" fill="currentColor"/>
    </svg>`,

  bookOpen: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 6.94C2 5.31 3.32 4 4.95 4H9.05C10.57 4 11.8 4.92 12 6.22C12.2 4.92 13.43 4 14.95 4H19.05C20.68 4 22 5.31 22 6.94V17.36C22 18.99 20.68 20.3 19.05 20.3H14.95C13.83 20.3 12.73 20.75 11.9 21.55L11.45 22C11.2 22.25 10.8 22.25 10.55 22L10.1 21.55C9.27 20.75 8.17 20.3 7.05 20.3H4.95C3.32 20.3 2 18.99 2 17.36V6.94Z"/>
      <path d="M12 6.5V21"/>
    </svg>`,

  creditCard: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 8.5H22"/>
      <path d="M6 16.5H8"/>
      <path d="M10.5 16.5H14.5"/>
      <path d="M22 8.97V17C22 20 20.5 22 17 22H7C3.5 22 2 20 2 17V8.97C2 5.97 3.5 3.97 7 3.97H17C20.5 3.97 22 5.97 22 8.97Z"/>
    </svg>`,

  list: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 12H16"/>
      <path d="M8 7.5H16"/>
      <path d="M8 16.5H13"/>
      <path d="M22 8.5V17C22 20 20.5 22 17 22H7C3.5 22 2 20 2 17V8.5C2 5.5 3.5 3.5 7 3.5H17C20.5 3.5 22 5.5 22 8.5Z"/>
    </svg>`,

  google: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>`,

  lock: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10"/>
      <path d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z"/>
      <path d="M12 17C12.8284 17 13.5 16.3284 13.5 15.5C13.5 14.6716 12.8284 14 12 14C11.1716 14 10.5 14.6716 10.5 15.5C10.5 16.3284 11.1716 17 12 17Z"/>
    </svg>`,

  user: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"/>
      <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22"/>
    </svg>`,

  logOut: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8.9 7.56C9.21 4.76 10.8 3.6 14.2 3.6H19.8C23.58 3.6 25.1 5.12 25.1 8.9V15.1C25.1 18.88 23.58 20.4 19.8 20.4H14.2C10.82 20.4 9.23 19.25 8.91 16.49" transform="translate(-3.1, 0) scale(0.9)"/>
      <path d="M2 12H14.88"/>
      <path d="M12.65 8.65L16 12L12.65 15.35"/>
    </svg>`,

  whatsapp: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>`,

  plus: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 18V6"/>
      <path d="M6 12H18"/>
    </svg>`,

  shield: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2L19.5 5V11.38C19.5 16.86 16.29 21.75 11.34 23.82C10.9 24.06 10.1 24.06 9.66 23.82C4.71 21.75 1.5 16.86 1.5 11.38V5L9 2H12Z"/>
    </svg>`,

  userCheck: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"/>
      <path d="M15 20.61L16.5 22.11L21 17.61"/>
      <path d="M3.41 22C3.41 18.13 7.26 15 12 15C12.8 15 13.57 15.09 14.3 15.26"/>
    </svg>`,

  userX: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"/>
      <path d="M16.5 17.5L20.5 21.5"/>
      <path d="M20.5 17.5L16.5 21.5"/>
      <path d="M3.41 22C3.41 18.13 7.26 15 12 15C12.8 15 13.57 15.09 14.3 15.26"/>
    </svg>`,

  phone: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20 21.37 19.37 21.62C18.74 21.87 18.06 22 17.3 22C16.2 22 15 21.71 13.69 21.14C12.38 20.57 11.09 19.76 9.82 18.72C8.55 17.67 7.39 16.48 6.36 15.17C5.33 13.85 4.54 12.51 3.99 11.16C3.45 9.8 3.17 8.54 3.17 7.38C3.17 6.64 3.29 5.95 3.53 5.32C3.77 4.69 4.14 4.12 4.66 3.63C5.3 3.01 6.01 2.7 6.78 2.7C7.09 2.7 7.4 2.77 7.69 2.92C7.98 3.07 8.23 3.3 8.43 3.62L10.37 6.36C10.57 6.64 10.71 6.91 10.8 7.16C10.89 7.41 10.93 7.65 10.93 7.87C10.93 8.14 10.85 8.41 10.7 8.68C10.55 8.95 10.33 9.24 10.05 9.53L9.36 10.24C9.25 10.35 9.2 10.48 9.2 10.63C9.2 10.72 9.22 10.8 9.25 10.89C9.29 10.97 9.33 11.04 9.36 11.11C9.69 11.72 10.15 12.39 10.75 13.11C11.36 13.83 12.01 14.51 12.72 15.15C12.8 15.22 12.88 15.27 12.96 15.31C13.05 15.35 13.14 15.37 13.24 15.37C13.4 15.37 13.54 15.31 13.66 15.2L14.34 14.53C14.64 14.23 14.94 14.01 15.22 13.86C15.5 13.7 15.77 13.62 16.05 13.62C16.27 13.62 16.5 13.66 16.76 13.75C17.02 13.84 17.29 13.98 17.58 14.18L20.37 16.17C20.69 16.39 20.92 16.65 21.06 16.95C21.19 17.25 21.26 17.56 21.26 17.88C21.26 18.04 21.97 18.17 21.97 18.33Z"/>
    </svg>`,

  upload: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 11L12 8L15 11"/>
      <path d="M12 8V16"/>
      <path d="M9 17H15"/>
      <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"/>
    </svg>`,

  image: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"/>
      <circle cx="9" cy="8" r="2"/>
      <path d="M2.67 18.95L8.55 15.03C9.17 14.62 10.06 14.65 10.64 15.11L11.03 15.42C11.67 15.93 12.65 15.93 13.29 15.42L18.07 11.6C18.71 11.09 19.69 11.09 20.33 11.6L22 12.94"/>
    </svg>`,

  trash: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 5.98C17.67 5.65 14.32 5.48 10.98 5.48C9 5.48 7.02 5.58 5.04 5.78L3 5.98"/>
      <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9.5 2 10.69 2H13.31C14.5 2 15.13 2.73 15.28 3.67L15.5 4.97"/>
      <path d="M18.85 9.14L18.2 19.21C18.09 20.78 17.5 22 15.1 22H8.9C6.5 22 5.91 20.78 5.8 19.21L5.15 9.14"/>
      <path d="M10.21 16.5H13.79"/>
      <path d="M9.5 12.5H14.5"/>
    </svg>`,

  bell: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12.02 2C8.34 2 5.36 4.98 5.36 8.66V10.76C5.36 11.44 5.08 12.46 4.73 13.04L3.46 15.16C2.68 16.47 3.22 17.93 4.66 18.41C9.44 20 14.6 20 19.38 18.41C20.75 17.95 21.31 16.39 20.58 15.16L19.31 13.04C18.96 12.46 18.68 11.43 18.68 10.76V8.66C18.68 5 15.7 2 12.02 2Z"/>
      <path d="M15.33 18.82C14.92 20.6 13.32 21.92 12 21.92C10.68 21.92 9.08 20.6 8.67 18.82"/>
    </svg>`,

  bellOff: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19.07 4.93L4.93 19.07"/>
      <path d="M10.83 2.5C11.22 2.18 11.61 2 12.02 2C15.7 2 18.68 5 18.68 8.66V10.76C18.68 11.43 18.96 12.46 19.31 13.04L20.58 15.16C21.05 15.95 20.89 16.89 20.31 17.55"/>
      <path d="M5.36 8.66C5.36 8.66 5.36 8.66 5.36 8.66C5.36 10.2 5.08 12.46 4.73 13.04L3.46 15.16C2.68 16.47 3.22 17.93 4.66 18.41C9.44 20 14.6 20 19.38 18.41"/>
      <path d="M15.33 18.82C14.92 20.6 13.32 21.92 12 21.92C10.68 21.92 9.08 20.6 8.67 18.82"/>
    </svg>`,

  play: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 12V7.6C4 4.22 6.39 2.84 9.32 4.53L13.13 6.73L16.94 8.93C19.87 10.62 19.87 13.38 16.94 15.07L13.13 17.27L9.32 19.47C6.39 21.16 4 19.78 4 16.4V12Z" fill="currentColor"/>
    </svg>`,

  pause: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H6.01C4.57 3 4 3.54 4 4.89V19.11C4 20.46 4.57 21 6.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z"/>
      <path d="M20 19.11V4.89C20 3.54 19.43 3 17.99 3H15.36C13.92 3 13.35 3.54 13.35 4.89V19.11C13.35 20.46 13.92 21 15.36 21H17.99C19.43 21 20 20.46 20 19.11Z"/>
    </svg>`,

  stop: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.11 20H4.89C3.54 20 3 19.43 3 17.99V6.01C3 4.57 3.54 4 4.89 4H19.11C20.46 4 21 4.57 21 6.01V17.99C21 19.43 20.46 20 19.11 20Z"/>
    </svg>`,

  mic: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 15C14.21 15 16 13.21 16 11V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11C8 13.21 9.79 15 12 15Z"/>
      <path d="M19 11C19 14.87 15.87 18 12 18C8.13 18 5 14.87 5 11"/>
      <path d="M12 18V22"/>
      <path d="M8 22H16"/>
    </svg>`,

  bolt: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.09 13.28H9.18V20.48C9.18 22.17 10.09 22.5 11.2 21.22L18.42 12.87C19.34 11.8 18.96 10.92 17.58 10.92H14.49V3.72C14.49 2.03 13.58 1.7 12.47 2.98L5.25 11.33C4.33 12.4 4.71 13.28 6.09 13.28Z"/>
    </svg>`,

  info: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"/>
      <path d="M12 8V13"/>
      <path d="M11.995 16H12.005"/>
    </svg>`,

  sliders: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.5 4.5H13.5"/>
      <path d="M10.5 19.5H13.5"/>
      <path d="M4 12H20"/>
      <path d="M7 7.5V16.5"/>
      <path d="M17 7.5V16.5"/>
    </svg>`,

  rotateCcw: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3.5 12C3.5 16.7 7.3 20.5 12 20.5C16.7 20.5 20.5 16.7 20.5 12C20.5 7.3 16.7 3.5 12 3.5C9.7 3.5 7.6 4.4 6 5.9L3.5 8.5"/>
      <path d="M3.5 3.5V8.5H8.5"/>
    </svg>`,

  touch: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"/>
      <path d="M12 8V12L15 15"/>
    </svg>`,

  target: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"/>
      <path d="M12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18Z"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>`,

  alertTriangle: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"/>
      <path d="M12 8V13"/>
      <path d="M11.995 16H12.005"/>
    </svg>`,

  ban: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"/>
      <path d="M4.93 4.93L19.07 19.07"/>
    </svg>`,

  hourglass: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"/>
      <path d="M12 6V12L15.5 14"/>
    </svg>`,

  inbox: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19.5 8.5V17.5C19.5 20.5 18 22 15 22H9C6 22 4.5 20.5 4.5 17.5V8.5C4.5 5.5 6 4 9 4H15C18 4 19.5 5.5 19.5 8.5Z"/>
      <path d="M7.5 11H16.5"/>
      <path d="M10 15H14"/>
    </svg>`,

  satellite: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"/>
      <path d="M16 8C17.33 9.33 18 10.67 18 12C18 13.33 17.33 14.67 16 16"/>
      <path d="M8 8C6.67 9.33 6 10.67 6 12C6 13.33 6.67 14.67 8 16"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>`,

  library: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 6.54V17.46C22 19.71 20.25 21 18.11 21H5.89C3.75 21 2 19.71 2 17.46V6.54C2 4.29 3.75 3 5.89 3H18.11C20.25 3 22 4.29 22 6.54Z"/>
      <path d="M7 3V21"/>
      <path d="M12 7H17"/>
      <path d="M12 11H17"/>
    </svg>`,

  checkCircle: (cls = "w-5 h-5") => `
    <svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z"/>
      <path d="M7.75 12L10.58 14.83L16.25 9.17"/>
    </svg>`
};
