import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Download,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  Maximize2
} from 'lucide-react';
import Dropzone from '../components/Dropzone';
import ComparisonSlider from '../components/ComparisonSlider';
import AdjustmentControls from '../components/AdjustmentControls';
import ProcessingIndicator from '../components/ProcessingIndicator';
import HistoryDrawer from '../components/HistoryDrawer';
import { colorizeImage, fetchSamples, getDownloadUrl } from '../api/api';

const HISTORY_STORAGE_KEY = 'colorai_studio_history_v1';

export default function StudioPage() {
  const [samples, setSamples] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [colorizedResult, setColorizedResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [history, setHistory] = useState([]);

  // Adjustments state
  const [adjustments, setAdjustments] = useState({
    mode: 'fusion',
    saturation: 1.0,
    warmth: 0,
    brightness: 1.0,
  });

  // Load samples and history
  useEffect(() => {
    fetchSamples().then(setSamples).catch(console.warn);

    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch (e) {
      console.warn('Could not read history from localStorage:', e);
    }
  }, []);

  const saveToHistory = (item) => {
    try {
      const updated = [item, ...history.filter((h) => h.id !== item.id)].slice(0, 8);
      setHistory(updated);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save history:', e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  // Handle uploaded file
  const handleFileSelected = (file) => {
    setErrorMessage('');
    setSelectedFile(file);
    setColorizedResult(null);

    // Create client-side preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle sample selection from preset gallery
  const handleSampleSelected = async (sample) => {
    setErrorMessage('');
    setIsProcessing(true);
    setColorizedResult(null);

    try {
      // Fetch sample binary
      const res = await fetch(`/samples/${sample.filename}`);
      const blob = await res.blob();
      const file = new File([blob], sample.filename, { type: 'image/png' });
      setSelectedFile(file);

      // Set preview
      const previewUrl = `/samples/${sample.filename}`;
      setOriginalPreview(previewUrl);

      // Perform colorization
      await runColorization(file);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to process sample image.');
      setIsProcessing(false);
    }
  };

  // Execute Colorization
  const runColorization = async (fileToUse = selectedFile, customAdjustments = adjustments) => {
    if (!fileToUse) return;
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const res = await colorizeImage(fileToUse, customAdjustments);
      setColorizedResult(res);

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#A855F7', '#3B82F6', '#10B981']
        });
      } catch (e) {}

      // Save to session history
      saveToHistory({
        id: Date.now().toString(),
        filename: res.filename || fileToUse.name,
        colorizedImage: res.colorized_image,
        colorizedUrl: res.colorized_url,
        processingTimeMs: res.processing_time_ms,
        metadata: res.metadata,
        timestamp: Date.now()
      });
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during colorization.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset workspace
  const handleReset = () => {
    setSelectedFile(null);
    setOriginalPreview(null);
    setColorizedResult(null);
    setErrorMessage('');
  };

  // Download Colorized Image
  const handleDownload = () => {
    if (!colorizedResult) return;
    const link = document.createElement('a');
    link.href = colorizedResult.colorized_image;
    link.download = `colorized_${colorizedResult.filename || 'photo'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Interactive AI Colorization Workspace</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Image Colorization <span className="gradient-text">Studio</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base mt-2">
          Upload any monochrome photo or choose a historical archive preset to synthesize realistic color tones.
        </p>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="w-full max-w-3xl mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-200 text-sm flex items-start gap-3 shadow-xl">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Colorization Error: </span>
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="text-red-400 hover:text-white text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* WORKSPACE AREA */}
      {!selectedFile && !colorizedResult && (
        // State A: Empty State / Dropzone
        <Dropzone
          onFileSelected={handleFileSelected}
          onSampleSelected={handleSampleSelected}
          samples={samples}
          isProcessing={isProcessing}
        />
      )}

      {/* State B: Processing State */}
      {isProcessing && (
        <div className="w-full py-16 flex justify-center">
          <ProcessingIndicator />
        </div>
      )}

      {/* State C: Loaded / Processed State */}
      {selectedFile && !isProcessing && (
        <div className="w-full flex flex-col items-center gap-8">
          {/* Action Header Card */}
          <div className="w-full max-w-4xl glass-card rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate max-w-xs sm:max-w-md">
                <div className="text-sm font-bold text-white truncate">
                  {selectedFile.name}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                  {colorizedResult?.metadata && (
                    <>
                      <span>•</span>
                      <span>{colorizedResult.metadata.width} × {colorizedResult.metadata.height} px</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-mono font-semibold">
                        {colorizedResult.processing_time_ms}ms
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Upload Another</span>
              </button>

              {!colorizedResult ? (
                <button
                  type="button"
                  onClick={() => runColorization()}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Colorize Image</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Colorized (PNG)</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Visualizer Area */}
          {colorizedResult ? (
            <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-5xl">
              {/* Left 3 cols: Before/After Comparison Slider */}
              <div className="lg:col-span-3 flex flex-col items-center">
                <ComparisonSlider
                  beforeImage={colorizedResult.original_preview || originalPreview}
                  afterImage={colorizedResult.colorized_image}
                  beforeLabel="ORIGINAL B&W"
                  afterLabel="GAN COLORIZED"
                  aspectRatio={colorizedResult.metadata?.aspect_ratio}
                  className="w-full"
                />

                {/* Status Bar */}
                <div className="w-full mt-4 flex items-center justify-between text-xs text-slate-400 px-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Colorization complete in {colorizedResult.processing_time_ms} ms</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">
                    Mode: {colorizedResult.metadata?.mode === 'fusion' ? 'Luminance Fusion' : 'Direct'}
                  </div>
                </div>
              </div>

              {/* Right 1 col: Fine-Tuning Controls */}
              <div className="lg:col-span-1 flex flex-col gap-4">
                <AdjustmentControls
                  mode={adjustments.mode}
                  saturation={adjustments.saturation}
                  warmth={adjustments.warmth}
                  brightness={adjustments.brightness}
                  onChange={(changes) => setAdjustments((prev) => ({ ...prev, ...changes }))}
                  onReset={() => setAdjustments({ mode: 'fusion', saturation: 1.0, warmth: 0, brightness: 1.0 })}
                  onApply={() => runColorization(selectedFile, adjustments)}
                  isProcessing={isProcessing}
                />

                <div className="p-4 rounded-2xl glass-card border border-white/5 text-xs text-slate-400 space-y-2">
                  <div className="font-bold text-slate-200">Export Tips:</div>
                  <p>
                    Downloads are saved as lossless, uncompressed PNG files preserving 100% of the synthesized color depth.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Preview before colorization
            <div className="w-full max-w-2xl flex flex-col items-center">
              <div className="w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl p-2">
                <img
                  src={originalPreview}
                  alt="Original preview"
                  className="w-full h-auto max-h-[500px] object-contain rounded-xl"
                />
              </div>

              <button
                type="button"
                onClick={() => runColorization()}
                className="mt-6 px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-extrabold text-base shadow-2xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-purple-200" />
                <span>Colorize This Image Now</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* History Drawer */}
      <HistoryDrawer
        history={history}
        onSelect={(item) => {
          setSelectedFile({ name: item.filename, size: 0 });
          setColorizedResult({
            filename: item.filename,
            original_preview: item.originalPreview || item.colorizedImage,
            colorized_image: item.colorizedImage,
            colorized_url: item.colorizedUrl,
            processing_time_ms: item.processingTimeMs,
            metadata: item.metadata
          });
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onClear={clearHistory}
      />
    </div>
  );
}

