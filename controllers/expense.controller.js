import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

// Function to validate expense data
const validateExpenseData = ({ expense, category, amount, user }) => {
  if (!expense || !amount || !user) {
    throw new ApiError("All fields are required", 400);
  }
  if (!category) {
    category = "Others";
  }
  if (amount <= 0) {
    throw new ApiError("Amount must be greater than 0", 400);
  }
};

// Function to update the user's budget
const updateBudget = async (user, amount, adding) => {
  try {
    // user.budget += adding ? -amount : amount;
    if (adding) user.budget -= amount;
    else user.budget += amount;
    await user.save();
  } catch (error) {
    console.log(error);
    throw new ApiError("Error updating budget", 500, error);
  }
};

// Function to create an expense
const createExpense = async (req, res, next) => {
  try {
    const { expense, category, amount, user } = req.body;

    // Validate input data
    validateExpenseData(req.body);

    // Create the expense
    const newExpense = await Expense.create({
      expense,
      category,
      amount,
      user: user,
    });
    await updateBudget(user, amount, true);

    res
      .status(200)
      .json(new ApiResponse(200, "Expense added successfully!", newExpense));
  } catch (error) {
    next(error);
  }
};

// Function to delete an expense
const deleteExpense = async (req, res, next) => {
  try {
    const { user } = req.body;

    // Find the expense to delete
    const expense = await Expense.findOne({ _id: req.params.id });
    if (!expense) {
      throw new ApiError("No expense present", 404);
    }

    await updateBudget(user, expense.amount, false);

    const deletedExpense = await Expense.deleteOne({ _id: req.params.id });
    res
      .status(202)
      .json(new ApiResponse(202, "Expense deleted successfully", expense));
  } catch (error) {
    next(error);
  }
};

// Function to update an expense
const updateExpense = async (req, res, next) => {
  try {
    const { amount, expense, user, category } = req.body;
    const updatedExpense = await Expense.findOne({ _id: req.params.id });
    if (!updatedExpense) {
      throw new ApiError("Expense not found", 404);
    }

    const prevAmount = updatedExpense.amount;

    // Update the expense details
    updatedExpense.amount = amount;
    updatedExpense.category = category;
    updatedExpense.expense = expense;

    const difference = amount - prevAmount;

    // Update the user's budget based on the difference
    await updateBudget(user, Math.abs(difference), difference < 0);

    await updatedExpense.save();

    res
      .status(200)
      .json(
        new ApiResponse(200, "Expense updated successfully!", updatedExpense)
      );
  } catch (error) {
    next(error);
  }
};

// Function to get expenses
const getExpense = async (req, res, next) => {
  try {
    const { user } = req.body;
    if (!user) {
      return next(new ApiError("Couldn't fetch user details", 502));
    }
    const expenses = await Expense.find({ user });

    res
      .status(200)
      .json(new ApiResponse(200, "Expenses fetched successfully!", expenses));
  } catch (error) {
    next(error);
  }
};

export { createExpense, deleteExpense, updateExpense, getExpense };
