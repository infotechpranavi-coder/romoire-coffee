import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(500).json({
        success: false,
        error: 'Cloudinary is not configured. Add CLOUDINARY_* env vars.',
      });
    }

    const folder =
      (typeof req.body?.folder === 'string' && req.body.folder.trim()) ||
      process.env.CLOUDINARY_UPLOAD_FOLDER ||
      'skygo/packages';
    const resourceType =
      req.body?.resourceType === 'video' ? 'video' : 'image';

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { timestamp, folder };
    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    return res.status(200).json({
      success: true,
      cloudName,
      apiKey,
      timestamp,
      signature,
      folder,
      resourceType,
    });
  } catch (error) {
    console.error('Cloudinary sign error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
