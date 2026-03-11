import multer from "multer";
import path from "path";
import fs from "fs";

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req: any, file, cb) => {
      // Create consistent filename that includes userId
      const userId = req.userId; // Make sure userId is available in req
      const fileExt = path.extname(file.originalname) || ".jpg";
      const filename = `${Date.now()}_${userId}${fileExt}`;
      cb(null, filename);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// OR for more control, use storage configuration:
// export const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       const uploadDir = path.join(process.cwd(), "public/uploads");
//       // Ensure directory exists
//       if (!fs.existsSync(uploadDir)) {
//         fs.mkdirSync(uploadDir, { recursive: true });
//       }
//       cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//       // Create unique filename
//       const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
//       const fileExt = path.extname(file.originalname);
//       cb(null, file.fieldname + "_" + uniqueSuffix + fileExt);
//     },
//   }),
//   limits: {
//     fileSize: 10 * 1024 * 1024, // 10MB limit
//   },
// });
