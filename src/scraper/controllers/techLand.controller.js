import containsLink from "../../utils/containsLink.js";
import Store from "../../models/Store.js";
import { logger } from "../../utils/logger.js";

// TechLand.com.bd

export const addTechLandLink = async (links) => {
  const newStore = {
    storeName: "TechLand",
    websiteUrl: "https://www.techlandbd.com/",
  };

  try {
    const store = await Store.findOne({ storeName: "TechLand" });
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
      `Something went wrong while adding links for the store: TechLand, Error: ${err.message}`
    );
    return false;
  }
};
