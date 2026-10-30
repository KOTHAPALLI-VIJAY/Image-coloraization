import React from 'react';
import {
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Code2,
  Server,
  Database,
  ArrowRight
} from 'lucide-react';

export default function AboutPage({ setActivePage }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>Research & Engineering Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About <span className="gradient-text">ColorAI Studio</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          Deep dive into the theory of image colorization, conditional GAN dynamics, and full-stack software architecture.
        </p>
      </div>

      {/* SECTION 1: WHAT IS IMAGE COLORIZATION */}
      <section className="w-full p-8 rounded-3xl glass-card border border-white/10 shadow-xl mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>The Problem of Image Colorization</span>
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
          <p>
            Image colorization is the computer vision task of assigning realistic color values (chrominance) to an image
            that only contains intensity information (luminance). Because luminance represents the scalar projection of three-dimensional
            RGB channels into a single grayscale scalar, colorization is an <strong>inherently ill-posed inverse problem</strong> with infinite valid solutions.
          </p>
          <p>
            For example, a gray sweater in a vintage photograph could realistically have been crimson red, cobalt blue, or emerald green.
            An effective colorization algorithm must not only invent believable colors, but must also maintain spatial coherence—ensuring
            that textures, shadows, skin tones, skies, and edges look visually harmonious and natural.
          </p>
        </div>
      </section>

      {/* SECTION 2: WHY GANS OVER TRADITIONAL CNNS */}
      <section className="w-full p-8 rounded-3xl glass-card border border-white/10 shadow-xl mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-blue-400" />
          <span>Generative Adversarial Networks (Pix2Pix)</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
          Generative Adversarial Networks (GANs), introduced by Ian Goodfellow et al. (2014) and adapted for image-to-image translation
          by Isola et al. (Pix2Pix, 2017), solve the colorization dilemma through a zero-sum two-player minimax game:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30">
            <div className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-1">
              Component 1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">The Generator (U-Net)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Takes the grayscale image as a conditioning input and predicts 3-channel color values.
              Equipped with skip connections, it passes low-level spatial features directly from encoder to decoder,
              preventing the bottleneck from destroying fine edge details.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-blue-500/30">
            <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider mb-1">
              Component 2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">The Discriminator (PatchGAN)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Penalizes unrealistic or blurry outputs by determining whether image patches look like authentic natural photographs.
              This adversarial loss discourages the generator from taking the "easy route" of averaging conflicting colors into sepia tones.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-700/80 text-slate-400 font-mono">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Traditional CNN (MSE / L2 Loss)</th>
                <th className="py-3 px-4 text-purple-400 font-bold">Pix2Pix GAN (Ours)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-sans">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Color Saturation</td>
                <td className="py-3 px-4 text-slate-400">Desaturated, washed-out sepia tones</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Vibrant, plausible natural distributions</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Edge Sharpness</td>
                <td className="py-3 px-4 text-slate-400">Color bleeding across object borders</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Precise contours preserved via U-Net skips</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Mathematical Behavior</td>
                <td className="py-3 px-4 text-slate-400">Regresses to Euclidean mean of all colors</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Matches true high-dimensional data manifold</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Output Crispness</td>
                <td className="py-3 px-4 text-slate-400">Locked to fixed low-res output size</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Preserves 100% resolution via Luminance Fusion</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: MODEL SPECIFICATIONS & PARAMETERS */}
      <section className="w-full p-8 rounded-3xl glass-card border border-white/10 shadow-xl mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>Trained Model Specifications</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Our deployed generator is loaded directly from <code className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono text-xs">checkpoints/generator_colorization.keras</code>.
          Below are the verified structural parameters inspected from the Keras checkpoint:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] text-slate-500 font-mono">TOTAL PARAMETERS</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">270,339</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">1.03 MB Model Size</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] text-slate-500 font-mono">INPUT RESOLUTION</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">256 × 256</div>
            <div className="text-[10px] text-purple-400 mt-0.5">1 Channel (Grayscale)</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] text-slate-500 font-mono">OUTPUT SHAPE</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">256 × 256</div>
            <div className="text-[10px] text-blue-400 mt-0.5">3 Channels (RGB Tanh)</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[11px] text-slate-500 font-mono">INFERENCE SPEED</div>
            <div className="text-xl sm:text-2xl font-extrabold text-white mt-1">&lt; 150 ms</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Pre-warmed C++ graph</div>
          </div>
        </div>

        {/* Layer Breakdown */}
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/70 p-4 font-mono text-xs text-slate-300">
          <div className="text-purple-400 font-bold mb-2">// Keras Generator Topology:</div>
          <div className="space-y-1 text-slate-400">
            <div>• Layer 1 (InputLayer): input_layer [256, 256, 1]</div>
            <div>• Layer 2 (Conv2D): conv2d [128, 128, 64] filters=64, k=4, s=2 + LeakyReLU</div>
            <div>• Layer 3 (Conv2D): conv2d_1 [64, 64, 128] filters=128, k=4, s=2 + BatchNorm + LeakyReLU</div>
            <div>• Layer 4 (Conv2DTranspose): conv2d_transpose [128, 128, 64] + BatchNorm + ReLU</div>
            <div>• Layer 5 (Concatenate): concatenate [128, 128, 128] (Skip connection from Layer 2)</div>
            <div>• Layer 6 (Conv2DTranspose): conv2d_transpose_1 [256, 256, 3] filters=3, k=4, s=2, activation=tanh</div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FULL-STACK ARCHITECTURE */}
      <section className="w-full p-8 rounded-3xl glass-card border border-white/10 shadow-xl mb-12">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2.5">
          <Code2 className="w-5 h-5 text-indigo-400" />
          <span>Full-Stack Architecture & Technologies</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-mono font-bold text-purple-400 uppercase mb-2">Frontend</div>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li>• React 19 + Vite</li>
              <li>• Tailwind CSS (v4)</li>
              <li>• Lucide React Icons</li>
              <li>• Canvas Confetti</li>
              <li>• Touch & Pointer Drag Slider</li>
              <li>• LocalStorage Session History</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-mono font-bold text-blue-400 uppercase mb-2">Backend</div>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li>• Python 3.10</li>
              <li>• FastAPI (Asynchronous ASGI)</li>
              <li>• Uvicorn Server</li>
              <li>• Lifespan Graph Warmup</li>
              <li>• CORS Middleware</li>
              <li>• File Validation & Cleanup</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase mb-2">Machine Learning</div>
            <ul className="text-xs text-slate-300 space-y-1.5 font-mono">
              <li>• TensorFlow 2.20 / Keras 3</li>
              <li>• OpenCV (cv2)</li>
              <li>• Pillow (PIL) EXIF handling</li>
              <li>• LAB Chrominance Fusion</li>
              <li>• NumPy 2.2 Vectorization</li>
              <li>• Direct C++ Forward Pass</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Action CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => setActivePage('studio')}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl hover:shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>Launch Colorize Studio</span>
        </button>
      </div>
    </div>
  );
}

