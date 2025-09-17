import { v2 as cloudinary } from 'cloudinary';
import logUtil from '../utils/logUtil.js';

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  logUtil.warn('Cloudinary is not configured. Image uploads will fail.');
}

export default cloudinary;