import mongoose from "mongoose";

export interface ListeningProgress {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  position: number; // seconds
  updatedAt: Date;
}

const schema = new mongoose.Schema<ListeningProgress>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Book" },
  position: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export const ProgressModel = mongoose.model<ListeningProgress>("Progress", schema);
