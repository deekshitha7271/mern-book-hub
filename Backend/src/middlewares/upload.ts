import fs from "fs";
import multer from "multer";
import path from "path";

// Ensure uploads folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // save PDFs here
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique name
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
});



// Audio upload setup

const audioDir = "uploads/audio/";
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

const storageAudio = multer.diskStorage({
  destination: (req, file, cb) => cb(null, audioDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

export const uploadAudio = multer({
  storage: storageAudio,
  fileFilter: (req, file, cb) => {
    const allowed = ["audio/mpeg", "audio/mp3", "audio/mp4", "audio/x-m4a", "audio/aac"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only audio files allowed (mp3,m4a,aac)"));
  },
  limits: { fileSize: 600 * 1024 * 1024 } // 600MB max - adjust as needed
});
