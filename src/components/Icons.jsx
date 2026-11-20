const S = ({ children, className = 'h-5 w-5', sw = 1.6, ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} {...p}>{children}</svg>
)
export const Bag = (p) => <S {...p}><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></S>
export const Menu = (p) => <S {...p}><path d="M4 7h16M4 12h16M4 17h10" /></S>
export const Close = (p) => <S {...p}><path d="M6 6l12 12M18 6 6 18" /></S>
export const Arrow = (p) => <S {...p}><path d="M5 12h14M13 6l6 6-6 6" /></S>
export const Plus = (p) => <S {...p}><path d="M12 5v14M5 12h14" /></S>
export const Minus = (p) => <S {...p}><path d="M5 12h14" /></S>
export const Pin = (p) => <S {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></S>
export const Phone = (p) => <S {...p}><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></S>
export const Battery = (p) => <S {...p}><rect x="3" y="7" width="16" height="10" rx="2" /><path d="M21 11v2M10 9l-2 3h4l-2 3" /></S>
export const Shield = (p) => <S {...p}><path d="M12 3 5 6v6c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></S>
export const Strap = (p) => <S {...p}><path d="M8 3h8l-1 5H9L8 3ZM8 21h8l-1-5H9l-1 5Z" /><circle cx="12" cy="12" r="4" /></S>
export const Check = (p) => <S {...p}><path d="m5 12 4 4 10-10" /></S>
export const Gift = (p) => <S {...p}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 3.5 8 4.5 9 8 12 8Zm0 0s1.5-4.5 4-3.5S15 8 12 8Z" /></S>
export const Plane = (p) => <S {...p}><path d="M10.5 13.5 3 11l1.5-1.5 8 1 4-4.5a2 2 0 0 1 3 3l-4.5 4 1 8L15 22.5l-2.5-7.5" /></S>
export const Spark = (p) => <S {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></S>
export const Truck = (p) => <S {...p}><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></S>
export const Search = (p) => <S {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></S>
export const Trash = (p) => <S {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></S>
export const Edit = (p) => <S {...p}><path d="M4 20h4L19 9l-4-4L4 16v4Z" /></S>
export const Eye = (p) => <S {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></S>
export const Logout = (p) => <S {...p}><path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10" /></S>
export const Clock = (p) => <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></S>
export const Upload = (p) => <S {...p}><path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" /></S>
export const WhatsApp = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor"><path d="M16.04 3C9.01 3 3.3 8.7 3.3 15.72c0 2.25.6 4.45 1.72 6.38L3.2 28.8l6.88-1.8a12.7 12.7 0 0 0 5.96 1.5h.01c7.02 0 12.73-5.71 12.73-12.73 0-3.4-1.33-6.6-3.73-9A12.64 12.64 0 0 0 16.04 3Zm0 23.3h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.08 1.07 1.09-3.98-.25-.41a10.55 10.55 0 0 1-1.62-5.55c0-5.84 4.75-10.6 10.6-10.6 2.83 0 5.49 1.1 7.49 3.11a10.52 10.52 0 0 1 3.1 7.49c0 5.84-4.76 10.59-10.53 10.59Zm5.8-7.93c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.56-1.58a9.6 9.6 0 0 1-1.77-2.2c-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65s1.14 3.07 1.3 3.28c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.2 2 .12.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" /></svg>
)
export const Facebook = ({ className = 'h-5 w-5' }) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M13.5 21v-7.5H16l.5-3h-3V8.6c0-.9.3-1.6 1.6-1.6h1.6V4.3c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.2H7.5v3h2.6V21h3.4Z" /></svg>)
export const Instagram = (p) => <S {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r=".6" fill="currentColor" /></S>
