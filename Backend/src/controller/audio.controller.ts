import type { Request, Response } from "express";
import { AudioBookModel } from "../models/audiobookmodel.js";

// Upload a brand-new Audiobook

export async function uploadNewAudioBook(req: Request, res: Response) {
  try {
    const { title, authorName, coverPic } = req.body;

    if (!title || !authorName || !coverPic) {
      return res.status(400).json({ error: "Title, author name, and coverPic are required" });
    }

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ error: "At least one audio file is required" });
    }

    const files = req.files as Express.Multer.File[];

    //  Generate URLs for each uploaded file
    const audioFilePaths = files.map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/audio/${file.filename}`
    );

    const newAudioBook = await AudioBookModel.create({
      title,
      authorName,
      coverPic,
      audio: audioFilePaths, // store array of URLs
    });

    return res.status(201).json({
      message: " Multiple audio files uploaded successfully",
      audioBook: newAudioBook,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Audio upload failed" });
  }
}

// Get all audiobooks
export async function getAllAudioBooks(req: Request, res: Response) {
  try {
    const result = await AudioBookModel.find({});
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Failed to fetch audiobooks:', err.message);
    return res.status(500).json({
      error: "Failed to fetch audiobooks",
      message: err.message,
    });
  }
}
