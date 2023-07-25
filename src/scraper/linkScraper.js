import { starTechLinkScraper } from "./link/starTech.js";
import { techLandLinkScraper } from "./link/TechLand.js";
import connectDB from "../utils/connect.js";
import "dotenv/config";
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

try {
  connectDB(process.env.MONGODB_URL);
} catch (err) {
  console.log(err);
}

logger.info("Started Scraping Startech for links.");
await starTechLinkScraper("https://www.startech.com.bd/");
logger.info("Finished Scraping Startech for links.");

logger.info("Started Scraping TechLand for links.");
await techLandLinkScraper("https://www.techlandbd.com/");
logger.info("Finished Scraping TechLand for links.");

mongoose.connection.close();
