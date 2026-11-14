import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sliders, Columns, Layers } from 'lucide-react';

interface ImageComparisonViewerProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const ImageComparisonViewer: React.FC<ImageComparisonViewerProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Earlier',
  afterLabel = 'Later',
}) => {
  const [mode, setMode] = useState<'slider' | 'sideBySide' | 'overlay'>('slider');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 - 100%
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(clamped);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDraggingRef.current && e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingRef.current) {
      handleMove(e.clientX);
    }
  }, [handleMove]);

  const handleStop = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleStop);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleStop);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleStop);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleStop);
    };
  }, [handleMouseMove, handleStop, handleTouchMove]);

  return (
    <div className="space-y-4">
      {/* Segmented Control Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 p-1 bg-[#EFECE5] rounded-xl">
          <button
            onClick={() => setMode('slider')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium rounded-lg transition-all cursor-pointer ${
              mode === 'slider'
                ? 'bg-white text-[#16281D] shadow-xs'
                : 'text-[#687C6E] hover:text-[#16281D]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Split Slider</span>
          </button>

          <button
            onClick={() => setMode('sideBySide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium rounded-lg transition-all cursor-pointer ${
              mode === 'sideBySide'
                ? 'bg-white text-[#16281D] shadow-xs'
                : 'text-[#687C6E] hover:text-[#16281D]'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>

          <button
            onClick={() => setMode('overlay')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium rounded-lg transition-all cursor-pointer ${
              mode === 'overlay'
                ? 'bg-white text-[#16281D] shadow-xs'
                : 'text-[#687C6E] hover:text-[#16281D]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overlay Blend</span>
          </button>
        </div>

        <div className="text-xs font-sans text-[#76877A]">
          {mode === 'slider' && 'Drag handle across the plant'}
          {mode === 'overlay' && 'Adjust opacity blend'}
        </div>
      </div>

      {/* Mode 1: Interactive Split Slider with clip-path */}
      {mode === 'slider' && (
        <div
          ref={containerRef}
          onMouseDown={(e) => {
            isDraggingRef.current = true;
            handleMove(e.clientX);
          }}
          onTouchStart={(e) => {
            isDraggingRef.current = true;
            if (e.touches.length > 0) handleMove(e.touches[0].clientX);
          }}
          className="relative rounded-3xl overflow-hidden aspect-[4/3] max-h-[560px] select-none cursor-ew-resize border border-[#DCD6C9] shadow-sm bg-[#EAE5DC]"
        >
          {/* Base Layer: Later Image */}
          <img
            src={afterImage}
            alt={afterLabel}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover select-none"
          />

          {/* Top Layer: Earlier Image using clip-path */}
          <div
            className="absolute inset-0 select-none overflow-hidden"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            }}
          >
            <img
              src={beforeImage}
              alt={beforeLabel}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
          </div>

          {/* Draggable Divider Line & Knob */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-white shadow-xl z-20 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#16281D] border-2 border-white text-white flex items-center justify-center text-[10px] font-sans shadow-lg">
              ◀▶
            </div>
          </div>

          {/* Labels on Top */}
          <div className="absolute top-4 left-4 bg-[#16281D]/80 backdrop-blur-xs text-[#FAF8F5] text-xs font-sans px-3 py-1.5 rounded-lg z-10 pointer-events-none">
            {beforeLabel}
          </div>
          <div className="absolute top-4 right-4 bg-[#16281D]/80 backdrop-blur-xs text-[#FAF8F5] text-xs font-sans px-3 py-1.5 rounded-lg z-10 pointer-events-none">
            {afterLabel}
          </div>
        </div>
      )}

      {/* Mode 2: Side-by-Side Large Photos */}
      {mode === 'sideBySide' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-sans font-medium text-[#76877A] block px-1">{beforeLabel}</span>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-[#DCD6C9] bg-[#EAE5DC] shadow-xs">
              <img
                src={beforeImage}
                alt={beforeLabel}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-sans font-medium text-[#76877A] block px-1">{afterLabel}</span>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-[#DCD6C9] bg-[#EAE5DC] shadow-xs">
              <img
                src={afterImage}
                alt={afterLabel}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Overlay Blend */}
      {mode === 'overlay' && (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] max-h-[560px] border border-[#DCD6C9] bg-[#EAE5DC] shadow-sm">
            <img
              src={beforeImage}
              alt={beforeLabel}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <img
              src={afterImage}
              alt={afterLabel}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-100"
              style={{ opacity: overlayOpacity }}
            />

            <div className="absolute top-4 left-4 bg-[#16281D]/80 backdrop-blur-xs text-[#FAF8F5] text-xs font-sans px-3 py-1.5 rounded-lg z-10 pointer-events-none">
              Blend View
            </div>
          </div>

          <div className="p-4 bg-[#FAF8F5] border border-[#E7E2D7] rounded-2xl flex items-center gap-4">
            <span className="text-xs font-sans text-[#76877A] shrink-0 font-medium">{beforeLabel}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
              className="w-full accent-[#16281D] cursor-pointer"
              aria-label="Overlay blend slider"
            />
            <span className="text-xs font-sans text-[#76877A] shrink-0 font-medium">{afterLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
};
