import type {Request,Response} from "express"
import { BookModel } from "../models/bookmodel.js"
import jsonwebtoken from "jsonwebtoken"
import {hash,compare} from "bcrypt"
import { UserModel } from "../models/usermodel.js"
import axios from "axios";

const jwt = jsonwebtoken

export async function createBooks(req:Request,res:Response){
    try{
        const {title,authorName,coverPic,rating,readStatus,aboutAuthor,aboutBook}=req.body
        if(!title||typeof(title)!=="string"){
            res.status(400).json({
                error:"title must be a non-empty string"
            })
        }
        if(!authorName||typeof(authorName)!=="string"){
            res.status(400).json({
                error:"authorName must be a non-empty string"
            })
        }
        const book = await BookModel.create({title,authorName,coverPic,rating,readStatus,aboutAuthor,aboutBook})
            return res.status(201).json({ message: "Book created successfully", book });


    }
    catch(e){
        res.status(500).json({error:"something went wrong"})
    }
}

export async function getBooks(req:Request,res:Response){
    try{
        const books = await BookModel.find()
        res.status(200).json({books:books})
    }
    catch(e){
        console.error('Error in getBooks:', e);
        res.status(500).json({error: e instanceof Error ? e.message : "something went wrong"})
    }
}

export async function getSpecificBook(req:Request,res:Response){
    try{
        const {id} = req.params
        const book = await BookModel.findById(id)
        if(!book){
            return res.status(400).json({error:"Id is not found"})
        }
        res.status(200).json({book})
    }
    catch(e){
        res.status(500).json({error:"something went wrong"})

    }
}

//Here, we are creating the createUser method
export async function createUser(req:Request,res:Response){
    try{
        const {username,password,role}=req.body;
        const hashedPassword=await hash(password,10)
        const userDetails = await UserModel.find({username})
        if(userDetails.length>0 ){
            return res.status(400).json({error:"User already exists"})
        }
        const user = await UserModel.create({username, password:hashedPassword,role});
        await user.save()
        res.status(200).json({user})

    }
    catch(e){
        console.error(e)
        res.status(500).json({error:"Something went wrong"})


    }
}

export async function loginUser(req:Request,res:Response){
    try{
        const {username,password} = req.body;
        const userDetails = await UserModel.find({username})
        if(userDetails.length>0 && userDetails[0] && userDetails[0].password){
            const isPasswordValid = await compare(password,userDetails[0].password)
            if(!isPasswordValid){
                return res.status(400).json({error:"Invalid Password"})
            }
            const payload = {id: userDetails[0]._id}
            const jwtToken = jwt.sign(payload,process.env.JWT_SECRET as string)
            res.status(200).json({jwtToken})

        }
        else{
            return res.status(400).json({error:"Please register first"})
        }


    }
    catch(e){
        console.error(e)
        res.status(500).json({error:"Something went wrong"})

    }

}




export const saveBookWithPDF = async (req: Request, res: Response) => {
  try {
    const { title, authorName, coverPic, rating, readStatus, aboutAuthor, aboutBook } = req.body;

    if (!req.file) return res.status(400).json({ error: "PDF file is required" });

    const book = await BookModel.create({
      title,
      authorName,
      coverPic, // optional
      rating,
      readStatus,
      aboutAuthor,
      aboutBook,
      previewLink: `/uploads/${req.file.filename}`,
    });

    return res.status(201).json({ message: "Book uploaded successfully", book });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
