import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
  const { email, name, password, budget } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(401).json(new ApiResponse(401, "User Already Exists!"));
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
    .json(new ApiResponse(201, "User registered Successfully", user));
};

export default registerUser;
