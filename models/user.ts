import connectDB from "@/libs/mongoDB";
import mongoose, { Schema } from "mongoose";


const userSchema = new Schema(
    {
       name: String,
       email: String,
       password: String,
       account_linked: Boolean,
       account_type: String
    },
    {
        timestamps: true,
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
)

userSchema.set('toJSON', {
    transform: function (doc, ret) {
      ret.id = ret._id;
      // delete ret._id;
    },
  });


const {conn} = connectDB();

const User = conn.models.User || conn.model("User", userSchema);

export default User