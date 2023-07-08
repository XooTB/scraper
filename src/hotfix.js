import Product from "./models/Product.js";
import convertPrice from "./utils/convertPrice.js";
import connectDB from "./utils/connect.js";
import "dotenv/config";

try {
  connectDB(process.env.MONGODB_URL);
} catch (err) {
  console.log(err);
}

const lowest = (arr) => {
  let lowest = 1000000;
  arr.forEach((item) => {
    if (convertPrice(item.price) < lowest) {
      lowest = item.price;
    }
  });

  return lowest;
};

const highest = (arr) => {
  let highest = 0;
  arr.forEach((item) => {
    if (convertPrice(item.price) > highest) {
      highest = item.price;
    }
  });

  return highest;
};

async function hotfix() {
  const allProducts = await Product.find({});

  allProducts.forEach(async (product, i) => {
    let productLowest = lowest(product.priceHistory);
    let productHighest = highest(product.priceHistory);

    product.historicalHigh = productHighest;
    product.historicalLow = productLowest;

    await product.save();
    console.log(`Update product no: ${i}`);
  });
}

await hotfix();
