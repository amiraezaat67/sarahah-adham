import mongoose from "mongoose";

const dbconnection = async () => {
    try {
        await mongoose.connect(process.env.DB_URI_LOCAL,{
        
        }); 
        console.log("Database connected");
    } catch (error) {
        console.log("Database connection error", error);
    }
}

export default dbconnection;

