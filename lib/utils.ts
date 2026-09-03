import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Compresses an image file on the client side using Canvas.
 * This prevents "413 Content Too Large" errors by reducing high-res images
 * (often 5-10MB) to ~200-500KB before upload.
 */
/**
 * Returns a sharp Cloudinary / external URL for hero banners.
 * `width` should match viewport × devicePixelRatio (capped at 3840).
 */
export function getHeroBannerUrl(url: string, publicId?: string, width = 1920): string {
  if (!url) return url;

  if (url.includes('images.unsplash.com')) {
    const upgraded = url
      .replace(/w=\d+/i, `w=${width}`)
      .replace(/q=\d+/i, 'q=75');
    return upgraded.includes('w=')
      ? upgraded
      : `${upgraded}${upgraded.includes('?') ? '&' : '?'}w=${width}&q=75`;
  }

  if (!url.includes('res.cloudinary.com')) return url;

  const cloudName = url.match(/res\.cloudinary\.com\/([^/]+)/)?.[1];
  const assetPath = resolveCloudinaryAssetPath(url, publicId);
  if (!cloudName || !assetPath) return url;

  const transforms = `c_limit,w_${width},q_auto:good,f_auto`;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms}/${assetPath}`;
}

export function getHeroBannerSrcSet(url: string, publicId?: string): string {
  const widths = [1080, 1600, 1920, 2560];
  return widths
    .map((w) => `${getHeroBannerUrl(url, publicId, w)} ${w}w`)
    .join(', ');
}

function resolveCloudinaryAssetPath(url: string, publicId?: string): string | null {
  const afterUpload = url.split('/upload/')[1];
  if (!afterUpload) return publicId || null;

  // Stored URL with version — always prefer this over bare public_id
  if (/^v\d+\//.test(afterUpload)) {
    return afterUpload;
  }

  // Legacy URL that baked transforms into the path — strip to versioned asset
  const versioned = afterUpload.match(/(?:.+\/)?(v\d+\/.+)$/);
  if (versioned?.[1]) {
    return versioned[1];
  }

  return publicId || afterUpload;
}

/** Reads a file as base64 without re-encoding (preserves full quality). */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Prepares a banner for upload at 16:9-friendly size.
 * Caps width at 1920px and uses JPEG so the payload stays under Vercel's ~4.5MB body limit.
 */
export function prepareBannerImageForUpload(
  file: File,
  targetMinWidth = 1920,
  maxWidth = 1920,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width < targetMinWidth) {
          const scale = targetMinWidth / width;
          width = targetMinWidth;
          height = Math.round(height * scale);
        } else if (width > maxWidth) {
          const scale = maxWidth / width;
          width = maxWidth;
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to prepare banner image'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Always JPEG — PNG banners are too large for serverless upload limits
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function compressImage(file: File, maxWidth = 1920, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Calculate the new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error("Failed to get canvas context"));
        }
        
        // Use high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 JPEG (base64 of JPEG is much smaller than PNG for photos)
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}
