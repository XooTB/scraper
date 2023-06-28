import mongoose from "mongoose";
import {
  addItem,
  getScrapeLinks,
} from "./scraper/controllers/ST_DB.controller.js";
import { linkScraper } from "./scraper/linkScraper.js";
import { scrapePage } from "./scraper/mainScraper.js";
import connectDB from "./utils/connect.js";
import containsLink from "./utils/containsLink.js";
import "dotenv/config";

try {
  connectDB(process.env.MONGODB_URL);
} catch (err) {
  console.log(err);
}

const links = await getScrapeLinks();

for (let i = 0; i < 50; i++) {
  await scrapePage(links[i]["url"]);
}

mongoose.connection.close();
