import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { AudioBookModel } from "../models/audiobookmodel.js"; // separate model
import { ProgressModel } from "../models/progressmodel.js"; // reuse progress if you want tracking

//  Upload a brand-new Audiobook



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
      message: "🎧 Multiple audio files uploaded successfully",
      audioBook: newAudioBook,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Audio upload failed" });
  }
}

//  Get all audiobooks
export async function getAllAudioBooks(req: Request, res: Response) {
  try {
    console.log('Attempting to get audio books...');
    
    // Try to execute a simple find query
    const result = await AudioBookModel.find({});
    console.log('Query result:', result);
    
    // Send response
    return res.status(200).json(result);
    
  } catch (err: any) {
    // Log the full error details to console
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    
    // Send a more informative error response
    return res.status(500).json({
      error: "Failed to fetch audiobooks",
      message: err.message,
      type: err.name
    });
  }
}

  

//  Stream audio file (with Range support)
export async function streamAudio(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const audioBook = await AudioBookModel.findById(id);

    if (!audioBook || !audioBook.audio) {
      return res.status(404).send("Audio not found");
    }

    const filePath = path.resolve(`uploads/audio/${path.basename(audioBook.audio[0])}`);
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "audio/mpeg",
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Stream error");
  }
}

//  Save listening progress
export async function saveProgress(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { position } = req.body;
    const userId = (req as any).userId || req.body.userId;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const filter = { userId, bookId: id };
    const update = { position };
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };

    const doc = await ProgressModel.findOneAndUpdate(filter, update, opts);
    return res.status(200).json({ message: "Progress saved", progress: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not save progress" });
  }
}

//  Get saved progress
export async function getProgress(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).userId || req.query.userId;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const prog = await ProgressModel.findOne({ userId, bookId: id });
    return res.status(200).json({ position: prog?.position || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
}
