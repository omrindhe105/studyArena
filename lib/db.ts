import mongoose from "mongoose";

export async function connectDb() {
    try{
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/studyArena");
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
    

