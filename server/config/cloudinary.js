import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import CloudinaryStorage from "multer-storage-cloudinary";
import multer from "multer";

// Cloudinary Bağlantı Ayarları
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage Motoru (Yükleme Kuralları)
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "TaskProFolder",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => `custom_${Date.now()}`,
  },
});

const upload = multer({ storage });

export default upload;
