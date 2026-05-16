import crypto from "crypto";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


// Inject crypto globally for the MongoDB driver
if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}


const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB conncted !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error ", error);
    process.exit(1);
  }
};

export default connectDB;
