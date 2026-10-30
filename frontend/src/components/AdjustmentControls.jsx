import React from 'react';
import { Sliders, RotateCcw, Sparkles, Layers, Sun, Thermometer, Palette } from 'lucide-react';

export default function AdjustmentControls({
  mode = 'fusion',
  saturation = 1.0,
  warmth = 0,
  brightness = 1.0,
  onChange,
  onReset,
  onApply,
  isProcessing = false
}) {
  const isChanged = mode !== 'fusion' || saturation !== 1.0 || warmth !== 0 || brightness !== 1.0;

  return (
    <div className="w-full glass-card rounded-2xl p-5 border border-white/10 shadow-xl text-slate-200">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold tracking-wide text-white uppercase">
            Color & Fidelity Controls
          </span>
        </div>
        {isChanged && (
          <button
            onClick={onReset}
            disabled={isProcessing}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Processing Mode Toggle */}
        <div>
          <label className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Pipeline Mode</span>
            </span>
            <span className="text-[11px] text-purple-400 font-semibold">
              {mode === 'fusion' ? 'Luminance Fusion' : 'Direct GAN'}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onChange({ mode: 'fusion' })}
              className={`py-1.5 px-2 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                mode === 'fusion'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              High-Fidelity Fusion
            </button>
            <button
              type="button"
              onClick={() => onChange({ mode: 'direct' })}
              className={`py-1.5 px-2 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                mode === 'direct'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Direct GAN
            </button>
          </div>
          <p className="mt-1 text-[10px] text-slate-500">
            {mode === 'fusion'
              ? 'Preserves 100% of the original photo’s crisp sharpness and resolution using LAB chrominance fusion.'
              : 'Directly upscales the 256×256 RGB neural prediction.'}
          </p>
        </div>

        {/* Saturation Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span>Saturation</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {Math.round(saturation * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1.8"
            step="0.05"
            value={saturation}
            onChange={(e) => onChange({ saturation: parseFloat(e.target.value) })}
            disabled={isProcessing}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Warmth Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              <span>Warmth</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {warmth > 0 ? `+${warmth}` : warmth}
            </span>
          </div>
          <input
            type="range"
            min="-35"
            max="35"
            step="1"
            value={warmth}
            onChange={(e) => onChange({ warmth: parseInt(e.target.value, 10) })}
            disabled={isProcessing}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Brightness Slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-yellow-400" />
              <span>Brightness</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              {Math.round(brightness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.25"
            step="0.02"
            value={brightness}
            onChange={(e) => onChange({ brightness: parseFloat(e.target.value) })}
            disabled={isProcessing}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>

        {/* Apply Button */}
        {onApply && (
          <button
            type="button"
            onClick={onApply}
            disabled={isProcessing}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-98 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Adjustments</span>
          </button>
        )}
      </div>
    </div>
  );
}

