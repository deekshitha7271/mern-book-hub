import mongoose from "mongoose";

export interface Book{
    authorName:string, 
    coverPic:string,
    rating:string,
    id:number,
    readStatus:String,
    title:string,
    aboutAuthor:string,
    aboutBook:string,
    previewLink:string,
    
}

const bookSchema=new mongoose.Schema<Book>(
    {
      authorName:{type:String, required:true,trim:true},
      coverPic:{type:String, required:true,trim:true},
      rating:{type:String, required:true,trim:true},
      // id:{type:Number ,required:true,trim:true},
      readStatus:{type:String, required:true,trim:true},
      title:{type:String, required:true,trim:true},
      aboutAuthor:{type:String, required:true,trim:true},
      aboutBook:{type:String, required:true,trim:true},
      previewLink: { type: String, trim: true },



    }
);

export const BookModel = mongoose.model<Book>("Book",bookSchema)





