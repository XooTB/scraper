import Store from "../../models/Store.js";
import containsLink from "../../utils/containsLink.js";
import { logger } from "../../utils/logger.js";

export const addSkylandLinks = async (links) => {
  const newStore = {
    storeName: "SkyLand",
    websiteUrl: "https://www.skyland.com.bd/",
  };

  try {
    const store = await Store.findOne({ storeName: "SkyLand" });
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

export const getSlLinks = async () => {
  try {
    const store = await Store.findOne({ storeName: "SkyLand" });
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
