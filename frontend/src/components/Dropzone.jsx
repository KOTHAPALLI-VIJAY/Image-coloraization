import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, AlertCircle, FileCheck } from 'lucide-react';

const MAX_SIZE_MB = 15;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp'];

export default function Dropzone({ onFileSelected, onSampleSelected, samples = [], isProcessing = false }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);

  const validateAndHandle = (file) => {
    setValidationError('');
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|bmp)$/i)) {
      setValidationError('Please upload a valid image file (PNG, JPG, JPEG, WEBP, BMP).');
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setValidationError(`File size exceeds ${MAX_SIZE_MB}MB limit. Please choose a smaller photo.`);
      return;
    }

    onFileSelected(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandle(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndHandle(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`w-full relative group cursor-pointer rounded-3xl p-8 md:p-12 text-center transition-all duration-300 border-2 border-dashed ${
          isDragOver
            ? 'border-purple-400 bg-purple-950/20 scale-[1.01] shadow-[0_0_30px_rgba(168,85,247,0.25)]'
            : 'border-slate-700/80 hover:border-purple-500/60 bg-slate-900/60 hover:bg-slate-900/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/bmp"
          className="hidden"
          onChange={handleFileInput}
          disabled={isProcessing}
        />

        {/* Floating background glow */}
        <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />

        {/* Central Icon */}
        <div className="mx-auto w-18 h-18 mb-5 rounded-2xl bg-gradient-to-tr from-purple-600/30 via-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:text-purple-300 transition-all shadow-lg">
          <Upload className="w-8 h-8" />
        </div>

        {/* Main Text */}
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
          Drop a black-and-white photo here
        </h3>
        <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto mb-6">
          Upload any historical portrait, street view, or family photo in PNG, JPG, or WEBP up to 15MB.
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm md:text-base shadow-xl hover:shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-purple-600" />
          <span>Upload Image</span>
        </button>

        {/* Validation Error Message */}
        {validationError && (
          <div className="mt-5 p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Preset Example Showcase Bar */}
      {samples.length > 0 && (
        <div className="w-full mt-6 pt-5 border-t border-slate-800/80 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wider font-semibold text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Or try with an example photo</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
            {samples.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSampleSelected(sample)}
                disabled={isProcessing}
                className="group relative rounded-xl overflow-hidden border border-slate-700/60 hover:border-purple-500/60 bg-slate-800/50 hover:bg-slate-800 text-left transition-all p-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
              >
                <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-slate-950 mb-1.5">
                  <img
                    src={`/samples/${sample.filename}`}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter grayscale"
                  />
                </div>
                <div className="px-1 truncate">
                  <div className="text-[11px] font-medium text-slate-200 truncate group-hover:text-purple-300">
                    {sample.title}
                  </div>
                  <div className="text-[9px] text-slate-500">
                    {sample.width} × {sample.height}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

