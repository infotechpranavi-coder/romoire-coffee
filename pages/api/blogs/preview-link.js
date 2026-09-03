function pickMeta(html, property) {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${property}["']`, 'i'),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return '';
}

function pickTitle(html) {
  const og = pickMeta(html, 'og:title');
  if (og) return og;
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1]?.trim() || '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const url = String(req.body?.url || '').trim();
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }

    let parsed;
    try {
      parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return res.status(400).json({ success: false, error: 'Please paste a valid https link' });
    }

    let title = '';
    let description = '';
    let image = '';
    let siteName = parsed.hostname.replace(/^www\./, '');

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; Explore360Bot/1.0; +https://360webiste.vercel.app)',
          Accept: 'text/html,application/xhtml+xml',
        },
        signal: AbortSignal.timeout(12000),
      });

      if (response.ok) {
        const html = await response.text();
        title = pickTitle(html);
        description =
          pickMeta(html, 'og:description') || pickMeta(html, 'description');
        image = pickMeta(html, 'og:image') || pickMeta(html, 'twitter:image');
        siteName = pickMeta(html, 'og:site_name') || siteName;
      }
    } catch (err) {
      console.warn('preview-link fetch failed:', err.message);
    }

    if (!title) {
      try {
        const path = parsed.pathname.replace(/\/+$/, '').split('/').pop() || '';
        title =
          path
            .replace(/[-_]+/g, ' ')
            .replace(/\.[a-z]+$/i, '')
            .replace(/\b\w/g, (c) => c.toUpperCase())
            .slice(0, 120) || 'External Experience';
      } catch {
        title = 'External Experience';
      }
    }
    if (!description) {
      description = `View this experience from ${siteName}.`;
    }

    return res.status(200).json({
      success: true,
      data: {
        url,
        title,
        excerpt: description.slice(0, 200),
        description,
        image,
        siteName,
      },
    });
  } catch (error) {
    console.error('preview-link error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
