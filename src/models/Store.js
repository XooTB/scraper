import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
  },
  links: [
    {
      category: {
        type: String,
        required: true,
       },
      url: {
        type: String,
        required: true,
      },
      _id: false,
   },
  ],
});

const Store = mongoose.model("Store", StoreSchema);

export default Store;
