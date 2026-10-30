import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  Maximize2,
  Share2
} from 'lucide-react';
import ComparisonSlider from '../components/ComparisonSlider';

const DEMO_SAMPLES = [
  {
    id: 'sample_1',
    title: 'Cozy Living Room',
    before: '/samples/sample_1_living_room.png',
    after: '/samples/sample_1_living_room_colorized.png',
    aspectRatio: 640 / 426,
    description: 'Natural daylight, wooden textures, and ambient indoor warmth synthesized from monochrome input.'
  },
  {
    id: 'sample_2',
    title: 'City Street & Architecture',
    before: '/samples/sample_2_street_life.png',
    after: '/samples/sample_2_street_life_colorized.png',
    aspectRatio: 375 / 500,
    description: 'Urban architecture, pavements, and vehicular tones restored with spatial consistency.'
  },
  {
    id: 'sample_3',
    title: 'Vintage Kitchen & Dining',
    before: '/samples/sample_3_kitchen_dining.png',
    after: '/samples/sample_3_kitchen_dining_colorized.png',
    aspectRatio: 640 / 425,
    description: 'Complex interior lighting and reflections faithfully colored by GAN discriminator feedback.'
  },
  {
    id: 'sample_4',
    title: 'Outdoor Scene & Vehicles',
    before: '/samples/sample_4_outdoor_market.png',
    after: '/samples/sample_4_outdoor_market_colorized.png',
    aspectRatio: 640 / 427,
    description: 'Vegetation, road surfaces, and sky hues realistically distinguished without color bleeding.'
  }
];

export default function LandingPage({ setActivePage }) {
  const [selectedDemo, setSelectedDemo] = useState(DEMO_SAMPLES[0]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* HERO SECTION */}
      <section className="relative w-full pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden flex flex-col items-center text-center px-4 sm:px-6 lg:px-8">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-blue-500/20 blur-[130px] rounded-full pointer-events-none -z-10" />

        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 shadow-inner backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Generative Adversarial Network (Pix2Pix) In Action</span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15] mb-6">
          Bring Your <span className="gradient-text">Black & White Memories</span> Back to Life.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Transform vintage family photos and historical archives into realistic, vibrant color images using
          a deep convolutional U-Net generator trained on adversarial chrominance distributions.
        </p>

        {/* Dual CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
          <button
            onClick={() => setActivePage('studio')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-base shadow-2xl shadow-purple-600/30 hover:shadow-purple-600/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-purple-200" />
            <span>Start Colorizing Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActivePage('how-it-works')}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-semibold text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore How It Works</span>
          </button>
        </div>

        {/* Interactive Before/After Showcase Card */}
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          {/* Sample Switcher Tabs */}
          <div className="flex items-center gap-2 mb-4 p-1.5 rounded-2xl bg-slate-900/80 border border-white/5 overflow-x-auto max-w-full">
            {DEMO_SAMPLES.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setSelectedDemo(demo)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDemo.id === demo.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {demo.title}
              </button>
            ))}
          </div>

          {/* Interactive Comparison Slider */}
          <ComparisonSlider
            beforeImage={selectedDemo.before}
            afterImage={selectedDemo.after}
            beforeLabel="ORIGINAL B&W"
            afterLabel="GAN COLORIZED"
            aspectRatio={selectedDemo.aspectRatio}
            className="w-full"
          />

          <p className="mt-3 text-xs text-slate-400 font-medium max-w-xl text-center">
            {selectedDemo.description}
          </p>

          {/* Social Proof / Trust Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-12 pt-8 border-t border-slate-800/80 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Advanced Colorization</div>
                <div className="text-xs text-slate-400">AI-powered clarity & vivid chrominance</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Preserve Memories</div>
                <div className="text-xs text-slate-400">Maintains 100% original sharpness</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Lossless PNG Export</div>
                <div className="text-xs text-slate-400">Download and share in full resolution</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES & FEATURES */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
            Technical Superiority
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Why Pix2Pix GAN Outperforms Standard CNNs
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Traditional Mean Squared Error (MSE) models produce blurry, brownish average colors.
            Our Generative Adversarial Network hallucinates authentic color distributions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-7 border border-white/5 hover:border-purple-500/30 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              U-Net Skip Connections
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Low-level spatial boundaries from encoder layers are concatenated directly into the decoder,
              preventing edge blurring and keeping object outlines tack sharp.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-7 border border-white/5 hover:border-blue-500/30 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              High-Fidelity Luminance Fusion
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We separate Luminance (L) from Chrominance (AB). The generator predicts color tones while the
              original high-resolution luminance retains every wrinkle, brick, and hair.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-7 border border-white/5 hover:border-emerald-500/30 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Pre-Warmed Fast Inference
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trained model weights (270,339 parameters) are preloaded once into memory during startup,
              executing neural forward passes in sub-100 millisecond latencies.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-7 border border-white/5 hover:border-pink-500/30 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-pink-950/60 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-5 group-hover:scale-110 transition-transform">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Interactive Fine-Tuning
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Post-inference controls allow real-time adjustment of saturation, color temperature (warmth),
              and brightness to match personal artistic vision.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-7 border border-white/5 hover:border-amber-500/30 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Aspect-Ratio Preservation
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unlike primitive implementations that squish images into square boxes, our pipeline reconstructs
              outputs matching the exact original dimensions of your photo.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-7 border border-white/5 hover:border-indigo-500/30 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Local Image History
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Keep track of recent colorizations in your local session. Easily re-compare results, tweak
              parameters, and download lossless PNGs anytime.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS 4-STEP STRIP */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl border-t border-slate-800/80">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
            Pipeline Overview
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-2">
            How The Colorization Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative p-6 rounded-2xl glass-card border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-4">
              01
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">Upload Grayscale Image</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accepts PNG, JPG, or WEBP. File orientation is corrected and dimensions are parsed.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl glass-card border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-4">
              02
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">L-Channel Extraction</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Image is resized to 256×256 and normalized to [-1, 1] range matching training distribution.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl glass-card border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-4">
              03
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">GAN Generator Inference</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              U-Net neural network with skip connections synthesizes realistic chromatic color channels.
            </p>
          </div>

          <div className="relative p-6 rounded-2xl glass-card border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center mb-4">
              04
            </div>
            <h4 className="text-base font-bold text-white mb-1.5">Detail Fusion & Export</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesized colors are fused with original high-resolution details and exported as PNG.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mb-12">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-tr from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 shadow-2xl flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-radial from-purple-600/10 to-transparent pointer-events-none" />

          <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
            Ready to revive historical photographs?
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-lg mb-8">
            Experience authentic generative colorization powered by our trained Pix2Pix generator.
          </p>

          <button
            onClick={() => setActivePage('studio')}
            className="px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm sm:text-base shadow-xl hover:shadow-purple-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Launch Colorize Studio</span>
          </button>
        </div>
      </section>
    </div>
  );
}

