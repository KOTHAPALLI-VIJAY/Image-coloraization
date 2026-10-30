import os
import sys
import json
import io

print("=== COLORAI STUDIO COMPLETE VERIFICATION TEST ===", flush=True)

# 1. Verify model checkpoint exists
checkpoint = "backend/checkpoints/generator_colorization.keras"
assert os.path.exists(checkpoint), f"Checkpoint missing: {checkpoint}"
print(f"[PASS] Model checkpoint exists ({os.path.getsize(checkpoint)} bytes)", flush=True)

# 2. Verify frontend dist exists
frontend_index = "frontend/dist/index.html"
assert os.path.exists(frontend_index), f"Frontend dist index.html missing: {frontend_index}"
print(f"[PASS] Frontend production build verified ({os.path.getsize(frontend_index)} bytes)", flush=True)

# 3. Import backend components
sys.path.insert(0, os.path.abspath("backend"))
from app import health_check, get_samples, colorize_image, get_model
from fastapi import UploadFile

print("[RUNNING] Testing backend health endpoint...", flush=True)
health = health_check()
print("Health response:", health, flush=True)
assert health["status"] == "healthy", "Backend unhealthy"
assert health["model_loaded"] is True, "Model not loaded"
print("[PASS] Backend health & model verified", flush=True)

print("[RUNNING] Testing samples endpoint...", flush=True)
samples_res = get_samples()
samples = samples_res["samples"]
assert len(samples) > 0, "No samples returned"
print(f"[PASS] Retrieved {len(samples)} curated samples", flush=True)

print("[RUNNING] Testing colorize endpoint with high-fidelity luminance fusion...", flush=True)
sample_img = "backend/samples/sample_1_living_room.png"
with open(sample_img, "rb") as f:
    img_bytes = f.read()

upload_file = UploadFile(
    file=io.BytesIO(img_bytes),
    size=len(img_bytes),
    filename="living_room.png",
    headers={"content-type": "image/png"}
)

res = colorize_image(
    file=upload_file,
    mode="fusion",
    saturation=1.1,
    warmth=5,
    brightness=1.0
)
data = json.loads(res.body.decode("utf-8"))
assert data["success"] is True, "Colorization failed"
assert data["metadata"]["width"] == 640, f"Unexpected width: {data['metadata']['width']}"
assert data["metadata"]["height"] == 426, f"Unexpected height: {data['metadata']['height']}"
assert data["colorized_image"].startswith("data:image/png;base64,"), "Invalid colorized base64"
assert os.path.exists(os.path.join("backend", "outputs", os.path.basename(data["colorized_url"]))), "Saved output file not found on disk"
print(f"[PASS] Inference succeeded in {data['inference_time_ms']}ms (Total: {data['processing_time_ms']}ms)", flush=True)
print(f"[PASS] Output dimensions preserved: {data['metadata']['width']}x{data['metadata']['height']} px", flush=True)

print("[RUNNING] Testing error validation on non-image file...", flush=True)
bad_upload = UploadFile(
    file=io.BytesIO(b"Not an image"),
    size=12,
    filename="malicious.txt",
    headers={"content-type": "text/plain"}
)
from fastapi import HTTPException
try:
    colorize_image(file=bad_upload)
    assert False, "Should have thrown HTTPException 400"
except HTTPException as e:
    assert e.status_code == 400
    print(f"[PASS] Correctly rejected invalid file format with status 400: {e.detail}", flush=True)

print("\n=======================================================", flush=True)
print("ALL VERIFICATION TESTS PASSED SUCCESSFULLY! 100% READY.", flush=True)
print("=======================================================", flush=True)
