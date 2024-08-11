import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    budget: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
