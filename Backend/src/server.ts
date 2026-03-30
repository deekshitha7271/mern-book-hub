import cors from "cors";
import express from 'express';
import dotenv from "dotenv";
import route from "./routes/bookroutes.js";
const app = express();
import { connectDb } from "./config/db.js";
//Middlewares
app.use(cors())
app.use(express.json())

dotenv.config();


const URI=process.env.Mongo_URI
const PORT=process.env.PORT || 5000;

if(!URI){
    console.error("MongoURI is missing in .env file")
    process.exit(1)
}

async function main(){
    try{
        // First connect to database
        console.log('Connecting to MongoDB...');
        await connectDb(URI as string);
        
        // Then set up routes
        console.log('Setting up routes...');
        app.use("/books/api", route);
        app.use("/uploads", express.static("uploads"));
        
        // Finally start the server
        app.listen(PORT, () => {
            console.log(`Server started on PORT ${PORT}`);
            console.log(`Test the audio books API at: http://localhost:${PORT}/books/api/get/audio`);
        });
    } catch(e) {
        console.error('Server startup error:', e);
        process.exit(1);
    }
}

// Start the server
main().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});

