import mongoose from "mongoose";

export interface User{
    username:string,
    password:string,
    
}

const userSchema = new mongoose.Schema<User>(
    {
        username:{type:String,required:true,trim:true,unique:true},
        password:{type:String,required:true},
    },{
        timestamps:true,
    }
);

export const UserModel = mongoose.model<User>("User",userSchema);