# ColorAI Studio – GAN-Based Image Colorization

> **A production-ready Full-Stack AI/ML Web Application** that transforms grayscale and vintage black-and-white photographs into authentic, high-fidelity color images using a trained **Pix2Pix Generative Adversarial Network (GAN)** with **U-Net skip connections** and **High-Fidelity Luminance Fusion**.

---

## 🌟 Key Features

- **Trained GAN Model Integration**: Directly utilizes your trained `generator_colorization.keras` checkpoint (270,339 parameters) with zero synthetic or mock outputs.
- **High-Fidelity Luminance Fusion**: Recombines original high-resolution grayscale details ($L$-channel) with the GAN's chromatic predictions ($a, b$ channels) in the LAB color space, preserving **100% of original photo resolution and aspect ratio**.
- **Interactive Before/After Comparison Slider**: Fluid, touch-and-drag split slider with circular handle, side-by-side mode, and fullscreen inspection view.
- **Modern AI SaaS Dark Interface**: Crafted with Tailwind CSS, dark navy/charcoal styling, subtle purple/blue gradient accents, and glassmorphism panels.
- **Real-Time Color & Warmth Controls**: Fine-tune saturation, color temperature (warmth), and brightness post-inference.
- **Curated Vintage Samples Preset Gallery**: Instant 1-click test drive with vintage street, portrait, and architectural photos.
- **Session History Drawer**: Automatically saves recent colorizations in local storage with one-click re-inspection and download.
- **Dual Execution Modes**: Run in development mode (Vite HMR + FastAPI) or single-command production mode (FastAPI serving compiled React SPA).

---

## 🏗️ Architecture & Technical Stack

```
                               ┌─────────────────────────────────┐
                               │   Grayscale Input Photo (W x H) │
                               └────────────────┬────────────────┘
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       │                                                 │
                       ▼                                                 ▼
          ┌─────────────────────────┐                       ┌─────────────────────────┐
          │  Original Full-Res (L)  │                       │   Resize to 256x256     │
          │   Luminance Preserved   │                       │   Normalized [-1, 1]    │
          └────────────┬────────────┘                       └────────────┬────────────┘
                       │                                                 │
                       │                                                 ▼
                       │                                    ┌─────────────────────────┐
                       │                                    │   Pix2Pix U-Net Model   │
                       │                                    │  (270,339 parameters)   │
                       │                                    └────────────┬────────────┘
                       │                                                 │
                       │                                                 ▼
                       │                                    ┌─────────────────────────┐
                       │                                    │  Predicted Chrominance  │
                       │                                    │    (a, b color space)   │
                       │                                    └────────────┬────────────┘
                       │                                                 │
                       └────────────────────────┬────────────────────────┘
                                                │
                                                ▼
                               ┌─────────────────────────────────┐
                               │  High-Fidelity Luminance Fusion │
                               │      (LAB -> Lossless RGB)      │
                               └────────────────┬────────────────┘
                                                │
                                                ▼
                               ┌─────────────────────────────────┐
                               │ Full-Res Colorized Image Output │
                               └─────────────────────────────────┘
```

### Technology Breakdown

| Component | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti |
| **Backend** | Python 3.10+, FastAPI (ASGI), Uvicorn, Python-Multipart |
| **Machine Learning** | TensorFlow 2.x, Keras 3, OpenCV (`cv2`), Pillow (`PIL`), NumPy |
| **Model Weights** | `checkpoints/generator_colorization.keras` |

---

## 📂 Project Structure

