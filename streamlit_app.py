"""
Streamlit legacy app preserved for reference.
To run modern web app:
Backend: uvicorn app:app --port 8000
Frontend: cd frontend && npm run dev
"""

import streamlit as st
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import io

IMG_SIZE = 256
OUTPUT_SIZE = 512

st.set_page_config(
    page_title="AI Image Colorization (Streamlit Legacy)",
    page_icon="🎨",
    layout="wide"
)

st.title("🎨 AI Image Colorization (Legacy Streamlit Mode)")
st.info("💡 Note: A modern React + FastAPI Web Application is now available! See README.md.")

@st.cache_resource
def load_model():
    return tf.keras.models.load_model(
        "checkpoints/generator_colorization.keras",
        compile=False
    )

model = load_model()
uploaded_file = st.file_uploader("Upload any image file", type=["jpg", "jpeg", "png", "webp"])

if uploaded_file:
    pil_image = Image.open(uploaded_file).convert("RGB")
    original = np.array(pil_image)
    h, w = original.shape[:2]

    img = cv2.resize(original, (IMG_SIZE, IMG_SIZE))
    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
    norm_gray = (gray / 127.5) - 1.0
    input_tensor = np.expand_dims(norm_gray, axis=(0, -1)).astype(np.float32)

    pred = model(input_tensor, training=False)[0].numpy()
    pred_rgb = ((pred + 1.0) * 127.5).clip(0, 255).astype(np.uint8)

    # Luminance fusion for crisp resolution
    pred_lab = cv2.cvtColor(pred_rgb, cv2.COLOR_RGB2LAB)
    orig_gray = cv2.cvtColor(original, cv2.COLOR_RGB2GRAY)
    ab_resized = cv2.resize(pred_lab[:, :, 1:], (w, h), interpolation=cv2.INTER_CUBIC)
    merged_lab = np.dstack((orig_gray, ab_resized))
    colorized = cv2.cvtColor(merged_lab, cv2.COLOR_LAB2RGB)

    col1, col2 = st.columns(2)
    with col1:
        st.subheader("🖤 Original")
        st.image(original, use_container_width=True)
    with col2:
        st.subheader("🌈 Colorized")
        st.image(colorized, use_container_width=True)

