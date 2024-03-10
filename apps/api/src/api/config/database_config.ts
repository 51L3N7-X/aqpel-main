import mongoose from "mongoose";

export const connectDB = async (uri: string, options: any) => {
  try {
    await mongoose.connect(uri, options);
    console.log(`Connected to ${uri}`);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};
