import bcrypt from "bcrypt";
import {User} from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
  const { email, name, password, budget } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(401, "User Already Exists!");
  }
  if (length(password) < 8) {
    throw new ApiError(402, "Password too short!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    name,
    password: hashedPassword,
    budget,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, user, "User registered Successfully"));
};

export default registerUser;