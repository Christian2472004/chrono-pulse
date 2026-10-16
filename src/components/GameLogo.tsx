import React from 'react';

interface GameLogoProps {
  /** Tailwind sizing classes (default: w-20 h-20) */
  className?: string;
  /**
   * Decorative brand mark (default true): hidden from screen readers,
   * since the wordmark "CHRONO // PULSE" next to it already states the name.
   */
  decorative?: boolean;
  /** Accessible label when decorative is false. */
  title?: string;
}

/**
 * Animated neon emblem: a clock ring forming a "C", crossed by the
 * lightning-slash bolt, with an orbiting energy comet and flickering sparks.
 * Animation classes live in src/index.css (respects prefers-reduced-motion).
 */
export const GameLogo: React.FC<GameLogoProps> = ({
  className = 'w-20 h-20',
  decorative = true,
  title = 'CHRONO-PULSE',
}) => (
  <svg
    viewBox="0 0 128 128"
    className={className}
    {...(decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': title })}
  >
    <defs>
      <radialGradient id="cpBg" cx="64" cy="48" r="80" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#101a33" />
        <stop offset="0.65" stopColor="#0a1021" />
        <stop offset="1" stopColor="#04060d" />
      </radialGradient>
      <linearGradient id="cpRing" x1="24" y1="18" x2="104" y2="110" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#22d3ee" />
        <stop offset="0.52" stopColor="#818cf8" />
        <stop offset="1" stopColor="#ec4899" />
      </linearGradient>
      <linearGradient id="cpBolt" x1="78" y1="30" x2="48" y2="98" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#f0fdff" />
        <stop offset="0.5" stopColor="#67e8f9" />
        <stop offset="1" stopColor="#a78bfa" />
      </linearGradient>
      <radialGradient id="cpCore" cx="64" cy="64" r="34" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#22d3ee" stopOpacity="0.25" />
        <stop offset="0.55" stopColor="#6366f1" stopOpacity="0.10" />
        <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
      </radialGradient>
      <filter id="cpGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Background plate */}
    <rect x="4" y="4" width="120" height="120" rx="28" fill="url(#cpBg)" />
    <rect
      x="4.75" y="4.75" width="118.5" height="118.5" rx="27.25"
      fill="none" stroke="url(#cpRing)" strokeOpacity="0.45" strokeWidth="1.5"
    />

    {/* Core glow */}
    <circle cx="64" cy="64" r="34" fill="url(#cpCore)" />

    {/* Clock ticks (12 / 9 / 6 o'clock) */}
    <g stroke="url(#cpRing)" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.75">
      <line x1="64" y1="17.5" x2="64" y2="23" />
      <line x1="17.5" y1="64" x2="23" y2="64" />
      <line x1="64" y1="105" x2="64" y2="110.5" />
    </g>

    {/* Chrono ring forming a "C" */}
    <path
      className="cp-logo-ring"
      d="M87.8 35.7 A37 37 0 1 0 87.8 92.3"
      fill="none" stroke="url(#cpRing)" strokeWidth="7.5" strokeLinecap="round"
      filter="url(#cpGlow)"
    />

    {/* Orbiting energy comet */}
    <path
      className="cp-logo-run"
      d="M87.8 35.7 A37 37 0 1 0 87.8 92.3"
      fill="none" stroke="#e0f2fe" strokeWidth="6.5" strokeLinecap="round"
      strokeDasharray="26 206.5" strokeDashoffset="0" opacity="0.9"
      filter="url(#cpGlow)"
    />

    {/* Slash bolt */}
    <path
      className="cp-logo-bolt"
      d="M70 34 L49 66 L61 66 L54 94 L80 59 L67 59 Z"
      fill="url(#cpBolt)" stroke="#e0f2fe" strokeWidth="1" strokeLinejoin="round" strokeOpacity="0.5"
      filter="url(#cpGlow)"
    />

    {/* Sparks */}
    <circle className="cp-logo-spark" cx="95" cy="28" r="2.6" fill="#67e8f9" />
    <circle className="cp-logo-spark cp-logo-spark-2" cx="95" cy="100" r="2.2" fill="#f472b6" />
  </svg>
);
