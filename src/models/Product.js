import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  productTitle: {
    type: String,
    required: true,
  },
  store: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  latestPrice: {
    type: String,
    required: true,
  },
  priceHistory: [
    {
      date: {
        type: String,
        requried: true,
        _id: false,
      },
      price: {
        type: String,
        required: true,
        _id: false,
      },
      _id: false,
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

export default Product;
