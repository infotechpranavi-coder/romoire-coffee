import { prepareBannerImageForUpload } from '@/lib/utils';
import { getYoutubeVideoId } from '@/lib/bannerMedia';
import type { BannerMediaType } from '@/lib/bannerMedia';

type MediaAsset = { public_id: string; url: string; alt: string };

/** Max source banner media file size */
export const MAX_BANNER_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
}

async function parseUploadResponse(uploadRes: Response) {
  const raw = await uploadRes.text();
  let uploadData: {
    success?: boolean;
    error?: string;
    public_id?: string;
    url?: string;
  } = {};

  try {
    uploadData = JSON.parse(raw);
  } catch {
    if (uploadRes.status === 413 || /request entity too large/i.test(raw)) {
      throw new Error('File is too large. Use an image up to 5 MB and try again.');
    }
    throw new Error(
      uploadRes.ok
        ? 'Upload failed with an unexpected server response.'
        : `Upload failed (${uploadRes.status}). Please try again.`
    );
  }

  if (!uploadRes.ok || !uploadData.success) {
    throw new Error(uploadData.error || 'Upload failed.');
  }

  return uploadData;
}

async function uploadBannerFile(
  file: File,
  folder: string
): Promise<MediaAsset> {
  if (file.size > MAX_BANNER_UPLOAD_BYTES) {
    throw new Error('File must be 5 MB or smaller.');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('folder', folder);

  const uploadRes = await fetch('/api/upload/banner', {
    method: 'POST',
    body: form,
  });

  const uploadData = await parseUploadResponse(uploadRes);
  return {
    public_id: uploadData.public_id || '',
    url: uploadData.url || '',
    alt: '',
  };
}

async function uploadImageAsset(file: File, title: string): Promise<MediaAsset> {
  const compressedDataUrl = await prepareBannerImageForUpload(file);
  const compressedFile = dataUrlToFile(
    compressedDataUrl,
    file.name.replace(/\.[^.]+$/, '') + '.jpg'
  );
  const asset = await uploadBannerFile(compressedFile, 'skygo/banners');
  return { ...asset, alt: title };
}

async function uploadVideoAsset(file: File, title: string): Promise<MediaAsset> {
  const asset = await uploadBannerFile(file, 'skygo/banners/videos');
  return { ...asset, alt: title };
}

function imageFromUrl(url: string, title: string): MediaAsset {
  return { public_id: '', url, alt: title };
}

export interface BannerMediaInput {
  mediaType: BannerMediaType;
  title: string;
  imageFile: File | null;
  externalImageUrl: string;
  videoFile: File | null;
  externalVideoUrl: string;
  youtubeUrl: string;
  existingImage?: MediaAsset;
  existingVideo?: MediaAsset;
}

export async function buildBannerMediaPayload(input: BannerMediaInput) {
  const {
    mediaType,
    title,
    imageFile,
    externalImageUrl,
    videoFile,
    externalVideoUrl,
    youtubeUrl,
    existingImage,
    existingVideo,
  } = input;

  let image: MediaAsset | undefined = existingImage;
  let video: MediaAsset | undefined = existingVideo;
  let normalizedYoutubeUrl = '';

  if (imageFile) {
    image = await uploadImageAsset(imageFile, title);
  } else if (externalImageUrl.trim()) {
    image = imageFromUrl(externalImageUrl.trim(), title);
  }

  if (mediaType === 'image') {
    if (!image?.url) {
      throw new Error('Banner image is required.');
    }
    return {
      mediaType,
      image,
      video: null,
      youtubeUrl: '',
    };
  }

  if (mediaType === 'video') {
    if (videoFile) {
      video = await uploadVideoAsset(videoFile, title);
    } else if (externalVideoUrl.trim()) {
      video = imageFromUrl(externalVideoUrl.trim(), title);
    } else if (existingVideo?.url) {
      video = existingVideo;
    }

    if (!video?.url) {
      throw new Error('Banner video file or URL is required.');
    }

    return {
      mediaType,
      image,
      video,
      youtubeUrl: '',
    };
  }

  normalizedYoutubeUrl = youtubeUrl.trim();
  if (!getYoutubeVideoId(normalizedYoutubeUrl)) {
    throw new Error('A valid YouTube link is required.');
  }

  return {
    mediaType,
    image,
    video: null,
    youtubeUrl: normalizedYoutubeUrl,
  };
}
