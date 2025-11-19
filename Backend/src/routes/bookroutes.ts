import { Router } from "express";
import {
  createBooks,
  getBooks,
  getSpecificBook,
  createUser,
  loginUser,
  saveBookWithPDF,
} from "../controller/book.controller.js";
import {
  getAllAudioBooks,
  streamAudio,
  saveProgress,
  getProgress,
  uploadNewAudioBook,
} from "../controller/audio.controller.js";
import { validation } from "../middlewares/validation.js";
import { upload, uploadAudio } from "../middlewares/upload.js";

const route = Router();

/* ----------  Normal Books ---------- */
route.post("/post", validation, createBooks);
route.get("/get", validation, getBooks);
route.get("/get/:id", validation, getSpecificBook);
route.post("/upload", upload.single("pdf"), saveBookWithPDF);

/* ---------- User Auth ---------- */
route.post("/register", createUser);
route.post("/login", loginUser);

/* ---------- Audio Books ---------- */
route.post("/upload/audio", uploadAudio.array("audio"), validation, uploadNewAudioBook);
// route.get("/get/audio", async (req, res) => {

//   try {
//     // Test if we can access the database
//     const isConnected = mongoose.connection.readyState === 1;
//     console.log('Database connection state:', isConnected);

//     // Try to count documents first
//     const count = await AudioBookModel.countDocuments();
//     console.log('Number of documents:', count);

//     // Then try to fetch them
//     const books = await AudioBookModel.find({});
//     console.log('Found books:', books);

//     return res.json({ 
//       success: true, 
//       count, 
//       books,
//       dbState: mongoose.connection.readyState
//     });
//   } catch (error: any) {
//     console.error('Detailed error:', error);
//     return res.status(500).json({
//       error: "Error in test route",
//       message: error.message,
//       stack: error.stack
//     });
//   }
// });
route.get("/stream/audio/:id",validation, streamAudio);
route.post("/progress/audio/:id",validation, saveProgress);
route.get("/get/audio", getAllAudioBooks);
route.get("/progress/audio/:id",validation, getProgress);

export default route;
