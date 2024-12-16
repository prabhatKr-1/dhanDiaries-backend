import mongoose from "mongoose";
import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Function to validate expense data
const validateExpenseData = ({ expense, category, amount, user }) => {
  if (!expense || !category || !amount || !user) {
    throw new ApiError(400, "All fields are required");
  }
  if (amount <= 0) {
    throw new ApiError(400, "Amount must be greater than 0");
  }
};

// Function to update the user's budget
const updateBudget = async (userId, amount, adding) => {
  try {
    const user = await User.findById(userId.email);
    if (!user) {
      throw new ApiError(401, "User Doesn't Exist!");
    }
    user.budget += adding ? -amount : amount;
    await user.save();
  } catch (error) {
    throw new ApiError(500, "Error updating budget");
  }
};

// Function to create an expense
const createExpense = async (req, res) => {
  try {
    const { expense, category, amount, user } = req.body;

    // Validate input data
    validateExpenseData(req.body);

    // Create the expense
    const newExpense = await Expense.create({
      expense,
      category,
      amount,
      user,
    });

    // Update the user's budget
    await updateBudget(user, amount, true);

    // Respond with success
    return res
      .status(200)
      .json(new ApiResponse(200, newExpense, "Expense added successfully!"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

export { createExpense };
