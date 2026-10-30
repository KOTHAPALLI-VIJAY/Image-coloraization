"""
AI Image Colorization Studio - Backend API & SPA Host
Powered by Pix2Pix GAN and FastAPI
"""

import os
import time
import uuid
import json
import logging
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import numpy as np
import tensorflow as tf
from PIL import Image

# Configure logging & Matplotlib cache silence
os.environ.setdefault("MPLCONFIGDIR", os.path.join(os.environ.get("TEMP", "/tmp"), "matplotlib_cache"))
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("colorization-api")

# Directory paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHECKPOINT_PATH = os.path.join(BASE_DIR, "checkpoints", "generator_colorization.keras")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
OUTPUTS_DIR = os.path.join(BASE_DIR, "outputs")
SAMPLES_DIR = os.path.join(BASE_DIR, "samples")
FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")
if not os.path.exists(FRONTEND_DIST):
    FRONTEND_DIST = os.path.join(os.path.dirname(BASE_DIR), "frontend", "dist")

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(OUTPUTS_DIR, exist_ok=True)
os.makedirs(SAMPLES_DIR, exist_ok=True)

MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp"}
IMG_SIZE = 256

from utils import preprocess_image, postprocess_image, image_to_base64

# Probe hardware once at startup
try:
    _gpus = tf.config.list_physical_devices("GPU")
    DEVICE_NAME = f"GPU ({len(_gpus)} available)" if _gpus else "CPU"
except Exception:
    DEVICE_NAME = "CPU"


def resolve_checkpoint_path() -> str:
    """Finds the checkpoint in backend/checkpoints or root checkpoints."""
    if os.path.exists(CHECKPOINT_PATH):
        return CHECKPOINT_PATH
    root_path = os.path.join(os.path.dirname(BASE_DIR), "checkpoints", "generator_colorization.keras")
    if os.path.exists(root_path):
        return root_path
    raise FileNotFoundError(f"Model checkpoint not found at {CHECKPOINT_PATH} or {root_path}")


