import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    expense: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Food",
        "Transport",
        "Entertainment",
        "Utilities",
        "Healthcare",
        "Others",
      ],
      default: "Others",
    },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
