import mongoose from "mongoose";

const audioBookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    authorName: { type: String, required: true },
    coverPic: { type: String, required: true },
    audio: { type: [String], required: true }, // Array of URLs/paths of uploaded files
  },
  { timestamps: true }
);

export const AudioBookModel = mongoose.model("AudioBook", audioBookSchema);
