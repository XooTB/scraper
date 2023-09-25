// Module Imports
import mongoose from "mongoose";
import connectDB from "./utils/connect.js";
import { logger } from "./utils/logger.js";
import getDateTime from "./utils/getDateTime.js";
import "dotenv/config";

// Other Imports
import { stScraper } from "./scraper/starTechScraper.js";
import { tlScraper } from "./scraper/techLandScraper.js";
import { ryansScraper } from "./scraper/ryansScraper.js";
import { slScraper } from "./scraper/skyLandScraper.js";
import { getTLLinks } from "./scraper/controllers/techLand.controller.js";
import { getSTLinks } from "./scraper/controllers/starTech.controller.js";
import { getRyansLink } from "./scraper/controllers/ryans.controller.js";
import { getSlLinks } from "./scraper/controllers/skyLand.controller.js";

try {
  connectDB("");
} catch (err) {
  console.log(err);
}

// Get All the scraping Links from DB.
const starTechLinks = await getSTLinks();
const techLandLinks = await getTLLinks();
const ryansLinks = await getRyansLink();
const skyLandLinks = await getSlLinks();

logger.info(`Crawl Started! Time: ${getDateTime()}`);

// Scraping StarTech
for (let i in starTechLinks) {
  await stScraper(`${starTechLinks[i]["url"]}?filter_status=7`);
}
logger.info(`Crawl Finished. Store: StarTech, Time: ${getDateTime()}`);

// Scraping Techland
for (let i in techLandLinks) {
  await tlScraper(`${techLandLinks[i]["url"]}?fq=1`);
}
logger.info(`Crawl Finished. Store: TechLand, Time: ${getDateTime()}`);

// Scraping Ryans
for (let i in ryansLinks) {
  await ryansScraper(`${ryansLinks[i]["url"]}?osp=1`);
}
logger.info(`Crawl Finished. Store: Ryans, Time: ${getDateTime()}`);

// Scraping SkyLand
for (let i in skyLandLinks) {
  await slScraper(`${skyLandLinks[i]["url"]}?fq=1`);
}
logger.info(`Crawl Finished. Store: SkyLand, Time: ${getDateTime()}`);

logger.info(`Crawl Complete! Time: ${getDateTime()}`);

mongoose.connection.close();
