import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

const registerUser = async (req, res, next) => {
  try {
    const { email, name, password, budget } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ApiError("User already exists", 409));
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      email,
      name,
      password: hashedPassword, // Use the hashed password
      budget,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully", user));
  } catch (error) {
    next(error);
  }
};

export default registerUser;
