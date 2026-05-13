/**
 * Cloudinary utility for safe image delivery with fallbacks.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwsl2ktt2';

/**
 * Generates a Cloudinary URL with an automatic fallback.
 * Format: https://res.cloudinary.com/[cloud-name]/image/upload/d_default.jpg/v1/[public-id]
 * 
 * @param publicId - The public ID of the image or a full Cloudinary URL
 * @returns A formatted Cloudinary URL string
 */
export function getSafeImageUrl(publicId: string): string {
  // Handle cases where a full URL might be passed by extracting the ID after /upload/(v\d+/)?
  const idOnly = publicId.includes('image/upload/') 
    ? publicId.split('image/upload/').pop()?.replace(/v\d+\//, '') 
    : publicId;

  // We use 'd_default.jpg' as the fallback parameter. 
  // Ensure 'default.jpg' exists in your Cloudinary media library root.
  // v1 is used as a placeholder version for consistency.
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/d_default.jpg/v1/${idOnly}`;
}