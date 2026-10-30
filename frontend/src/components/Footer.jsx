import React from 'react';
import { Palette, Heart, Cpu, Sparkles, ExternalLink, Code2 } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="w-full bg-[#070A11] border-t border-white/5 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 p-0.5">
                <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                  <Palette className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold text-white">
                ColorAI <span className="gradient-text">Studio</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              State-of-the-art GAN-powered image colorization platform. Restoring historical photographs,
              archival footage, and family memories into authentic, realistic colors through deep generative adversarial networks.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-purple-950/40 text-purple-300 border border-purple-500/20">
                Pix2Pix GAN
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-950/40 text-blue-300 border border-blue-500/20">
                U-Net Skip Connections
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-500/20">
                Luminance Fusion
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                FastAPI + React
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => {
                    setActivePage('landing');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('studio');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Colorize Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('how-it-works');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-purple-400 transition-colors cursor-pointer"
                >
                  Architecture & Model
                </button>
              </li>
            </ul>
          </div>

          {/* Machine Learning Specs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-4">
              Model Specifications
            </h4>
            <ul className="space-y-2 text-xs font-mono text-slate-400">
              <li className="flex justify-between py-1 border-b border-slate-800/80">
                <span>Architecture</span>
                <span className="text-slate-200">Pix2Pix U-Net</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-800/80">
                <span>Parameters</span>
                <span className="text-slate-200">270,339</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-800/80">
                <span>Input Shape</span>
                <span className="text-slate-200">256 × 256 × 1</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-800/80">
                <span>Checkpoint</span>
                <span className="text-purple-400 truncate max-w-[120px]">generator_colorization.keras</span>
              </li>
              <li className="flex justify-between py-1 border-b border-slate-800/80">
                <span>Framework</span>
                <span className="text-slate-200">TensorFlow / Keras 3</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ColorAI Studio. Developed with Generative Adversarial Networks.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Production-grade portfolio project</span>
            <span>•</span>
            <span className="text-purple-400 font-medium">Full-Stack AI/ML Application</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
