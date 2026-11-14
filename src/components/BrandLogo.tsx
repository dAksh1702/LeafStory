import React from 'react';

export interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'wordmark' | 'responsive';
  className?: string;
  symbolClassName?: string;
  textClassName?: string;
  showVersion?: boolean;
  versionText?: string;
  invert?: boolean;
}

/**
 * LeafStory Botanical Brand Mark
 * Combines an unfurling leaf with an inner observational lens curve,
 * representing growth, mindful observation, and the unfolding story of living things.
 */
export const LeafStoryMark: React.FC<{ className?: string; invert?: boolean }> = ({
  className = 'w-6 h-6',
  invert = false,
}) => {
  const primaryStroke = invert ? '#FAF8F5' : '#16281D';
  const accentFill = invert ? 'rgba(216, 230, 216, 0.22)' : 'rgba(32, 61, 42, 0.12)';
  const innerVein = invert ? '#C2D9C5' : '#4E6153';

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer subtle circular aura representing observing attention & time cycle */}
      <circle
        cx="16"
        cy="16"
        r="14.5"
        stroke={primaryStroke}
        strokeWidth="1"
        strokeOpacity={invert ? '0.25' : '0.15'}
        strokeDasharray="2 2"
      />

      {/* Main sculptural leaf silhouette: gently tilted, organic natural poise */}
      <path
        d="M16 4.5C16 4.5 9 10 9 18.5C9 22.6421 12.134 26 16 26.5C19.866 26 23 22.6421 23 18.5C23 13 18.5 7 16 4.5Z"
        fill={accentFill}
        stroke={primaryStroke}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central observational aperture vein: arches gently like an observant pupil / stem */}
      <path
        d="M16 26V11.5"
        stroke={innerVein}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M16 16.5C18.2 15 20 12.8 20.5 10.5"
        stroke={innerVein}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M16 20C13.8 18.8 12 17.5 11.5 15.5"
        stroke={innerVein}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Tender growth node */}
      <circle cx="16" cy="11.5" r="1.25" fill={primaryStroke} />
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  className = '',
  symbolClassName = 'w-7 h-7',
  textClassName = '',
  showVersion = true,
  versionText = '3.0',
  invert = false,
}) => {
  const textColor = invert ? 'text-[#FAF8F5]' : 'text-[#16281D]';
  const subtextColor = invert ? 'text-[#C5D5C9]' : 'text-[#76877A]';

  // Compact only (icon only)
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center justify-center shrink-0 ${className}`} title="LeafStory">
        <LeafStoryMark className={symbolClassName} invert={invert} />
      </div>
    );
  }

  // Wordmark only
  if (variant === 'wordmark') {
    return (
      <div className={`inline-flex items-baseline gap-1.5 ${className}`}>
        <span className={`font-serif tracking-tight text-xl sm:text-2xl font-normal ${textColor} ${textClassName}`}>
          LeafStory
        </span>
        {showVersion && (
          <span className={`text-[10px] font-sans font-medium uppercase tracking-widest ${subtextColor}`}>
            {versionText}
          </span>
        )}
      </div>
    );
  }

  // Responsive (compact on mobile < 768px, full on tablet/desktop)
  if (variant === 'responsive') {
    return (
      <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
        <LeafStoryMark className={symbolClassName} invert={invert} />
        <div className="hidden sm:flex items-baseline gap-1.5">
          <span className={`font-serif tracking-tight text-xl sm:text-2xl font-normal ${textColor} ${textClassName}`}>
            LeafStory
          </span>
          {showVersion && (
            <span className={`text-[10px] font-sans font-medium uppercase tracking-widest ${subtextColor}`}>
              {versionText}
            </span>
          )}
        </div>
      </div>
    );
  }

  // Full default (mark + wordmark)
  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      <LeafStoryMark className={symbolClassName} invert={invert} />
      <div className="flex items-baseline gap-1.5">
        <span className={`font-serif tracking-tight text-xl sm:text-2xl font-normal leading-none ${textColor} ${textClassName}`}>
          LeafStory
        </span>
        {showVersion && (
          <span className={`text-[10px] font-sans font-medium uppercase tracking-widest ${subtextColor}`}>
            {versionText}
          </span>
        )}
      </div>
    </div>
  );
};
