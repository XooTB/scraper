import Product from "./models/Product.js";
import connectDB from "./utils/connect.js";
import mongoose from "mongoose";

import "dotenv/config";

try {
  connectDB(process.env.MONGODB_URL);
} catch (err) {
  console.log(err);
}

async function hotfix() {
  await Product.deleteMany({ store: "TechLand" });
}

await hotfix();

mongoose.connection.close();
