type IconProps = { className?: string };

export function VisaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 24" className={className} aria-label="Visa">
      <rect width="48" height="24" rx="4" fill="#1A1F71" />
      <text
        x="24"
        y="16.5"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fontWeight="700"
        fontSize="11"
        fill="#ffffff"
      >
        VISA
      </text>
    </svg>
  );
}

export function MastercardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 24" className={className} aria-label="Mastercard">
      <rect width="48" height="24" rx="4" fill="#F4F4F5" />
      <circle cx="20" cy="12" r="7" fill="#EB001B" />
      <circle cx="28" cy="12" r="7" fill="#F79E1B" fillOpacity="0.9" />
    </svg>
  );
}

export function PaypalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 24" className={className} aria-label="PayPal">
      <rect width="48" height="24" rx="4" fill="#F4F4F5" />
      <text
        x="24"
        y="16"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontStyle="italic"
        fontSize="10"
        fill="#003087"
      >
        Pay
        <tspan fill="#009cde">Pal</tspan>
      </text>
    </svg>
  );
}

export function StripeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 24" className={className} aria-label="Stripe">
      <rect width="48" height="24" rx="4" fill="#635BFF" />
      <text
        x="24"
        y="16"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="10"
        fill="#ffffff"
      >
        stripe
      </text>
    </svg>
  );
}
