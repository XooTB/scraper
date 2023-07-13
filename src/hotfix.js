import Product from "./models/Product.js";
import convertPrice from "./utils/convertPrice.js";
import connectDB from "./utils/connect.js";
import { scrapePage } from "./scraper/mainScraper.js";
import { getScrapeLinks } from "./scraper/controllers/ST_DB.controller.js";

import "dotenv/config";

try {
  connectDB(process.env.MONGODB_URL);
} catch (err) {
  console.log(err);
}

async function hotfix() {}

await hotfix();

mongoose.connection.close();
