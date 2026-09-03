export type BannerMediaType = 'image' | 'video' | 'youtube';

type BannerOrderItem = {
  order?: number;
  createdAt?: string | Date;
};

/** Keep homepage slider and dashboard list in the same display-order sequence. */
export function sortBannersByOrder<T extends BannerOrderItem>(banners: T[] | null | undefined): T[] {
  if (!Array.isArray(banners)) return [];

  return [...banners].sort((a, b) => {
    const orderDiff = (a.order ?? 0) - (b.order ?? 0);
    if (orderDiff !== 0) return orderDiff;

    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return aTime - bTime;
  });
}

export function getYoutubeVideoId(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function getYoutubeEmbedUrl(url?: string | null): string | null {
  const id = getYoutubeVideoId(url);
  if (!id) return null;

  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: id,
    controls: '0',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    showinfo: '0',
    iv_load_policy: '3',
  });

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export function getYoutubeThumbnail(url?: string | null): string | null {
  const id = getYoutubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function getBannerPreviewImage(banner: {
  mediaType?: BannerMediaType;
  image?: { url?: string };
  video?: { url?: string };
  youtubeUrl?: string;
}): string {
  if (banner.mediaType === 'youtube') {
    return getYoutubeThumbnail(banner.youtubeUrl) || banner.image?.url || '';
  }
  if (banner.mediaType === 'video') {
    return banner.image?.url || '';
  }
  return banner.image?.url || '';
}

export function getBannerMediaLabel(mediaType?: BannerMediaType) {
  if (mediaType === 'video') return 'Video';
  if (mediaType === 'youtube') return 'YouTube';
  return 'Image';
}
