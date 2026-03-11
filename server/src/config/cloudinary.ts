// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Create storage engine for multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: process.env.CLOUDINARY_UPLOAD_FOLDER || "uploads",
//       format: "jpg", // or 'png', 'webp', etc.
//       public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
//       transformation: [{ width: 1000, crop: "limit" }], // Optional: resize images
//     };
//   },
// });

// // Create multer upload middleware
// export const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     // Allow only images
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed!") as any, false);
//     }
//   },
// });

// export default cloudinary;
