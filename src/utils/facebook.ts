/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Checks if the given URL is a Facebook post, video, or picture link.
 */
export const isFacebookUrl = (url: string): boolean => {
  if (!url) return false;
  const cleaned = url.trim().toLowerCase();
  return (
    cleaned.includes('facebook.com') ||
    cleaned.includes('fb.watch') ||
    cleaned.includes('fb.com')
  );
};

/**
 * Returns a valid Facebook plugins embed URL for a given Facebook link.
 */
export const getFacebookEmbedUrl = (url: string): string => {
  if (!url) return '';
  const trimmedUrl = url.trim();

  // Determine if it is likely a video, watch, or live link
  const isVideo =
    trimmedUrl.includes('/videos/') ||
    trimmedUrl.includes('/watch') ||
    trimmedUrl.includes('fb.watch') ||
    trimmedUrl.includes('v=') ||
    trimmedUrl.includes('/share/v/');

  const baseUrl = isVideo
    ? 'https://www.facebook.com/plugins/video.php'
    : 'https://www.facebook.com/plugins/post.php';

  // Return the standard full plugin URL with safe encoding
  return `${baseUrl}?href=${encodeURIComponent(trimmedUrl)}&show_text=true&width=500&height=500`;
};