def get_model():
    """Returns the loaded model singleton, loading and warming it up if not yet loaded."""
    if not hasattr(app.state, "model") or app.state.model is None:
        target_path = resolve_checkpoint_path()
        logger.info(f"Loading trained GAN generator from: {target_path}")
        model = tf.keras.models.load_model(target_path, compile=False)
        app.state.model = model
        app.state.model_loaded = True
        logger.info("Model loaded successfully into memory. Pre-warming graph...")
        dummy = tf.zeros((1, IMG_SIZE, IMG_SIZE, 1), dtype=tf.float32)
        _ = model(dummy, training=False)
        logger.info("Inference engine pre-warmed and ready.")
    return app.state.model


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Preloads and warms up model on application startup."""
    logger.info("Starting ColorAI Studio backend service...")
    try:
        get_model()
    except Exception as e:
        logger.error(f"Error loading model during lifespan: {e}", exc_info=True)
    yield
    logger.info("ColorAI Studio service shut down.")


app = FastAPI(
    title="ColorAI Studio - GAN Image Colorization API",
    description="High-fidelity automatic image colorization powered by Pix2Pix Generative Adversarial Network.",
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file mounts for outputs and samples
app.mount("/static/outputs", StaticFiles(directory=OUTPUTS_DIR), name="outputs")
app.mount("/static/samples", StaticFiles(directory=SAMPLES_DIR), name="samples")


@app.get("/api/health")
def health_check():
    """Health check endpoint verifying backend status and model readiness."""
    try:
        model = get_model()
        model_loaded = model is not None
    except Exception:
        model_loaded = False

    return {
        "status": "healthy" if model_loaded else "degraded",
        "model_loaded": model_loaded,
        "framework": "TensorFlow / Keras",
        "tensorflow_version": tf.__version__,
        "device": DEVICE_NAME,
        "model_info": {
            "architecture": "Pix2Pix U-Net Generator with Skip Connections",
            "input_resolution": f"{IMG_SIZE}x{IMG_SIZE}x1 (Grayscale)",
            "output_resolution": f"{IMG_SIZE}x{IMG_SIZE}x3 (RGB)",
            "total_parameters": 270339,
            "weights_file": os.path.basename(resolve_checkpoint_path())
        }
    }


@app.get("/api/samples")
def get_samples():
    """Returns the list of curated historical grayscale sample images."""
    manifest_path = os.path.join(SAMPLES_DIR, "manifest.json")
    if os.path.exists(manifest_path):
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
            return {"samples": manifest}
            
    samples = []
    for f in os.listdir(SAMPLES_DIR):
        if f.lower().endswith((".png", ".jpg", ".jpeg")):
            samples.append({
                "id": os.path.splitext(f)[0],
                "filename": f,
                "title": f.replace("_", " ").replace(".png", "").replace(".jpg", "").title(),
                "src": f"/api/samples/{f}"
            })
    return {"samples": samples}


@app.get("/api/samples/{filename}")
def get_sample_file(filename: str):
    """Serves a specific sample image file."""
    file_path = os.path.join(SAMPLES_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Sample image not found.")
    return FileResponse(file_path, media_type="image/png")


@app.post("/api/colorize")
def colorize_image(
    file: UploadFile = File(...),
    mode: str = Form("fusion"),
    saturation: float = Form(1.0),
    warmth: int = Form(0),
    brightness: float = Form(1.0)
):
    """
    Colorizes an uploaded grayscale or black & white image using the trained GAN generator.
    """
    model = get_model()
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Colorization model is not loaded."
        )

    # Validate Content-Type
    content_type = getattr(file, "content_type", None) or ""
    filename = getattr(file, "filename", None) or ""
    if content_type.lower() not in ALLOWED_MIME_TYPES and not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.bmp')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file format '{content_type}'. Please upload a PNG, JPG, JPEG, WEBP, or BMP image."
        )

    # Read bytes safely and check size
    if hasattr(file, "file") and hasattr(file.file, "read"):
        file.file.seek(0)
        image_bytes = file.file.read()
    elif hasattr(file, "read"):
        image_bytes = file.read()
    elif isinstance(file, bytes):
        image_bytes = file
    else:
        raise HTTPException(status_code=400, detail="Invalid file stream.")

    if len(image_bytes) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")
    if len(image_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024 * 1024)}MB."
        )

    start_time = time.perf_counter()

    try:
        prep = preprocess_image(image_bytes, target_size=(IMG_SIZE, IMG_SIZE))
        input_tensor = prep["input_tensor"]
        original_gray = prep["original_gray"]
        orig_w = prep["orig_w"]
        orig_h = prep["orig_h"]
        file_size_kb = prep["file_size_kb"]

        # Run model inference synchronously
        t0 = time.perf_counter()
        raw_prediction = model(input_tensor, training=False).numpy()
        inference_time_ms = round((time.perf_counter() - t0) * 1000, 1)

        # Postprocessing with High-Fidelity Luminance Fusion
        colorized_rgb = postprocess_image(
            prediction_tensor=raw_prediction,
            original_gray=original_gray,
            mode=mode,
            saturation=saturation,
            warmth=warmth,
            brightness=brightness
        )

        total_time_ms = round((time.perf_counter() - start_time) * 1000, 1)

        output_filename = f"colorized_{uuid.uuid4().hex[:10]}.png"
        output_path = os.path.join(OUTPUTS_DIR, output_filename)
        pil_out = Image.fromarray(colorized_rgb)
        pil_out.save(output_path, format="PNG", optimize=True)

        original_preview_b64 = image_to_base64(original_gray, format="JPEG")
        colorized_b64 = image_to_base64(colorized_rgb, format="PNG")

        return JSONResponse({
            "success": True,
            "filename": filename,
            "processing_time_ms": total_time_ms,
            "inference_time_ms": inference_time_ms,
            "original_preview": original_preview_b64,
            "colorized_image": colorized_b64,
            "colorized_url": f"/api/outputs/{output_filename}",
            "metadata": {
                "width": orig_w,
                "height": orig_h,
                "aspect_ratio": prep["aspect_ratio"],
                "file_size_kb": file_size_kb,
                "mode": mode,
                "saturation": saturation,
                "warmth": warmth,
                "brightness": brightness
            }
        })

    except Exception as e:
        logger.error(f"Error during colorization: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process image: {str(e)}"
        )


@app.get("/api/outputs/{filename}")
def get_output_file(filename: str):
    """Serves the generated colorized image for display or download."""
    clean_filename = os.path.basename(filename)
    file_path = os.path.join(OUTPUTS_DIR, clean_filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Requested colorized image was not found.")
        
    return FileResponse(
        file_path,
        media_type="image/png",
        filename=clean_filename,
        headers={"Content-Disposition": f'attachment; filename="{clean_filename}"'}
    )


# Mount Production Frontend SPA if dist directory exists
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="spa_assets")
        
    dist_samples_dir = os.path.join(FRONTEND_DIST, "samples")
    if os.path.exists(dist_samples_dir):
        app.mount("/samples", StaticFiles(directory=dist_samples_dir), name="dist_samples")

    @app.get("/")
    def serve_root():
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        return FileResponse(index_file)

    @app.get("/{full_path:path}")
    def serve_spa_frontend(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("static/"):
            raise HTTPException(status_code=404, detail="API route not found.")
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        return FileResponse(index_file)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
