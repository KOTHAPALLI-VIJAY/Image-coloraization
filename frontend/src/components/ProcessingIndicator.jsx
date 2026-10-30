import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Preprocessing & L-Channel Extraction', desc: 'Resizing to 256×256 and normalizing to [-1, 1]' },
  { id: 2, title: 'Pix2Pix U-Net Generator Inference', desc: 'Synthesizing chrominance via convolutional skip connections' },
  { id: 3, title: 'High-Fidelity Luminance Fusion', desc: 'Combining original high-res details with predicted colors' },
  { id: 4, title: 'Final Image Reconstruction', desc: 'Encoding lossless PNG and generating preview' },
];

export default function ProcessingIndicator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const ms = Date.now() - startTime;
      setElapsed(ms);

      if (ms > 400 && currentStep === 1) setCurrentStep(2);
      if (ms > 1200 && currentStep === 2) setCurrentStep(3);
      if (ms > 2000 && currentStep === 3) setCurrentStep(4);
    }, 100);

    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-3xl glass-card border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] text-center">
      {/* Central Animated Orb */}
      <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 opacity-30 animate-ping" />
        <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 animate-spin opacity-80" />
        <div className="relative z-10 w-16 h-16 rounded-full bg-slate-950 flex items-center justify-center text-purple-300 shadow-inner">
          <Sparkles className="w-7 h-7 animate-pulse text-purple-400" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-1">
        Colorizing Your Image...
      </h3>
      <p className="text-xs text-purple-300 font-mono mb-6">
        GAN Neural Forward Pass • {(elapsed / 1000).toFixed(1)}s elapsed
      </p>

      {/* Pipeline Steps List */}
      <div className="space-y-3 text-left">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                isCurrent
                  ? 'bg-purple-950/40 border border-purple-500/40'
                  : isDone
                  ? 'bg-slate-900/40 opacity-70'
                  : 'opacity-30'
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-600" />
                )}
              </div>
              <div className="flex-1">
                <div className={`text-xs font-semibold ${isCurrent ? 'text-purple-200' : 'text-slate-300'}`}>
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-500">
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

