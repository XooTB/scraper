import Product from "../../models/Product.js";
import getDate from "../../utils/getDate.js";
import Store from "../../models/Store.js";
import convertPrice from "../../utils/convertPrice.js";
import { logger } from "../../utils/logger.js";

// Add a new Item to the DB..

export const addItem = async (productData) => {
  try {
    const store = await Store.findOne({ storeName: "StarTech" });
    if (!store) {
      throw Error("Store information not found!");
    }

    // Create a new Product Object
    if (isNaN(convertPrice(productData.price))) {
      return true;
    }

    const newProduct = {
      productTitle: productData.title,
      store: "StarTech",
      image: productData.image,
      latestPrice: convertPrice(productData.price),
      priceHistory: [
        {
          date: getDate(),
          price: convertPrice(productData.price),
        },
      ],
    };

    // Add the New Product information to the Database.
    await Product.create(newProduct);
    return true;
  } catch (err) {
    logger.err(`Something went wrong while adding item. Error: ${err.message}`);
    return false;
  }
};

// Get the Scraped Links from the LinkDB.

export const getScrapeLinks = async () => {
  try {
    const store = await Store.findOne({ storeName: "StarTech" });
    if (!store) {
      throw Error("Store information not found!");
    }

    return store.links;
  } catch (err) {
    logger.err(`Something went wrong while adding item. Error: ${err.message}`);
  }
};

// Check the price and Update the Item.

export const updateItem = async (productInfo, Product) => {
  try {
    const pastPrice = convertPrice(Product.latestPrice);
    const currentPrice = convertPrice(productInfo.price);

    if (isNaN(currentPrice)) {
      return true;
    }

    if (pastPrice !== currentPrice) {
      Product.priceHistory.push({
        date: getDate(),
        price: currentPrice,
      });
      Product.latestPrice = currentPrice;
      await Product.save();
    }
    return true;
  } catch (err) {
    logger.err(`Something went wrong while adding item. Error: ${err.message}`);
    return false;
  }
};

// Sort the Items into exiting and non-existing Entries.

export const handleItems = async (productInfo) => {
  try {
    const product = await Product.findOne({ productTitle: productInfo.title });
    if (!product) {
      return await addItem(productInfo);
    }

    return await updateItem(productInfo, product);
  } catch (err) {
    logger.err(`Something went wrong while adding item. Error: ${err.message}`);
    return false;
  }
};
