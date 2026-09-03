/**
 * Proxies an external page so it can be shown inside our blog detail iframe
 * (avoids X-Frame-Options on the parent document when the upstream allows fetching).
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  const rawUrl = String(req.query.url || '').trim();
  if (!rawUrl) {
    return res.status(400).send('Missing url');
  }

  let target;
  try {
    target = new URL(rawUrl);
    if (!['http:', 'https:'].includes(target.protocol)) {
      throw new Error('Invalid protocol');
    }
  } catch {
    return res.status(400).send('Invalid url');
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });

    const contentType = upstream.headers.get('content-type') || '';
    if (!upstream.ok) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.removeHeader('X-Frame-Options');
      res.setHeader('Content-Security-Policy', 'frame-ancestors *');
      return res.status(200).send(`<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><title>Preview unavailable</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:2rem;background:#f8fafc;color:#1e293b;text-align:center}
a{display:inline-block;margin-top:1rem;background:#bd9245;color:#fff;text-decoration:none;padding:.85rem 1.5rem;border-radius:999px;font-weight:700;font-size:.8rem;text-transform:uppercase;letter-spacing:.06em}</style>
</head><body>
<div><p>This page could not be loaded in the preview.</p>
<a href="${target.toString()}" target="_blank" rel="noopener noreferrer">Open original page</a></div>
</body></html>`);
    }

    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      const buf = Buffer.from(await upstream.arrayBuffer());
      res.setHeader('Content-Type', contentType || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=300');
      return res.status(200).send(buf);
    }

    let html = await upstream.text();

    if (!/<base\s/i.test(html)) {
      html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${target.origin}/">`);
      if (!/<base\s/i.test(html)) {
        html = `<base href="${target.origin}/">${html}`;
      }
    }

    html = html
      .replace(/if\s*\(\s*top\s*!==?\s*self\s*\)/gi, 'if(false)')
      .replace(/if\s*\(\s*self\s*!==?\s*top\s*\)/gi, 'if(false)')
      .replace(/if\s*\(\s*window\s*\.\s*top\s*!==?\s*window\s*\.\s*self\s*\)/gi, 'if(false)')
      .replace(/top\.location\s*=/gi, 'void 0; //')
      .replace(/parent\.location\s*=/gi, 'void 0; //');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=120');
    res.removeHeader('X-Frame-Options');
    res.setHeader('Content-Security-Policy', 'frame-ancestors *');
    return res.status(200).send(html);
  } catch (error) {
    console.error('embed-proxy error:', error.message);
    return res.status(502).send(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:2rem;text-align:center">
        <p>Could not load this page inside the preview.</p>
        <p><a href="${target.toString()}" target="_blank" rel="noopener">Open original link</a></p>
      </body></html>`
    );
  }
}
