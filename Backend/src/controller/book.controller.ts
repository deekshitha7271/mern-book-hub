import type { Request, Response } from "express";
import { BookModel } from "../models/bookmodel.js";
import { UserModel } from "../models/usermodel.js";
import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

// Create a new book entry
export async function createBooks(req: Request, res: Response) {
    try {
        const { title, authorName, coverPic, rating, readStatus, aboutAuthor, aboutBook } = req.body;

        if (!title || typeof title !== "string") {
            return res.status(400).json({ error: "title must be a non-empty string" });
        }
        if (!authorName || typeof authorName !== "string") {
            return res.status(400).json({ error: "authorName must be a non-empty string" });
        }

        const book = await BookModel.create({ title, authorName, coverPic, rating, readStatus, aboutAuthor, aboutBook });
        return res.status(201).json({ message: "Book created successfully", book });
    } catch (e) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

// Get all books with optional shelf and search filters
export async function getBooks(req: Request, res: Response) {
    try {
        const { shelf, search } = req.query;
        const filter: any = {};

        if (shelf && typeof shelf === "string" && shelf !== "ALL") {
            if (shelf === "WANT_TO_READ") {
                filter.readStatus = { $regex: /to read|want to read/i };
            } else if (shelf === "CURRENTLY_READING") {
                filter.readStatus = { $regex: /currently reading/i };
            } else if (shelf === "READ") {
                filter.readStatus = { $regex: /^read$/i };
            } else {
                filter.readStatus = shelf;
            }
        }

        if (search && typeof search === "string" && search.trim() !== "") {
            filter.title = { $regex: search, $options: "i" };
        }

        const books = await BookModel.find(filter);
        res.status(200).json({ books });
    } catch (e) {
        res.status(500).json({ error: e instanceof Error ? e.message : "Something went wrong" });
    }
}

// Get a single book by ID
export async function getSpecificBook(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const book = await BookModel.findById(id);

        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json({ book });
    } catch (e) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

// Register a new user
export async function createUser(req: Request, res: Response) {
    try {
        const { username, password, role } = req.body;

        const existingUser = await UserModel.find({ username });
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await hash(password, 10);
        const user = await UserModel.create({ username, password: hashedPassword, role });
        res.status(201).json({ user });
    } catch (e) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

// Login a user and return a JWT
export async function loginUser(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        const userDetails = await UserModel.find({ username });

        if (!userDetails.length || !userDetails[0]?.password) {
            return res.status(400).json({ error: "Please register first" });
        }

        const isPasswordValid = await compare(password, userDetails[0].password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const payload = { id: userDetails[0]._id };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET as string);
        res.status(200).json({ jwtToken });
    } catch (e) {
        res.status(500).json({ error: "Something went wrong" });
    }
}

// Upload a book with a PDF preview file
export const saveBookWithPDF = async (req: Request, res: Response) => {
    try {
        if (!req.file) return res.status(400).json({ error: "PDF file is required" });

        const { title, authorName, coverPic, rating, readStatus, aboutAuthor, aboutBook } = req.body;

        const book = await BookModel.create({
            title,
            authorName,
            coverPic,
            rating,
            readStatus,
            aboutAuthor,
            aboutBook,
            previewLink: `/uploads/${req.file.filename}`,
        });

        return res.status(201).json({ message: "Book uploaded successfully", book });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong" });
    }
};
