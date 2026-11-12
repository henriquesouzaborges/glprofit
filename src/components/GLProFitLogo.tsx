import React, { useState } from 'react';
import logoOficial from '../assets/images/gl-pro-fit-logo-oficial.png';

interface GLProFitLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'official' | 'vector' | 'image';
}

export const GLProFitLogo: React.FC<GLProFitLogoProps> = ({
  className = '',
  theme = 'dark',
  size = 'md',
  showSubtitle = true,
  variant = 'official'
}) => {
  const [imageError, setImageError] = useState(false);

  // Dimension mapping
  const dimensions = {
    sm: { width: 180, height: 50 },
    md: { width: 260, height: 75 },
    lg: { width: 340, height: 95 },
    xl: { width: 440, height: 125 },
  }[size];

  const gColor = theme === 'dark' ? '#FFFFFF' : '#0F172A';
  const lColor = '#2563EB'; // Royal blue matching GL logo
  const textColor = theme === 'dark' ? '#F8FAFC' : '#0F172A';
  const subtextColor = theme === 'dark' ? '#94A3B8' : '#334155';
  const ringColor = '#2563EB';
  const darkArcColor = theme === 'dark' ? '#E2E8F0' : '#0F172A';

  // Logomarca oficial (PNG com fundo transparente, sem recompressão)
  if (variant === 'official') {
    return (
      <img
        src={logoOficial}
        alt="GL PRO FIT — Performance • Análise • Controle"
        draggable={false}
        className={`block h-auto select-none ${className}`}
        style={{ width: '100%', maxWidth: dimensions.width * 1.05 }}
      />
    );
  }

  // If image variant requested and available
  if (variant === 'image' && !imageError) {
    return (
      <div className={`inline-flex items-center justify-center p-2 rounded-2xl bg-white/95 shadow-md ${className}`}>
        <img
          src="/logo_gl_profit.jpg"
          alt="GL PRO FIT"
          className="h-auto object-contain rounded-xl"
          style={{ maxHeight: dimensions.height * 1.3, maxWidth: dimensions.width * 1.2 }}
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 460 140"
        className="w-full h-auto max-w-full drop-shadow-sm"
        style={{ maxHeight: dimensions.height * 1.5, minWidth: dimensions.width }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Blue line gradient */}
          <linearGradient id="glBlueLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="70%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.2" />
          </linearGradient>

          {/* Glow filter for heartbeat */}
          <filter id="ecgGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#2563EB" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* ============================================================== */}
        {/* LEFT EMBLEM: Circular crest with Runner & Heartbeat (ECG)      */}
        {/* ============================================================== */}
        <g transform="translate(10, 10)">
          {/* Outer circle top/left blue arc */}
          <path
            d="M 54 12 A 44 44 0 0 0 13 60"
            stroke={ringColor}
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Outer circle bottom/right arc */}
          <path
            d="M 28 86 A 44 44 0 0 0 88 52"
            stroke={darkArcColor}
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Runner Silhouette */}
          <g fill={darkArcColor}>
            {/* Runner Head */}
            <circle cx="68" cy="27" r="7.5" />

            {/* Runner Torso in dynamic forward lean */}
            <path d="M 64 35 C 59 42, 54 48, 50 56 L 43 53 C 40 48, 46 41, 55 36 Z" />
            <path d="M 64 36 L 56 58 L 47 57 C 51 46, 57 39, 64 36 Z" />
            
            {/* Back Arm (right arm pumped back) */}
            <path d="M 60 41 L 78 48 L 76 53 L 57 44 Z" />
            <circle cx="78" cy="49" r="3.5" />
            
            {/* Front Arm (left arm forward) */}
            <path d="M 53 43 L 42 41 L 46 36 L 55 38 Z" />
            <circle cx="42" cy="40" r="3" />
            
            {/* Front Leg (bent forward, knee driving forward) */}
            <path d="M 50 56 C 58 64, 66 69, 73 70 L 69 75 C 62 73, 54 67, 47 58 Z" />
            <path d="M 72 70 L 71 83 L 67 82 L 68 72 Z" />
            
            {/* Back Leg (kicking back in stride) */}
            <path d="M 47 58 L 33 72 L 29 68 L 44 56 Z" />
            <path d="M 31 71 L 24 87 L 20 84 L 27 69 Z" />
            <path d="M 23 86 L 19 92 L 17 88 L 22 84 Z" />
          </g>

          {/* Royal Blue ECG / Heartbeat pulse wave cutting horizontally through runner */}
          <path
            d="M 2 54 L 26 54 L 32 50 L 37 68 L 44 32 L 51 64 L 56 54 L 98 54"
            stroke="#2563EB"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#ecgGlow)"
          />
        </g>

        {/* ============================================================== */}
        {/* RIGHT SIDE: GL PRO FIT Typography and Subtitle                */}
        {/* ============================================================== */}
        <g transform="translate(130, 0)">
          {/* Main "G L" Athletic Letters */}
          <g>
            {/* "G" - Sporty Bold Italic */}
            <text
              x="0"
              y="74"
              fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
              fontSize="78"
              fontWeight="900"
              fontStyle="italic"
              letterSpacing="-2"
              fill={gColor}
            >
              G
            </text>

            {/* "L" - Royal Blue Athletic Italic */}
            <text
              x="62"
              y="74"
              fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
              fontSize="78"
              fontWeight="900"
              fontStyle="italic"
              letterSpacing="-2"
              fill={lColor}
            >
              L
            </text>
          </g>

          {/* "PRO FIT" Sub-heading */}
          <text
            x="32"
            y="98"
            fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
            fontSize="23"
            fontWeight="900"
            fontStyle="italic"
            letterSpacing="6"
            fill={textColor}
          >
            PRO FIT
          </text>

          {/* Thin horizontal blue line */}
          <line
            x1="-8"
            y1="107"
            x2="230"
            y2="107"
            stroke="url(#glBlueLine)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Subtitle: PERFORMANCE • ANÁLISE • CONTROLE */}
          {showSubtitle && (
            <g transform="translate(-4, 122)">
              <text
                x="0"
                y="0"
                fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
                fontSize="11.5"
                fontWeight="800"
                letterSpacing="1.8"
                fill={subtextColor}
              >
                PERFORMANCE
              </text>
              <circle cx="103" cy="-4" r="2.2" fill="#2563EB" />
              <text
                x="112"
                y="0"
                fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
                fontSize="11.5"
                fontWeight="800"
                letterSpacing="1.8"
                fill={subtextColor}
              >
                ANÁLISE
              </text>
              <circle cx="180" cy="-4" r="2.2" fill="#2563EB" />
              <text
                x="189"
                y="0"
                fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
                fontSize="11.5"
                fontWeight="800"
                letterSpacing="1.8"
                fill={subtextColor}
              >
                CONTROLE
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

