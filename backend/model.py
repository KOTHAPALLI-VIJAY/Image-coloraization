"""
GAN Generator Model Definition for Image Colorization.
Matches the architecture and layer structure of checkpoints/generator_colorization.keras.
"""

import tensorflow as tf
from tensorflow.keras import layers

IMG_SIZE = 256

def build_generator(input_shape=(IMG_SIZE, IMG_SIZE, 1)):
    """
    Builds the Pix2Pix U-Net Generator.
    Input: (256, 256, 1) Grayscale normalized to [-1, 1]
    Output: (256, 256, 3) Color RGB normalized to [-1, 1]
    """
    inputs = layers.Input(shape=input_shape, name="input_layer")

    # Encoder Step 1: 256x256x1 -> 128x128x64
    e1 = layers.Conv2D(64, kernel_size=4, strides=2, padding='same', name="conv2d")(inputs)
    e1 = layers.LeakyReLU(name="leaky_re_lu")(e1)

    # Encoder Step 2: 128x128x64 -> 64x64x128
    e2 = layers.Conv2D(128, kernel_size=4, strides=2, padding='same', name="conv2d_1")(e1)
    e2 = layers.BatchNormalization(name="batch_normalization")(e2)
    e2 = layers.LeakyReLU(name="leaky_re_lu_1")(e2)

    # Decoder Step 1: 64x64x128 -> 128x128x64
    d1 = layers.Conv2DTranspose(64, kernel_size=4, strides=2, padding='same', name="conv2d_transpose")(e2)
    d1 = layers.BatchNormalization(name="batch_normalization_1")(d1)
    d1 = layers.ReLU(name="re_lu")(d1)

    # U-Net Skip Connection: Concatenate d1 (128x128x64) and e1 (128x128x64) -> 128x128x128
    skip = layers.Concatenate(name="concatenate")([d1, e1])

    # Decoder Step 2: 128x128x128 -> 256x256x3
    outputs = layers.Conv2DTranspose(
        3, kernel_size=4, strides=2, padding='same', activation='tanh', name="conv2d_transpose_1"
    )(skip)

    return tf.keras.Model(inputs=inputs, outputs=outputs, name="functional")

if __name__ == "__main__":
    gen = build_generator()
    gen.summary()

