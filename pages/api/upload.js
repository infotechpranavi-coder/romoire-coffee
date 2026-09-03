import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { data, folder, resourceType } = req.body;

    if (!data) {
      return res.status(400).json({ success: false, error: 'No file data provided' });
    }

    const uploadFolder = folder || process.env.CLOUDINARY_UPLOAD_FOLDER || 'skygo/packages';
    const isBanner = String(folder || '').includes('banner');
    const isVideo = resourceType === 'video';

    const result = await cloudinary.uploader.upload(data, {
      folder: uploadFolder,
      resource_type: isVideo ? 'video' : 'image',
      ...(isVideo
        ? {}
        : isBanner
          ? {
              quality: 100,
              flags: 'keep_iptc',
            }
          : {
              transformation: [
                { width: 1920, crop: 'limit', quality: 'auto:good' },
              ],
            }),
    });

    return res.status(200).json({
      success: true,
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      resource_type: result.resource_type,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
