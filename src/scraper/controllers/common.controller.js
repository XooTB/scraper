import Store from "../../models/Store.js";
import containsLink from "../../utils/containsLink.js";
import Product from "../../models/Product.js";
import getDate from "../../utils/getDate.js";
import convertPrice from "../../utils/convertPrice.js";
import { logger } from "../../utils/logger.js";

// Add a new Product to the DB.

export const addProduct = async (productData) => {
  try {
    const store = await Store.findOne({ storeName: productData.storeName });
    if (!store) {
      throw Error("Store information not found!");
    }

    const productPrice = convertPrice(productData.price);

    // Create a new Product Object
    if (isNaN(productPrice) || !productPrice) {
      return true;
    }

    const newProduct = {
      productTitle: productData.title,
      store: productData.storeName,
      image: productData.image,
      productLink: productData.productLink,
      latestPrice: productPrice,
      priceHistory: [
        {
          date: getDate(),
          price: productPrice,
        },
      ],
      historicalHigh: productPrice,
      historicalLow: productPrice,
    };

    // Add the New Product information to the Database.
    await Product.create(newProduct);
    return true;
  } catch (err) {
    logger.error(
      `Something went wrong while adding item. Error: ${err.message}`
    );
    return false;
  }
};

// Check the price and Update the Item.

export const updateProduct = async (productInfo, Product) => {
  try {
    const pastPrice = convertPrice(Product.latestPrice);
    const currentPrice = convertPrice(productInfo.price);
    const historicalHigh = convertPrice(Product.historicalHigh);
    const historicalLow = convertPrice(Product.historicalLow);
    const productLink = productInfo.productLink;

    if (isNaN(currentPrice) || !currentPrice) {
      return true;
    }

    if (pastPrice !== currentPrice) {
      Product.priceHistory.push({
        date: getDate(),
        price: currentPrice,
      });
      Product.latestPrice = currentPrice;

      if (currentPrice > historicalHigh) {
        Product.historicalHigh = currentPrice;
      } else if (currentPrice < historicalLow) {
        Product.historicalLow = currentPrice;
      }
    }

    if (Product.productLink !== productLink) {
      Product.productLink = productLink;
    }

    await Product.save();
    return true;
  } catch (err) {
    logger.error(
      `Something went wrong while adding item. Error: ${err.message}. ProductTitle: ${Product.productTitle}`
    );
    return false;
  }
};

// Sort the Items into exiting and non-existing Entries.

export const handleItems = async (productInfo) => {
  try {
    const product = await Product.findOne({
      productTitle: productInfo.title,
      store: productInfo.storeName,
      productLink: productInfo.productLink,
    });
    if (!product) {
      return await addProduct(productInfo);
    } else if (product) {
      return await updateProduct(productInfo, product);
    }
  } catch (err) {
    logger.error(
      `Something went wrong while adding item. Error: ${err.message}`
    );
    return false;
  }
};