```
Image-Colorization/
├── backend/
│   ├── app.py                      # FastAPI server with REST endpoints & SPA host
│   ├── model.py                    # Pix2Pix Generator model definition (U-Net)
│   ├── utils.py                    # Preprocessing, LAB Luminance Fusion & Adjustments
│   ├── requirements.txt            # Python dependencies
│   ├── checkpoints/
│   │   └── generator_colorization.keras # Trained generator weights (270k params)
│   ├── samples/                    # Curated vintage grayscale sample images
│   ├── uploads/                    # Temporary uploaded files
│   └── outputs/                    # Exported lossless colorized images
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js              # Resilient API communication layer
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top navigation with live model status badge
│   │   │   ├── Footer.jsx          # Comprehensive footer with specs & links
│   │   │   ├── ComparisonSlider.jsx# Drag Before/After split image slider
│   │   │   ├── Dropzone.jsx        # Drag-and-drop file uploader with validation
│   │   │   ├── AdjustmentControls.jsx # Saturation, warmth, and mode fine-tuning
│   │   │   ├── ProcessingIndicator.jsx # Multi-stage AI progress loader
│   │   │   └── HistoryDrawer.jsx   # Local recent colorizations drawer
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx     # Modern AI SaaS hero & feature showcase
│   │   │   ├── StudioPage.jsx      # Core Colorization Studio workspace
│   │   │   ├── HowItWorksPage.jsx  # Technical pipeline & architectural flow
│   │   │   └── AboutPage.jsx       # GAN theory & model parameter inspection
│   │   ├── App.jsx                 # Main application controller & router
│   │   ├── main.jsx                # React root mount
│   │   └── index.css               # Tailwind CSS v4 and glassmorphism styles
│   ├── public/
│   │   └── samples/                # Sample images and colorized pairs
│   ├── package.json
│   └── vite.config.js              # Vite config with dev reverse proxy
├── dataset/
│   ├── train2017/                  # COCO 2017 training images
│   └── val2017/                    # COCO 2017 validation images
├── app.py                          # Root backend launcher (mirrors backend/app.py)
├── model.py                        # Root model architecture (mirrors backend/model.py)
├── utils.py                        # Root image utilities (mirrors backend/utils.py)
├── train.py                        # Generator training script
├── streamlit_app.py                # Legacy Streamlit app preserved for reference
├── requirements.txt                # Unified root requirements
├── .env.example                    # Environment variable template
└── README.md                       # Comprehensive documentation
```

---

## 🔍 Machine Learning Inspection & Bug Fixes

During the initial codebase inspection, the following critical improvements were identified and resolved:

1. **U-Net Architecture Alignment**:
   - The saved model `checkpoints/generator_colorization.keras` contains a functional U-Net with a **skip connection** concatenating `conv2d` (Encoder 1) with `re_lu` (Decoder 1) to produce a 128-channel input for `conv2d_transpose_1`.
   - The original `model.py` was missing this `layers.Concatenate()` connection. `model.py` was updated to accurately reflect the exact architecture and weights of the trained checkpoint.

2. **Aspect Ratio & Resolution Distortion Fix**:
   - The original Streamlit script forcefully squashed every image into a square $256 \times 256$ or $512 \times 512$ box, distorting landscape and portrait aspect ratios.
   - We introduced **High-Fidelity Luminance Fusion**: The GAN operates at $256 \times 256$ to synthesize chromatic tone information ($a, b$ channels). The predicted chrominance is resized back to the original photo's dimensions and fused with the original high-resolution $L$ (luminance) channel in the LAB color space. This retains **100% of the original photo's sharpness and native aspect ratio**.

3. **Inference Graph Warm-Up**:
   - TensorFlow models can experience a 2–3 second latency spike on the first request due to C++ graph tracing.
   - The backend now performs a pre-warm dummy inference pass during server lifespan startup. Subsequent requests complete in sub-second inference speeds (~80–150ms).

4. **Synchronous Thread-Safe FastAPI Execution**:
   - CPU-bound model inference, NumPy conversions, and OpenCV operations are executed in synchronous worker pools, preventing event loop blocking and keeping all API endpoints concurrently responsive.

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+ and npm**
- **Git**

---

### Step 1: Clone the Repository & Setup Python Environment

```bash
git clone https://github.com/your-username/Image-Colorization.git
cd Image-Colorization

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt
```

---

### Step 2: Setup Frontend

```bash
cd frontend
npm install
cd ..
```

---

### Step 3: Run the Application

