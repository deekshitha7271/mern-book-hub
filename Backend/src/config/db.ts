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
        console.error('MongoDB connection error:');
        console.error('- Error name:', e.name);
        console.error('- Error message:', e.message);
        console.error('- Stack trace:', e.stack);
        process.exit(1)
    }
}