import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("Successfully connected to MongoDB database!");
  } catch (err) {
    console.log("Connection to MongoDB failed!", err);
  }
};
export default connectDB;
