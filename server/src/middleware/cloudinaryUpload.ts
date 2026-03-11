// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Create storage engine specifically for receipts
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: (req, file) => ({
//     folder: "receipts", // All receipts go here
//     allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
//     transformation: [{ width: 1000, crop: "limit" }], // Resize large images
//     public_id: `receipt-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
//   }),
// });

// // Create multer upload middleware for single file
// export const uploadReceipt = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     // Only allow images
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed!") as any, false);
//     }
//   },
// }).single("receipt"); // 'receipt' is the field name in your form
