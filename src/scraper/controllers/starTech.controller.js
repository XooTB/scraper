import Store from "../../models/Store.js";
import containsLink from "../../utils/containsLink.js";
import Product from "../../models/Product.js";
import getDate from "../../utils/getDate.js";
import convertPrice from "../../utils/convertPrice.js";
import { logger } from "../../utils/logger.js";

export const addStarTechLink = async (links) => {
  const newStore = {
    storeName: "StarTech",
    websiteUrl: "https://www.startech.com.bd/",
  };

  try {
    const store = await Store.findOne({ storeName: "StarTech" });
    if (!store) {
      await Store.create({
        ...newStore,
        links: [...links],
      });
      return true;
    }

    for (let i in links) {
      if (!containsLink(links[i]["url"], store.links)) {
        store.links.push(links[i]);
        continue;
      }
    }
    await store.save();
    return true;
  } catch (err) {
    logger.error(
      `Something went wrong while adding Links. Error: ${err.message}`
    );
    return false;
  }
};

// Get the Scraped Links from the LinkDB.

export const getSTLinks = async () => {
  try {
    const store = await Store.findOne({ storeName: "StarTech" });
    if (!store) {
      throw Error("No store named StarTech Found.");
    }

    return store.links;
  } catch (err) {
    logger.error(
      `Something went wrong while adding item. Error: ${err.message}`
    );
  }
};
