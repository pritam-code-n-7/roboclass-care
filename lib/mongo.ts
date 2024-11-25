import mongoose from "mongoose";

export async function dbConnect() {
  try {
    const conn = await mongoose.connect(String(process.env.NEXT_PUBLIC_MONGO_URI));

    return conn;
  } catch (error) {
    throw new Error("mongodb connection error" + error);
  }
}
