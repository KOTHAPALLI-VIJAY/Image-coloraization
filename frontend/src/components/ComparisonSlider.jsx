import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Columns, Eye, Maximize2, Minimize2, MoveHorizontal } from 'lucide-react';

/**
 * High-performance Before/After Image Comparison Slider.
 * Supports touch, mouse drag, keyboard navigation, and side-by-side mode.
 */
export default function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER',
  aspectRatio = null,
  initialPosition = 50,
  showModeToggle = true,
  className = ''
}) {
  const [sliderPos, setSliderPos] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' | 'side-by-side'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // Position calculation
  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    handleMove(e.clientX);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPos((prev) => Math.min(100, prev + 5));
    }
  };

  // ESC to exit fullscreen
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* View controls toolbar */}
      {showModeToggle && (
        <div className="flex items-center justify-between w-full max-w-4xl mb-3 px-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
              <MoveHorizontal className="w-3.5 h-3.5 text-purple-400" />
              <span>Drag slider or click anywhere to compare</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode(viewMode === 'slider' ? 'side-by-side' : 'slider')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
              title="Toggle Slider vs Side-by-Side"
            >
              <Columns className="w-3.5 h-3.5 text-blue-400" />
              <span>{viewMode === 'slider' ? 'Side-by-Side' : 'Split Slider'}</span>
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Display Container */}
      <div
        className={`w-full max-w-4xl transition-all duration-300 ${
          isFullscreen
            ? 'fixed inset-0 z-50 max-w-none w-screen h-screen bg-black/95 p-6 flex flex-col justify-center items-center'
            : ''
        }`}
      >
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-slate-800/90 text-white hover:bg-slate-700 border border-slate-600 shadow-xl"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        )}

        {viewMode === 'slider' ? (
          // Interactive Split Slider View
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="slider"
            aria-valuenow={sliderPos}
            aria-valuemin={0}
            aria-valuemax={100}
            className={`relative w-full overflow-hidden rounded-2xl bg-slate-900 border border-white/10 shadow-2xl cursor-ew-resize focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
              isFullscreen ? 'max-h-[85vh] max-w-5xl' : ''
            }`}
            style={{
              aspectRatio: aspectRatio ? `${aspectRatio}` : 'auto'
            }}
          >
            {/* After Image (Background - Colorized) */}
            <img
              src={afterImage}
              alt={afterLabel}
              draggable={false}
              className="w-full h-full object-contain block pointer-events-none"
            />

            {/* After Badge */}
            <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-md text-xs font-semibold tracking-wider bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 uppercase shadow-lg">
              {afterLabel}
            </div>

            {/* Before Image (Clipped Overlay - Grayscale) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={beforeImage}
                alt={beforeLabel}
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain max-w-none pointer-events-none"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                  height: containerRef.current ? `${containerRef.current.clientHeight}px` : '100%'
                }}
              />

              {/* Before Badge */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md text-xs font-semibold tracking-wider bg-black/60 backdrop-blur-md text-slate-300 border border-white/20 uppercase shadow-lg">
                {beforeLabel}
              </div>
            </div>

            {/* Divider Line & Circular Drag Handle */}
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none transition-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Vertical line */}
              <div className="absolute inset-y-0 -left-[1px] w-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]" />

              {/* Circular Handle */}
              <div
                className={`absolute top-1/2 -left-5 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/90 border-2 border-white flex items-center justify-center text-white shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-transform ${
                  isDragging ? 'scale-115 ring-4 ring-purple-500/40 bg-purple-950/80' : 'hover:scale-105'
                }`}
              >
                <div className="flex items-center gap-0.5 text-xs font-bold tracking-tighter">
                  <span className="text-purple-300">&#10094;</span>
                  <span className="text-blue-300">&#10095;</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Side-by-Side Comparison View
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-xl">
              <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-md text-xs font-semibold tracking-wider bg-black/60 backdrop-blur-md text-slate-300 border border-white/20 uppercase">
                {beforeLabel}
              </div>
              <img
                src={beforeImage}
                alt={beforeLabel}
                className="w-full h-full object-contain block max-h-[500px]"
              />
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-xl">
              <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-md text-xs font-semibold tracking-wider bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 uppercase">
                {afterLabel}
              </div>
              <img
                src={afterImage}
                alt={afterLabel}
                className="w-full h-full object-contain block max-h-[500px]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

