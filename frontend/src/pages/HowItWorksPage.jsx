import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Layers,
  Cpu,
  Eye,
  Sliders,
  Download,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Image Ingestion & Format Validation',
    subtitle: 'Aspect Ratio & Orientation Handling',
    description:
      'The client uploads a vintage photograph in PNG, JPG, or WEBP format. EXIF tags are inspected to automatically correct camera orientation. The original resolution (width × height) is recorded in memory to ensure zero distortion.',
    details: [
      'Preserves original aspect ratio without forced square cropping',
      'Validates file size (up to 15MB) and rejects non-image payloads',
      'Generates client-side low-latency grayscale preview'
    ],
    tag: 'Input Stage'
  },
  {
    step: '02',
    title: 'Grayscale Normalization & L-Channel Isolation',
    subtitle: 'LAB / Grayscale Mapping to [-1, 1]',
    description:
      'The image is resized to 256×256 pixels using bicubic/area anti-aliasing interpolation. Grayscale intensity values [0, 255] are mathematically transformed into a zero-centered floating point tensor [-1.0, 1.0], matching the exact tanh activation domain used during model training.',
    details: [
      'Input tensor shape: (1, 256, 256, 1) float32',
      'Formula: norm_gray = (gray / 127.5) - 1.0',
      'Luminance (L) channel contains 100% of spatial detail, edges, and texture'
    ],
    tag: 'Preprocessing'
  },
  {
    step: '03',
    title: 'Pix2Pix U-Net Generator Forward Pass',
    subtitle: 'Convolutional Skip Connections in Action',
    description:
      'The 256×256 grayscale tensor flows through the trained convolutional generator. Encoder Conv2D layers compress the spatial context into high-level semantic features, while Decoder Conv2DTranspose layers upscale the features. Skip connections concatenate early feature maps directly to decoder layers, ensuring object boundaries never lose sharpness.',
    details: [
      'Encoder 1: 256×256×1 -> 128×128×64 (Conv2D + LeakyReLU)',
      'Encoder 2: 128×128×64 -> 64×64×128 (Conv2D + BatchNorm + LeakyReLU)',
      'Decoder 1: 64×64×128 -> 128×128×64 (Conv2DTranspose + BatchNorm + ReLU)',
      'Skip Connection: Concatenates Decoder 1 (64ch) with Encoder 1 (64ch) -> 128ch',
      'Decoder 2: 128×128×128 -> 256×256×3 (Conv2DTranspose + Tanh)'
    ],
    tag: 'Neural Synthesis'
  },
  {
    step: '04',
    title: 'High-Fidelity Luminance Fusion',
    subtitle: 'Preserving 100% Original Photo Resolution',
    description:
      'Standard colorization models directly output low-resolution 256×256 RGB images, which look blurry when scaled up. In our Luminance Fusion pipeline, we isolate the GAN’s synthesized chromatic information (the A & B color channels in LAB space) and fuse them with the user’s original high-resolution grayscale image.',
    details: [
      'Human visual cortex perceives sharpness almost entirely via luminance (L)',
      'Predicted chrominance is smoothly upscaled to original photo dimensions (e.g., 1920×1080)',
      'Final image has the authentic GAN colors and 100% original pixel-level crispness'
    ],
    tag: 'Postprocessing'
  },
  {
    step: '05',
    title: 'Client Delivery & Lossless PNG Export',
    subtitle: 'Instant Rendering & Fine-Tuning',
    description:
      'The final colorized image is encoded into a high-depth lossless PNG and delivered to the frontend along with precise latency metadata. The user can interactively compare before/after states with the draggable slider, tweak color temperature or saturation, and download the full-resolution file.',
    details: [
      'Zero-latency Base64 data streaming for immediate visual feedback',
      'Downloadable PNG artifact with clean Content-Disposition headers',
      'Session storage history for comparing multiple versions'
    ],
    tag: 'Output Stage'
  }
];

