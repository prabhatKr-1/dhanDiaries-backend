import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "User Doesn't Exists!");
  }
  const rightPassword = await bcrypt.compare(password, user.password);

  if (!rightPassword) {
    throw new ApiError(402, "Invalid Password!");
  }
  jwt.sign(user._id, 56486345);

  res.json(new ApiResponse(201, user, "Successfully Logged In!"));
};

export default loginUser;
