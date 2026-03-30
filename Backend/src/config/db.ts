import mongoose from "mongoose";

export async function connectDb(url:string){
    try{
        console.log('Attempting to connect to MongoDB...');
        const connect = await mongoose.connect(url);
        console.log(`MongoDB connected successfully:`);
        console.log(`- Host: ${connect.connection.host}`);
        console.log(`- Database: ${connect.connection.name}`);
        console.log(`- State: ${connect.connection.readyState}`);
    }
    catch(e: any){
        process.exit(1)
    }
}