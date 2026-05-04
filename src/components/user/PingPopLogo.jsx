import { getBadgeTheme } from './badgeTheme';

function PingPopLogo({ className = '', level = 10 }) {
  const badge = getBadgeTheme(level);

  return (
    <svg viewBox="0 0 64 64" className={className} aria-label="PingPop badge character">
      <path
        d="M32 14C43.3 14 51.5 22 51.5 32.2C51.5 43.9 41.9 51.8 33.9 58.7C32.9 59.6 31.1 59.6 30.1 58.7C22 51.8 12.5 43.9 12.5 32.2C12.5 22 20.7 14 32 14Z"
        fill="#FFD23F"
      />
      <path
        d="M25.2 10.8C22.6 8.1 18.2 8 15.8 10.3C13.7 12.3 13.7 15.6 15.5 17.8C17.2 19.8 20.6 20.2 23 18.7L25.2 17.2V10.8Z"
        fill={badge.ribbonColor}
      />
      <path
        d="M38.8 10.8C41.4 8.1 45.8 8 48.2 10.3C50.3 12.3 50.3 15.6 48.5 17.8C46.8 19.8 43.4 20.2 41 18.7L38.8 17.2V10.8Z"
        fill={badge.ribbonColor}
      />
      <rect x="29.5" y="9" width="5" height="8" rx="2.5" fill={badge.ribbonColor} />
      <circle cx="32" cy="13.3" r="2.9" fill="#FFE7B1" stroke="#F0A933" strokeWidth="1.4" />
      <circle cx="32" cy="31.8" r="13" fill="#FFF8D6" />
      <circle cx="26.3" cy="30.6" r="2.1" fill="#0F5C66" />
      <circle cx="37.7" cy="30.6" r="2.1" fill="#0F5C66" />
      <path
        d="M27.2 36C28.7 38 30.2 38.9 32 38.9C33.8 38.9 35.3 38 36.8 36"
        fill="none"
        stroke="#0F5C66"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="32" cy="44.3" r="5.5" fill="#FFF7D1" stroke="#24C2B7" strokeWidth="1.8" />
      <path d="M31.7 39.9L28.7 46.6L34.8 44.7Z" fill="#F25B5B" />
      <path d="M31.7 39.9L34.8 44.7L30.6 48.1Z" fill="#0F5C66" />
      <circle cx="32" cy="44.3" r="1.1" fill="#0F5C66" />
    <path
        d="M16 18.8C14.9 20.3 14.1 22 13.6 23.9"
        fill="none"
        stroke="#FFE898"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18.8 16.1C19.8 15.4 20.8 14.9 21.9 14.6"
        fill="none"
        stroke="#FFE898"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default PingPopLogo;
