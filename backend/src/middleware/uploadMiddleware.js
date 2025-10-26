import multer from "multer";

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images and videos for form media
  const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg/;
  const allowedVideoTypes = /mp4|webm|ogg|mov/;
  const allowedDocTypes = /pdf|doc|docx|xls|xlsx|txt/;

  const mimetype =
    allowedImageTypes.test(file.mimetype) ||
    allowedVideoTypes.test(file.mimetype) ||
    allowedDocTypes.test(file.mimetype);

  if (mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, videos, and documents are allowed."
      )
    );
  }
};

// Create upload middleware
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: fileFilter,
});

// Specific middleware for different upload types
export const uploadSingle = upload.single("file");
export const uploadMultiple = upload.array("files", 5); // Max 5 files
