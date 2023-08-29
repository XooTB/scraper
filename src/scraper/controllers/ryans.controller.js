import Store from "../../models/Store.js";
import containsLink from "../../utils/containsLink.js";
import { logger } from "../../utils/logger.js";

export const addRyansLink = async (links) => {
  const newStore = {
    storeName: "Ryans",
    websiteUrl: "https://www.ryanscomputers.com/",
  };

  try {
    // Try getting the store.
    const store = await Store.findOne({ storeName: "Ryans" });

    // If No store exits, then create a new one.
    if (!store) {
      await Store.create({
        ...newStore,
        links: [...links],
      });
      return true;
    }

    // If Store exits, then add
    for (let i in links) {
      if (!containsLink(links[i]["url"], store.links)) {
        store.links.push(links[i]);
        continue;
      }
    }

    // Save the Updated Store to the DB
    await store.save();
    return true;
  } catch (err) {
    logger.error(
      `Something went wrong while adding Links. Error: ${err.message}`
    );
    return false;
  }
};

export const getRyansLink = async () => {
  try {
    const store = await Store.findOne({ storeName: "Ryans" });
    if (!store) {
      throw Error("No store named Ryans Found.");
    }

    return store.links;
  } catch (err) {
    logger.error(
      `Something went wrong while adding Store. Error: ${err.message}`
    );
  }
};
