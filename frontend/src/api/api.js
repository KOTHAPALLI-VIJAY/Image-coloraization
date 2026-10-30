/**
 * API client for ColorAI Studio backend.
 * Provides resilient communication with health check, sample fetching, and colorization endpoints.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Checks backend health and GAN model load status.
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend health check error:', err);
    return {
      status: 'offline',
      model_loaded: false,
      error: err.message
    };
  }
}

/**
 * Fetches available sample images.
 */
export async function fetchSamples() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/samples`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to load samples');
    const data = await res.json();
    return data.samples || [];
  } catch (err) {
    console.warn('Failed to fetch samples from API, falling back to static manifest:', err);
    // Fallback to static public samples manifest
    const fallback = await fetch('/samples/manifest.json');
    if (fallback.ok) return await fallback.json();
    return [];
  }
}

/**
 * Colorizes an image file through the GAN backend.
 * 
 * @param {File|Blob} file Image file to colorize
 * @param {Object} options Optional settings: mode, saturation, warmth, brightness
 * @returns {Promise<Object>} API response with previews and output URL
 */
export async function colorizeImage(file, options = {}) {
  const formData = new FormData();
  formData.append('file', file, file.name || 'image.png');
  
  if (options.mode) formData.append('mode', options.mode);
  if (options.saturation !== undefined) formData.append('saturation', options.saturation.toString());
  if (options.warmth !== undefined) formData.append('warmth', options.warmth.toString());
  if (options.brightness !== undefined) formData.append('brightness', options.brightness.toString());

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const res = await fetch(`${API_BASE_URL}/api/colorize`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMsg = 'Colorization failed.';
      try {
        const errorData = await res.json();
        errorMsg = errorData.detail || errorData.message || errorMsg;
      } catch (e) {
        errorMsg = `Server error (${res.status} ${res.statusText})`;
      }
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Colorization timed out. Please try a smaller image or retry.');
    }
    throw err;
  }
}

/**
 * Helper to get absolute download URL for a colorized image.
 */
export function getDownloadUrl(colorizedUrl) {
  if (!colorizedUrl) return '';
  if (colorizedUrl.startsWith('http://') || colorizedUrl.startsWith('https://')) {
    return colorizedUrl;
  }
  return `${API_BASE_URL}${colorizedUrl}`;
}

