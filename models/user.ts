import connectDB from "@/libs/mongoDB";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
       name: String,
       email: String,
       password: String,
    },
    {
        timestamps: true
    }
)

const {conn} = connectDB()
const User = conn.models.User || conn.model("User", userSchema);

export default User