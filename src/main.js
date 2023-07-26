// Module Imports
import mongoose, { get } from "mongoose";
import connectDB from "./utils/connect.js";
import { logger } from "./utils/logger.js";
import getDateTime from "./utils/getDateTime.js";
import "dotenv/config";

// Other Imports
import { getSTLinks } from "./scraper/controllers/starTech.controller.js";
import { stScraper } from "./scraper/starTechScraper.js";
import { getTLLinks } from "./scraper/controllers/techLand.controller.js";
import { tlScraper } from "./scraper/techLandScraper.js";

try {
  connectDB("");
} catch (err) {
  console.log(err);
}

// Get All the scraping Links from DB.
const starTechLinks = await getSTLinks();
const techLandLinks = await getTLLinks();

logger.info(`Crawl Started! Time: ${getDateTime()}`);

for (let i in starTechLinks) {
  await stScraper(starTechLinks[i]["url"]);
}
logger.info(`Crawl Finished. Store: StarTech, Time: ${getDateTime()}`);

for (let i in techLandLinks) {
  await tlScraper(`${techLandLinks[i]["url"]}?fq=1`);
}
logger.info(`Crawl Finished. Store: TechLand, Time: ${getDateTime()}`);

logger.info(`Crawl Complete! Time: ${getDateTime()}`);

mongoose.connection.close();