const FAQS = [
  {
    q: 'Why use a GAN instead of a traditional CNN for colorization?',
    a: 'Traditional CNNs trained with Mean Squared Error (MSE) or Mean Absolute Error (MAE) suffer from the "regression to the mean" problem. Because an object like a car or jacket could realistically be red, blue, or green, an MSE loss forces the model to predict the average color—resulting in washed-out sepia, brownish, or gray tones. A Generative Adversarial Network uses a Discriminator that penalizes unnatural averaging, forcing the Generator to hallucinate plausible, vibrant, and authentic color distributions.'
  },
  {
    q: 'How does High-Fidelity Luminance Fusion preserve photo sharpness?',
    a: 'In human vision, rods (responsible for light intensity and sharpness) vastly outnumber cones (responsible for color). In the LAB color space, L represents pure luminance while A and B represent color axes. Our GAN model colorizes at 256×256 resolution. By resizing only the A and B chrominance channels to the original photo dimensions and merging them with the original uncompressed grayscale L-channel, the resulting image preserves every fine pore, hair, and leaf in full original resolution.'
  },
  {
    q: 'What dataset was the model trained on?',
    a: 'The generator was trained on the Common Objects in Context (COCO 2017) dataset, covering thousands of natural indoor and outdoor scenes, human portraits, animals, vehicles, and varied lighting conditions.'
  },
  {
    q: 'Are uploaded images sent to third-party cloud APIs?',
    a: 'No. The entire machine learning inference pipeline runs locally on your own backend server via TensorFlow and FastAPI. Your private photos never leave your local environment.'
  }
];

export default function HowItWorksPage({ setActivePage }) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          <span>Under the Hood</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How ColorAI <span className="gradient-text">Works</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          A step-by-step technical breakdown of our Pix2Pix Generative Adversarial Network and high-fidelity chrominance reconstruction pipeline.
        </p>
      </div>

      {/* Visual Pipeline Flowchart Banner */}
      <div className="w-full p-6 sm:p-8 rounded-3xl glass-card border border-white/10 shadow-2xl mb-16">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">
          End-to-End Architectural Flow
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 text-center flex flex-col items-center">
            <span className="text-[10px] font-mono text-purple-400 font-bold mb-1">INPUT</span>
            <div className="text-sm font-bold text-white mb-1">Grayscale Image</div>
            <div className="text-[10px] text-slate-400">Variable (W × H)</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 text-center flex flex-col items-center">
            <span className="text-[10px] font-mono text-blue-400 font-bold mb-1">PREPROCESS</span>
            <div className="text-sm font-bold text-white mb-1">L-Channel Tensor</div>
            <div className="text-[10px] text-slate-400">256 × 256 in [-1, 1]</div>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-500/50 text-center flex flex-col items-center shadow-lg shadow-purple-600/20">
            <span className="text-[10px] font-mono text-purple-300 font-bold mb-1">PIX2PIX GAN</span>
            <div className="text-sm font-bold text-white mb-1">U-Net Generator</div>
            <div className="text-[10px] text-purple-300">270,339 Parameters</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-center flex flex-col items-center">
            <span className="text-[10px] font-mono text-emerald-400 font-bold mb-1">FUSION</span>
            <div className="text-sm font-bold text-white mb-1">LAB Recombination</div>
            <div className="text-[10px] text-slate-400">Original L + GAN AB</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-pink-500/30 text-center flex flex-col items-center">
            <span className="text-[10px] font-mono text-pink-400 font-bold mb-1">OUTPUT</span>
            <div className="text-sm font-bold text-white mb-1">Full Color PNG</div>
            <div className="text-[10px] text-slate-400">Original Resolution</div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Deep Dive */}
      <div className="w-full space-y-8 mb-20">
        {WORKFLOW_STEPS.map((item, idx) => (
          <div
            key={item.step}
            className="p-6 sm:p-8 rounded-3xl glass-card border border-white/5 hover:border-purple-500/30 transition-all shadow-xl flex flex-col md:flex-row gap-6 items-start"
          >
            {/* Step Number Badge */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-mono font-black text-xl shadow-lg flex-shrink-0">
              {item.step}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-500/30">
                  {item.tag}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {item.subtitle}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-3">
                {item.title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                {item.description}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs text-slate-400 font-mono">
                {item.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Frequently Asked Questions */}
      <div className="w-full max-w-3xl mb-16">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-purple-400 font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-card border border-white/5 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between text-sm sm:text-base font-bold text-slate-200 hover:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-8">
        <button
          onClick={() => setActivePage('studio')}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl hover:shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>Try It in the Colorize Studio</span>
        </button>
      </div>
    </div>
  );
}

