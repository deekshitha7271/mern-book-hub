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
  uploadNewAudioBook,
} from "../controller/audio.controller.js";
import { validation } from "../middlewares/validation.js";
import { upload, uploadAudio } from "../middlewares/upload.js";

const route = Router();

/* ---------- Audio Books ---------- */
route.post("/upload/audio", uploadAudio.array("audio"), validation, uploadNewAudioBook);
route.get("/get/audio", getAllAudioBooks);

/* ----------  Normal Books ---------- */
route.post("/post", validation, createBooks);
route.get("/get", validation, getBooks);
route.get("/get/:id", validation, getSpecificBook);
route.post("/upload", upload.single("pdf"), saveBookWithPDF);

/* ---------- User Auth ---------- */
route.post("/register", createUser);
route.post("/login", loginUser);

export default route;
