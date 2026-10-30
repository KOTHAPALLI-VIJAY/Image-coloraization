"""
Pix2Pix GAN Colorization Training Script.
Trains the generator to convert grayscale images (L) to realistic color images (RGB)
using Adam optimizer and L1 loss / adversarial training.
"""

import os
import tensorflow as tf
from model import build_generator, IMG_SIZE

BATCH_SIZE = 8
EPOCHS = 100
LEARNING_RATE = 2e-4
BETA_1 = 0.5
CHECKPOINT_PATH = "checkpoints/generator_colorization.keras"


def load_image(file_path):
    """Loads, resizes, and normalizes an image to [-1, 1], returning (gray, color)."""
    img = tf.io.read_file(file_path)
    img = tf.image.decode_jpeg(img, channels=3)
    img = tf.image.resize(img, [IMG_SIZE, IMG_SIZE])
    img = (img / 127.5) - 1.0

    gray = tf.image.rgb_to_grayscale(img)
    return gray, img


def create_dataset(data_dir):
    """Creates a tf.data pipeline from an image directory."""
    file_pattern = os.path.join(data_dir, "*.jpg")
    file_paths = tf.data.Dataset.list_files(file_pattern, shuffle=True)
    dataset = file_paths.map(load_image, num_parallel_calls=tf.data.AUTOTUNE)
    dataset = dataset.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
    return dataset


def train():
    os.makedirs("checkpoints", exist_ok=True)
    generator = build_generator()
    generator.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE, beta_1=BETA_1),
        loss="mae",
        metrics=["mse"]
    )
    generator.summary()

    data_dir = "dataset/train2017"
    if os.path.exists(data_dir) and len(os.listdir(data_dir)) > 0:
        print(f"Loading training images from {data_dir}...")
        dataset = create_dataset(data_dir)
        print(f"Starting training for {EPOCHS} epochs...")
        generator.fit(dataset, epochs=EPOCHS)
        generator.save(CHECKPOINT_PATH)
        print(f"Model trained and saved to {CHECKPOINT_PATH} successfully!")
    else:
        print(f"Dataset directory '{data_dir}' not found or empty.")
        print(f"Saved initial initialized generator model to {CHECKPOINT_PATH}.")
        generator.save(CHECKPOINT_PATH)


if __name__ == "__main__":
    train()
