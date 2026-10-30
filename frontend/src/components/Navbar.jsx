import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Activity, Menu, X, ArrowRight } from 'lucide-react';
import { checkBackendHealth } from '../api/api';

export default function Navbar({ activePage, setActivePage }) {
  const [health, setHealth] = useState({ status: 'checking', model_loaded: false });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchHealth = async () => {
      const h = await checkBackendHealth();
      if (isMounted) setHealth(h);
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 15000); // Check every 15s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'studio', label: 'Colorize Studio' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About & Model' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            setActivePage('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group focus:outline-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all group-hover:scale-105">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
              ColorAI <span className="gradient-text font-black">Studio</span>
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 -mt-0.5">
              Pix2Pix GAN Engine
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-white/5">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Status Badge & CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Health Pill */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border backdrop-blur-md ${
              health.model_loaded
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : health.status === 'offline'
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-400'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
            title={health.model_loaded ? 'Trained GAN Generator Loaded (270k params)' : 'Connecting to API'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                health.model_loaded ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span>{health.model_loaded ? 'GAN Ready' : 'Connecting'}</span>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => {
              setActivePage('studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActivePage(link.id);
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activePage === link.id
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setActivePage('studio');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open Studio</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

