import logger from "../utils/logging";
import mongoose from "mongoose";
mongoose.set("strictQuery", false);

export { mongoose };

export default async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {});
  } catch (error) {
    logger.error("Could not connect to MongoDB:", error.message);
  }
};
