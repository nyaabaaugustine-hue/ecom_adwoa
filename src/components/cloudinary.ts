const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dwsl2ktt2';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop&q=80';

export function getSafeImageUrl(src: string, width?: number): string {
  if (!src) {
    return FALLBACK_IMAGE;
  }

  // Locally-uploaded image from BEFORE the Cloudinary migration
  // ("/api/upload" used to write to public/uploads => "/uploads/xyz.jpg").
  // public/uploads is gitignored and Vercel's filesystem is ephemeral, so
  // these paths are guaranteed to 404 in production. Fall back immediately
  // instead of requesting a file that will never exist. New uploads go to
  // Cloudinary and return a full https://res.cloudinary.com/... URL, which
  // is handled further below and unaffected by this.
  if (src.startsWith('/uploads/')) {
    return FALLBACK_IMAGE;
  }

  // Locally-uploaded image (from /api/upload => "/uploads/xyz.jpg") — serve as-is,
  // Next/Image handles local /public paths natively without needing remotePatterns.
  if (src.startsWith('/')) {
    return src;
  }

  // Already a full external URL (e.g. a stock photo or any non-Cloudinary CDN) —
  // use it directly instead of proxying through Cloudinary's fetch delivery,
  // which requires "allowed fetch domains" to be configured and is unreliable
  // if that hasn't been set up.
  if ((src.startsWith('http://') || src.startsWith('https://')) && !src.includes('res.cloudinary.com')) {
    return src;
  }

  // Full Cloudinary URL — apply f_auto/q_auto (+ optional width) transforms.
  if (src.startsWith('http://') || src.startsWith('https://')) {
    const parts = src.split('image/upload/');
    if (parts.length < 2) return src;

    const tail = parts[1].replace(/^v\d+\//, '');
    const transforms = [`f_auto`, `q_auto`];
    if (width) transforms.push(`w_${width}`);

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms.join(',')}/v1/${tail}`;
  }

  // Bare identifier that isn't a URL or local path — a leftover/placeholder
  // Cloudinary public_id that was never actually uploaded. Fall back to a
  // stock image rather than requesting an asset that doesn't exist.
  return FALLBACK_IMAGE;
}
