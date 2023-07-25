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

export const getTLLinks = async () => {
  try {
    const store = await Store.findOne({ storeName: "TechLand" });

    if (!store) {
      throw Error("No store named TechLand found.");
    }

    return store.links;
  } catch (err) {
    logger.error(
      `Something went wrong while getting scraping Links from Techland. Message: ${err.message}`
    );
  }
};

export const handleTLProducts = async (productInfo) => {
  try {
    const product = await Product.findOne({ productTitle: productInfo.title });
    if (!product) {
      return await addItem(productInfo);
    }
  } catch (err) {
    logger.error(
      `Something went wrong in HandleProducts. Error: ${err.message}`
    );
  }
};
