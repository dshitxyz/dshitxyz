import React from 'react';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

/**
 * DSHIT Mascot Component
 * The official face of dshit.xyz
 * Mr. Hankey × Queen Latifah × Gumby
 * "if it stinks, it ships"
 */
export const Mascot: React.FC<MascotProps> = ({
  size = 'md',
  className = '',
  animated = true
}) => {
  const sizeMap = {
    sm: 'w-24 h-32',
    md: 'w-40 h-56',
    lg: 'w-64 h-96'
  };

  const animationClass = animated ? 'animate-bounce-gentle' : '';

  return (
    <div className={`${sizeMap[size]} ${animationClass} ${className}`}>
      <svg
        viewBox="0 0 400 600"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        {/* Background */}
        <rect width="400" height="600" fill="#1a1a1a" />

        {/* Define gradients */}
        <defs>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#2d7a2d', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="brownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#8B4513', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#5c2d0f', stopOpacity: 1 }} />
          </linearGradient>
          <radialGradient id="shine" cx="30%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="200" cy="560" rx="80" ry="15" fill="#000000" opacity="0.3" />

        {/* Main body */}
        <path
          d="M 150 250 Q 140 280 145 320 Q 150 360 165 380 L 235 380 Q 250 360 255 320 Q 260 280 250 250 Q 240 240 200 240 Q 160 240 150 250"
          fill="url(#brownGrad)"
          stroke="#5c2d0f"
          strokeWidth="3"
        />

        {/* Body shine */}
        <ellipse cx="200" cy="300" rx="35" ry="50" fill="url(#shine)" />

        {/* Ribbed texture */}
        <g stroke="#5c2d0f" strokeWidth="2" opacity="0.6" fill="none">
          <path d="M 160 270 Q 200 275 240 270" />
          <path d="M 158 290 Q 200 295 242 290" />
          <path d="M 157 310 Q 200 315 243 310" />
          <path d="M 160 330 Q 200 335 240 330" />
          <path d="M 165 350 Q 200 355 235 350" />
        </g>

        {/* Head */}
        <ellipse cx="200" cy="150" rx="60" ry="70" fill="url(#greenGrad)" stroke="#1a5c1a" strokeWidth="3" />

        {/* Head shine */}
        <ellipse cx="170" cy="110" rx="25" ry="35" fill="url(#shine)" />

        {/* Left eye */}
        <circle cx="165" cy="130" r="12" fill="#ffffff" />
        <circle cx="165" cy="130" r="8" fill="#000000" />
        <circle cx="168" cy="128" r="3" fill="#ffffff" />

        {/* Right eye */}
        <circle cx="235" cy="135" r="12" fill="#ffffff" />
        <circle cx="235" cy="135" r="8" fill="#000000" />
        <circle cx="237" cy="133" r="3" fill="#ffffff" />

        {/* Eyebrows */}
        <path d="M 150 110 Q 165 100 175 105" stroke="#1a5c1a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 225 105 Q 240 100 250 110" stroke="#1a5c1a" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Nose */}
        <g fill="#8B4513">
          <circle cx="185" cy="155" r="4" />
          <circle cx="215" cy="155" r="4" />
        </g>

        {/* Mouth */}
        <path d="M 170 175 Q 200 190 230 175" stroke="#1a5c1a" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M 175 180 Q 200 188 225 180" stroke="#000000" strokeWidth="2" fill="none" opacity="0.5" />

        {/* Left arm */}
        <path d="M 140 280 Q 80 250 60 200" stroke="#4CAF50" strokeWidth="18" fill="none" strokeLinecap="round" />
        <circle cx="60" cy="200" r="14" fill="url(#greenGrad)" stroke="#1a5c1a" strokeWidth="2" />

        {/* Right arm */}
        <path d="M 260 270 Q 320 240 340 160" stroke="#4CAF50" strokeWidth="18" fill="none" strokeLinecap="round" />
        <circle cx="340" cy="160" r="14" fill="url(#greenGrad)" stroke="#1a5c1a" strokeWidth="2" />

        {/* Left foot */}
        <ellipse cx="160" cy="410" rx="25" ry="18" fill="url(#brownGrad)" stroke="#5c2d0f" strokeWidth="2" />
        <g fill="#5c2d0f" opacity="0.4">
          <circle cx="150" cy="420" r="5" />
          <circle cx="160" cy="422" r="5" />
          <circle cx="170" cy="420" r="5" />
        </g>

        {/* Right foot */}
        <ellipse cx="240" cy="410" rx="25" ry="18" fill="url(#brownGrad)" stroke="#5c2d0f" strokeWidth="2" />
        <g fill="#5c2d0f" opacity="0.4">
          <circle cx="230" cy="420" r="5" />
          <circle cx="240" cy="422" r="5" />
          <circle cx="250" cy="420" r="5" />
        </g>

        {/* Crown */}
        <g>
          <path d="M 140 80 L 170 40 L 200 30 L 230 40 L 260 80" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
          <circle cx="170" cy="50" r="6" fill="#FF69B4" stroke="#DAA520" strokeWidth="1" />
          <circle cx="200" cy="35" r="8" fill="#FF69B4" stroke="#DAA520" strokeWidth="1" />
          <circle cx="230" cy="50" r="6" fill="#FF69B4" stroke="#DAA520" strokeWidth="1" />
        </g>

        {/* Bulge detail */}
        <ellipse cx="200" cy="340" rx="22" ry="35" fill="#6B3410" opacity="0.6" stroke="#5c2d0f" strokeWidth="2" />
        <path d="M 190 340 Q 200 360 210 340" stroke="#5c2d0f" strokeWidth="2" fill="none" opacity="0.7" />

        {/* Glitch lines */}
        <g stroke="#FF0000" strokeWidth="1" opacity="0.3">
          <line x1="140" y1="200" x2="145" y2="205" />
          <line x1="250" y1="250" x2="255" y2="255" />
        </g>

        {/* Text */}
        <text
          x="200"
          y="520"
          fontFamily="'Bebas Neue', sans-serif"
          fontSize="24"
          fill="#F4D03F"
          textAnchor="middle"
          fontWeight="bold"
          letterSpacing="2"
        >
          DSHIT
        </text>
      </svg>
    </div>
  );
};

Mascot.displayName = 'Mascot';
