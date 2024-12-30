// YouTube API Keys
const API_KEYS = [
  'AIzaSyDJFNUeBWwKYZKn2_b0E5vyTbayHBgoNLI',
  'AIzaSyBYYtHG7Nx-WVCwgS7xGiog6wsoy-RK8Sg',
  'AIzaSyDlozYUr-Qjrrk9_D0BojzVkvnPp70HYYA',
  'AIzaSyB-lKNBZAzW0KyYWe7uW3xUVEsjj6XsUY8',
  'AIzaSyBatITv9FABAKd3XvPs2tnbkTPw5xjmb9A',
  'AIzaSyCFLQFX3SLzvjDQTpiiCn5K_g0VLKd3tCM',
  'AIzaSyCKWTsJD2n_Bejc0sQ1d1a-Iy5v8Fz0xBc',
  'AIzaSyD9mqbrUrGy3lnuhk5oiATo8gj95k3jAFk'
];

// Key rotation settings
const KEY_ROTATION_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
let currentKeyIndex = 0;
let lastRotation = Date.now();

// Get current API key with rotation
export function getYouTubeApiKey(): string {
  const now = Date.now();
  if (now - lastRotation >= KEY_ROTATION_INTERVAL) {
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    lastRotation = now;
  }
  return API_KEYS[currentKeyIndex];
}

export const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';