#### Option A: Quick 1-Click Windows Launcher (Easiest)
Simply double-click [`run_app.bat`](file:///c:/collage/projects/Image-Colorization/run_app.bat) in the project folder. It launches both the FastAPI backend and React Vite frontend in background windows and automatically opens your browser at:
`http://localhost:5173`

---

#### Option B: Manual Development Mode

Run the backend and frontend in separate terminals:

**Terminal 1 (Backend API):**
```bash
python -m uvicorn app:app --host 127.0.0.1 --port 5000
```
*Backend API will run at `http://127.0.0.1:5000` (Interactive docs at `http://127.0.0.1:5000/docs`).*

**Terminal 2 (Frontend with Hot Module Replacement):**
```bash
cd frontend
npm run dev
```
*Frontend will run at `http://localhost:5173` (proxies `/api` requests to backend).*

---

#### Option C: Single-Command Production Mode

Build the frontend once, then let FastAPI serve both the compiled SPA and the API on port 5000:

```bash
# 1. Build frontend
cd frontend
npm run build
cd ..

# 2. Start combined server
python -m uvicorn app:app --host 127.0.0.1 --port 5000
```
*Open your browser at `http://127.0.0.1:5000`.*

---

#### Option D: Legacy Streamlit Mode

If you wish to run the legacy Streamlit interface:
```bash
streamlit run streamlit_app.py
```

---

## 📡 API Reference

### 1. `GET /api/health`
Checks backend health and model load status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "framework": "TensorFlow / Keras",
  "tensorflow_version": "2.20.0",
  "device": "CPU",
  "model_info": {
    "architecture": "Pix2Pix U-Net Generator with Skip Connections",
    "input_resolution": "256x256x1 (Grayscale)",
    "output_resolution": "256x256x3 (RGB)",
    "total_parameters": 270339,
    "weights_file": "generator_colorization.keras"
  }
}
```

---

### 2. `GET /api/samples`
Fetches the list of curated historical sample images.

**Response:**
```json
{
  "samples": [
    {
      "id": "sample_1_living_room",
      "filename": "sample_1_living_room.png",
      "title": "Cozy Living Room & Interior",
      "width": 640,
      "height": 426,
      "src": "/api/samples/sample_1_living_room.png"
    }
  ]
}
```

---

### 3. `POST /api/colorize`
Uploads and colorizes a grayscale image.

**Request:** `multipart/form-data`
- `file`: Image file (PNG, JPG, JPEG, WEBP, up to 15MB)
- `mode` *(optional)*: `"fusion"` (default) or `"direct"`
- `saturation` *(optional)*: float `0.2` to `1.8` (default: `1.0`)
- `warmth` *(optional)*: int `-35` to `+35` (default: `0`)
- `brightness` *(optional)*: float `0.75` to `1.25` (default: `1.0`)

**Response:**
```json
{
  "success": true,
  "filename": "vintage_photo.png",
  "processing_time_ms": 142.5,
  "inference_time_ms": 78.2,
  "original_preview": "data:image/jpeg;base64,...",
  "colorized_image": "data:image/png;base64,...",
  "colorized_url": "/api/outputs/colorized_a1b2c3d4e5.png",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "aspect_ratio": 1.778,
    "file_size_kb": 240.5,
    "mode": "fusion",
    "saturation": 1.0,
    "warmth": 0,
    "brightness": 1.0
  }
}
```

---

### 4. `GET /api/outputs/{filename}`
Downloads the full-resolution colorized PNG artifact.

---

## 🧪 Testing and Verification

Run the automated end-to-end verification test suite:

```bash
python test_complete_app.py
```

This verifies:
1. Integrity of the trained model checkpoint.
2. Production build bundle of the frontend.
3. Health check status and device assignment.
4. Curated sample manifest availability.
5. High-fidelity colorization pipeline and aspect-ratio preservation.
6. Validation and rejection of non-image file uploads with HTTP 400.

---

## 💡 Technical Interview Q&A Summary

> **Q: Why does a standard CNN colorization model produce sepia/gray images?**  
> *A:* When minimizing $L_2$ (Mean Squared Error) loss over multimodal distributions (e.g. an apple could be green or red), the optimal loss-minimizing point is the mathematical mean of all valid colors. This causes traditional CNNs to predict washed-out gray or sepia. A GAN introduces an adversarial Discriminator that penalizes unnatural averages, compelling the Generator to choose vivid, realistic points on the natural image manifold.

> **Q: Why use U-Net skip connections in the Generator?**  
> *A:* Information passes through bottleneck downsampling layers, which extract semantic content (e.g. "this is a coat") but lose spatial localization (exact pixel boundaries). Skip connections shuttle low-level edge features from encoder to decoder, preventing color bleeding across contours.

> **Q: How does High-Fidelity Luminance Fusion avoid pixelation?**  
> *A:* The human visual system's spatial acuity is primarily driven by luminance ($L$), not chrominance ($a, b$). By scaling only the predicted $a, b$ channels to the original photo's resolution and retaining the original uncompressed grayscale $L$ channel, the output retains 100% of the input's native sharpness.

---

## 📄 License

This project is licensed under the MIT License.
