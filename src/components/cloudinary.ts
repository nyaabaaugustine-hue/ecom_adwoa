/**
 * Cloudinary utility for safe image delivery with fallbacks.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwsl2ktt2';

/**
 * Generates a Cloudinary URL with an automatic fallback.
 * 
 * For external URLs (e.g., Unsplash): uses Cloudinary's fetch API
 * For Cloudinary public IDs: uses the upload API with fallback
 * 
 * @param src - The image source (full URL or Cloudinary public ID)
 * @returns A formatted Cloudinary URL string
 */
export function getSafeImageUrl(src: string): string {
  // Handle external URLs using Cloudinary's fetch API
  if (src.startsWith('http://') || src.startsWith('https://')) {
    // Check if it's already a Cloudinary URL
    if (src.includes('res.cloudinary.com')) {
      return src;
    }
    // Use fetch API for external images
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/${src}`;
  }

  // Handle Cloudinary public IDs
  const idOnly = src.includes('image/upload/') 
    ? src.split('image/upload/').pop()?.replace(/v\d+\//, '') 
    : src;

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/d_default.jpg/v1/${idOnly}`;
}