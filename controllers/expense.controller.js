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
const updateBudget = async (email, amount, adding) => {
  try {
    const user = await User.findOne({ email });
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
    await updateBudget(user.email, amount, true);

    // Respond with success
    return res
      .status(200)
      .json(new ApiResponse(200, newExpense, "Expense added successfully!"));
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
};

// Deleting an expense
const deleteExpense = async (req, res) => {
  try {
    const { amount, user } = req.body;

    const expense = await Expense.findOne({ _id: req.params.id });
    if (!expense) {
      return res.json(new ApiError(402, "No expense present!"));
    }
    await updateBudget(user.email, amount, false);
    const deletedExpense = await Expense.deleteOne({ _id: req.params.id });
    res
      .status(202)
      .json(
        new ApiResponse(202, deletedExpense, "Expense Deleted Successfully")
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          "Something went wrong while deleting the expense",
          error
        )
      );
  }
};

// Updating an expense
const updateExpense = async (req, res) => {
  const { amount, expense, user, category, _id } = req.body;

  try {
    // Find the expense to be updated
    const updatedExpense = await Expense.findOne({ _id: req.params.id });
    if (!updatedExpense) {
      return res.status(404).json(new ApiError(404, "Expense Not Found!"));
    }

    // Get the previous amount of the expense
    const prevAmount = updatedExpense.amount;

    // Update the expense details
    updatedExpense.amount = amount;
    updatedExpense.category = category;
    updatedExpense.expense = expense;

    const difference = amount - prevAmount;

    // Update the user's budget based on the difference
    await updateBudget(user.email, Math.abs(difference), difference < 0);

    await updatedExpense.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedExpense, "Expense Updated Successfully!")
      );
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 501,
          "Something went wrong while updating the expense",
          error
        )
      );
  }
};

const getExpense = async (req, res) => {
  try {
    const { email } = req.params;
    const expenses = await Expense.find({ user: email });

    return res
      .status(200)
      .json(new ApiResponse(200, expenses, "Expenses fetched successfully!"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          "Error fetching expenses for the user",
          error
        )
      );
  }
};

export { createExpense, deleteExpense, updateExpense, getExpense };
