import mongoose from "mongoose";

const connectDB = () => {
   
    try {
        const mongoUri = process.env.DB_URI;
        if(!mongoUri){
            throw new Error("DB_URI does not exist in environment variable");
        }
    
        const conn = mongoose.createConnection(mongoUri);
        // console.log("Database connected successfully");

        return {conn}
    } catch (error) {
        throw new Error("Unable to connect to database");
    }

}

export default connectDB