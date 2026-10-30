"""
Image Preprocessing and Postprocessing Pipeline for GAN Colorization Studio.
Maintains exact input normalization, color spaces, and resolution preservation.
"""

import io
import base64
import numpy as np
import cv2
from PIL import Image, ImageOps

IMG_SIZE = 256

def preprocess_image(image_bytes: bytes, target_size=(IMG_SIZE, IMG_SIZE)):
    """
    Validates, corrects orientation, and preprocesses an uploaded image.
    
    Returns:
        dict:
            - input_tensor: (1, 256, 256, 1) float32 in [-1.0, 1.0]
            - original_rgb: (H, W, 3) uint8 numpy array
            - original_gray: (H, W) uint8 numpy array
            - orig_w: original width in pixels
            - orig_h: original height in pixels
            - file_size_kb: file size in KB
    """
    file_size_kb = round(len(image_bytes) / 1024, 2)
    
    # Load via PIL for robust format handling and EXIF correction
    pil_img = Image.open(io.BytesIO(image_bytes))
    pil_img = ImageOps.exif_transpose(pil_img)
    
    # Ensure RGB
    if pil_img.mode != "RGB":
        pil_img = pil_img.convert("RGB")
        
    original_rgb = np.array(pil_img, dtype=np.uint8)
    orig_h, orig_w = original_rgb.shape[:2]
    
    # Full-resolution grayscale
    original_gray = cv2.cvtColor(original_rgb, cv2.COLOR_RGB2GRAY)
    
    # Model input resize (256, 256)
    interp = cv2.INTER_AREA if (orig_w > target_size[0] or orig_h > target_size[1]) else cv2.INTER_CUBIC
    resized_gray = cv2.resize(original_gray, target_size, interpolation=interp)
    
    # Normalize to [-1.0, 1.0] exactly matching training
    norm_gray = (resized_gray.astype(np.float32) / 127.5) - 1.0
    
    # Shape: (1, 256, 256, 1)
    input_tensor = np.expand_dims(norm_gray, axis=(0, -1)).astype(np.float32)
    
    return {
        "input_tensor": input_tensor,
        "original_rgb": original_rgb,
        "original_gray": original_gray,
        "orig_w": orig_w,
        "orig_h": orig_h,
        "file_size_kb": file_size_kb,
        "aspect_ratio": round(orig_w / orig_h, 3)
    }

def postprocess_image(
    prediction_tensor: np.ndarray,
    original_gray: np.ndarray,
    mode: str = "fusion",
    saturation: float = 1.0,
    warmth: int = 0,
    brightness: float = 1.0
) -> np.ndarray:
    """
    Converts raw GAN prediction back into high-fidelity full-resolution color image.
    
    Args:
        prediction_tensor: (1, 256, 256, 3) or (256, 256, 3) float in [-1, 1]
        original_gray: (orig_h, orig_w) original grayscale image
        mode: "fusion" (High-Fidelity Luminance preservation) or "direct" (Direct GAN resize)
        saturation: Multiplier for color saturation (0.0 to 2.0, default 1.0)
        warmth: Temperature shift in [-50, 50] (default 0)
        brightness: Multiplier for brightness (0.5 to 1.5, default 1.0)
        
    Returns:
        np.ndarray: (orig_h, orig_w, 3) uint8 RGB image
    """
    if prediction_tensor.ndim == 4:
        pred = prediction_tensor[0]
    else:
        pred = prediction_tensor

    # Denormalize from [-1, 1] to [0, 255]
    pred_rgb_256 = ((pred + 1.0) * 127.5).clip(0, 255).astype(np.uint8)
    
    orig_h, orig_w = original_gray.shape[:2]

    if mode == "fusion":
        # Luminance Fusion:
        # Use full-resolution original grayscale as L channel in LAB color space
        # Use predicted A & B chrominance channels upscaled to original resolution
        pred_lab = cv2.cvtColor(pred_rgb_256, cv2.COLOR_RGB2LAB)
        ab_upscaled = cv2.resize(pred_lab[:, :, 1:], (orig_w, orig_h), interpolation=cv2.INTER_CUBIC)
        
        merged_lab = np.dstack((original_gray, ab_upscaled))
        final_rgb = cv2.cvtColor(merged_lab, cv2.COLOR_LAB2RGB)
    else:
        # Direct mode: Direct resize of 256x256 RGB prediction
        final_rgb = cv2.resize(pred_rgb_256, (orig_w, orig_h), interpolation=cv2.INTER_CUBIC)

    # Optional fine-tuning adjustments
    final_rgb = apply_adjustments(final_rgb, saturation=saturation, warmth=warmth, brightness=brightness)

    return final_rgb

def apply_adjustments(img_rgb: np.ndarray, saturation: float = 1.0, warmth: int = 0, brightness: float = 1.0) -> np.ndarray:
    """Applies saturation, warmth, and brightness adjustments to an RGB image."""
    result = img_rgb.copy()

    # Apply warmth (shift R positive, B negative)
    if warmth != 0:
        r = result[:, :, 0].astype(np.int16) + warmth
        b = result[:, :, 2].astype(np.int16) - warmth
        result[:, :, 0] = np.clip(r, 0, 255).astype(np.uint8)
        result[:, :, 2] = np.clip(b, 0, 255).astype(np.uint8)

    # Apply saturation & brightness via HSV
    if saturation != 1.0 or brightness != 1.0:
        hsv = cv2.cvtColor(result, cv2.COLOR_RGB2HSV).astype(np.float32)
        if saturation != 1.0:
            hsv[:, :, 1] = np.clip(hsv[:, :, 1] * saturation, 0, 255)
        if brightness != 1.0:
            hsv[:, :, 2] = np.clip(hsv[:, :, 2] * brightness, 0, 255)
        result = cv2.cvtColor(hsv.astype(np.uint8), cv2.COLOR_HSV2RGB)

    return result

def image_to_base64(img_array: np.ndarray, format: str = "PNG") -> str:
    """Encodes a uint8 numpy image (RGB or Grayscale) into a base64 data URI string."""
    pil_img = Image.fromarray(img_array)
    buf = io.BytesIO()
    pil_img.save(buf, format=format, optimize=True)
    b64_str = base64.b64encode(buf.getvalue()).decode("utf-8")
    mime = "image/png" if format.upper() == "PNG" else "image/jpeg"
    return f"data:{mime};base64,{b64_str}"

def rgb_to_gray(img: np.ndarray) -> np.ndarray:
    """Helper preserving legacy signature for backward compatibility."""
    gray = cv2.cvtColor((img * 127.5 + 127.5).astype(np.uint8), cv2.COLOR_RGB2GRAY)
    gray = gray / 127.5 - 1.0
    return np.expand_dims(gray, axis=-1)

