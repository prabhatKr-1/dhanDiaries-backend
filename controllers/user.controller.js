import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// New user registration
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
      password: hashedPassword,
      budget,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "User registered successfully", user));
  } catch (error) {
    next(error);
  }
};

// Function to generate tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError("Error generating access and refresh tokens", 403);
  }
};

// Login user function
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError("User doesn't exist", 404)); // Use ApiError
    }

    // Validate the password
    const rightPassword = await user.isPasswordCorrect(password);
    if (!rightPassword) {
      return next(new ApiError("Invalid password", 401));
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    // Fetch user details without sensitive fields
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "Successfully logged in", {
          user: loggedInUser,
          accessToken,
          refreshToken,
        })
      );
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ApiError("User not found in request", 404));
    }
    return res.status(203).json(
      new ApiResponse(203, "Profile fetched successfully!", {
        user: req.user,
      })
    );
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1, // removes the field from document
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, "User logged Out"));
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, getProfile, logoutUser };
