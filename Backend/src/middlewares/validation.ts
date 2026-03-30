import type { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

// Verifies the JWT Bearer token from Authorization header
export function validation(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: no token provided" });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized: invalid token" });
    }
}
