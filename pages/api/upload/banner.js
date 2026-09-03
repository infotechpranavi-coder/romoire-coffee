import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES },
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

function uploadBufferToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
    stream.end(buffer);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return res.status(500).json({
      success: false,
      error: 'Cloudinary is not configured. Add CLOUDINARY_* env vars.',
    });
  }

  try {
    await runMiddleware(req, res, upload.single('file'));

    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }

    const folder =
      (typeof req.body?.folder === 'string' && req.body.folder.trim()) || 'skygo/banners';
    const isVideo = file.mimetype.startsWith('video/');

    const result = await uploadBufferToCloudinary(file.buffer, {
      folder,
      resource_type: isVideo ? 'video' : 'image',
      ...(isVideo
        ? {}
        : {
            quality: 'auto:good',
            fetch_format: 'auto',
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
    if (error?.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        error: 'File must be 5 MB or smaller.',
      });
    }

    console.error('Banner upload error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Upload failed',
    });
  }
}
