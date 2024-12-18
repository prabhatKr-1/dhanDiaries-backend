import ApiError from "./ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log(req.cookies);
      return next(new ApiError("Unauthorized request, token not present", 401));
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return next(new ApiError("Invalid Access Token", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
