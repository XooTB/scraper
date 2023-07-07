import mongoose from "mongoose";
import { getScrapeLinks } from "./scraper/controllers/ST_DB.controller.js";
import { scrapePage } from "./scraper/mainScraper.js";
import connectDB from "./utils/connect.js";
import { logger } from "./utils/logger.js";
import getDateTime from "./utils/getDateTime.js";
import "dotenv/config";

try {
  connectDB(process.env.MONGODB_URL);
} catch (err) {
  console.log(err);
}

const links = await getScrapeLinks();
logger.info(`Crawl Started! Time: ${getDateTime()}`);

for (let i = 0; i < 10; i++) {
  await scrapePage(links[i]["url"]);
}
logger.info(`Crawl Finished! Time: ${getDateTime()}`);

mongoose.connection.close();
