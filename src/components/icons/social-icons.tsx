type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TwitterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.9 3H21l-6.55 7.49L22.2 21h-6.03l-4.72-6.17L5.98 21H3.87l7.01-8.01L2.9 3h6.18l4.27 5.64L18.9 3zm-1.06 16.17h1.12L7.24 4.76H6.03l11.81 14.41z" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14 9V6.5c0-.83.67-1.5 1.5-1.5H17V2h-2.5C11.9 2 10 3.9 10 6.5V9H7v3h3v10h4V12h2.8l.7-3H14z" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GoogleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.88c2.27-2.09 3.57-5.17 3.57-8.84z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.92H1.3v3.11C3.26 21.3 7.3 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.31 14.31A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.58.4-2.31V6.58H1.3A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.3 5.42l4.01-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.6 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.3 0 3.26 2.7 1.3 6.58l4.01 3.11C6.25 6.87 8.89 4.77 12 4.77z"
      />
    </svg>
  );
}

export function AppleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.36 1.43c0 1.14-.42 2.2-1.24 3.07-.9.98-2.14 1.62-3.32 1.52-.15-1.13.42-2.31 1.2-3.1.87-.88 2.34-1.55 3.36-1.49zM20.7 17.2c-.5 1.15-.74 1.66-1.38 2.68-.9 1.43-2.16 3.21-3.73 3.22-1.39.02-1.75-.9-3.64-.9-1.88 0-2.29.88-3.68.92-1.57.05-2.76-1.55-3.66-2.97-2.51-3.94-2.77-8.57-1.22-11.03 1.1-1.75 2.84-2.78 4.48-2.78 1.66 0 2.7.92 4.08.92 1.33 0 2.14-.93 4.08-.93 1.46 0 3.01.8 4.11 2.17-3.62 1.98-3.03 7.16.56 8.7z" />
    </svg>
  );
}
