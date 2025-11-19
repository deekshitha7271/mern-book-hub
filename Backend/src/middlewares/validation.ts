import type {Request,Response,NextFunction} from "express"
import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;



export async function validation(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (!decoded) return res.status(401).json({ error: "Invalid token" });
    // attach userId
    (req as any).userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid Token" });
  }
}
